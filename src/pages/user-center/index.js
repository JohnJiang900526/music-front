import React, { Component } from "react";
import {
  CSSTransition
} from "react-transition-group";
import "./index.less";
import { withRouter } from "react-router-dom";

import { HOC } from "components/hoc";

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
      currentKey: 0
    };
  }

  componentDidMount () {
    this.setState({
      appear: true,
      show: true,
      rootClassName: "user-center",
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
    this.setState({ currentKey })
  }

  getText() {
    return this.state.currentKey === 0 ? "暂无收藏歌曲" : "你还没听过歌曲";
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
              <div className="play-btn">
                <i className="icon-play"></i>
                <span className="text">随机播放全部</span>
              </div>
              <div className="list-content">
                <div className="lists"></div>
                <div className="no-result-wrapper">
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

export default withRouter(HOC(UserCenter));
