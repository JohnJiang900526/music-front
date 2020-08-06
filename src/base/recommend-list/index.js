import React from "react";
import LazyImg from "base/lazy-img";
import "./index.less";

function List(props) {
  let { item } = props;
  return (
    <div className="recommend-list">
      <div className="list-icon">
        <LazyImg src = { item.imgurl }></LazyImg>
      </div>
      <div className="list-text">
        <h2 className="name">{ item.creator.name }</h2>
        <div className="disc">{ item.dissname }</div>
      </div>
    </div>
  );
}

export default List;
