import React, { Component } from 'react'
import { Typography, Icon, Divider, List, Avatar, Popover, Button, Menu, Modal, message } from 'antd';
import './CredentialAndHighlights.css';
import { call } from '../../api';
import EducationCredential from './EducationCredential';
import EmploymentCredential from './EmploymentCredential';
import LocationCredential from './LocationCredential';
import CredentialModal from './CredentialModal';
import EducationCredentialForm from './EducationCredentialForm';

const { Text, Title } = Typography;

class CredentialAndHighlights extends Component {
    constructor(props) {
        super(props);
        const { education,
            employment,
            location,
        } = props;
        let dataSource = [];
        if (education && employment && location) {
            const employmentData = employment.map(e => ({
                title: e.position + " at " + e.company,
                type: "employment",
                icon: "mail",
                ...e
            }))
            const educationData = education.map(e => ({
                title: e.degreeType + " " + e.concentration + " " + e.school,
                icon: "idcard",
                type: "education",
                ...e
            }))
            const locationData = location.map(e => ({
                title: e.location,
                icon: "pushpin",
                type: "location",
                ...e
            }))

            dataSource = employmentData.concat(educationData, locationData);
        }

        this.state = {
            dataSource,
            visible: false,
            education: this.props.education || [],
            employment: this.props.employment || [],
            location: this.props.location || [],
            userId: this.props.userId,
            popoverVisible: false,
            editEducationModal: false,
            addEmploymentModal: false,
            addLocationModal: false,
            addEducationModal: false,
            editEmploymentModal: false,
            editLocationModal: false
        }
    }


    toggleModal = () => {
        this.setState((state, props) => ({
            visible: !state.visible
        }))
    }

    toggleAddModal = (type) => {
        this.setState({
            [type]: false
        })
    }

    togglePopover = (popoverVisible) => {
        console.log("popover toggle")
        this.setState({
            popoverVisible
        })
    }

    handleOpenModal = (type) => {
        console.log(type)
        this.setState({
            [type]: true,
            popoverVisible: false
        })
    }

    handleEdit = (type) => {

    }

    handleAddEducation = (item) => {
        console.log(item)
        let { education, dataSource } = this.state;
        const userId = localStorage.getItem("userId")
        education = education.slice(0);
        education.push(item)
        console.log(education)
        call({
            method: "put",
            url: `/users/${userId}`,
            data: {
                education
            }
        })
            .then(data => {
                console.log(data)
                message.success(data.response[0].message)
                item = {
                    title: item.degreeType + " " + item.concentration + " " + item.school,
                    icon: "idcard",
                    type: "education",
                    ...item
                }
                dataSource.push(item);
                this.setState({
                    education,
                    dataSource,
                    addEducationModal: false
                })
            })
            .catch(err => {
                console.log(err)
                message.error(err.message)
                this.setState((state, props) => ({
                    loading: false,

                }))
            })

    }


    handleAddEmployment = (item) => {
        console.log(item)
        let { employment, dataSource } = this.state;
        const userId = localStorage.getItem("userId")
        employment = employment.slice(0);
        employment.push(item)
        console.log(employment)
        call({
            method: "put",
            url: `/users/${userId}`,
            data: {
                employment
            }
        })
            .then(data => {
                console.log(data)
                message.success(data.response[0].message)
                item = {
                    title: item.position + " at " + item.company,
                    type: "employment",
                    icon: "mail",
                    ...item
                }
                dataSource.push(item);
                this.setState({
                    employment,
                    dataSource,
                    addEmploymentModal: false
                })
            })
            .catch(err => {
                console.log(err)
                message.error(err.message)
                this.setState((state, props) => ({
                    loading: false,

                }))
            })
    }

    handleAddLocation = (item) => {
        console.log(item)
        let { location, dataSource } = this.state;
        const userId = localStorage.getItem("userId")
        location = location.slice(0);
        location.push(item)
        console.log(location)
        call({
            method: "put",
            url: `/users/${userId}`,
            data: {
                location
            }
        })
            .then(data => {
                console.log(data)
                message.success(data.response[0].message)
                item = {
                    title: item.location,
                    icon: "pushpin",
                    type: "location",
                    ...item
                }
                dataSource.push(item);
                this.setState({
                    location,
                    dataSource,
                    addLocationModal: false
                })
            })
            .catch(err => {
                console.log(err)
                message.error(err.message)
                this.setState((state, props) => ({
                    loading: false,

                }))
            })
    }

    handleEditEducation = (item) => {
        console.log(item)
        delete item["type"]
        delete item["icon"]
        delete item["title"]
        let { education, dataSource } = this.state;
        const userId = localStorage.getItem("userId")
        education = education.slice(0);
        education = education.map(e => {
            if (e._id === item._id) return item
            return e
        })

        console.log(education)
        call({
            method: "put",
            url: `/users/${userId}`,
            data: {
                education
            }
        })
            .then(data => {
                console.log(data)
                message.success(data.response[0].message)

                this.setState({
                    education,
                    dataSource
                })
            })
            .catch(err => {
                console.log(err)
                message.error(err.message)
                this.setState((state, props) => ({
                    loading: false,

                }))
            })
    }


    handleEditEmployment = (item) => {
        delete item["type"]
        delete item["icon"]
        delete item["title"]
        console.log(item)
        let { employment, dataSource } = this.state;
        const userId = localStorage.getItem("userId")
        employment = employment.slice(0);
        employment = employment.map(e => {
            console.log(e._id === item._id)

            if (e._id === item._id) {
                return item
            }
            return e
        })

        console.log(employment)
        call({
            method: "put",
            url: `/users/${userId}`,
            data: {
                employment
            }
        })
            .then(data => {
                console.log(data)
                message.success(data.response[0].message)

                this.setState({
                    employment,
                    dataSource
                })
            })
            .catch(err => {
                console.log(err)
                message.error(err.message)
                this.setState((state, props) => ({
                    loading: false,

                }))
            })
    }

    handleEditLocation = (item) => {
        console.log(item)
        delete item["type"]
        delete item["icon"]
        delete item["title"]
        let { location, dataSource } = this.state;
        const userId = localStorage.getItem("userId")
        location = location.slice(0);
        location = location.map(e => {
            if (e._id === item._id) return item
            return e
        })

        console.log(location)
        call({
            method: "put",
            url: `/users/${userId}`,
            data: {
                location
            }
        })
            .then(data => {
                console.log(data)
                message.success(data.response[0].message)

                this.setState({
                    location,
                    dataSource,
                })
            })
            .catch(err => {
                console.log(err)
                message.error(err.message)
                this.setState((state, props) => ({
                    loading: false,

                }))
            })
    }
    render() {
        const { education,
            employment,
            location,
            visible,
            popoverVisible,
            editEducationModal,
            addEmploymentModal,
            addLocationModal,
            addEducationModal,
            dataSource,
            userId
        } = this.state;
        console.log(this.state.addEmploymentModal)
        return (
            <>
                <div className="credential-and-highlights">
                    <Title level={4}>Credential & Highlights</Title>
                    {userId === localStorage.getItem("userId") ?
                        <Icon type="edit" onClick={this.toggleModal} /> : null}
                    <Divider />
                    {
                        dataSource.map((data, i) => (
                            data.type === "education" ?
                                <EducationCredential education={data} userId={userId} handleAdd={this.handleEditEducation} visible={editEducationModal} key={i} /> :
                                data.type === "employment" ?
                                    <EmploymentCredential employment={data} userId={userId} handleAdd={this.handleEditEmployment} visible={addEmploymentModal} key={i} /> :
                                    data.type === "location" ?
                                        <LocationCredential location={data} userId={userId} handleAdd={this.handleEditLocation} visible={addLocationModal} key={i} /> : null
                        ))
                    }


                    {/* <LocationCredential location={location} /> */}
                    <CredentialModal toggleModal={this.toggleModal} handleOk={this.toggleModal} visible={visible} className="credential-modal">
                        {/* {modalContent} */}
                        <List.Item>
                            <Popover
                                className="credential-popover"
                                content={
                                    <div className="add-a-credential" >
                                        <div onClick={() => { this.handleOpenModal("addEducationModal") }}><Icon type="idcard" /> Education</div>
                                        <div onClick={() => { this.handleOpenModal("addEmploymentModal") }}><Icon type="idcard" /> Employment</div>
                                        <div onClick={() => { this.handleOpenModal("addLocationModal") }}><Icon type="idcard" /> Location</div>
                                    </div>
                                }
                                trigger="click"
                                placement="bottom"
                                visible={popoverVisible}
                                onVisibleChange={this.togglePopover}
                            >
                                <Button icon="plus" type="primary" ghost >Add a credential</Button>
                            </Popover>
                        </List.Item>
                        <List
                            itemLayout="horizontal"
                            dataSource={dataSource}
                            renderItem={item => (
                                <List.Item className="list-item">
                                    <List.Item.Meta
                                        title={
                                            item.type === "education" ?
                                                <EducationCredential education={item} visible={editEducationModal} userId={userId} handleAdd={this.handleEditEducation} key={item} /> :
                                                item.type === "employment" ?
                                                    <EmploymentCredential employment={item} visible={addEmploymentModal} userId={userId} handleAdd={this.handleEditEmployment} key={item} /> :
                                                    item.type === "location" ?
                                                        <LocationCredential location={item} visible={addLocationModal} userId={userId} handleAdd={this.handleEditLocation} key={item} /> : null
                                        }
                                    />
                                </List.Item>
                            )}
                        />


                    </CredentialModal>
                </div>

                <EducationCredential
                    visible={addEducationModal}
                    key={addEducationModal + "2"}
                    hideText={true}
                    handleAdd={this.handleAddEducation}
                    toggleModal={this.toggleAddModal}

                />
                <EmploymentCredential
                    visible={addEmploymentModal}
                    hideText={true}
                    handleAdd={this.handleAddEmployment}
                    toggleModal={this.toggleAddModal}
                    key={addEmploymentModal + "1"}
                />
                <LocationCredential
                    visible={addLocationModal}
                    hideText={true}
                    handleAdd={this.handleAddLocation}
                    toggleModal={this.toggleAddModal}
                    key={addLocationModal + "3"}
                />
            </>
        )
    }
}

export default CredentialAndHighlights