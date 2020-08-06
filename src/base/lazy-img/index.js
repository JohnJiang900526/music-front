import React, { Component } from "react";
import "./index.less";
import defaultUrl from "common/image/default.png";

// 封装懒加载图片组件
// 市面上的懒加载组件太烂了

class LazyImg extends Component {
  constructor (props) {
    super(props);
    this.state = {};
  }

  componentDidMount () {
    this.observe();
  }

  observe = () => {
    const threshold = [0.20];

    const io = new IntersectionObserver((entries)=>{
      entries.forEach((item)=>{
        if (item.intersectionRatio <= 0 ) {
          return false;
        }

        const { target } = item;
        target.src = target.dataset.src;
      })
    }, {
      threshold
    });

    io.observe(this.Img);
  }

  render () {
    let { width = 60, height = 60, src, defaultSrc } = this.props;
    return (
      <img
        alt=""
        className="avatar"
        ref={el => this.Img = el}
        width={width}
        src={defaultSrc || defaultUrl}
        data-src={src}
        height={height}/>
    );
  }
}

export default LazyImg;
