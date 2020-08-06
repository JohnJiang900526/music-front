import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import {
  CSSTransition
} from "react-transition-group";

import { getSingerDetail } from "api/singer";
import { getPurlUrl } from "api/song";
import { isValidMusic, createSong } from "common/js/song";
import "./index.less";

import MusicList from "components/music-list";

class SingerDetail extends Component {
  constructor (props) {
    super(props);
    this.state = {
      show: false,
      appear: false,
      rootClassName: "singer-detail",
      songs: [],
      name: "",
      logo: ""
    };
  }

  componentDidMount () {
    this.setState({
      show: true,
      appear: true,
      rootClassName: "singer-detail"
    });

    this.getDetail();
  }

  getDetail() {
    const { id } = this.props.match.params;

    getSingerDetail(id).then((res) => {
      if (res.code === 0) {
        let list = res.data.list;
        let songs = this.normalizeSongs(list);
        let name = res.data.singer_name;
        let logo = `url("https://y.gtimg.cn/music/photo_new/T001R300x300M000${id}.jpg?max_age=2592000")`
        
        this.setState({ name, logo });
        getPurlUrl(songs).then((result) => {
          this.setState({ songs: result.data.songs });
        });
      }
    }).catch((e) => {
      console.log(e.message);
    });
  }

  // 返回事件
  back() {
    let rootClassName = "singer-detail hide";
    this.setState({ rootClassName }, () => {
      setTimeout(() => {
        this.props.history.goBack();
        this.setState({
          rootClassName: "singer-detail"
        });
      }, 300);
    });
  }

  normalizeSongs (list) {
    let ret = [];
    list.forEach((item) => {
      let {musicData} = item;
      if (isValidMusic(musicData)) {
        ret.push(createSong(musicData));
      }
    });
    return ret;
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
            logo={ this.state.logo }
            songs={ this.state.songs }
            back={() => { this.back() }}
            title={this.state.name}/>
        </div>
      </CSSTransition>
    );
  }
}

export default withRouter(SingerDetail);
