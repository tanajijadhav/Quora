import React, { Component } from 'react';
import { Row, Col, Card, Typography, Avatar, Menu, Icon, Empty } from 'antd';
import './AnswerLayout.css';
import { call } from '../../api';
import { TestDisplayQuestion } from '../DisplayQuestion/DisplayQuestion';
import BottomScrollListener from 'react-bottom-scroll-listener';

const { Title, Text } = Typography;



class AnswerLayout extends Component {
    state = {
        selected: "questions",
        data: [],
        allDataFetched: false,
        pageNumber: 1
    };
    componentDidMount() {
        this.setData();
    }

    handleClick = ({ key }) => {
        this.setState({
            selected: key
        })
    }

    handleScrollToBottom = () => {
        this.setData();
    }
    setData = () => {
        let { data, allDataFetched, pageNumber } = this.state;
        console.log(data)
        if (!allDataFetched) {
            call({
                method: 'get',
                url: `/topicQuestions?page=${pageNumber}`
            })
                .then(response => {
                    console.log(response)
                    response = response.data.map(d => ({
                        hasAnswer: false,
                        ...d
                    }))
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
    }

    render = () => {
        const { data } = this.state;
        const profileImage = null;
        const avatar = profileImage ? <Avatar size="small" src={profileImage} /> : <Avatar size="small" icon="user" />;


        return (
            <div className="home">
                <Row gutter={16}>
                    <Col span={4}>
                        <Menu
                            onClick={this.handleClick}
                            defaultSelectedKeys={["questions"]}
                            mode="inline"
                        >
                            <Menu.Item key="questions"><Icon type="idcard" />Questions for you</Menu.Item>
                        </Menu>
                    </Col>
                    <Col span={14}>
                        {
                            data.length > 0 ?
                                <Card className="card"
                                    title="Questions"
                                >
                                    <TestDisplayQuestion data={data} />
                                    <BottomScrollListener onBottom={this.handleScrollToBottom} />
                                </Card> :
                                <Empty />
                        }
                    </Col>
                </Row>
            </div>
        );
    };
}


export default AnswerLayout;