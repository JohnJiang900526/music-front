import React from "react";
import { Link } from "react-router-dom";
import "./index.less";

function header () {
  return (
    <div className="header-content">
      <div className="header-icon"></div>
      <div className="header-text">Chicken Music</div>
      <div className="header-mine">
        <Link to="/user">
          <span className="icon-mine"></span>
        </Link>
      </div>
    </div>
  )
}

export default header;
