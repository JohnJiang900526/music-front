import React, { Component } from "react";
import "./index.less";

const progressBtnWidth = 14;

class ProgressBar extends Component {
  constructor (props) {
    super(props);
    this.state = {};
  }

  componentDidMount () {
    this.touch = {};
  }

  // 计算偏移量
  computedOffset = (percent = 0) => {
    if (!this.Bar) {
      return 0;
    }

    const totalWidth = (this.Bar.clientWidth - progressBtnWidth) || 0;

    if (percent < 0) {
      percent = 0;
    } else if (percent > 1) {
      percent = 1;
    }

    return totalWidth * percent;
  }

  // 计算宽度
  computedWidth = () => {
    let offset = this.computedOffset(this.props.percent);

    return { 
      "width": `${ offset }px` 
    };
  }

  // 计算Transform
  computedTransform = () => {
    let offset = this.computedOffset(this.props.percent);
    return {
      "transform": `translate3d(${ offset }px, 0px, 0px)`
    };
  }

  // 进度条bar的点击事件
  progressClickHandle = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const rect = this.Progress.getBoundingClientRect();
    const offsetWidth = Math.floor(e.pageX - rect.left);
    const totalWidth = (this.Bar && this.Bar.clientWidth - progressBtnWidth) || 100;
    const percent = offsetWidth / totalWidth;

    this.props.percentChange && this.props.percentChange(percent);
  }

  handleTouchStart = (e) => {
    this.touch.initiated = true;
    this.touch.startX = e.touches[0].pageX;
    this.touch.left = this.ProgressInner.clientWidth;
  }

  handleTouchMove = (e) => {
    if (!this.touch.initiated) {
      return false;
    }

    const deltaX = e.touches[0].pageX - this.touch.startX;
    const totalWidth = (this.Bar && this.Bar.clientWidth) || 100;
    const offsetWidth = Math.min(
      this.Progress.clientWidth, 
      Math.max(0, this.touch.left + deltaX)
    );
    const percent = offsetWidth / totalWidth;

    this.touch.percent = percent;
    this.props.percentChange && this.props.percentChange(percent);
  }

  handleTouchEnd = (e) => {
    const { percent } = this.touch;
    
    this.touch.initiated = false;
    this.props.percentChange && this.props.percentChange(percent);
  }

  render() {
    return (
      <div 
      ref={(e) => { this.Progress = e }}
        onClick={ this.progressClickHandle }
        className="progress-bar">
        <div
          ref={(e) => { this.Bar = e }}
          className="bar-inner">
          <div className="progress"
            ref={(e) => {this.ProgressInner = e}} 
            style={this.computedWidth()}>
          </div>
          <div
            ref={(e) => { this.BarBtn = e }}
            onTouchStart={this.handleTouchStart}
            onTouchMove={this.handleTouchMove}
            onTouchEnd={this.handleTouchEnd}
            className="progress-btn-wrapper"
            style={this.computedTransform()}>
            <div className="progress-btn"></div>
          </div>
        </div>
      </div>
    );
  }
}

export default ProgressBar;
