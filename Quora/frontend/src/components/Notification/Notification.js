import React, { Component } from 'react'
import { List, Avatar, Typography } from 'antd';
import { withRouter } from 'react-router-dom';
import { call } from '../../api';
import "./Notification.css";
const data = [{
    notificationId: "sdjbkcjnsd",
    notification: "<NAME> answered a Question",
    question: {
        userId: "1",
        firstName: "Bhaskar",
        lastName: "Gurram",
        question: "What is your name?",
        questionId: "234"
    },
    createdAt: 12345678,
}, {
    notificationId: "sdjbkcjnsd",
    notification: "<NAME> answered a Question",
    question: {
        userId: "1",
        firstName: "Bhaskar",
        lastName: "Gurram",
        question: "What is your name?",
        questionId: "234"
    },
    createdAt: 12345678,
}]

const { Text } = Typography;

class Notification extends Component {
    state = {
        notifications: []
    }
    componentDidMount() {
        let userId = localStorage.getItem("userId")
        call({
            method: 'get',
            url: `/users/${userId}/notifications`
        })
            .then(data => {
                console.log(data)
                this.setState({
                    notifications: data.notifications
                })
            })
            .catch(err => {
                console.log(err)
            })
        // setInterval(() => {
        //     call({
        //         method: 'get',
        //         url: `/users/${userId}/notifications`
        //     })
        //         .then(data => {
        //             console.log(data)
        //             this.setState({
        //                 notifications: data.notifications
        //             })
        //         })
        //         .catch(err => {
        //             console.log(err)
        //         })
        // }, 10000)


    }

    handleQuestionClick = (id) => {
        const { history, handleItemClick } = this.props;
        history.push(`/question/${id}`)
        handleItemClick(false);
    }

    handleNameClick = (id) => {
        const { history, handleItemClick } = this.props;
        history.push(`/profile/${id}`)
        handleItemClick(false);
    }
    render() {
        const { notifications } = this.state;
        return (
            <div className="notification">
                <List
                    bordered
                    dataSource={notifications}
                    renderItem={item => (
                        <List.Item>
                            <List.Item.Meta
                                avatar={<Avatar src={`https://s3.ap-south-1.amazonaws.com/checkapp-dev/profiles/${item.question.userId}`} />}
                                title={<div className="title">
                                    <Text className="name" strong onClick={() => this.handleNameClick(item.question.userId)}>
                                        {item.question.firstName + " " + item.question.lastName}
                                    </Text>
                                    &nbsp;
                                    {item.notification.replace("<NAME>", "")}
                                    &nbsp;
                                <Text className="question" strong onClick={() => this.handleQuestionClick(item.question.questionId)}>
                                        {item.question.question}
                                    </Text>
                                </div>}

                            />
                        </List.Item>
                    )}
                />
            </div>
        )
    }
}


export default withRouter(Notification);