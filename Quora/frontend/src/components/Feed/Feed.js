import React, { Component } from 'react';
import { Row, Col, Menu, Icon, Card, Typography, Avatar } from 'antd';
import jwtDecode from 'jwt-decode'
import './Feed.css';
import { call } from '../../api';
import BottomScrollListener from 'react-bottom-scroll-listener';
import { DisplayQuestion } from '../DisplayQuestion/DisplayQuestion';
import { AskQuestion } from './../AskQuestion/AskQuestion.js'
const { Title, Text } = Typography;




class Feed extends Component {
    state = {
        data: [],
        pageNumber: 1,
        allDataFetched: false,
        addQuestion: false
    };

    handleRedirection = (questionId) => {
        // this.props.history.push('/question/' + questionId);
        window.open('/question/' + questionId);
    }

    setData = () => {
        let { data, allDataFetched, pageNumber } = this.state;

        call({
            method: 'get',
            url: `/userfeeds?page=${pageNumber}`
        })
            .then(response => {
                console.log(response)
                response = response.data
                if (response.length === 0) {
                    allDataFetched = true
                    this.setState({
                        allDataFetched
                    })
                } else {

                    data = data.slice(0)
                    console.log(response)
                    pageNumber += 1;
                    Array.prototype.push.apply(data, response);
                    console.log(data)

                    this.setState({
                        data,
                        pageNumber,
                        allDataFetched
                    })
                }
            })
            .catch(err => {
                console.log(err)
            })
    }


    componentDidMount() {
        this.setData()
    }
    handleClick = ({ key }) => {
        this.setState({
            selected: key
        })
    }
    handleScrollToBottom = () => {
        const { allDataFetched } = this.state;
        if (!allDataFetched)
            this.setData()
        console.log("botton")
    }

    handleShowAddQuestion = (newQuestionId = null) => {
        console.log('IN SHOW ADD QUESTION');
        this.setState({
            addQuestion: !this.state.addQuestion
        })
        // console.log('New question ', newQuestionId);
        if (newQuestionId !== undefined && newQuestionId !== null) {

            console.log('in ifff ', newQuestionId);

            this.props.history.push('/question/' + newQuestionId);
            window.location.reload();
        }
    }

    render = () => {
        const { data, topics } = this.state;
        console.log(data)
        let userId = localStorage.getItem("userId");
        let userName = localStorage.getItem("userName");
        let profileCredential = localStorage.getItem("profileCredential");
        let profileImage = '/users/' + userId + '/image/';
        let user = localStorage.getItem("user")
        console.log(user)

        const cardContent = <div className="pointer" onClick={() => { this.handleShowAddQuestion() }}>
            <Avatar src={`https://s3.ap-south-1.amazonaws.com/checkapp-dev/profiles/${userId}`} />
            {/* < Text >{`${user.firstName} ${user.lastName}`}</Text> */}
            <Text style={{ marginLeft: "10px" }}>{userName}</Text>
            <Title level={4} className="text_color_black" style={{ marginTop: 0, opacity: 0.5 }}>What is your question?</Title>
            <AskQuestion handleShowAddQuestion={this.handleShowAddQuestion} visible={this.state.addQuestion} userId={userId} userName={userName} profileCredential={profileCredential} />
        </div>


        return (
            <div className="home">
                <Card bodyStyle={{ padding: 7, paddingLeft: 10 }} className="card" >
                    {cardContent}
                </Card>
                {/* <TestDisplayQuestion data={data} /> */}
                {data.map((question) => {
                    return (
                        <Card className="card marginTop-l" bodyStyle={{ paddingTop: 10, paddingBottom: 0, paddingLeft: 4, paddingRight: 4 }}>
                            <Col span={24} >
                                <DisplayQuestion data={question} handleRedirection={this.handleRedirection} />
                            </Col>
                        </Card>
                    )
                })}
                <BottomScrollListener onBottom={this.handleScrollToBottom} />
            </div>
        );
    };
}


export default Feed;