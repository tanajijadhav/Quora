import React, { Component } from 'react'
import { Modal, Typography, Button, List, Avatar, Skeleton } from 'antd';
import "./Messages.css";
import { call } from '../../api';

const { Title, Text } = Typography;


const data = [
    {
        conversationId: "1",
        name: "Atul",
        profileImage: null,
        conversation: "Hi how are you",
        user_id: "5"
    },
    {
        conversationId: "2",
        name: "Vinit",
        profileImage: null,
        conversation: "Hi how are you",
        user_id: "4"

    }
]


class Messages extends Component {
    state = {
        visible: true,
        conversations: [],
        loading: true
    }

    componentDidMount() {
        call({
            method: 'get',
            url: `/conversations`
        })
            .then(data => {
                console.log(data)
                let conversations = data.conversations;
                conversations = conversations.map(conversation => ({
                    conversationId: conversation.conversationId,
                    name: conversation.conversationWith.firstName + " " + conversation.conversationWith.lastName,
                    conversation: conversation.lastMessage.message,
                    user_id: conversation.conversationWith.userId
                }))
                this.setState({
                    conversations,
                    loading: false
                })
            })

    }

    handleCancel = () => {
        this.props.history.goBack();
    }

    handleOk = () => {

    }
    handleNewMessage = () => {
        console.log("new message")
        this.props.history.push({
            pathname: "/messages/new",
            state: {
                modal: true
            }
        })
    }

    handleMessageClick = (conversationId) => {
        console.log(conversationId)
        this.props.history.push({
            pathname: `/messages/thread/${conversationId}`,
            state: {
                modal: true
            }
        })
    }

    handleCancel = () => {
        this.props.history.goBack();
    }


    render() {
        const { visible, conversations, loading } = this.state;
        return (
            <div >
                <Modal
                    className="messages-modal"
                    style={{ top: 20 }}
                    title={<Title level={4}>Messages</Title>}
                    visible={visible}
                    //             onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={[
                        <Button key="back" onClick={this.handleCancel}>Return</Button>,
                        <Button key="submit" type="primary" onClick={this.handleNewMessage}>
                            New Message
                        </Button>,
                    ]}

                >
                    {

                        !loading ?
                            <List

                                itemLayout="horizontal"
                                dataSource={conversations}
                                renderItem={item => (
                                    <List.Item className="list-item" onClick={() => this.handleMessageClick(item.conversationId)}>
                                        <List.Item.Meta
                                            avatar={<Avatar src={`https://s3.ap-south-1.amazonaws.com/checkapp-dev/profiles/${item.userId}`} />}
                                            title={<a >{item.name}</a>}
                                            description={item.conversation}
                                        />
                                    </List.Item>
                                )}
                            /> :
                            <Skeleton active paragraph={{ rows: 9 }} />
                    }
                </Modal>
            </div>
        )
    }
}

export default Messages;