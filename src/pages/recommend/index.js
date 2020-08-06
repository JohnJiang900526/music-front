import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { PullToRefresh, Carousel } from 'antd-mobile';
import List from "base/recommend-list";
import { getRecommend } from "api/recommend";
import "./index.less";

import * as Actions from 'store/actions';

class Recommend extends Component {
  constructor (props) {
    super(props);

    this.state = {
      name: "recommend",
      refreshing: false,
      down: true,
      height: document.documentElement.clientHeight - 88,
      downOption: {
        activate: "下拉刷新",
        finish: " "
      }
    }
  }

  getRecommend (fn) {
    const { handleRecommend } = this.props;

    getRecommend().then((res) => {
      let { list = [], banner = {} } = res.data;
      let { slider } = banner;

      handleRecommend({ slider, data: [] });

      setTimeout(() => {
        handleRecommend({ slider, data: list });
      }, 100);
      fn && fn();
    }).catch((e) => {
      fn && fn(e);
    });
  }

  componentDidMount() {
    this.getRecommend();
  }

  onRefresh = () => {
    this.setState({ refreshing: true });
    this.getRecommend(() => {
      this.setState({ refreshing: false });
    });
  }

  // 渲染list数据
  List = () => {
    const { recommend } = this.props;
    return (
      <div className="recommend-list-content">
        <h1 className="list-title">热门歌单推荐</h1>
        <ul className="list-content">
          {
            recommend.data.map((item, index) => {
              return (
                <li
                  className="item"
                  onClick={ () => { this.openHandle(item) } }
                  key={ item.dissid }>
                  <List item = { item }/>
                </li>
              )
            })
          }
        </ul>
      </div>
    )
  }

  openHandle (item) {
    this.props.history.push(`/recommend/${item.dissid}`);
  }

  // render banner
  Banner = () => {
    const { recommend } = this.props;
    const { slider = [] } = recommend;
    return (
      <div className="recommend-banner">
        <div className="banner-inner">
          <Carousel
            className="carousel-block"
            autoplay={ false }
            infinite
            selectedIndex={ 0 }>
            {
              slider.map((item) => {
                return (
                  <img
                    key= { item.id }
                    alt= { item.picUrl }
                    src={ item.picUrl }/>
                );
              })
            }
          </Carousel>
        </div>
      </div>
    )
  }

  render () {
    let PullToRefreshStyleOption = {
      height: this.state.height,
      overflow: 'auto'
    };
    let { down, downOption, refreshing } = this.state;

    return (
      <div className="recommend" ref={el => this.WrapHeight = el}>
        <PullToRefresh 
          damping={ 120 }
          style={ PullToRefreshStyleOption }
          indicator={down ? downOption : { deactivate: '上拉可以刷新' }}
          direction={down ? 'down' : 'up'}
          refreshing={ refreshing }
          onRefresh={ this.onRefresh } >
            {
              this.Banner()
            }
            {
              this.List()
            }
        </PullToRefresh>
      
        { this.props.children }
      </div>
    );
  }
}

// 接收state数据
const mapStateToProps = state => ({
  recommend: Object.assign({}, state.recommend)
});

// 接收action方法
const mapDispatch = (dispatch) => ({
  handleRecommend(value) {
    dispatch(Actions.handleRecommend(value));
  }
});

export default connect(mapStateToProps, mapDispatch)(withRouter(Recommend));
