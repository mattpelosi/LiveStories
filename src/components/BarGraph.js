import React from "react";
import window from "./globals/window";
import withStyles from "@material-ui/core/styles/withStyles";
import Paper from "@material-ui/core/Paper";

const styles = theme => ({
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: "center",
    color: theme.palette.text.secondary,
    marginTop: 8
  }
});

class BarGraph extends React.Component {
  constructor(props) {
    super(props);
    this.chartRef = React.createRef();
    this.drawChart = this.drawChart.bind(this);
    this.buildDataTable = this.buildDataTable.bind(this);
    this.buildOptions = this.buildOptions.bind(this);
    this.resize = this.resize.bind(this);
  }

  async componentDidMount() {
    await window.google.charts.load("current", { packages: ["corechart"] });
    if (this.props.pigData) {
      const data = this.buildDataTable();
      const options = this.buildOptions();
      window.google.charts.setOnLoadCallback(this.drawChart(data, options));
    }
    window.addEventListener("resize", this.resize);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.pigData !== this.props.pigData) {
      if (this.props.pigData) {
        const data = this.buildDataTable();
        const options = this.buildOptions();
        window.google.charts.setOnLoadCallback(this.drawChart(data, options));
      }
    }
  }

  buildDataTable() {
    const { pigData } = JSON.parse(JSON.stringify(this.props));
    pigData.forEach(item => item.push("color: #3F51B5"));
    pigData.unshift(["Element", "Density", { role: "style" }]);

    var data = new window.google.visualization.arrayToDataTable(pigData);
    return data;
  }

  buildOptions() {
    const { interval } = this.props;
    return {
      title: "Annual Population of wild pigs for each Hawiian Island",
      width: 600,
      height: 400,
      animation: {
        duration: interval,
        easing: "out",
        startup: true
      },
      legend: "none"
    };
  }

  drawChart(data, options) {
    var chart = new window.google.visualization.BarChart(this.chartRef.current);
    chart.draw(data, options);
    chart.container.childNodes[0].childNodes[0].style.margin = "0 auto";
  }

  resize() {
    console.log("resizing");
    window.innerHeight;
    window.innerWidth;
  }

  render() {
    const { classes } = this.props;
    return (
      <Paper className={classes.paper}>
        <div ref={this.chartRef} />
      </Paper>
    );
  }
}

export default withStyles(styles)(BarGraph);
