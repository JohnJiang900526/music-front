import React, { Component } from "react";
import "./index.less";

import { PlayerAction } from "common/js/player-action";

class MusicList extends Component {
  constructor (props) {
    super(props);
    this.state = {
      offsetTop: 220
    };
  }

  componentDidMount () {
    this.init();
  }

  init() {
    const width = this.MusicBlock.clientWidth;
    const offsetTop = Math.floor(width * 0.7);
    
    this.setState({ offsetTop });
  }

  renderTop() {
    return (
      <div ref={e => this.TopBlock = e} style={{ "backgroundImage": this.props.logo }} className="music-top-block">
        <div className="play-wrapper">
          <div className="play">
            <i className="icon-play"></i>
            <span className="text">随机播放全部</span>
          </div>
        </div>
        <div className="filter"></div>
      </div>
    );
  }

  getRankCls(index) {
    if (index <= 2) {
      return `icon icon${index}`
    } else {
      return 'text'
    }
  }

  getRankText(index) {
    if (index > 2) {
      return index + 1
    }
  }

  handleClick (index) {
    const {
      playerHandleSequenceList,
      playerHandleCurrentIndex,
      playerHandleFullScreen,
      songs
    } = this.props;

    playerHandleSequenceList(songs);
    playerHandleCurrentIndex(index);
    playerHandleFullScreen(true);
  }

  renderMain () {
    return (
      <div
        style={{ "top": this.state.offsetTop + "px" }}
        className="music-main-block">
        <ul className="music-list">
          {
            this.props.songs.map((item, index) => {
              return (
                <li onClick={() => { this.handleClick(index) }} key={item.id} className="item">
                  <div style={{ "display": this.props.rank ? "": "none" }} className="rank">
                  <span className={ this.getRankCls(index) }>{ this.getRankText(index) }</span>
                  </div>
                  <div className="content">
                    <h2 className="name">{ item.name } </h2>
                    <div className="desc">{ `${item.singer}.${item.album}` }</div>
                  </div>
                </li>
              );
            })
          }
        </ul>
      </div>
    );
  }

  render () {
    return (
      <div ref={e => this.MusicBlock = e} className="music-lists">
        <div onClick={() => { this.props.back() }} className="title-back"><i className="icon-back"></i></div>
        <div className="title-text">{ this.props.title }</div>
        { this.renderTop() }
        { this.renderMain() }
      </div>
    );
  }
}

export default PlayerAction(MusicList);
