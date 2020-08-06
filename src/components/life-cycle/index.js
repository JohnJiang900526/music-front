import React, { Component } from "react";

class LifeCycle extends Component {
  constructor (props) {
    super(props);

    this.state = {};
  }

  componentWillMount () {
    // 1.即将挂在dom
  }
  UNSAFE_componentWillMount () {
    // 1.即将挂在dom
  }

  componentDidMount () {
    // 2.已经挂在了dom
  }

  render () {
    // 3.渲染dom
    return (
      <div className="life-cycle">life-cycle</div>
    )
  }

  shouldComponentUpdate () {
    // 5.组件是否要更新
    return true || false;
  }

  componentWillUpdate () {
    // 4.页面即将更新
  }
  UNSAFE_componentWillUpdate () {
    // 4.页面即将更新
  }

  componentDidUpdate () {
    // 5.组件已经更新
  }

  componentWillReceiveProps () {
    // 6.组件即将接收参数
  }
  UNSAFE_componentWillReceiveProps () {
    // 6.组件即将接收参数
  }

  componentWillUnmount () {
    // 7.页面即将卸载
  }
  
  componentDidCatch () {
    // 8.错误处理函数
  }
}

export default LifeCycle;

