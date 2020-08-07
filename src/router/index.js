import React, { Component } from 'react';
import {
  Route,
  Switch,
  Redirect,
  // BrowserRouter as Router,
  HashRouter as Router,
} from "react-router-dom";
import "./index.less";

// page组件
import Rank from "pages/rank";
import RankDetail from "pages/rank-detail";
import Recommend from "pages/recommend";
import RecommendDetail from "pages/recommend-detail";
import Search from "pages/search";
import Singer from "pages/singer";
import SingerDetail from "pages/singer-detail";
import NoMatch from "pages/no-match";
import User from "pages/user-center"
import Player from "pages/player"

// 业务组件
import Header from "components/header";
import Nav from "components/nav";

class App extends Component {
  render () {
    return (
      <Router>
        <div className="react-music">
          <div className="main-head-wrap">
            <Header/>
            <Nav/>
          </div>
          <div className="main-body-wrap">
            <Switch>
              <Route exact path="/">
                <Redirect to="/recommend" />
              </Route>

              <Route path="/recommend" render = {() => {
                return (
                  <Recommend>
                    <Route path="/recommend/:id">
                      <RecommendDetail/>
                    </Route>
                  </Recommend>
                );
              }}></Route>
              
              <Route path="/singer" render = {() => {
                return (
                  <Singer>
                    <Route path="/singer/:id">
                      <SingerDetail/>
                    </Route>
                  </Singer>
                );
              }}></Route>

              <Route path="/rank" render = {() => {
                return (
                  <Rank>
                    <Route path="/rank/:id">
                      <RankDetail/>
                    </Route>
                  </Rank>
                );
              }}></Route>
              
              <Route path="/search">
                <Search/>
              </Route>

              <Route path="/user">
                <User/>
              </Route>

              <Route path="*">
                <NoMatch />
              </Route>
            </Switch>
            </div>
          <Player/>
        </div>
      </Router>
    );
  }
}

export default App;
