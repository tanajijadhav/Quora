import React, { Component } from 'react';
import { Typography, Modal, Icon, Input, message } from 'antd';
import { call } from '../../api';
// import './Credential.css';

import Credential from './Credential';
import CredentialModal from './CredentialModal';
const { Text, Title } = Typography;


class ProfileCredential extends Component {
    state = {
        visible: false,
        credential: this.props.profileCredential,
        editCredential: this.props.profileCredential,
        loading: false,
        userId: this.props.userId
    }

    toggleModal = () => {
        this.setState((state, props) => ({
            visible: !state.visible
        }))
    }

    handleChange = (e) => {
        console.log(e.target.value, this.state.editCredential)
        this.setState({
            editCredential: e.target.value
        })
    }

    handleOk = () => {
        const { userId } = this.props;
        const { editCredential } = this.state;
        console.log("handleok")
        this.setState({
            loading: true
        })
        call({
            method: "put",
            url: `/users/${userId}`,
            data: {
                profileCredential: editCredential
            }
        })
            .then(data => {
                console.log(data)
                message.success(data.response[0].message)
                this.setState((state, props) => ({
                    visible: !state.visible,
                    credential: state.editCredential
                }))
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
        const { credential, visible, editCredential, userId } = this.state;
        const modalContent =
            <>
                <span><Icon type="user" /> Add profile credential</span>
                <Input placeholder="15 years as a college admission officer" onChange={this.handleChange} value={editCredential} />
            </>


        return (
            <>

                <div className="credential">
                    {credential ?
                        <div>
                            <Title level={4}>{credential}</Title>
                            {
                                userId === localStorage.getItem("userId") ?

                                    <Text type="secondary" onClick={this.toggleModal} className="edit">Edit</Text>
                                    : null
                            }
                        </div>
                        :
                        userId === localStorage.getItem("userId") ?
                            <Text type="secondary" onClick={this.toggleModal}>Add Profile Credential</Text>
                            : null
                    }

                </div>
                <CredentialModal toggleModal={this.toggleModal} handleOk={this.handleOk} visible={visible}>
                    {modalContent}
                </CredentialModal>
            </>
        )
    }
}

export default ProfileCredential;