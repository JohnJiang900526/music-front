import React, { Component } from "react";
import { connect } from "react-redux";
import * as Actions from 'store/actions';
import Comfirm from "base/Comfirm";
import { playMode } from 'common/js/config';
import { isExist } from "common/js/util";
import "./index.less";

class PlayList extends Component {
  constructor (props) {
    super(props);
    this.state = {};
  }

  // 计算播放模式className
  computedModeClass() {
    switch(this.props.mode) {
      case playMode.sequence:
        return "icon icon-sequence";
      case playMode.loop:
        return "icon icon-loop";
      case playMode.random:
        return "icon icon-random";
      default:
        return "icon icon-sequence";
    }
  }

  // 计算播放模式text
  computedTextClass() {
    switch(this.props.mode) {
      case playMode.sequence:
        return "顺序播放";
      case playMode.loop:
        return "单曲循环";
      case playMode.random:
        return "随机播放";
      default:
        return "顺序播放";
    }
  }

  // 关闭操作
  closeHandle = (e) => {
    e.preventDefault();
    e.stopPropagation();

    this.props.closePlayListHandle &&
    this.props.closePlayListHandle();
  }

  // 清空操作
  clearHandle = (e) => {
    e.preventDefault();
    e.stopPropagation();

    this.Comfirm.showHandle();
  }
  
  // 修改播放模式
  changePlayMode = () => {
    this.props.changePlayMode &&
    this.props.changePlayMode();
  }

  // 确定清空时间事件
  okHandle = () => {
    this.props.handleSequenceList && 
    this.props.handleSequenceList([]);
  }

  // 删除歌曲事件
  deleteHandle = (item) => {
    let sequenceList = this.props.sequenceList;
    let result = [];

    result = sequenceList.filter((list) => {
      return list.id !== item.id;
    });

    this.props.handleSequenceList &&
    this.props.handleSequenceList(result);
  }

  toggleFavorite = (song) => {
    this.props.handleFavoriteList &&
    this.props.handleFavoriteList(song);
  }

  isFavorite = (song) => {
    if (!song.id) {
      return "icon-not-favorite";
    }

    if (isExist(song, this.props.favoriteList)) {
      return "icon-favorite";
    } else {
      return "icon-not-favorite";
    }
  }

  renderList () {
    const playIcon = (index) => {
      return this.props.currentIndex === index ? "current icon-play" : "current";
    };

    if (this.props.playlist.length > 0) {
      return this.props.playlist.map((item, index) => {
        return (
          <li key={ item.id } className="item">
            <i className={playIcon(index)}></i>
            <span className="text">{ item.name }</span>
            <span onClick={() => { this.toggleFavorite(item) }} className="like">
              <i className={this.isFavorite(item)}></i>
            </span>
            <span onClick={() => { this.deleteHandle(item) }} className="delete">
              <i className="icon-delete"></i>
            </span>
          </li>
        );
      });
    } else {
      return null;
    }
  }

  render() {
    return (
      <div className="play-list">
        <div className="list-wrapper">
          <div className="list-header">
            <h2 className="title">
              <i onClick={this.changePlayMode} className={this.computedModeClass()}></i>
              <span className="text">{ this.computedTextClass() }</span>
              <span onClick={this.clearHandle} className="clear">
                <i className="icon-clear"></i>
              </span>
            </h2>
          </div>
          <div className="list-content">
            <ul className="list-inner">
              { this.renderList() }
            </ul>
          </div>
          <div className="list-operate">
            <div className="add">
              <i className="icon-add"></i>
              <span className="text">添加歌曲到队列</span>
            </div>
          </div>
          <div onClick={this.closeHandle} className="list-close">
            <span>关闭</span>
          </div>
        </div>
        <div className="add-song"></div>
        <Comfirm 
          ref={(e) => {this.Comfirm = e}}
          okHandle={this.okHandle}
          okText={"清空"}
          cancelText={"取消"}/>
      </div>
    );
  }
}

// 接收state数据
const mapStateToProps = state => ({
  currentIndex: state.currentIndex,
  mode: state.mode,
  playlist: state.playlist,
  sequenceList: state.sequenceList,
  favoriteList: state.favoriteList
});

// 接收action方法
const mapDispatch = (dispatch) => ({
  handleCurrentIndex(value) {
    dispatch(Actions.handleCurrentIndex(value));
  },
  // 原始歌曲队列
  handleSequenceList(value) {
    dispatch(Actions.handleSequenceList(value));
  },
  handleFavoriteList(value) {
    dispatch(Actions.handleFavoriteList(value));
  }
});

export default connect(mapStateToProps, mapDispatch)(PlayList);
