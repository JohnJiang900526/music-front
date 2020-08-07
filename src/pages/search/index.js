import React, { Component } from "react";
import { PullToRefresh } from 'antd-mobile';
import { connect } from "react-redux";
import SearchBox from "base/search-box";
import Comfirm from "base/Comfirm";
import "./index.less";

import { getHotKey, search } from "api/search";
import { getPurlUrl } from "api/song";
import { isValidMusic, createSong } from "common/js/song";
import { PlayerAction } from "common/js/player-action";

import {
  SearchSave,
  getSearch,
  SearchClear,
  SearchDelete
} from "common/js/search.js";

const title = "确定清空历史记录?";

class Search extends Component {
  constructor (props) {
    super(props);

    this.state = {
      name: "search",
      placeholder: "搜索歌曲、歌手",
      hotkey: [],
      history: [],
      searchKey: "",
      page: 1,
      zhida: 0, 
      perpage: 100,
      songs: [],
      refreshing: false,
      down: true,
      height: document.documentElement.clientHeight - 158,
    }
  }

  componentDidMount () {
    this.getHot(() => {
      this.getHistory();
    });
  }

  getHot = (fn) => {
    getHotKey().then((res) => {
      let { hotkey } = res.data;

      if (hotkey.length > 10) {
        hotkey = hotkey.slice(0 ,10);
      }
      this.setState({ hotkey }, () => {
        fn && fn();
      });
    });
  }

  // 获取对应值
  getValue = (val) => {
    let key = (val || "").trim();

    this.setState({ searchKey: key });

    if (key !== "") {
      SearchSave(key);
    }

    this.getHistory();
    this.searchHandle();
  }

  searchHandle(fn) {
    const { page, zhida, perpage,searchKey } = this.state;

    search(searchKey, page, zhida, perpage).then(({ data = {} }) => {
      getPurlUrl(this.normalizeSongs(data.song.list)).then((result) => {
        this.setState({ songs: result.data.songs });
        fn && fn();
      });
    });
  }

  normalizeSongs(list) {
    let ret = []
    list.forEach((musicData) => {
      if (isValidMusic(musicData)) {
        ret.push(createSong(musicData))
      }
    })
    return ret
  }

  // 删除事件
  deleteHistory = (item) => {
    SearchDelete(item);
    this.getHistory();
  }

  // 清除事件
  clearHistory = () => {
    this.Comfirm.showHandle && this.Comfirm.showHandle();
  }

  okHandle = () => {
    SearchClear();
    this.getHistory();
  }

  // 获取历史记录
  getHistory = () => {
    let history = getSearch() || [];

    this.setState({ history });
  }

  setData = (val) => {
    this.SearchBox.setData(val);
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

  handleClick = (index) => {
    const {
      playerHandleSequenceList,
      playerHandleCurrentIndex,
      playerHandleFullScreen
    } = this.props;
    const songs = this.state.songs;

    playerHandleSequenceList(songs);
    playerHandleCurrentIndex(index);
    playerHandleFullScreen(true);
  }

  renderSuggest () {
    const { searchKey } = this.state;
    return (
      <div className="suggest" style={{ "zIndex": searchKey!== "" ? 100 : -10 }}>
        <PullToRefresh
          damping={ 100 }
          ref={el => this.ptr = el}
          style={this.PullToRefreshStyleOption()}
          indicator={this.state.down ? {} : { deactivate: '上拉可以刷新' }}
          direction={this.state.down ? 'down' : 'up'}
          refreshing={this.state.refreshing}
          onRefresh={() => {
            this.setState({ refreshing: true });
            this.searchHandle(() => {
              this.setState({ refreshing: false });
            });
          }}>
          <ul className="suggest-lists">
            {
              this.state.songs.map((item, index) => {
                return(
                  <li 
                    onClick={() => { this.handleClick(index) }} 
                    key={ item.id } 
                    className="suggest-item">
                    <div className="icon">
                      <i className="icon-music"></i>
                    </div>
                    <div className="name">
                    <p className="text">{ item.name }</p>
                    </div>
                  </li>
                );
              })
            }
          </ul>
        </PullToRefresh>
      </div>
    );
  }

  render () {
    return (
      <div className="search">
        <div className="search-box-warp">
          <SearchBox
            ref={ el => this.SearchBox = el }
            placeholder={this.state.placeholder}
            getValue= { this.getValue }
          ></SearchBox>
        </div>

        <div className="shortcut-wrapper">
          <div className="shortcut">
            <div className="hot-key-content">
              <h1 className="title">热门搜索</h1>
              <ul>
                {
                  this.state.hotkey.map((item) => {
                    return (
                      <li onClick={ () => { this.setData(item.k) } } className="item" key={item.n + item.k}>
                        <span>{ item.k }</span>
                      </li>
                    )
                  })
                }
              </ul>
            </div>
            <div 
              className="search-history" 
              style={{ display: this.state.history.length > 0 ? "block" : "none" }}>
              <h1 className="title">
                <span className="text">搜索历史</span>
                <span onClick={this.clearHistory} className="clear">
                  <i className="icon-clear"></i>
                </span>
              </h1>
              <div className="search-list">
                <ul>
                  {
                    this.state.history.map((item) => {
                      return (
                        <li key={ item } className="search-item">
                          <span  onClick={ () => { this.setData(item) } }  className="text">{ item }</span>
                          <span onClick={() => { this.deleteHistory(item) }} className="icon">
                            <i className="icon-delete"></i>
                          </span>
                        </li>
                      )
                    })
                  }
                </ul>
              </div>
            </div>
          </div>
        </div>
        { this.renderSuggest() }

        <Comfirm
          ref={ el => this.Comfirm = el }
          okHandle={this.okHandle}
          title={ title }
        ></Comfirm>
      </div>
    )
  }
}

// 接收state数据
const mapStateToProps = state => ({
  playlist: state.playlist
});

export default connect(mapStateToProps, null)(PlayerAction(Search));
