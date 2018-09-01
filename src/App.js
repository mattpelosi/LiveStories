import React, { Component } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import GraphContainer from "./components/GraphContainer";
import "./App.css";
import { createMuiTheme } from "@material-ui/core/styles";

const theme = createMuiTheme({
  palette: {
    primary: {
      light: "#757ce8",
      main: "#3F51B5",
      dark: "#002884",
      contrastText: "#fff"
    }
  }
});

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
