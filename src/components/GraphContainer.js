import React from "react";
import pigData from "../wild-pig-data.json";
import queryString from "query-string";
import PlayPauseButton from "./PlayPauseButton";
import DisplayYear from "./DisplayYear";
import StopWatch from "./StopWatch";
import BarGraph from "./BarGraph";
import withStyles from "@material-ui/core/styles/withStyles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";

const styles = theme => ({
  root: {
    flexGrow: 1,
    background: "#eeeeee"
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: "center",
    color: theme.palette.text.secondary
  }
});

class GraphContainer extends React.Component {
  constructor(props) {
    super(props);

    this.getQueryString = this.getQueryString.bind(this);
    this.parseAndBuildPigData = this.parseAndBuildPigData.bind(this);
    this.togglePlayPause = this.togglePlayPause.bind(this);
    this.incrementYear = this.incrementYear.bind(this);
    this.initializeYearData = this.initializeYearData.bind(this);
    this.goToYear = this.goToYear.bind(this);
    this.saveStateToLocalStorage = this.saveStateToLocalStorage.bind(this);
  }

  componentDidMount() {
    const { previousAppState } = localStorage;
    if (previousAppState) {
      this.hydrateStateWithLocalStorage(previousAppState);
    } else {
      const { paused, year } = this.getQueryString();
      const pigPopulations = this.parseAndBuildPigData(pigData);
      const { initialYear, years } = this.initializeYearData(
        year,
        pigPopulations
      );
      const newState = { paused, year: initialYear, years, pigPopulations };
      this.setState(newState);
    }
    // window.addEventListener("beforeunload", this.saveStateToLocalStorage);
  }

  // componentWillUnmount() {
  //   window.removeEventListener("beforeunload", this.saveStateToLocalStorage);
  // }
  
  componentDidUpdate(prevProps) {
    if (this.props.location.search !== prevProps.location.search) {
      const { year, paused } = this.state;
      this.props.history.replace(`/?year=${year}&paused=${paused}`);
    }
  }

  getQueryString() {
    let { paused, year } = queryString.parse(this.props.location.search);
    if (paused && year) {
      return { paused: JSON.parse(paused), year: year };
    } else {
      return { paused: true, year: year };
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

  initializeYearData(year, pigData) {
    const years = Object.keys(pigData);
    const initialYear =
      typeof year !== "undefined " &&
      year !== null &&
      year !== "" &&
      years.includes(year)
        ? year
        : years[0];
    return { initialYear, years };
  }

  togglePlayPause() {
    const { paused, year } = this.state;
    if (year) {
      const newState = { ...this.state, paused: !paused, year: year };
      this.setState(newState);
    }
  }

  incrementYear() {
    const { year, years } = this.state;
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

  goToYear(event) {
    const year = event.target.innerText;
    this.setState({ year: year });
  }

  hydrateStateWithLocalStorage(previousAppState) {
    const persistedState = JSON.parse(previousAppState);
    let { paused, year } = queryString.parse(this.props.location.search);
    if (typeof paused !== "undefined" && paused !== null && paused !== "") {
      persistedState.paused = JSON.parse(paused);
    }
    if (
      typeof year !== "undefined" &&
      year !== null &&
      year !== "" &&
      persistedState.years.includes(year)
    ) {
      persistedState.year = year;
    }
    this.setState(persistedState);
  }

  saveStateToLocalStorage() {
    const appState = {};
    for (let key in this.state) {
      appState[key] = this.state[key];
    }
    localStorage.setItem("previousAppState", JSON.stringify(appState));
  }

  render() {
    if (!this.state) {
      return null;
    }
    const { paused, year, years, pigPopulations } = this.state;
    const { classes } = this.props;
    let pigData;
    for (let dataYear in pigPopulations) {
      if (dataYear === year) {
        pigData = pigPopulations[year];
      }
    }

    return (
      <div className={classes.root}>
        <Grid container className={classes.root} spacing={16} justify="center">
          <Paper className={classes.paper}>
            <DisplayYear
              current={year}
              total={years}
              goToYear={this.goToYear}
            />
            <BarGraph pigData={pigData} interval={2000} />
            <PlayPauseButton paused={paused} onClick={this.togglePlayPause} />
          </Paper>
        </Grid>

        <StopWatch
          paused={paused}
          incrementYear={this.incrementYear}
          interval={2000}
        />
      </div>
    );
  }
}

export default withStyles(styles)(GraphContainer);
