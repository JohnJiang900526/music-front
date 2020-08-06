import React, { Component } from "react";
import "./index.less";

class ProgressCircle extends Component{
  constructor(props) {
    super(props);
    this.state = {
      dashArray: Math.PI * 100
    };
  }

  dashOffset = () => {
    const percent = this.props.percent || 0;
    return (1 - percent) * this.state.dashArray;
  }

  render () {
    return (
      <div className="progress-circle">
        <svg width={ this.props.radius || 100 } height={ this.props.radius || 100 }
          viewBox="0 0 100 100" version="1.1" 
          xmlns="http://www.w3.org/2000/svg">
          <circle className="progress-background" r="50" cx="50" cy="50" fill="transparent"/>
          <circle 
            className="progress-bar" r="50" cx="50" cy="50" fill="transparent" 
            strokeDasharray={this.state.dashArray}
            strokeDashoffset={this.dashOffset()}/>
        </svg>
        { this.props.children }
      </div>
    );
  }
}

export default ProgressCircle;