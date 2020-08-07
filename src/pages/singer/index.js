import React, { Component } from "react";
import { connect } from "react-redux";
import { PullToRefresh } from 'antd-mobile';
import { withRouter } from "react-router-dom";
import "./index.less";

import * as Actions from 'store/actions';

import SingerList from "components/singer-list";
import { getSingerList } from "api/singer.js";
import { formatSinger, getDOMPosition, scrollToY } from "common/js/util.js";

class Singer extends Component {
  constructor (props) {
    super(props);

    this.state = {
      name: "singer",
      refreshing: false,
      down: true,
      height: document.documentElement.clientHeight,
      downOption: {
        activate: "下拉刷新",
        finish: " "
      },
      list: [],
      groups: [],
      ScrollDOM: null,
      activeKey: "hot",
      isScroll: false
    }
  }

  componentDidMount () {
    const height = this.WrapHeight.offsetHeight;
    
    this.getSinger(() => {
      this.setState({ height });
    });
  }

  initDom() {
    setTimeout(() => {
      if (!this.ScrollBlock || !this.WrapHeight) {
        return false;
      }

      let listDOM = this.ScrollBlock.getElementsByClassName("list-group");
      let ScrollDOM = this.WrapHeight.getElementsByClassName("am-pull-to-refresh")[0];
      
      this.setState({
        list: listDOM,
        ScrollDOM: ScrollDOM
      });
    }, 500);
  }

  getSinger = (fn) => {
    const { handleSingers, singers } = this.props;

    if (singers.length > 0) {
      this.initDom();
      fn && fn();
      return false;
    }

    getSingerList().then((res) => {
      let { list = [] } = res.data;

      handleSingers(list);
      this.setState({ groups: formatSinger(list) }, () => {
        this.initDom();
        fn && fn();
      });
    });
  }

  Groups = () => {
    const groups = formatSinger(this.props.singers);
    return groups.map((group) => {
      return (
        <li key={ group.key } data-key={ group.key } className="list-group">
          <h2 className="list-group-title">{ group.name }</h2>
          <ul>
            {
              group.data.map((item) => {
                return (
                  <li onClick={() => { this.openHandle(item) }} className="list-group-item" key={ item.Fsinger_id }>
                    <SingerList item={ item }/>
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
    this.props.history.push(`/singer/${ item.Fsinger_mid }`);
  }

  ShortcutHandle = (e) => {
    let key = e.currentTarget.dataset.key;
    let { list } = this.state;
    let msg = scrollToY(key, list);

    this.scrollTo(msg);
  }

  Shortcut = () => {
    let { activeKey } = this.state;

    return this.state.groups.map(group => {
      let key = group.key;
      let className = activeKey === group.key ? "item active" : "item";

      if (key === "hot") {
        key = "热";
      }
      return (
        <li 
          className={ className } 
          key={ key }
          onClick={ this.ShortcutHandle }
          data-key={group.key}>{ key }</li>
      )
    });
  }

  onRefresh = () => {
    this.setState({ refreshing: true });
    this.getSinger(() => {
      this.setState({ refreshing: false });
    });
  }

  // 滚动事件
  onScroll = () => {
    let { list, ScrollDOM } = this.state;
    
    if (!ScrollDOM) {
      return false;
    }

    let scrollTop = ScrollDOM.scrollTop + 25;
    let targetItem = getDOMPosition(list, scrollTop);
    
    this.setState({
      activeKey: targetItem.key,
      isScroll: true
    });
  }

  // 滚动位置事件
  scrollTo = (pos) => {
    let { ScrollDOM, isScroll } = this.state;

    if (!ScrollDOM) {
      return false;
    }


    ScrollDOM.scrollTop = isScroll ?  pos.offsetTop - 25: pos.offsetTop;
  }

  PullToRefreshStyleOption = () => {
    let height = this.state.height;

    if (this.props.playlist.length > 0) {
      height = height - 60;
    }

    return {
      height,
      overflow: 'auto'
    }
  }

  render () {
    let { down, downOption, refreshing } = this.state;
    return (
      <div className="singer">
        <div className="singer-inner">
          <div
            className="singer-group-list"
            onScroll={this.onScroll}  
            ref={el => this.WrapHeight = el}>
              <PullToRefresh 
                damping={ 120 }
                style={ this.PullToRefreshStyleOption() }
                indicator={down ? downOption : { deactivate: '上拉' }}
                direction={down ? 'down' : 'up'}
                refreshing={ refreshing }
                onRefresh={ this.onRefresh } >
                  <ul ref={el => this.ScrollBlock = el}>
                    { this.Groups() }
                  </ul>
              </PullToRefresh>
          </div>

          <div className="list-shortcut">
            <ul>
              { this.Shortcut() }
            </ul>
          </div>
          <div className="list-fixed"></div>
        </div>
        { this.props.children }
      </div>
    )
  }
}

// 接收state数据
const mapStateToProps = state => ({
  singers: [...state.singers],
  playlist: state.playlist
});

// 接收action方法
const mapDispatch = (dispatch) => ({
  handleSingers(value) {
    dispatch(Actions.handleSingers(value));
  }
});

export default connect(mapStateToProps, mapDispatch)(withRouter(Singer));
