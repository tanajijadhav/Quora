import React, { Component } from 'react'
import { Modal, Typography, Button, List, Avatar, Input, Icon } from 'antd';
import "./NewMessage.css";
import PeopleSearch from './PeopleSearch';
import { call } from '../../api'
const { TextArea } = Input;


const { Title, Text } = Typography;

class Message extends Component {
    state = {
        visible: true,
        to: "",
        message: "",
        data: [
            {
                _id: "1",
                name: "Bhaskar Gurram",
                profileImage: null,

            }
        ]
    }



    handleCancel = () => {
        this.props.history.go(-2);
    }
    handleBack = () => {
        this.props.history.goBack();
    }
    handleChange = (e) => {
        this.setState({
            message: e.target.value
        })
    }

    handleSendMessage = () => {
        const { message, to } = this.state;
        let id = "1";
        call({
            method:"post",
            url: "/conversations/message",
            data: {
                to,
                message
            }
        })
        .then(data => {
            console.log(data.conversation.conversationId)
            this.props.history.push({
                pathname: `/messages/thread/${data.conversation.conversationId}`,
                state: {
                    modal: true
                }
            })
            console.log(message, to)
        })
        .catch(err => {
            console.log(err)
        })
        
    }

    hanldeClick = (_id) => {
        console.log(_id)
        this.state.to = _id;
    }

    render() {
        const { visible, message } = this.state;
        return (
            <div >
                <Modal
                    className="messages-modal new-message-modal"
                    style={{ top: 20 }}
                    title={
                        <div className="thread-title">
                            <Icon type="left" onClick={this.handleBack} />
                            <Title level={4}>New Message </Title>
                        </div>}
                    visible={visible}
                    onCancel={this.handleCancel}
                    footer={[
                        <Button key="back" onClick={this.handleBack}>back</Button>,
                        <Button key="submit" type="primary" onClick={this.handleSendMessage}>
                            Send
                        </Button>,
                    ]}

                >
                    <PeopleSearch
                        handleClick={this.hanldeClick}
                    />
                    <TextArea rows={7} onChange={this.handleChange} value={message} />

                </Modal>
            </div>
        )
    }
}

export default Message;