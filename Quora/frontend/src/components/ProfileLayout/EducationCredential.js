import React, { Component } from 'react';
import { Icon, Input, Row, Col, Typography, Form, Select, Button, message } from 'antd';
import './EducationCredential.css';
import { call } from '../../api';

import Credential from './Credential';
import CredentialModal from './CredentialModal';
import EducationCredentialForm from './EducationCredentialForm';

const { Text, Title } = Typography;
const { Option } = Select;

class EducationCredential extends Component {
    constructor(props) {
        super(props)
        let editEducation = {
            school: "",
            concentration: "",
            secondaryConcentration: "",
            graduationYear: "",
            degreeType: "",
            ...props.education
        }
        this.state = {
            userId: props.userId,
            visible: props.visible,
            hideText: props.hideText,
            education: props.education || {},
            editEducation
        }
    }

    toggleModal = () => {
        const { toggleModal } = this.props;
        if(toggleModal) {
            toggleModal("addEducationModal")
        }
        this.setState((state, props) => ({
            visible: !state.visible
        }))
    }


    handleOk = () => {
        console.log("handleok")
        const { handleAdd, userId } = this.props;
        if (handleAdd) {
            handleAdd(this.state.editEducation)
        }
        

       

        this.setState((state, props) => ({
            visible: !state.visible,
            education: { ...state.editEducation }
        }))
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
            let editEducation = state.editEducation;
            editEducation[name] = value;
            return {
                editEducation
            }
        })
    }
    render() {
        const { visible, education, editEducation, button, hideText, userId } = this.state;
        const { school, concentration, secondaryConcentration, degreeType, graduationYear } = education;
        var options = [];
        for (var i = 2025; i > 1900; i--) {
            options.push(<Option value={i} key={i}>{i}</Option>)
        }
        return (
            <>
                <div className="credential">
                    {!hideText ?
                        school ?
                            <div>
                                <Icon type="idcard" />
                                <Title level={4}>{degreeType + " " + concentration + " " + school}</Title>
                                {
                                    userId === localStorage.getItem("userId") ?
                                    <Text type="secondary" onClick={this.toggleModal} className="edit">Edit</Text> : null
                                }
                            </div>
                            :
                            <div className="title">
                                <Icon type="idcard" />
                                <span onClick={this.toggleModal}>Add Education Credential</span>
                            </div>
                        : null
                    }

                </div>
                <CredentialModal toggleModal={this.toggleModal} handleOk={this.handleOk} visible={visible}>
                    <div>
                        <span><Icon type="idcard" /> Add Education credential</span>
                        <Form.Item>

                            <Row gutter={8}>
                                <Col span={6}><Text>School</Text></Col>
                                <Col span={18}><Input placeholder="Florida State University" onChange={this.handleChange} name="school" value={editEducation.school} /></Col>
                            </Row>
                        </Form.Item>
                        <Form.Item>
                            <Row gutter={8}>
                                <Col span={6}><Text>Concentration</Text></Col>
                                <Col span={18}><Input placeholder="Communications" onChange={this.handleChange} name="concentration" value={editEducation.concentration} /></Col>
                            </Row>
                        </Form.Item>
                        <Form.Item>
                            <Row gutter={8}>
                                <Col span={6}><Text>Secondary Concentration</Text></Col>
                                <Col span={18}><Input placeholder="Advertising" onChange={this.handleChange} name="secondaryConcentration" value={editEducation.secondaryConcentration} /></Col>
                            </Row>
                        </Form.Item>
                        <Form.Item>
                            <Row gutter={8}>
                                <Col span={6}><Text>Degree Type</Text></Col>
                                <Col span={18}><Input placeholder="B.A." onChange={this.handleChange} name="degreeType" value={editEducation.degreeType} /></Col>
                            </Row>
                        </Form.Item>
                        <Form.Item>
                            <Row gutter={8}>
                                <Col span={6}><Text>Graduation Year</Text></Col>
                                <Col span={18}>
                                    <Select defaultValue="lucy" style={{ width: 120 }} name="graduationYear" value={editEducation.graduationYear} onChange={this.handleChange}>
                                        {
                                            options
                                        }
                                    </Select>
                                </Col>
                            </Row>
                        </Form.Item>
                    </div>
                </CredentialModal>
            </>
        )


    }
}

export default EducationCredential;