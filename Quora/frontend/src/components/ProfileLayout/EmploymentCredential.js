import React, { Component } from 'react';
import { Icon, Input, Row, Col, Typography, Form, Select, Checkbox, Button } from 'antd';

import CredentialModal from './CredentialModal';

const { Text, Title } = Typography;
const { Option } = Select;

class EmploymentCredential extends Component {
    constructor(props) {
        super(props)
        let editEmployment = {
            position: "",
            company: "",
            startYear: "",
            endYear: "",
            current: false,
            ...props.employment
        }
        this.state = {
            visible: props.visible,
            hideText: props.hideText,
            userId: props.userId,
            employment: props.employment || {},
            editEmployment
        }
    }

    toggleModal = () => {
        const { toggleModal } = this.props;
        if (toggleModal) {
            toggleModal("addEmploymentModal")
        }
        this.setState((state, props) => ({
            visible: !state.visible
        }))
    }


    handleOk = () => {
        console.log("handleok")
        const { handleAdd } = this.props;
        if (handleAdd) {
            handleAdd(this.state.editEmployment)
        }
        this.setState((state, props) => ({
            visible: !state.visible,
            employment: { ...state.editEmployment }
        }))
    }

    handleChange = (e, type) => {
        let name, value;
        if(e.target) {
            name = e.target.name;
            if (e.target.value !== undefined) {
                value = e.target.value
            } else if (e.target.checked !== undefined) {
                value = e.target.checked
            }
        }
         else {
            name = type;
            value = e
        }
        console.log(name, value)
        this.setState((state) => {
            let editEmployment = state.editEmployment;
            editEmployment[name] = value;
            return {
                editEmployment
            }
        })
    }
    render() {
        const { visible, employment, editEmployment, hideText, userId } = this.state;
        const { position, company, startYear, endYear, current } = employment;
        var options = [];
        for (var i = 2019; i > 1900; i--) {
            options.push(<Option value={i} key={i}>{i}</Option>)
        }
        return (
            <>
                <div className="credential">
                    {!hideText ? position ?
                        <div>
                            <Icon type="mail" />
                            <Title level={4}>{position + " at " + company}</Title>
                            {
                                    userId === localStorage.getItem("userId") ?
                                    <Text type="secondary" onClick={this.toggleModal} className="edit">Edit</Text> : null
                                }
                        </div>
                        :
                        <div className="title">
                            <Icon type="idcard" />
                            <span onClick={this.toggleModal}>Add Employment Credential</span>
                        </div> : null
                    }

                </div>
                <CredentialModal toggleModal={this.toggleModal} handleOk={this.handleOk} visible={visible}>
                    <div>
                        <span><Icon type="idcard" /> Add Employment credential</span>
                        <Form.Item>

                            <Row gutter={8}>
                                <Col span={6}><Text>Position</Text></Col>
                                <Col span={18}><Input placeholder="Carpenter" onChange={this.handleChange} name="position" value={editEmployment.position} /></Col>
                            </Row>
                        </Form.Item>
                        <Form.Item>
                            <Row gutter={8}>
                                <Col span={6}><Text>Company</Text></Col>
                                <Col span={18}><Input placeholder="Facebook" onChange={this.handleChange} name="company" value={editEmployment.company} /></Col>
                            </Row>
                        </Form.Item>
                        <Form.Item>
                            <Row gutter={8}>
                                <Col span={6}><Text>Start Year</Text></Col>
                                <Col span={18}>
                                    <Select defaultValue="lucy" style={{ width: 120 }} name="startYear" value={editEmployment.startYear} onChange={(e) => this.handleChange(e, "startYear")}>
                                        {
                                            options
                                        }
                                    </Select>
                                </Col>
                            </Row>
                        </Form.Item>
                        <Form.Item>
                            <Row gutter={8}>
                                <Col span={6}><Text>End Year</Text></Col>
                                <Col span={18}>
                                    <Select defaultValue="lucy" style={{ width: 120 }} name="endYear" value={editEmployment.endYear} onChange={(e) => this.handleChange(e, "endYear")}>
                                        {
                                            options
                                        }
                                    </Select>
                                </Col>
                            </Row>
                        </Form.Item>
                        <Form.Item>
                            <Row gutter={8}>
                                <Col span={6}><Text>Current</Text></Col>
                                <Col span={18}>
                                    <Checkbox
                                        checked={editEmployment.current}
                                        name="current"
                                        onChange={this.handleChange}
                                    >
                                        Current
                                    </Checkbox>
                                </Col>
                            </Row>
                        </Form.Item>
                    </div>
                </CredentialModal>
            </>
        )


    }
}

export default EmploymentCredential;