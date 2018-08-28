import React, { Component } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import GraphContainer from "./components/GraphContainer";
import "./App.css";

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Route path="/" component={GraphContainer} />
      </BrowserRouter>
    );
  }
}

export default App;
