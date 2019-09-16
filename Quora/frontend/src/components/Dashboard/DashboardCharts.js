import React, { Component } from "react";
import "antd/dist/antd.css";
import "./../../style.css";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

class DashboardCharts extends Component {
  render() {
    const options = {
      chart: {
        height: 250,
        width: 400
      },

      title: {
        text: ""
      },
      xAxis: {
        //visible: true,
        categories: this.props.xAxis
      },
      yAxis: {
        title: {
          text: null
        }
      },
      series: [
        {
          name: this.props.name,
          type: "area",
          data: this.props.graphData,
          color: this.props.color
        }
      ],
      credits: {
        enabled: false
      }
    };
    return (
      <HighchartsReact
        highcharts={Highcharts}
        constructorType={"chart"}
        options={options}
      />
    );
  }
}

export default DashboardCharts;
