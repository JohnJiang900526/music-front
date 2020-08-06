import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import {
  CSSTransition
} from "react-transition-group";
import { getCdInfo } from "api/recommend";
import { getPurlUrl } from "api/song";
import { isValidMusic, createSong } from "common/js/song";
import "./index.less";

import MusicList from "components/music-list";

class RecommendDetail extends Component {
  constructor (props) {
    super(props);

    this.state = {
      show: false,
      appear: false,
      rootClassName: "recommend-detail",
      logo: "",
      dissname: "",
      songs: []
    };
  }

  componentDidMount() {
    this.setState({
      appear: true,
      show: true,
      rootClassName: "recommend-detail"
    });

    this.getCdInfo();
  }

  getCdInfo() {
    const { id } = this.props.match.params;
   
    getCdInfo(id).then(({ data = {} }) => {
      let isArray = Object.prototype.toString.call(data.cdlist) === "[object Array]";
      if (isArray && data.cdlist.length > 0) {
        let obj = data.cdlist[0];
        let { logo, dissname, songlist } = obj;
        let songs = this.normalizeSongs(songlist);

        this.setState({ logo: `url("${logo}")`, name: dissname });
        getPurlUrl(songs).then((result) => {
          this.setState({ songs: result.data.songs });
        });
      }
    }).catch((e) => {
      console.log(e.message);
    });
  }

  normalizeSongs(list) {
    let ret = []
    list.forEach((musicData) => {
      if (isValidMusic(musicData)) {
        ret.push(createSong(musicData))
      }
    });
    return ret
  }

  // 返回事件
  back() {
    let rootClassName = "recommend-detail hide";
    this.setState({ rootClassName }, () => {
      setTimeout(() => {
        this.props.history.goBack();
        this.setState({
          rootClassName: "recommend-detail"
        });
      }, 300);
    });
  }

  render() {
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
};

export default withRouter(RecommendDetail);
