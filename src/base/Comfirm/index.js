import React, { Component } from "react";
import { Transition } from "react-transition-group";
import "./index.less";

class Comfirm extends Component {
  constructor (props) {
    super(props);

    this.state = {
      title: "标题",
      cancelText: "取消",
      okText: "确定",
      show: false,
      duration: {
        enter: 300,
        exit: 300,
      },
      currentClass: ""
    };
  }

  componentDidMount () {

  }

  showHandle = () => {
    this.setState({ show: true });
  }

  hideHandle = () => {
    this.setState({ show: false });
  }

  cancelHandle = () => {
    let { cancelHandle } = this.props;

    this.hideHandle();
    cancelHandle && cancelHandle();
  }

  okHandle = () => {
    let { okHandle } = this.props;

    this.hideHandle();
    okHandle && okHandle();
  }

  onEntering = () => {
    this.setState({currentClass: "confirm-active"});
  }

  onExiting = () => {
    this.setState({currentClass: "confirm-leave"});
  }

  renderComfirm = () => {
    let cancelText = this.props.cancelText || this.state.cancelText;
    let okText = this.props.okText || this.state.okText;
    let title = this.props.title || this.state.title;

    let confirmClassName = "comfirm " + this.state.currentClass;
    let contentClassName = "confirm-content " + this.state.currentClass;

    return (
      <Transition
        onEntering={this.onEntering}
        onExiting={this.onExiting}

        appear={true}
        in={this.state.show} 
        timeout={this.state.duration}>
        <div className={confirmClassName}>
          <div className="confirm-wrapper">
            <div className={contentClassName}>
              <div className="text">{ title }</div>
              <div className="operate">
                <div onClick={ this.cancelHandle } className="operate-btn left">{ cancelText }</div>
                <div onClick={ this.okHandle } className="operate-btn right">{ okText }</div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    );
  }

  render () {
    return this.state.show ? this.renderComfirm() : <div></div>
  }
}

export default Comfirm;
