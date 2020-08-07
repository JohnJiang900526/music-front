import React, { Component } from "react";
import { connect } from "react-redux";
import * as Actions from 'store/actions';

// 接收state数据
const mapStateToProps = state => ({
  playerStateMode: state.mode,
  playerStateSequenceList: state.sequenceList,
  playerStatePlaylist: state.playlist,
  playerStateCurrentIndex: state.currentIndex,
  playerFullScreen: state.fullScreen
});

// 接收action方法
const mapDispatch = (dispatch) => ({
  // 全屏
  playerHandleFullScreen(value) {
    dispatch(Actions.handleFullScreen(value));
  },
  // 原始歌曲队列
  playerHandleSequenceList(value) {
    dispatch(Actions.handleSequenceList(value));
  },
  // 歌曲播放队列
  playerHandleCurrentIndex(value) {
    dispatch(Actions.handleCurrentIndex(value));
  },
  // 设置播放模式
  playerHandleMode(value) {
    dispatch(Actions.handleMode(value));
  }
});

export function PlayerAction (WrappedComponent) {
  const PlayActionComponent = connect(mapStateToProps, mapDispatch)(WrappedComponent);
  return class extends Component {
    constructor (props) {
      super(props);
      this.state = {};
    }

    render () {
      return(
        <PlayActionComponent {...this.props}></PlayActionComponent>
      );
    }
  }
}

