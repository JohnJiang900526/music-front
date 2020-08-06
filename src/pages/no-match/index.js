import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import LazyImg from "base/lazy-img";
import defaultUrl from "common/image/no-page.png";
import "./index.less";

class NoMatch extends Component {
  constructor (props) {
    super(props);

    this.state = {
      name: "no-match"
    }
  }

  back = () => {
    let { history } = this.props;
    
    history.goBack();
  }

  render () {
    return (
      <div className="no-match">
        <div onClick={ this.back } className="back-content">
          <i className="icon-back"></i>
        </div>
        <div className="no-match-inner">
          <LazyImg className="img" src={ defaultUrl } width={100} height={100}/>
          <p className="text">404</p>
        </div>
      </div>
    )
  }
}

export default withRouter(NoMatch);