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

    // use binding in the constructor using .bind() instead of arroow functions
    // so GraphContainer only binds methods once, not on subsiquent updates
    this.getQueryString = this.getQueryString.bind(this);
    this.parseAndBuildPigData = this.parseAndBuildPigData.bind(this);
    this.togglePlayPause = this.togglePlayPause.bind(this);
    this.incrementYear = this.incrementYear.bind(this);
    this.initializeYearData = this.initializeYearData.bind(this);
    this.goToYear = this.goToYear.bind(this);
    this.saveStateToLocalStorage = this.saveStateToLocalStorage.bind(this);
  }

  // After the component has mounted, it checks for arguments passed
  // as query string parameters and stores them in a variable. It then parses the JSON
  // data into the model required by the Google Charts API and stores this
  // in a varialbe. It then builds a newState object with the previously defined variables
  // and sets State with it.
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
    window.addEventListener("beforeunload", this.saveStateToLocalStorage);
  }

  componentWillUnmount() {
    window.removeEventListener("beforeunload");
  }

  // getQueryString pulls the values from url querystring (passed as props through <BrowserRouter/>)
  // and assigns them to variables. It then performs a series of checks of these
  // variables.
  getQueryString() {
    let { paused, year } = queryString.parse(this.props.location.search);
    if (paused && year) {
      return { paused: JSON.parse(paused), year: year };
    } else if (paused) {
      return { paused: JSON.parse(paused), year: year };
    } else if (year) {
      return { paused: true, year: year };
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
    const initialYear = year ? year : years[0];
    return { initialYear, years };
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
    let { paused, year } = queryString.parse(this.props.location.search);
    const persistedState = JSON.parse(previousAppState);
    if (typeof paused !== "undefined" && typeof paused !== null) {
      persistedState.paused = paused;
    }
    if (typeof year !== "undefined" && typeof year !== null) {
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
    const { paused, year, pigPopulations } = this.state;
    const { classes } = this.props;
    const years = Object.keys(pigPopulations);
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
