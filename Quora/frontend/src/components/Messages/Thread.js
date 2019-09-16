import React, { Component } from 'react'
import { Modal, List, Typography, Button, Avatar, Input, Icon, Skeleton } from 'antd';
import { withLastLocation } from 'react-router-last-location';
import Chat from './Chat';
import { call } from '../../api';
import ThreadFooter from './ThreadFooter';

import './Thread.css';

const { Title, Text } = Typography;
const conversation = {
  "users": [
    "a1640220-6802-11e9-8e1a-bd176bf67daa",
    "e1a21570-6802-11e9-935c-855a9a513e79"
  ],
  "conversationId": "24427060-687f-11e9-820f-d16c50b9ab48",
  "messages": 3,
  "updatedAt": "2019-04-26T23:58:09.013Z",
  "createdAt": "2019-04-26T23:58:09.013Z",
  "firstName": "vinit",
  "lastName": "dholakia",
  "userId": "a1640220-6802-11e9-8e1a-bd176bf67daa",
  "conversationWith": {
    "firstName": "Tosha",
    "lastName": "Kamath",
    "userId": "e1a21570-6802-11e9-935c-855a9a513e79"
  },
  "messageList": [
    {
      "_id": "5cc3a331b3fefeb598dd2df4",
      "from": "e1a21570-6802-11e9-935c-855a9a513e79",
      "to": "a1640220-6802-11e9-8e1a-bd176bf67daa",
      "message": "Hello Vinit! Good to be on Quora",
      "createdAt": "2019-04-27T00:32:49.736Z"
    },
    {
      "_id": "5cc39ba451c4e8adb90cc2b0",
      "from": "a1640220-6802-11e9-8e1a-bd176bf67daa",
      "to": "e1a21570-6802-11e9-935c-855a9a513e79",
      "message": "Hello, Welcome to Quora!",
      "createdAt": "2019-04-27T00:00:36.249Z"
    },
    {
      "_id": "5cc39b11d9f5f2ac9dcc5c48",
      "from": "a1640220-6802-11e9-8e1a-bd176bf67daa",
      "to": "e1a21570-6802-11e9-935c-855a9a513e79",
      "message": "Hi There",
      "createdAt": "2019-04-26T23:58:09.113Z"
    }
  ]
}
const axios = {
  get: () => (
    new Promise((resolve, reject) => {
      resolve(conversation)
    })
  )
}

class Thread extends Component {
  state = {
    visible: true,
    conversation: {},
    loading: true
  }



  componentDidMount() {
    console.log(this.props.match.params.id)
    call({
      method: "get",
      url: `/conversations/${this.props.match.params.id}`
    })
      .then(data => {
        const conversation = data.conversation;
        console.log(conversation)
        this.setState({
          conversation,
          loading: false
        })
        this.scrollToBottom();
      })
      .catch(err => {
        console.log(err)
      })




  }

  handleSubmit = (message) => {
    const { conversation } = this.state;
    let data = {
      to: conversation.conversationWith.userId,
      message
    } // send this to server
    let newMessage = {
      from: conversation.userId,
      to: conversation.conversationWith.userId,
      message,
      createdAt: Date.now()
    }
    conversation.messageList.push(newMessage)
    this.setState({
      conversation
    }, () => {
      this.scrollToBottom();
    })
    
    call({
      method: 'post',
      url: "/conversations/message",
      data
    })
      .then(data => {
        console.log(data)
      
      })
      .catch(err => {
        console.log(err)
      })

  }
  handleBack = () => {
    if (this.props.lastLocation.pathname.split('/')[2])
      this.props.history.go(-2);
    else
      this.props.history.goBack();
  }

  handleCancel = () => {
    console.log(this.props.lastLocation)
    if (this.props.lastLocation.pathname.split('/')[2])
      this.props.history.go(-3);
    else
      this.props.history.go(-2);
  }
  scrollToBottom = () => {
    this.messagesEnd.scrollIntoView({ behavior: "smooth" });
  }
  render() {
    const { visible, conversation, loading } = this.state;
    let conversationWithName;
    let messageList = [];

    if (Object.keys(conversation).length > 0) {

      const { conversationWith } = conversation;
      messageList = conversation.messageList;
      messageList = messageList.map(message => ({
        message: message.message,
        userId: message.from === conversation.userId ? conversation.userId : conversationWith.userId,
        date: message.createdAt,
        _id: message._id,
        justifyContent: message.from === conversation.userId ? "flex-end" : "flex-start"

      }))
      const { firstName, lastName } = conversationWith;
      conversationWithName = firstName + " " + lastName;
    }
    console.log(messageList)

    return (
      <div>
        <Modal
          className="messages-modal thread"
          style={{ top: 20 }}
          title={
            <div className="thread-title">
              <Icon type="left" onClick={this.handleBack} />
              <Title level={4}>Conversation with {conversationWithName} </Title>
            </div>}
          visible={visible}
          //             onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={[
            <div key="1">
              <ThreadFooter handleSubmit={this.handleSubmit} key />
            </div>
          ]}

        >
          {

            !loading ?
              <>
                {
                  messageList.map((message, i) => (
                    <div key={i}>
                      <Chat
                        _id={message._id}
                        justifyContent={message.justifyContent}
                        userId={message.userId}
                        message={message.message}
                        date={message.date}
                      />
                    </div>

                  ))
                }
                <div style={{ float: "left", clear: "both" }}
                  ref={(el) => { this.messagesEnd = el; }}>
                </div>
              </> :
              <Skeleton active paragraph={{ rows: 9 }} />

          }

        </Modal>
      </div>
    )
  }
}
export default withLastLocation(Thread);
