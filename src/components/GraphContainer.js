import React from "react";
import pigData from "../wild-pig-data.json";
import queryString from "query-string";
import PlayPauseButton from "./PlayPauseButton";
import DisplayYear from "./DisplayYear";
import StopWatch from "./StopWatch";
import BarGraph from "./BarGraph";

class GraphContainer extends React.PureComponent {
  constructor(props) {
    super(props);

    this.getQueryString = this.getQueryString.bind(this);
    this.parseAndBuildPigData = this.parseAndBuildPigData.bind(this);
    this.togglePlayPause = this.togglePlayPause.bind(this);
    this.incrementYear = this.incrementYear.bind(this);
  }

  componentDidMount() {
    const { paused, year } = this.getQueryString();
    const pigPopulations = this.parseAndBuildPigData(pigData);
    const newState = { paused, year, pigPopulations };
    this.setState(newState);
  }

  getQueryString() {
    let { paused, year } = queryString.parse(this.props.location.search);
    if (paused && year) {
      return { paused: JSON.parse(paused), year: year };
    } else if (paused) {
      return { paused: JSON.parse(paused), year: null };
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
        newPigData[year] = [[island, pigPopulation]];
      } else {
        newPigData[year].push([island, pigPopulation]);
      }
    });
    return newPigData;
  }

  togglePlayPause() {
    const { paused, year } = this.state;
    let newState;
    if (year) {
      newState = { ...this.state, paused: !paused, year: year };
      this.setState(newState);
    }
  }

  incrementYear() {
    const { year } = this.state;
    const years = Object.keys(this.state.pigPopulations);
    if (!year) {
      this.setState({ year: years[0] });
    } else {
      const index = years.indexOf(year);
      if (years[index + 1]) {
        this.setState({ year: years[index + 1] });
      } else {
        this.setState({ year: years[0] });
      }
    }
  }

  render() {
    if (!this.state) {
      return null;
    }
    const { paused, year, pigPopulations } = this.state;
    let pigData;
    for (let dataYear in pigPopulations) {
      if (dataYear === year) {
        pigData = pigPopulations[year];
      }
    }

    return (
      <React.Fragment>
        <DisplayYear year={year} />
        <PlayPauseButton paused={paused} onClick={this.togglePlayPause} />
        <BarGraph pigData={pigData} />
        <StopWatch
          paused={paused}
          incrementYear={this.incrementYear}
          interval={2000}
        />
      </React.Fragment>
    );
  }
}

export default GraphContainer;
