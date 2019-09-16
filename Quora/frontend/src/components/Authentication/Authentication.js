import React, { Component } from "react";
import "antd/dist/antd.css";
import "./../../style.css";
import SignupForm from "./../SignUp/SignUp";
import LoginForm from "./../Login/Login";

import { Form, Icon, Input, Button, Checkbox, Card, Row, Col } from "antd";

class Authentication extends Component {
  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <div
        style={{
          backgroundImage:
            "url(http://qsf.fs.quoracdn.net/-3-images.home.illo_1920.png-26-5ac607d989ef8067.png)",
          paddingTop: "66px",
          width: "100&#37"
        }}
      >
        <div>
          <Card
            style={{
              marginLeft: "auto",
              marginRight: "auto",
              width: "660px",
              marginTop: "60px",
              background: "#fff",
              border: "1px solid #e2e2e2",
              boxShadow: "0 0 5px #888",
              borderRadius: "4px"
            }}
          >
            <Row>
              <Col span={24} align="middle">
                <img
                  src="http://qsf.fs.quoracdn.net/-3-images.logo.wordmark_default.svg-26-bfa6b94bc0d6af2e.svg"
                  align="center"
                />
              </Col>
            </Row>
            <Row>
              <Col span={24} align="middle">
                <h1
                  style={{
                    fontFamily:
                      "q_serif',Georgia,Times,Times New Roman,Hiragino Kaku Gothic Pro,Meiryo,serif",
                    fontSize: "19px",
                    fontWeight: "400",
                    color: "#949494",
                    marginTop: "10px"
                  }}
                >
                  A place to share knowledge and better understand the world
                </h1>
              </Col>
            </Row>

            <Row style={{ padding: "32px" }}>
              <Col span={12}>
                <SignupForm />
              </Col>
              <Col span={12}>
                <LoginForm />
              </Col>
            </Row>
          </Card>
        </div>
      </div>
    );
  }
}

const WrappedNormalLoginForm = Form.create({ name: "login" })(Authentication);

export default WrappedNormalLoginForm;
