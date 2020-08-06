import React, { Component } from "react";

// class形式的有状态组件
export function HOC (WrappedComponent) {
  return class extends Component {
    constructor (props) {
      super(props);

      this.state = {
        name: "hoc",
        msg: null
      };
    }

    postMessage = (msg) => {
      this.setState({msg});
    }

    render () {
      let newProps = {
        HOC: {
          postMessage: this.postMessage
        }
      }
      return(
        <WrappedComponent {...this.props} {...newProps}></WrappedComponent>
      )
    }
  }
}

// function方式的无状态组件
export function HOC1 (WrappedComponent) {
  function postMessage (msg) {
    console.log(msg);
  }

  const newProps = { 
    HOC: {
      postMessage
    }
  };

  return function (props) {
    return <WrappedComponent {...props} {...newProps}/>
  };
}
