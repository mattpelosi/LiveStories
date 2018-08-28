import React from "react";
import pigData from "../wild-pig-data.json";
import queryString from "query-string";

class GraphContainer extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};

    this.getAndSetQueryString = this.getAndSetQueryString.bind(this);
  }

  componentDidMount() {
    this.getAndSetQueryString();
  }

  getAndSetQueryString() {
    const { paused, year } = queryString.parse(this.props.location.search);
    if (paused || year) {
      this.setState({ isPaused: paused, year: year });
    }
  }

  render() {
    return (
      <div className="App">
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <table>
          <tbody>
            <tr>
              <th>Year</th>
              <th>Island</th>
              <th>Population</th>
            </tr>
            {pigData["PIG POPULATIONS"].map((datum, index) => (
              <tr key={index}>
                <td>{datum.year}</td>
                <td>{datum.island}</td>
                <td>{datum.pigPopulation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default GraphContainer;
