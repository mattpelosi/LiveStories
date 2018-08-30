import React from "react";
import window from "./globals/window";

class BarGraph extends React.Component {
  constructor(props) {
    super(props);
    this.chartRef = React.createRef();
    this.drawChart = this.drawChart.bind(this);
    this.buildDataTable = this.buildDataTable.bind(this);
    this.buildOptions = this.buildOptions.bind(this);
  }

  async componentDidMount() {
    await window.google.charts.load("current", { packages: ["corechart"] });
    if (this.props.pigData) {
      const data = this.buildDataTable();
      const options = this.buildOptions();
      window.google.charts.setOnLoadCallback(this.drawChart(data, options));
    }
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
    pigData.unshift(["Element", "Density"]);

    var data = new window.google.visualization.arrayToDataTable(pigData);
    return data;
  }

  buildOptions() {
    return {
      title: "How Much Pizza I Ate Last Night",
      width: 400,
      height: 300,
      animation: {
        duration: 2000,
        easing: "out",
        startup: true
      }
    };
  }

  drawChart(data, options) {
    var chart = new window.google.visualization.BarChart(this.chartRef.current);
    chart.draw(data, options);
  }

  render() {
    return (
      <div>
        <div ref={this.chartRef} />
      </div>
    );
  }
}

export default BarGraph;
