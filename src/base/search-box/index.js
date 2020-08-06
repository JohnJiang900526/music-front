import React, { Component } from "react";
import "./index.less";

class SearchBox extends Component {
  constructor (props) {
    super(props);

    this.state = {
      name: "search-box",
      val: ""
    }
  }

  inputHandle = (e) => {
    let val = e.currentTarget.value;

    this.setState({ val });
    this.postValue(val);
  }

  clear = () => {
    this.input.value = "";
    this.setState({ val: "" });
    this.postValue(this.input.value);
  }

  // 节流处理
  postValue = (val) => {
    this.timer && clearTimeout(this.timer);

    let { getValue } = this.props;
    this.timer = setTimeout(() => {
      getValue(val);
    }, 400);
  }

  clearBtnIsShow = () => {
    return {'display': this.state.val ? "" : "none"};
  }

  setData = (val) => {
    this.input.value = val;

    this.setState({ val });

    this.postValue(val);
  }

  render () {
    return (
      <div className="search-box">
        <i className="icon-search"></i>
        <input 
          onInput={ this.inputHandle } 
          className="input"
          ref={el => this.input = el}
          placeholder={ this.props.placeholder }/>
        <i onClick={ this.clear } style= { this.clearBtnIsShow() } className="icon-dismiss"></i>
      </div>
    )
  }
}

export default SearchBox;
