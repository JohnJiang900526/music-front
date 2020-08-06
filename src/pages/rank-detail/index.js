import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import {
  CSSTransition
} from "react-transition-group";
import "./index.less";
import { getMusicList } from "api/rank";
import { getPurlUrl } from "api/song";
import { isValidMusic, createSong } from "common/js/song";

import MusicList from "components/music-list";

class RankDetail extends Component{
  constructor (props) {
    super(props);

    this.state = {
      show: false,
      appear: false,
      rootClassName: "rank-detail",
    };
  }

  componentDidMount() {
    this.setState({
      appear: true,
      show: true,
      rootClassName: "rank-detail",
      logo: "",
      name: "",
      songs: []
    });

    this.getDetail();
  }

  getDetail() {
    const { id } = this.props.match.params;

    getMusicList(id).then((res) => {
      if (res.code === 0) {
        let { songlist, topinfo } = res.data;
        let songs = this.normalizeSongs(songlist);

        this.setState({ name: topinfo.ListName });
        getPurlUrl(songs).then((result) =>{ 
          let songs = result.data.songs
          let logo = `url("${ songs[0].image }")`;

          this.setState({ songs, logo });
        }).catch((e) => {
          console.log(e.message);
        });
      }
    }).catch((e) => {
      console.log(e.message);
    });
  }

  normalizeSongs(list) {
    let ret = []
    list.forEach((item) => {
      const musicData = item.data
      if (isValidMusic(musicData)) {
        ret.push(createSong(musicData))
      }
    })
    return ret
  }

  // 返回事件
  back() {
    let rootClassName = "rank-detail hide";
    this.setState({ rootClassName }, () => {
      setTimeout(() => {
        this.props.history.goBack();
        this.setState({
          rootClassName: "rank-detail"
        });
      }, 300);
    });
  }

  render () {
    return (
      <CSSTransition
        appear={this.state.appear}
        classNames="fade"
        in = {this.state.show}
        unmountOnExit={ true }
        timeout = { 10 }>
        <div className={ this.state.rootClassName }>
          <MusicList 
            rank={ true }
            logo={ this.state.logo }
            songs={ this.state.songs }
            back={() => { this.back() }}
            title={this.state.name}/>
        </div>
      </CSSTransition>
    );
  }
}

export default withRouter(RankDetail);
