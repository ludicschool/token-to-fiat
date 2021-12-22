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
import PayPage from './pages/PayPage'

function App() {

  const [navToggled, setNavToggled] = useState(false);

  const handleNavToggle = () => {
    setNavToggled(!navToggled);
  }

  return (
    <div className="App">
      <Toggle handleNavToggle={handleNavToggle} />
      <Router>
        {navToggled ? <Menu handleNavToggle={handleNavToggle} /> : null}

        <Route exact path="/" component={HomePage} />
        <Route exact path="/buy" component={BuyPage} />
        <Route exact path="/pay" component={PayPage} />

      </Router>
    </div>
  );
}

export default App;
