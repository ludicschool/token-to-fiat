import React, { Component } from 'react';
import { useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
// components
import Toggle from './components/Toggle';
import Menu from './components/Menu';
// pages
import HomePage from './pages/HomePage';
import BuyPage from './pages/BuyPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import ErrorPage from './pages/ErrorPage';

function App() {
  const [navToggled, setNavToggled] = useState(false);

  const handleNavToggle = () => {
    setNavToggled(!navToggled);
  }

  return (
    <div className="App">
  
      
      <Router>
      <Switch>
      {navToggled ? <Menu handleNavToggle={handleNavToggle} /> : null}
        <Route exact path="/" component={BuyPage} />
        <Route path="*" component={ErrorPage} />
      </Switch>
      </Router>
    </div>
  );
}

export default App;
