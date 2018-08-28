import React from "react";
import pigData from "../wild-pig-data.json";
import queryString from "query-string";

class GraphContainer extends React.PureComponent {
  constructor(props) {
    super(props);

    this.getQueryString = this.getQueryString.bind(this);
    this.parseAndBuildPigData = this.parseAndBuildPigData.bind(this);
  }

  componentDidMount() {
    const { paused, year } = this.getQueryString();
    const pigPopulations = this.parseAndBuildPigData(pigData);
    this.setState({ paused, year, pigPopulations });
  }

  getQueryString() {
    const { paused, year } = queryString.parse(this.props.location.search);
    if (paused && year) {
      return { paused: paused, year: year };
    } else if (paused) {
      return { paused: paused, year: null };
    } else if (year) {
      return { paused: true, year: year };
    } else {
      return { paused: true, year: null };
    }
  }

  parseAndBuildPigData(pigData) {
    const pigPopulations = pigData["PIG POPULATIONS"];
    const newPigData = {};

    pigPopulations.forEach(item => {
      const { year, island, pigPopulation } = item;
      if (!newPigData[year]) {
        newPigData[year] = [{ island, pigPopulation }];
      } else {
        newPigData[year].push({
          island,
          pigPopulation
        });
      }
    });
    return newPigData;
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
