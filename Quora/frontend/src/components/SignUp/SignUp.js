import React, { Component } from "react";
import "antd/dist/antd.css";
import "./../../style.css";
import axios from "axios";
import { call } from '../../api';
import { withRouter } from 'react-router-dom';

import { Form, Icon, Input, Button, Card, message } from "antd";

class SignUp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      password: ""
    };
  }
  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };
  signupSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        //  console.log("Received values of form: ", values);
        let data = {
          firstName: this.state.firstName,
          lastName: this.state.lastName,
          email: this.state.email,
          password: this.state.password
        };
        console.log("signup data ", data);
        call({
          method: "post",
          url: '/signup',
          data
        })
          .then(res => {
            // console.log("signup response data", res);
            // message.success(res.response[0].message);
            // window.localStorage.setItem("userId", res.user.userId);
            // window.localStorage.setItem("token", res.token);
            data = {
              email: data.email,
              password: data.password
            }
            call({
              method: "post",
              url: '/signin',
              data
            })
              .then(res => {
                console.log("login response data", res);
                message.success(res.response[0].message);
                window.localStorage.setItem("userId", res.user.userId);

                window.localStorage.setItem("token", res.token);
                window.localStorage.setItem("profileCredential", res.user.profileCredential);
                window.localStorage.setItem("userName", res.user.firstName + ' ' + res.user.lastName)

                localStorage.setItem("user", res.user)
                this.props.history.push("/")

              })
              .catch(err => {
                console.log("login error: ", err);

                message.error(err.message.response.message);
              });

          })
          .catch(err => {
            console.log("login error: ", err);

            message.error(err.message.response.message);
          });
        // axios
        //   .post("http://10.0.0.188:7836/v1/signup", data)
        //   .then(res => {
        //     if (res.status === 200) {
        //       console.log("Signup response data", res.data.response[0].message);
        //       message.success(res.data.response[0].message);
        //       //   window.localStorage.setItem("userId");
        //       //   window.localStorage.setItem("token");
        //     }
        //   })
        //   .catch(err => {
        //     console.log("signup error: ", err);

        //     console.log(
        //       "signup error response: ",
        //       err.response.data.response.message
        //     );
        //     message.error(err.response.data.response.message);
        //   });
      }
    });
  };
  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <Card
        style={{
          borderLeft: "none",
          borderTop: "none",
          borderBottom: "none"
        }}
      >
        <h7>Sign Up</h7>
        <Form onSubmit={this.signupSubmit} className="signup-form">
          <Form.Item>
            {getFieldDecorator("firstName", {
              rules: [
                {
                  required: true,
                  message: "Please input your firstname!"
                }
              ]
            })(
              <Input
                prefix={
                  <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                type="text"
                placeholder="firstname"
                name="firstName"
                onChange={this.onChange}
              />
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator("lastName", {
              rules: [
                {
                  required: true,
                  message: "Please input your lastname!"
                }
              ]
            })(
              <Input
                prefix={
                  <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                type="text"
                placeholder="lastname"
                name="lastName"
                onChange={this.onChange}
              />
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator("signupEmail", {
              rules: [
                {
                  required: true,
                  message: "Please input your email!"
                }
              ]
            })(
              <Input
                prefix={
                  <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                type="email"
                placeholder="email"
                name="email"
                onChange={this.onChange}
              />
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator("signupPassword", {
              rules: [
                {
                  required: true,
                  message: "Please input your Password!"
                }
              ]
            })(
              <Input
                prefix={
                  <Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                type="password"
                placeholder="Password"
                name="password"
                onChange={this.onChange}
              />
            )}
          </Form.Item>

          <p style={{ color: "#949494", fontSize: "13px" }}>
            By clicking "Sign Up" you indicate that you have read and agree to
            Quora's <a>Terms of Service</a> and <a>Privacy Policy</a>.
          </p>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="signup-form-button"
            >
              Sign Up
            </Button>
          </Form.Item>
        </Form>
      </Card>
    );
  }
}

const signupForm = Form.create({ name: "signup" })(SignUp);

export default withRouter(signupForm);
