import React from "react";
import LazyImg from "base/lazy-img";
import "./index.less";

function SingerList ({ item }) {
  return (
    <div className="singer-list">
      <LazyImg 
        className="avatar"
        width={50}
        height={50}
        src={ item.avatar }></LazyImg>
      <span className="name">{ item.Fsinger_name }</span>
    </div>
  );
}

export default SingerList;
