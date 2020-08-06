import React, { Component } from "react";
import { connect } from "react-redux";
import Lyric from 'lyric-parser';
import store from 'store';
import "./index.less";
import ProgressBar from "components/progress-bar";
import ProgressCircle from "base/progress-circle";
import { playMode } from 'common/js/config'
import { prefixStyle } from "common/js/dom";
import * as Actions from 'store/actions';

const transform = prefixStyle('transform');
const transitionDuration = prefixStyle('transitionDuration');

class Player extends Component {
  constructor (props) {
    super(props);

    this.touch = {};

    this.state = {
      normalStyle: {
        display: "none",
        opacity: 0
      },
      miniStyle: {
        display: "none"
      },
      radius: 32,
      currentShow: "cd",
      song: {},
      songReady: false, // 歌曲是否加載完畢
      fullScreen: false,
      playing: false,
      currentTime: 0,
      currentLineNum: 0,
      playingLyric: "",
      currentLyric: null
    };

    store.subscribe(() => {
      const state = store.getState();
      const { fullScreen, playlist, currentIndex, playing } = state;
      const song = playlist[currentIndex] || {};

      if (fullScreen) {
        if (fullScreen === this.state.fullScreen) {
          return false;
        }

        this.setState({ 
          normalStyle: { display: "block", opacity: 1 },
          fullScreen: true
        }, () => {
          this.Audio.play();
        });
      } else {
        let miniStyle = {};
        if (fullScreen === this.state.fullScreen) {
          return false;
        }

        if (playlist.length > 0) {
          miniStyle = {};
        } else {
          miniStyle = { display: "none" };
        }

        this.setState({ fullScreen: false }, () => {
          this.delay(() => {
            this.setState({ miniStyle, normalStyle: { display: "none", opacity: 0 } });
          });
        });
      }

      if (this.state.song.id !== song.id) {
        if (this.state.currentLyric) {
          this.state.currentLyric.stop();
        }

        this.clearLyric(() => {
          this.getLyric(() => {
            if (!this.state.currentLyric) {
              return false;
            }
            this.state.currentLyric.seek(this.state.currentTime * 1000);
          });
        });
      }

      this.setState({ playing, song });
    });
  }

  // 延时方法
  delay(fn) {
    this.timer && clearTimeout(this.timer);

    this.timer = setTimeout(() => {
      fn && fn();
    }, 350);
  }

  // 计算图片的className
  computedImageClass(name) {
    return this.props.playing ? `${name} play` : name;
  }

  // 計算className
  computeClass (name) {
    return this.state.songReady ? name : `${name} disable`;
  }

  // 播放和暂停className
  computeCenterClass () {
    const play = "icon-play";
    const pause = "icon-pause";
    if (this.props.playing) {
      return this.state.songReady ? pause : `${pause} disable`;
    } else {
      return this.state.songReady ? play : `${play} disable`;
    }
  }

  // mini播放暂停className
  computeMiniCenterClass () {
    const play = "icon-mini icon-play-mini";
    const pause = "icon-mini icon-pause-mini";
    if (this.props.playing) {
      return this.state.songReady ? pause : `${pause} disable`;
    } else {
      return this.state.songReady ? play : `${play} disable`;
    }
  }

  // 计算top bottom 的class
  computeNavClass(name, fullScreen) {
    if (fullScreen) {
      return `${name} show`;
    } else {
      return `${name}`;
    }
  }

  // 计算播放模式className
  computedModeClass() {
    switch(this.props.mode) {
      case playMode.sequence:
        return "icon-sequence";
      case playMode.loop:
        return "icon-loop";
      case playMode.random:
        return "icon-random";
      default:
        return "icon-sequence";
    }
  }

  // 计算dot的样式
  computedDotClassName(index) {
    if (index === 0) {
      return this.state.currentShow === "cd" ? "dot active" : "dot";
    } else if (index === 1){
      return this.state.currentShow === "lyric" ? "dot active" : "dot";
    }
  }

  // 已经开始播放
  onPlaying() {
    const songReady = true;
    this.setState({ songReady }, () => {
      this.props.handlePlaying(true);
    });
  }

  // 播放发生错误
  onError(e) {
    console.log(e.message);
  }

  // 播放的切换事件
  togglePlaying (type) {
    if (!this.state.songReady) {
      return false;
    }

    const { playing } = this.props;
    // 在设置playing之前获取 否则获取无效
    if (playing) {
      if (this.props.fullScreen) {
        this.syncWrapperTransform('imageWrapper', 'image');
      } else {
        this.syncWrapperTransform('miniWrapper', 'miniImage');
      }
    }

    this.props.handlePlaying(!playing);

    if (type === "mini") {
      this.props.handleFullScreen(false);
    } else if (type === "normal") {
      this.props.handleFullScreen(true);
    }

    if (playing) {
      this.Audio.pause();
    } else {
      this.Audio.play();
    }

    if (this.state.currentLyric) {
      this.state.currentLyric.togglePlay();
    }
  }

  // 事件更新事件
  timeupdate() {
    const currentTime = this.Audio.currentTime;

    this.setState({ currentTime });
    // 更新歌词
    if (this.state.currentLyric) {
      this.state.currentLyric.seek(currentTime * 1000);
    }
  }

  // 停止事件
  onPause() {
    this.props.handlePlaying(false);
    if (this.state.currentLyric) {
      this.state.currentLyric.stop();
    }
  }

  // 播放结束
  onEnded() {
    const currentTime = 0;
    const { mode } = this.props;
    this.setState({ currentTime });

    if (mode === playMode.loop) {
      this.loop();
    } else {
      this.next();
    }
  }

  // 播放下一首歌曲
  next = () => {
    const { songReady } = this.state;
    const { currentIndex, playlist } = this.props;
    if (!songReady) {
      return false;
    }

    if (playlist.length === 1) {
      this.loop();
      return false;
    }

    let index = currentIndex + 1;
    if (index >= playlist.length) {
      index = 0;
    }

    this.props.handleCurrentIndex(index);
    this.props.handlePlaying(false);
    this.setState({ songReady });
    this.delay(() => {
      this.togglePlaying();
    });
  }

  // 播放上一首歌曲
  prev = () => {
    const { songReady } = this.state;
    const { currentIndex, playlist } = this.props;
    if (!songReady) {
      return false;
    }

    if (playlist.length === 1) {
      this.loop();
      return false;
    }

    let index = currentIndex - 1;
    if (index === -1) {
      index = playlist.length - 1;
    }

    this.props.handleCurrentIndex(index);
    this.props.handlePlaying(false);
    this.setState({ songReady });
    this.delay(() => {
      this.togglePlaying();
    });
  }

  // 循环播放
  loop = () => {
    const currentTime = 0;
    this.Audio.currentTime = currentTime;
    this.props.handlePlaying(true);
    this.delay(() => {
      this.Audio.play();
    });
  }

  // 清除歌词事件
  clearLyric = (fn) => {
    this.Lyric = "";
    if (this.state.currentLyric) {
      this.state.currentLyric.stop();
    }

    this.setState({
      currentTime: 0,
      currentLineNum: 0,
      playingLyric: "",
      currentLyric: null
    }, () => {
      fn && fn();
    });
  }

  // 歌词回调事件
  handleLyric = ({ lineNum, txt }) => {
    const currentLineNum = lineNum;
    const playingLyric = txt;
    
    this.setState({ currentLineNum, playingLyric });
    this.scrollTo(lineNum);
  }

  // 获取歌词
  getLyric = (fn) => {
    const { song } = this.state;

    if (!song.getLyric) { return false; }
    song.getLyric().then((lyric) => {
      if (this.Lyric !== lyric) {
        this.Lyric = lyric;

        const currentLyric = new Lyric(lyric, this.handleLyric);
        this.setState({ lyric, currentLyric }, () => {
          fn && fn();
        });
      }
    }).catch(() => {
      this.setState({ lyric: "", currentLyric: null });
    });
  }

  // 渲染歌词
  renderLyricList() {
    const computedTextClass = (index) => {
      return this.state.currentLineNum === index ? "text current" : "text";
    }

    if (this.state.currentLyric && this.state.currentLyric.lines) {
      return this.state.currentLyric.lines.map((item, index) => {
        return (
          <div key={item.time} className={computedTextClass(index)}>{ item.txt }</div>
        );
      });
    } else {
      return null;
    }
  }

  // 歌词滚动
  scrollTo(num) {
    const offset = 300;
    const LyricWrapper = this.LyricWrapper;
    const notCurrentLyric = !this.state.currentLyric || !this.state.currentLyric.lines;

    if (notCurrentLyric) { return false; }

    const scrollHeight = LyricWrapper.scrollHeight - offset;
    const length = this.state.currentLyric.lines.length;
    const singleHeight = scrollHeight / length;
    const scrollTop = num * singleHeight;

    LyricWrapper.scrollTop = scrollTop;
  }

  middleTouchStart = (e) => {
    e.preventDefault();
    const touch = e.touches[0];

    this.touch.initiated = true;
    this.touch.startX = touch.pageX;
    this.touch.startY = touch.pageY;
    this.touch.moved = false;
  }

  middleTouchMove = (e) => {
    e.preventDefault();
    if (!this.touch.initiated) {
      return false;
    }
    const touch = e.touches[0];
    const deltaX = touch.pageX - this.touch.startX;
    const deltaY = touch.pageY - this.touch.startY;

    if (Math.abs(deltaY) > Math.abs(deltaX)) {
      return false;
    }

    if (!this.touch.moved) {
      this.touch.moved = true
    }

    const left = this.currentShow === 'cd' ? 0 : -window.innerWidth;
    const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX));

    this.touch.percent = Math.abs(offsetWidth / window.innerWidth);
    this.MiddleR.style[transform] = `translate3d(${offsetWidth}px,0,0)`
    this.MiddleR.style[transitionDuration] = 0
    this.MiddleL.style.opacity = 1 - this.touch.percent
    this.MiddleL.style[transitionDuration] = 0
  }

  middleTouchEnd = (e) => {
    e.preventDefault();
    if (!this.touch.moved) {
      return false;
    }
    const time = 300;
    let offsetWidth, opacity;
    if (this.state.currentShow === 'cd') {
      if (this.touch.percent > 0.1) {
        offsetWidth = -window.innerWidth;
        opacity = 0;
        this.setState({currentShow: "lyric"});
      } else {
        offsetWidth = 0;
        opacity = 1;
      }
    } else {
      if (this.touch.percent < 0.9) {
        offsetWidth = 0;
        this.setState({currentShow: "cd"});
        opacity = 1;
      } else {
        offsetWidth = -window.innerWidth;
        opacity = 0;
      }
    }
    this.MiddleR.style[transform] = `translate3d(${offsetWidth}px,0,0)`;
    this.MiddleR.style[transitionDuration] = `${time}ms`;
    this.MiddleL.style.opacity = opacity
    this.MiddleL.style[transitionDuration] = `${time}ms`;
    this.touch.initiated = false;
  }

  // 修改播放模式
  changePlayMode() {
    let { mode } = this.props;

    if (mode === 2) {
      mode = 0;
    } else {
      mode += 1;
    }

    this.props.handleMode(mode);
  }

  // 正常的播放器
  normalPlayer () {
    return (
      <div className="normal-player" style={this.state.normalStyle}>
        <div className="background">
          <img 
            width="100%" height="100%" 
            alt=""
            src={ this.state.song.image }/>
        </div>
        <div className={ this.computeNavClass("top", this.state.fullScreen) }>
          <div onClick={() => { this.props.handleFullScreen(false) }} className="back">
            <i className="icon-back"></i>
          </div>
          <div className="title">{ this.state.song.name }</div>
          <div className="subtitle">{ this.state.song.singer }</div>
        </div>
        <div
          onTouchStart={this.middleTouchStart}
          onTouchMove={this.middleTouchMove}
          onTouchEnd={this.middleTouchEnd}
          className="middle">
          <div ref={(e) => {this.MiddleL = e}} className="middle-l">
            <div className="cd-wrapper">
              <div className="cd" ref={(e) => {this.imageWrapper = e}}>
                <img alt="" ref={(e) => {this.image = e}} className={this.computedImageClass("image")} src={ this.state.song.image }/>
              </div>
            </div>
            <div className="playing-lyric-wrapper">
              <div className="playing-lyric">{this.state.playingLyric}</div>
            </div>
          </div>
          <div ref={(e) => {this.MiddleR = e}} className="middle-r">
            <div
              ref={(e) => {this.LyricWrapper = e}}
              className="lyric-wrapper">
                <div className="lyric-top-block"></div>
                <div>
                  { this.renderLyricList() }
                </div>
                <div className="lyric-bottom-block"></div>
            </div>
          </div>
        </div>
        <div className={ this.computeNavClass("bottom", this.state.fullScreen) }>
          <div className="dot-wrapper">
            <span className={this.computedDotClassName(0)}></span>
            <span className={this.computedDotClassName(1)}></span>
          </div>
          <div className="progress-wrapper">
            <span className="time time-l">{this.format(this.state.currentTime)}</span>
            <div className="progress-bar-wrapper">
              <ProgressBar 
                percentChange={this.percentChange}
                percent={this.percent()}/>
            </div>
            <span className="time time-r">{this.format(this.state.song.duration)}</span>
          </div>
          <div className="operators">
            <div className="icon i-left">
              <i 
                onClick={() => { this.changePlayMode() }}
                className={this.computedModeClass()}/>
            </div>
            <div className={ this.computeClass("icon i-left") }>
              <i 
                onClick={() => { this.prev() }}
                className="icon-prev"/>
            </div>
            <div className={ this.computeClass("icon i-center") }>
              <i
                onClick={ () => { this.togglePlaying("normal") } } 
                className={ this.computeCenterClass() }/>
            </div>
            <div className={ this.computeClass("icon i-right") }>
              <i 
                onClick={() => { this.next() }}
                className="icon-next"/>
            </div>
            <div className="icon i-right">
              <i className="icon icon-not-favorite"></i>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // mini播放器
  miniPlayer () {
    return (
      <div className="mini-player" style={this.state.miniStyle}>
        <div onClick={() => { this.props.handleFullScreen(true) }} className="icon">
          <div ref={(e) => { this.miniWrapper = e }} className="imgWrapper">
            <img
              ref={(e) => { this.miniImage = e }}
              width="40" height="40" 
              alt=""
              className={this.computedImageClass("")}
              src={ this.state.song.image }/>
          </div>
        </div>
        <div onClick={() => { this.props.handleFullScreen(true) }} className="text">
          <h2 className="name">{ this.state.song.name }</h2>
          <p className="desc">{ this.state.song.singer }</p>
        </div>
        <div className="control">
          <ProgressCircle percent={this.percent()} radius={ this.state.radius }>
            <i
              onClick={ () => { this.togglePlaying("mini") } } 
              className={this.computeMiniCenterClass()}></i>
          </ProgressCircle>
        </div>
        <div className="control">
          <i className="icon-playlist"></i>
        </div>
      </div>
    );
  }

  // play list
  playList() {
    return (
      <div className="playlist"></div>
    );
  }

  // 百分比发生变化
  percentChange = (percent) => {
    const currentTime = Math.floor(percent * this.state.song.duration);

    this.Audio.pause();
    this.setState({ currentTime });
    if (this.Audio && this.Audio.currentTime) {
      this.Audio.currentTime = currentTime;
    }

    this.delay(() => {
      this.Audio.play();
      if (this.state.currentLyric) {
        this.state.currentLyric.seek(currentTime * 1000);
      }
    });
  }

  // 计算歌曲播放的百分比
  percent() {
    const { currentTime, song } = this.state;
    return currentTime / song.duration;
  }

  /**
   * 计算内层Image的transform，并同步到外层容器
   * @param wrapper
   * @param inner
   */
  syncWrapperTransform (wrapper, inner) {
    if (!this[wrapper]) {
      return false;
    }

    let imageWrapper = this[wrapper];
    let image = this[inner];
    let wTransform = getComputedStyle(imageWrapper)[transform];
    let iTransform = getComputedStyle(image)[transform];

    imageWrapper.style[transform] = wTransform === 'none' ? iTransform : iTransform.concat(' ', wTransform)
  }

  format(interval) {
    const _pad = function (num, n = 2) {
      let len = num.toString().length;
      while (len < n) {
        num = '0' + num;
        len++;
      }
      return num;
    }

    interval = interval | 0
    const minute = interval / 60 | 0
    const second = _pad(interval % 60)
    return `${minute}:${second}`
  }

  // audio 音频播放器
  audio() {
    return (
      <audio
        ref={e => this.Audio = e}
        onPlaying={(e) => { this.onPlaying(e) }}
        onPause={(e) => {this.onPause(e)}}
        onTimeUpdate={(e) => { this.timeupdate(e) }}
        onEnded={(e) => { this.onEnded(e) }}
        onError={(e) => { this.onError(e) }}
        src={ this.state.song.url }>
      </audio>
    );
  }

  render() {
    return (
      <div className="player">
        { this.normalPlayer() }
        { this.miniPlayer() }
        { this.playList() }
        { this.audio() }
      </div>
    );
  }

  componentWillUnmount() {
    this.timer && clearTimeout(this.timer);
    this.timer = null;
    delete this.timer;
  }
}

// 接收state数据
const mapStateToProps = state => ({
  fullScreen: state.fullScreen,
  playing: state.playing,
  currentIndex: state.currentIndex,
  mode: state.mode,
  playlist: state.playlist
});

// 接收action方法
const mapDispatch = (dispatch) => ({
  handleFullScreen(value) {
    dispatch(Actions.handleFullScreen(value));
  },
  handlePlaying (value) {
    dispatch(Actions.handlePlaying(value));
  },
  handleCurrentIndex(value) {
    dispatch(Actions.handleCurrentIndex(value));
  },
  handleMode(value) {
    dispatch(Actions.handleMode(value));
  }
});

export default connect(mapStateToProps, mapDispatch)(Player);
