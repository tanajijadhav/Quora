import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import "antd/dist/antd.css";
import Layout from './components/Layout/Layout';
import Authentication from './components/Authentication/Authentication';

import PrivateRoute from "./components/common/PrivateRoute";
import Dashboard from "./components/Dashboard/Dashboard";

class App extends Component {
  render = () => {
    return (
      <Router>
        <Switch>
          <Route path="/login" component={Authentication} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/" component={Layout} />
        </Switch>
      </Router>
    );
  };
}

export default App;
