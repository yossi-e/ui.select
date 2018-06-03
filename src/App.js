import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import UISelect from './ui.select.jsx'

import data1 from './data/select1.json'
import data2 from './data/select1.json'

class App extends Component {
  render() {
    return (
      <div className="test-app">
          <div className="row">
            <div className="col col1">
              <UISelect options={data1}/>
            </div>
          </div>

          <div className="row">
            <div className="col col2">
            <UISelect options={data2}/>
            </div>
          </div>

          <div className="row">
            <div className="col col3">
              <UISelect options={data1}/>
            </div>
          </div>
      </div>
    );
  }
}

export default App;
