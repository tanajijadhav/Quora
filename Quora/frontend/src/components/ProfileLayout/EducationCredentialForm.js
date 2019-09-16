import React, { Component } from 'react'
import { Form, Icon, Row, Col, Input, Typography, Select, Divider, Button } from 'antd';

const { Text } = Typography;
const { Option } = Select;

export default class EducationCredentialForm extends Component {
    state = {
        education: this.props.education
    }

    handleChange = (e) => {
        let name, value;
        if (e.target) {
            value = e.target.value;
            name = e.target.name;
        } else {
            name = "graduationYear";
            value = e
        }


        this.setState((state) => {
            let education = state.education;
            education[name] = value;
            return {
                education
            }
        })
    }

    render() {
        const { school, concentration, secondaryConcentration, degreeType, graduationYear } = this.state.education;
        var options = [];
        for (var i = 2019; i > 1900; i--) {
            options.push(<Option value={i} key={i}>{i}</Option>)
        }
        return (
            <div>
                <span><Icon type="idcard" /> Add Education credential</span>
                <Form.Item>

                    <Row gutter={8}>
                        <Col span={6}><Text>School</Text></Col>
                        <Col span={18}><Input placeholder="Florida State University" onChange={this.handleChange} name="school" value={school} /></Col>
                    </Row>
                </Form.Item>
                <Form.Item>
                    <Row gutter={8}>
                        <Col span={6}><Text>Concentration</Text></Col>
                        <Col span={18}><Input placeholder="Communications" onChange={this.handleChange} name="concentration" value={concentration} /></Col>
                    </Row>
                </Form.Item>
                <Form.Item>
                    <Row gutter={8}>
                        <Col span={6}><Text>Secondary Concentration</Text></Col>
                        <Col span={18}><Input placeholder="Advertising" onChange={this.handleChange} name="secondaryConcentration" value={secondaryConcentration} /></Col>
                    </Row>
                </Form.Item>
                <Form.Item>
                    <Row gutter={8}>
                        <Col span={6}><Text>Degree Type</Text></Col>
                        <Col span={18}><Input placeholder="B.A." onChange={this.handleChange} name="degreeType" value={degreeType} /></Col>
                    </Row>
                </Form.Item>
                <Form.Item>
                    <Row gutter={8}>
                        <Col span={6}><Text>Graduation Year</Text></Col>
                        <Col span={18}>
                            <Select defaultValue="lucy" style={{ width: 120 }} name="graduationYear" value={graduationYear} onChange={this.handleChange}>
                                {
                                    options
                                }
                            </Select>
                        </Col>
                    </Row>
                </Form.Item>
            </div>
        )
    }
}
