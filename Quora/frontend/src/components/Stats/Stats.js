import React, { Component } from "react";
import "antd/dist/antd.css";
import "./../../style.css";
import axios from "axios";
import "./Stats.css";
import { Element } from "react-faux-dom";
import * as d3 from "d3";
import { Button, Row, Col, Menu, Dropdown } from "antd";
import { call } from "../../api";

class Stats extends Component {
  constructor(props) {
    super(props);

    this.state = {
      views: "statsTab-active",
      upvotes: "statsTab",
      downvotes: "statsTab",
      questionArray: [],
      answerId: "",
      viewsCount: "",
      upvotesCount: "",
      downvotesCount: "",
      graphData: "",
      filter: "",
      toggle: true
    };
  }

  componentDidMount() {
    // const token =
    //   "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhMTY0MDIyMC02ODAyLTExZTktOGUxYS1iZDE3NmJmNjdkYWEiLCJjcmVhdGVkX2F0IjoxNTU2NzQzMTcwMzIyLCJpYXQiOjE1NTY3NDMxNzAsImV4cCI6MTU1OTMzNTE3MH0.CNknpZADc05g6Un4ogHzO8pmdW5mDB3QnhRLQKHcmm0";

    // let token = localStorage.getItem("token");
    // console.log(token);

    // axios
    //   .get("/answers?top=10&sort=views", {
    //     headers: {
    //       authorization: "Bearer " + token
    //     }
    //   })
    call({
      method: "get",
      url: "/answers?top=10&sort=views"
    })
      .then(res => {
        console.log("view response data", res.answers);

        this.setState({
          questionArray: res.answers,
          answerId: res.answers[0].answerId,
          viewsCount: res.answers[0].noOfTimesviewed,
          upvotesCount: res.answers[0].upvotes,
          downvotesCount: res.answers[0].downvotes
        });

        // axios.get("/answers/" + this.state.answerId + "/views?day=30", {
        //   headers: {
        //     authorization: "Bearer " + token
        //   }
        // });
        call({
          method: "get",
          url: "/answers/" + res.answers[0].answerId + "/views?day=30"
        })
          .then(res => {
            console.log("graph response", res.data);
            this.setState({
              graphOriginalData: res.data,
              graphData: res.data.graphData
            });
          })
          .catch(err => {
            console.log("view error: ", err);
          });
      })
      .catch(err => {
        console.log("view error: ", err);
      });
  }

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  graph = name => {
    //e.preventDefault();
    // console.log(e.target.name, name);
    // const token =
    //   "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhMTY0MDIyMC02ODAyLTExZTktOGUxYS1iZDE3NmJmNjdkYWEiLCJjcmVhdGVkX2F0IjoxNTU2NzQzMTcwMzIyLCJpYXQiOjE1NTY3NDMxNzAsImV4cCI6MTU1OTMzNTE3MH0.CNknpZADc05g6Un4ogHzO8pmdW5mDB3QnhRLQKHcmm0";

    if (name === "views") {
      // axios
      //   .get("v1/answers/:this.state.answerId/views?day=30", {
      //     headers: {
      //       authorization: token
      //     }
      //   })
      call({
        method: "get",
        url: "/answers/" + this.state.answerId + "/views?day=30"
      })
        .then(res => {
          console.log("graph views response data", res.data.graphData);
          this.setState({
            graphData: res.data.graphData,
            views: "statsTab-active",
            upvotes: "statsTab",
            downvotes: "statsTab"
          });
        })
        .catch(err => {
          console.log("views graph error: ", err);
        });
    } else if (name === "upvotes") {
      // axios
      //   .get("v1/answers/:this.state.answerId/upvotes?day=30", {
      //     headers: {
      //       authorization: token
      //     }
      //   })
      call({
        method: "get",
        url: "/answers/" + this.state.answerId + "/upvotes?day=30"
      })
        .then(res => {
          console.log("graph upvotes response data", res.data.graphData);
          this.setState({
            graphData: res.data.graphData,
            upvotes: "statsTab-active",
            views: "statsTab",
            downvotes: "statsTab"
          });
        })
        .catch(err => {
          console.log("upvotes graph error: ", err);
        });
    } else if (name === "downvotes") {
      // axios
      //   .get("v1/answers/:this.state.answerId/downvotes?day=30", {
      //     headers: {
      //       authorization: token
      //     }
      //   })
      call({
        method: "get",
        url: "/answers/" + this.state.answerId + "/downvotes?day=30"
      })
        .then(res => {
          console.log("graph downvotes response data", res.data.graphData);
          this.setState({
            graphData: res.data.graphData,
            downvotes: "statsTab-active",
            upvotes: "statsTab",
            views: "statsTab"
          });
        })
        .catch(err => {
          console.log("downvotes graph error: ", err);
        });
    }
  };

  plot = (chart, width, height) => {
    //  var viewData = [];
    //  viewData = viewGraph[0].views;

    // console.log("view Data", viewGraph[0].views);

    //create scales!
    const xScale = d3
      .scaleBand()
      .domain((this.state.graphData || []).map((d, i) => {return ((new Date(d.timestamp).getMonth()+1)+"/"+new Date(d.timestamp).getDate())}))
      .range([0, width]);
    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(this.state.graphData, d => d.count)])
      .range([height, 0]);
    //  const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    chart
      .selectAll(".bar")
      .data(this.state.graphData || [])
      .enter()
      .append("rect")
      .classed("bar", true)
      .attr("x", d => xScale(((new Date(d.timestamp).getMonth()+1)+"/"+new Date(d.timestamp).getDate())))
      .attr("y", d => yScale(d.count))
      .attr("height", d => height - yScale(d.count))
      .attr("width", d => xScale.bandwidth() - 1)
      .style("fill", "#84B1E1");
    //.style("fill", (d, i) => colorScale(i));

    // chart
    //   .selectAll(".bar-label")
    //   .data(this.state.graphData || [])
    //   .enter()
    //   .append("text")
    //   .classed("bar-label", true)
    //   .attr("x", d => xScale(d.country) + xScale.bandwidth() / 2)
    //   .attr("dx", 0)
    //   .attr("y", d => yScale(d.value))
    //   .attr("dy", -6)
    //   .text(d => d.value);

    const xAxis = d3.axisBottom().scale(xScale);

    chart
      .append("g")
      .classed("x axis", true)
      .attr("transform", `translate(0,${height})`)
      .call(xAxis);

    const yAxis = d3
      .axisLeft()
      .ticks(5)
      .scale(yScale);

    chart
      .append("g")
      .classed("y axis", true)
      .attr("transform", "translate(0,0)")
      .call(yAxis);

    // chart
    //   .select(".x.axis")
    //   .append("text")
    //   .attr("x", width / 2)
    //   .attr("y", 60)
    //   .attr("fill", "#000")
    //   .style("font-size", "20px")
    //   .style("text-anchor", "middle")
    //   .text("Country");

    // chart
    //   .select(".y.axis")
    //   .append("text")
    //   .attr("x", 0)
    //   .attr("y", 0)
    //   .attr("transform", `translate(-50, ${height / 2}) rotate(-90)`)
    //   .attr("fill", "#000")
    //   .style("font-size", "20px")
    //   .style("text-anchor", "middle")
    //   .text("Government Expenditure in Billion Dollars");

    const yGridlines = d3
      .axisLeft()
      .scale(yScale)
      .ticks(5)
      .tickSize(-width, 0, 0)
      .tickFormat("");

    chart
      .append("g")
      .call(yGridlines)
      .classed("gridline", true);
  };

  drawChart() {
    let width, height;
    if (this.state.toggle) {
      width = 820;
      height = 500;
    } else {
      width = 1200;
      height = 500;
    }

    const el = new Element("div");
    const svg = d3
      .select(el)
      .append("svg")
      .attr("id", "chart")
      .attr("width", width)
      .attr("height", height);

    const margin = {
      top: 60,
      bottom: 100,
      left: 80,
      right: 40
    };

    const chart = svg
      .append("g")
      .classed("display", true)
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    this.plot(chart, chartWidth, chartHeight);

    return el.toReact();
  }

  onChangeQuestion = answerId => {
    // console.log("key ", answerId);
    this.state.questionArray.map((data, i) => {
      //console.log("key ", data);
      if (answerId === data.answerId) {
        //   console.log("key ", i);
        this.setState({
          answerId: data.answerId,
          viewsCount: data.noOfTimesviewed,
          upvotesCount: data.upvotes,
          downvotesCount: data.downvotes
        });

        // const token =
        //   "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhMTY0MDIyMC02ODAyLTExZTktOGUxYS1iZDE3NmJmNjdkYWEiLCJjcmVhdGVkX2F0IjoxNTU2NzQzMTcwMzIyLCJpYXQiOjE1NTY3NDMxNzAsImV4cCI6MTU1OTMzNTE3MH0.CNknpZADc05g6Un4ogHzO8pmdW5mDB3QnhRLQKHcmm0";

        // axios
        //   .get("/v1/answers/:this.state.answerId/views?day=30", {
        //     headers: {
        //       authorization: token
        //     }
        //   })
        call({
          method: "get",
          url: "/answers/" + this.state.answerId + "/views?day=30"
        })
          .then(res => {
            console.log("graph response data", res.data.graphData);
            this.setState({
              graphData: res.data.graphData
            });
          })
          .catch(err => {
            console.log("view error: ", err);
          });
      }
    });
  };

  dropDown = value => {
    // const token =
    //   "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhMTY0MDIyMC02ODAyLTExZTktOGUxYS1iZDE3NmJmNjdkYWEiLCJjcmVhdGVkX2F0IjoxNTU2NzQzMTcwMzIyLCJpYXQiOjE1NTY3NDMxNzAsImV4cCI6MTU1OTMzNTE3MH0.CNknpZADc05g6Un4ogHzO8pmdW5mDB3QnhRLQKHcmm0";

    console.log("value", value);
    if (value === "views") {
      this.setState({
        filter: "views",
        toggle: true
      });
    } else if (value === "upvotes") {
      this.setState({
        filter: "upvotes",
        toggle: true
      });
    } else if (value === "downvotes") {
      this.setState({
        filter: "downvotes",
        toggle: true
      });
    } else if (value === "bookmark") {
      this.setState({
        filter: "bookmark",
        toggle: false
      });
    }
    if (value === "profile") {
      this.setState({
        filter: "profile",
        toggle: false
      });
    }

    // axios
    //   .get("v1/answers?top=10&sort=this.state.filter", {
    //     headers: {
    //       authorization: token
    //     }
    //   })
    call({
      method: "get",
      url: "/answers?top=10&sort=" + this.state.filter
    })
      .then(res => {
        if (res.status === 200) {
          console.log("dropdown view response data", res.data.answers);

          this.setState({
            questionArray: res.answers,
            answerId: res.answers[0].answerId,
            viewsCount: res.answers[0].noOfTimesviewed,
            upvotesCount: res.answers[0].upvotes,
            downvotesCount: res.answers[0].downvotes
          });

          // axios
          //   .get("v1/answers/:this.state.answerId/views?day=30", {
          //     headers: {
          //       authorization: token
          //     }
          //   })
          call({
            method: "get",
            url: "/answers/" + this.state.answerId + "/views?day=30"
          })
            .then(res => {
              console.log("dropdown graph response data", res.data.graphData);
              this.setState({
                graphData: res.data.graphData
              });
            })
            .catch(err => {
              console.log("view error: ", err);
            });
        }
      })
      .catch(err => {
        console.log("view error: ", err);
      });
  };

  render() {
    const menu = (
      <Menu>
        <Menu.Item onClick={() => this.dropDown("views")}>
          <a>Views</a>
        </Menu.Item>
        <Menu.Item onClick={() => this.dropDown("upvotes")}>
          <a>Upvotes</a>
        </Menu.Item>
        <Menu.Item onClick={() => this.dropDown("downvotes")}>
          <a>Downvotes</a>
        </Menu.Item>
        <Menu.Item onClick={() => this.dropDown("bookmark")}>
          <a>Bookmark</a>
        </Menu.Item>
        <Menu.Item onClick={() => this.dropDown("profile")}>
          <a>Profile views</a>
        </Menu.Item>
      </Menu>
    );

    return (
      <Row className="ContentWrapper">
        <Row>
          <Col span={4}>
            <p className="statsTitle">Stats</p>
          </Col>
          <Col span={4} />
          <Col span={4} />
          <Col span={4} />
          <Col span={4} />
          <Col span={4}>
            <Dropdown overlay={menu} placement="bottomCenter">
              <Button style={{ float: "right" }}>Answer</Button>
            </Dropdown>
          </Col>
        </Row>
        {this.state.toggle && (
          <Row>
            <Col span={7} className="statsAnswerList">
              <Menu defaultSelectedKeys={["0"]} defaultOpenKeys={["sub1"]}>
                {(this.state.questionArray || []).map((q, i) => (
                  <Menu.Item
                    key={i}
                    onClick={() => this.onChangeQuestion(q.answerId)}
                    style={{ whiteSpace: "unset" }}
                  >
                    <a>{q.question}</a>
                  </Menu.Item>
                ))}
              </Menu>
            </Col>
            <Col span={17} className="statsgraph">
              <button
                name="views"
                className={this.state.views}
                onClick={() => this.graph("views")}
                style={{
                  borderLeft: "none",
                  borderRight: "none",
                  borderTop: "none"
                }}
              >
                <p className="viewsNum">{this.state.viewsCount}</p>
                <p className="viewslabel">VIEWS</p>
              </button>
              <button
                name="upvotes"
                className={this.state.upvotes}
                onClick={() => this.graph("upvotes")}
                style={{
                  borderRight: "none",
                  borderTop: "none"
                }}
              >
                <p className="upvotesNum">{this.state.upvotesCount}</p>
                <p className="upvoteslabel">UPVOTES</p>
              </button>
              <button
                name="downvotes"
                className={this.state.downvotes}
                onClick={() => this.graph("downvotes")}
                style={{
                  borderTop: "none"
                }}
              >
                <p className="downvotesNum">{this.state.downvotesCount}</p>
                <p className="downvoteslabel">DOWNVOTES</p>
              </button>
              <Col span={24}>{this.drawChart()}</Col>
            </Col>
          </Row>
        )}
        {!this.state.toggle && (
          <Row>
            <Col span={24}>{this.drawChart()}</Col>
          </Row>
        )}
      </Row>
    );
  }
}

export default Stats;
