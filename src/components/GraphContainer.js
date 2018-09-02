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

  // Here the code checks localstorage for the presence of a persisted
  // state. If it exists, that state is passed into
  // a method used to hydrate the app's state with this data.
  // If there isn't a persisted state in localstorage, the code moves to the else
  // condition where arguments passed as a querysting are extracted and stored along with
  // a rebuilt model of the pig population data(model built to fit google chart API).
  // The code then runs an initializeYearData method that returns an array of years
  // and a initial year value. A newState object is built using the paused, year,
  // years, and pigPopulation data and then setstate is called and passed this object.
  // Lastly, an event listener is added to the window object that listens for when
  // the window is about to unload and passed a method to store state in localstorage
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

  // Before the component unmounts, "beforeunload" event listener is removed
  componentWillUnmount() {
    window.removeEventListener("beforeunload", this.saveStateToLocalStorage);
  }

  // Here the code pulls the values from the url querystring (passed as props through <BrowserRouter/>)
  // and assigns them to variables. It then performs a series of checks.
  // The first check is if both 'paused' and 'year' are in the query string
  // If they are, the code returns an object with "paused" and "year".
  // "Paused" is passed into JSON.parse to transform it from a string into a boolean.
  // If both 'paused' and 'year' aren't given, the else condition returns the object with
  // true as the "paused" value and year as is. In this case,'Paused' is assigned to true so that if the app
  // loads withoiut a value, it will default in the paused state and not trigger the stopWatch component.
  getQueryString() {
    let { paused, year } = queryString.parse(this.props.location.search);
    if (paused && year) {
      return { paused: JSON.parse(paused), year: year };
    } else {
      return { paused: true, year: year };
    }
  }

  // Here the code is given the JSON data from the pig populations file on disk.
  // A newPigData object is defined. This will be built into the model required by the google charts API
  // The code executes a forEach loop on the pigPopulations array. During each iteration the year, island,
  // and pigPopulation properties are extracted from the current item. On line 99, the newPigData object
  // is checked for a property that matches the current items' 'year', if it isn't present, the code adds
  // it to the object and defines it with an array. Inside this array is another array that is given the 'island'
  // and 'pigPopulation' data at index [0] and [1].
  // If the current items' 'year' is present as a property on the object, the code pushes into it an array
  // with the 'island' and 'pigPopulation' data at index [0] and [1].
  // When the forEach loop is complete the newPigData object is returned
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

  // Here the code is given the 'year' returned from the queryString method
  // and the remodeled pigData returned from the buildAndParsePigData method.
  // The code then runs Object.keys to build an array of all the years (as strings).
  // A ternary operator is used to check if the 'year' is not 'undefined', null, or an
  // empty string. If matches any of these conditions the default year is set to the first year present in
  // in the years array (this assumes that the JSON data with always match the model give. Otherwise a
  // sorting method would be required to ensure chronological order). It is passes the checks it remains
  // the same value and the initialYear string and years array are returned in an object.
  initializeYearData(year, pigData) {
    debugger;
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

  // Here the code extracts the 'paused' and 'year' values from the component's state.
  // The code then checks to make sure a year is present in the state. This check is done
  // to ensure that when, in the next line of code, the state is set with these values, the
  // child compoents receive their props at the time. This is done to keep each child componets
  // behavior syncronized together.
  togglePlayPause() {
    const { paused, year } = this.state;
    if (year) {
      const newState = { ...this.state, paused: !paused, year: year };
      this.setState(newState);
    }
  }

  // This method is passed into the StopWatch component's props as a callback.
  // It's triggered when the StopWatch component completes a given interval
  // The code extracts the 'years' array and 'year' string from the state
  // An if condition checks if 'year' doesn't match a truthy value. If it
  // meets this condition, setState is called using the year at the index [0]
  // of the 'years' array. This check is needed to ensure that a year value
  // is always passed into setState.
  // If this condition isn't met, the index of the 'year' is returned from indexOf
  // Another if condition checks if there is another item in the array. If there is
  // the code runs setState with the next index item. Otherwise the app is at the last
  // item in the array and should return to the begining and start over.
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

  // This method is passed into the DisplayYear component as props as a callback.
  // The code receives the event, extracts the innerText (year as a string), and
  // calls setState with this year value. I added this functionality to enhance the
  // apps behavioral options when a user wants to display a years data by clicking a
  // tab
  goToYear(event) {
    const year = event.target.innerText;
    this.setState({ year: year });
  }

  // This method is called if a previous state has been saved in localstorage.
  // Here the code is given the App's previous state and performs a JSON.parse
  // to transform the stringified data into a standard JS object.
  // The 'paused' and 'year' values are extracted from the querystring for checks
  // of 'undefined', null, empty string values, and that a given year is within the available data.
  // If they pass the conditions, they are used to set their respective properties values
  // in the persistedState object. These checks are made so that the user can merge either
  // or both values of the querystring with those in the persisted state.
  // setState is then called with the persistedState object
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

  // This method is attached to the 'beforeunload' event listener.
  // Here the code declares an object 'appState'.
  // Each property in this.state is looped through and during each
  // iteration the item is inserted into the appState object.
  // Lastly, the 'appState' object is set into localstorage at the
  // given key "previousAppState"
  saveStateToLocalStorage() {
    const appState = {};
    for (let key in this.state) {
      appState[key] = this.state[key];
    }
    localStorage.setItem("previousAppState", JSON.stringify(appState));
  }

  render() {
    // if no state is present, return null to prevent 'undefined' error crashes.
    if (!this.state) {
      return null;
    }
    const { paused, year, years, pigPopulations } = this.state;
    const { classes } = this.props;
    // const years = Object.keys(pigPopulations);
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
