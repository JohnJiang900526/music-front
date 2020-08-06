import React from "react";
import { NavLink } from "react-router-dom";
import "./index.less";

function Nav () {
  return (
    <div className="nav-content">
      <div className="tab-content">
        <NavLink to="/recommend" className="tab-item">
          <span className="text">推荐</span>
        </NavLink>
        <NavLink to="/singer" className="tab-item">
        <span className="text">歌手</span>
        </NavLink>
        <NavLink to="/rank" className="tab-item">
        <span className="text">排行</span>
        </NavLink>
        <NavLink to="/search" className="tab-item">
        <span className="text">搜索</span>
        </NavLink>
      </div>
    </div>
  );
}

export default Nav;
