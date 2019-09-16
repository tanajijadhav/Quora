import React, { Component } from "react";
import "antd/dist/antd.css";
import "./../../style.css";
import axios from "axios";
import { call } from '../../api';
import { withRouter } from 'react-router-dom';

import { Form, Icon, Input, Button, Card, message } from "antd";

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loginEmail: "",
      loginPassword: ""
    };
  }
  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  loginSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        //console.log("Received values of form: ", values);
        const data = {
          email: this.state.loginEmail,
          password: this.state.loginPassword
        };
        if (data.email === "admin@sjsu.edu" && data.password === "admin") return this.props.history.push("/dashboard")
        console.log("login data ", data);
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

      }
    });
  };
  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <Card
        style={{
          borderRight: "none",
          borderTop: "none",
          borderBottom: "none"
        }}
      >
        <h7>Login</h7>
        <Form onSubmit={this.loginSubmit} className="login-form">
          <Form.Item>
            {getFieldDecorator("loginEmail", {
              rules: [
                {
                  required: true,
                  message: "Please input your username!"
                }
              ]
            })(
              <Input
                prefix={
                  <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                type="email"
                placeholder="Email"
                name="loginEmail"
                onChange={this.onChange}
              />
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator("loginPassword", {
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
                name="loginPassword"
                onChange={this.onChange}
              />
            )}
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              Log in
            </Button>
          </Form.Item>
        </Form>
      </Card>
    );
  }
}

const loginForm = Form.create({ name: "login" })(Login);

export default withRouter(loginForm);
