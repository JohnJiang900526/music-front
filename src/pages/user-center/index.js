import React, { Component } from "react";
import {
  CSSTransition
} from "react-transition-group";
import "./index.less";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { HOC } from "components/hoc";
import { PlayerAction } from "common/js/player-action";
import { playMode } from "common/js/config";

class UserCenter extends Component {
  constructor (props) {
    super(props);

    this.state = {
      show: false,
      appear: false,
      rootClassName: "user-center",
      switchData: [
        {
          text: "我喜欢的",
          key: 0
        },
        {
          text: "最近播放",
          key: 1
        }
      ],
      currentKey: 0,
      songs: []
    };
  }

  componentDidMount () {
    this.setState({
      appear: true,
      show: true,
      rootClassName: "user-center",
      songs: [...this.props.favoriteList]
    });
  }

  back = () => {
    let rootClassName = "user-center hide";
    this.setState({ rootClassName }, () => {
      setTimeout(() => {
        this.props.history.goBack();
        this.setState({
          rootClassName: "user-center"
        });
      }, 300);
    });
  }

  getClassName (index) {
    return this.state.currentKey ===  index? "switch-item active" : "switch-item";
  }

  switchHandle(currentKey) {
    this.setState({ currentKey });
  }

  getText() {
    return this.state.currentKey === 0 ? "暂无收藏歌曲" : "你还没听过歌曲";
  }

  styleOption = (type) => {
    const songs = this.state.currentKey === 0 ? [...this.props.favoriteList] : [...this.props.playHistory];
    if (type === "lists") {
      return songs.length > 0 ? {} : {display: "none"};
    } else {
      return songs.length > 0 ? {display: "none"} : {};
    }
  }

  listStyleOption = () => {
    if (this.props.playlist.length > 0) {
      return {
        height: `calc(100% - 91px)`
      };
    } else {
      return {
        height: `calc(100% - 31px)`
      };
    }
  }

  handleClick = (index, type) => {
    const songs = this.state.currentKey === 0 ? [...this.props.favoriteList] : [...this.props.playHistory];
    const {
      playerHandleSequenceList,
      playerHandleCurrentIndex,
      playerHandleFullScreen,
      playerHandleMode,
    } = this.props;

    playerHandleSequenceList(songs);
    playerHandleCurrentIndex(index);
    playerHandleFullScreen(true);
    if (type === "random") {
      playerHandleMode(playMode.random);
    }
  }

  renderList = () => {
    const songs = this.state.currentKey === 0 ? [...this.props.favoriteList] : [...this.props.playHistory];

    return songs.map((item, index) => {
      return (
        <div onClick={() => {this.handleClick(index)}} key={item.id} className="list-item">
          <h2 className="name">{item.name}</h2>
          <p className="desc">{`${item.singer}.${item.album}`}</p>
        </div>
      );
    });
  }

  render () {
    return(
      <CSSTransition
        appear={this.state.appear}
        classNames="fade"
        in = {this.state.show}
        unmountOnExit={ true }
        timeout = {10}>
          <div className={ this.state.rootClassName }>
            <div onClick={ () => { this.back() } } className="back">
              <i className="icon-back"></i>
            </div>
            <div className="switch-wrap">
              {
                this.state.switchData.map((item, index) => {
                  return (
                    <div 
                      onClick={() => { this.switchHandle(index) }} 
                      key={item.key} 
                      className={ this.getClassName(index) }>
                        { item.text }
                    </div>
                  );
                })
              }
            </div>
            <div className="switch-content">
              <div onClick={() => { this.handleClick(0, "random") }} className="play-btn">
                <i className="icon-play"></i>
                <span className="text">随机播放全部</span>
              </div>
              <div className="list-content" style={this.listStyleOption()}>
                <div className="lists" style={this.styleOption("lists")}>
                  { this.renderList() }
                </div>
                <div className="no-result-wrapper" style={this.styleOption()}>
                  <div className="no-result-icon"></div>
                  <div className="no-result-text">{this.getText()}</div>
                </div>
              </div>
            </div>
          </div>
      </CSSTransition>
    );
  }

  componentWillUnmount () {
    this.timer && clearTimeout(this.timer);
  }
}

// 接收state数据
const mapStateToProps = state => ({
  playHistory: state.playHistory,
  favoriteList: state.favoriteList,
  playlist: state.playlist
});

export default connect(mapStateToProps, null)(withRouter(HOC(PlayerAction(UserCenter))));
