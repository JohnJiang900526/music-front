import React, { Component } from "react";
import { connect } from "react-redux";
import { PullToRefresh } from 'antd-mobile';
import { withRouter } from "react-router-dom";
import LazyImg from "base/lazy-img";
import "./index.less";

import * as Actions from 'store/actions';

import { getTopList } from "api/rank.js";

class Rank extends Component {
  constructor (props) {
    super(props);

    this.state = {
      name: "rank",
      topList: [],
      refreshing: false,
      down: true,
      height: document.documentElement.clientHeight,
      downOption: {
        activate: "下拉刷新",
        finish: " "
      }
    }
  }

  componentDidMount () {
    const height = this.WrapHeight.offsetHeight;
    this.getTop(() => {
      this.setState({ height });
    });

    console.log(this.props);
  }

  getTop = (fn, refresh) => {
    const { handleRanks, ranks } = this.props;

    if (!refresh && ranks.length > 0) {
      fn && fn();
      return false;
    }

    getTopList().then((res) => {
      let { topList } = res.data;

      handleRanks(topList);
      fn && fn();
    });
  }

  RankList = () => {
    const { ranks } = this.props;
    return ranks.map((item) => {
      return (
        <li className="item" onClick={() => { this.openHandle(item) }} key={item.id}>
          <div className="icon">
            <LazyImg 
              width={100}
              height={100}
              src={ item.picUrl }></LazyImg>
          </div>
          <ul className="songlist">
            {
              item.songList.map((item, index) => {
                return (
                  <li key={item.singername + item.songname} className="song">
                    <span>{ index }</span>
                    <span>{ item.songname + ' ' + item.singername }</span>
                  </li>
                )
              })
            }
          </ul>
        </li>
      )
    });
  }

  openHandle(item) {
    const { id, picUrl } = item;
    let url = picUrl.replace("http://y.gtimg.cn/music/photo_new/T003R300x300M000", "");
    url = url.replace(".jpg", "");
    this.props.history.push(`/rank/${id}?pic=${url}`);
  }

  onRefresh = () => {
    this.setState({ refreshing: true });
    this.getTop(() => {
      this.setState({ refreshing: false });
    }, true);
  }

  render () {
    let PullToRefreshStyleOption = {
      height: this.state.height,
      overflow: 'auto'
    };
    let { down, downOption, refreshing } = this.state;

    return (
      <div className="rank">
        <div className="rank-main" ref={el => this.WrapHeight = el}>
          <PullToRefresh
            damping={ 120 }
            style={ PullToRefreshStyleOption }
            indicator={down ? downOption : { deactivate: '上拉' }}
            direction={down ? 'down' : 'up'}
            refreshing={ refreshing }
            onRefresh={ this.onRefresh }>
            <ul>
              { this.RankList() }
            </ul>
          </PullToRefresh>
        </div>
      
        { this.props.children }
      </div>
    )
  }
}
// 接收state数据
const mapStateToProps = state => ({
  ranks: state.ranks
});

// 接收action方法
const mapDispatch = (dispatch) => ({
  handleRanks(value) {
    dispatch(Actions.handleRanks(value));
  }
});

export default connect(mapStateToProps, mapDispatch)(withRouter(Rank));
