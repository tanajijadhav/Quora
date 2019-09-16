import React, {
  Component
} from "react";
import "antd/dist/antd.css";
import "./DashboardCharts.css";
import axios from "axios";
import {
  call
} from "../../api";

import DashboardCharts from "./DashboardCharts";
// import { Element } from "react-faux-dom";
// import * as d3 from "d3";
import {
  Row,
  Col,
  Select
} from "antd";

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      graphData: {},
      xAxis: {}
    };
  }
  makeGraph = (graphRange, graphType) => {
    console.log(graphRange, graphType);
    // const token =
    //   "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhMTY0MDIyMC02ODAyLTExZTktOGUxYS1iZDE3NmJmNjdkYWEiLCJjcmVhdGVkX2F0IjoxNTU2NzQzMTcwMzIyLCJpYXQiOjE1NTY3NDMxNzAsImV4cCI6MTU1OTMzNTE3MH0.CNknpZADc05g6Un4ogHzO8pmdW5mDB3QnhRLQKHcmm0";

    // axios
    //   .get("/views?frequency=" + graphRange + "&type=" + graphType, {
    //     headers: {
    //       authorization: token
    //     }
    //   })
    call({
      method: "get",
      url: "/views?frequency=" + graphRange + "&type=" + graphType
    })
      .then(res => {
        // console.log("view response data", res.data.data.graphData);

        let result = res.data.graphData.map((value, i) => {
          return value["count"];
        });

        let result1 = res.data.graphData.map((date, i) => {
          if (graphRange == "hour") {
            return new Date(date["timestamp"]).getHours() + " " + new Date(date["timestamp"]).getMinutes()
          } else if (graphRange === "day") {
            return new Date(date["timestamp"]).getHours()
          } else if (graphRange === "week") {
            return ((new Date(date["timestamp"]).getMonth() + 1) + "/" + new Date(date["timestamp"]).getDate())
          } else if (graphRange === "month") {
            return ((new Date(date["timestamp"]).getMonth() + 1) + "/" + new Date(date["timestamp"]).getDate())
          } else {
            return new Date(date["timestamp"]).toDateString();
          }
        });

        //   console.log("result", result1);
        let graphData = this.state.graphData || {};
        let xAxis = this.state.xAxis || {};

        graphData[graphType] = result;
        xAxis[graphType] = result1;

        this.setState({
          graphData: graphData,
          xAxis: xAxis
        });
      })
      .catch(err => {
        console.log("view error: ", err);
      });
  };
  makeAllGraph = value => {
    let graphRange = value;
    let graphAttr = [{
      graphRange: graphRange,
      graphType: "signin"
    },
    {
      graphRange: graphRange,
      graphType: "signup"
    },
    {
      graphRange: graphRange,
      graphType: "newquestion"
    },
    {
      graphRange: graphRange,
      graphType: "newanswer"
    },
    {
      graphRange: graphRange,
      graphType: "newcomment"
    }
    ];

    graphAttr.map((d, i) => {
      this.makeGraph(d.graphRange, d.graphType);
    });
  };
  componentDidMount() {
    this.makeAllGraph("hour");
  }

  render() {
    let chartData = [{
      name: "SignIn",
      color: "#ff6361",
      graphData: this.state.graphData["signin"],
      xAxis: this.state.xAxis["signin"]
    },
    {
      name: "Signup",
      color: "#bc5090",
      graphData: this.state.graphData["signup"],
      xAxis: this.state.xAxis["signup"]
    },
    {
      name: "New Questions",
      color: "#58508d",
      graphData: this.state.graphData["newquestion"],
      xAxis: this.state.xAxis["newquestion"]
    },
    {
      name: "New Answers",
      color: "#003f5c",
      graphData: this.state.graphData["newanswer"],
      xAxis: this.state.xAxis["newanswer"]
    },
    {
      name: "New Comments",
      color: "#ffa600",
      graphData: this.state.graphData["newcomment"],
      xAxis: this.state.xAxis["newcomment"]
    }
    ];

    const Option = Select.Option;

    function handleChange(value) {
      console.log(`selected ${value}`);
    }

    console.log(chartData);

    return (
      <Row
        style={{
          marginTop: "30px",
          marginLeft: "40px"
        }}
      >
        <Row>
          <Col span={24}>
            <Col span={8}>
              <h3 className="dashboardChartTitle">Dashboard</h3>
            </Col>
            <Col span={8} />
            <Col span={8} style={{ float: "right", marginRight: "80px" }}>
              <Select
                defaultValue="hour"
                style={{ width: 120 }}
                onChange={this.makeAllGraph}
                style={{ float: "right" }}
              >
                <Option value="hour">Hour</Option>
                <Option value="day">Day</Option>
                <Option value="week">Week</Option>
                <Option value="month">Month</Option>
                <Option value="year">Year</Option>
              </Select>
            </Col>
          </Col>
        </Row>
        <Row>
          {chartData.map((value, i) => (
            <Col span={8}>
              <DashboardCharts
                name={value.name}
                color={value.color}
                graphData={value.graphData}
                xAxis={value.xAxis}
              />
            </Col>
          ))}
        </Row>
      </Row>
    );
  }
}

export default Dashboard;