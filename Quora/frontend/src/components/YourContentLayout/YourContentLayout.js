import React, { Component } from 'react'
import { Row, Menu, Col, Icon, Card, Divider, Typography, List } from 'antd'
import moment from 'moment';
import { call } from '../../api'

import './YourContentLayout.css';

const { Title } = Typography;

const data = [
    {
        question: "What is the question?",
        date: "29th August",
        _id: "1"
    },
    {
        question: "What is the question?",
        date: "29th August",
        _id: "2"
    },
    {
        question: "What is the question?",
        date: "29th August",
        _id: "3"
    },
    {
        answer: "This is the answer",
        date: "16th August",
        _id: "4"
    },
]

class YourContentLayout extends Component {

    state = {
        type: "all_types",
        year: "all_time",
        order_direction: "newest_first"
    }

    setData = (filter, key) => {
        const userId = localStorage.getItem("userId")
        console.log(filter);
        call({
            method: "get",
            url: `/user/${userId}/content?${filter}`
        })
            .then(response => {
                console.log(response)
                this.setState({
                    data: response.data,
                    ...key
                })
            })
            .catch(err => {
                console.log(err)
            })
    }
    componentDidMount() {
        this.setData("")
    }

    handleItemClick = (item) => {
        console.log(item)
    }

    handleTypeClick = ({ key }) => {
        console.log(key)
        const { order_direction, year } = this.state;
        let filter = `content_types=${key}&order_direction=${order_direction}&year=${year}`;

        this.setData(filter, {
            type: key
        })
    }
    hanleYearClick = ({ key }) => {
        const { order_direction, type } = this.state;
        let filter = `content_types=${type}&order_direction=${order_direction}&year=${key}`;

        this.setData(filter, {
            year: key
        })
    }

    hanldeSortClick = ({ key }) => {
        console.log(key)
        const { type, order_direction, year } = this.state;
        let filter = `content_types=${type}&order_direction=${key}&year=${year}`;

        this.setData(filter, {
            order_direction: key
        })
    }
    render() {
        const { type, order_direction, year, data } = this.state;
        return (
            <div className="your-content">
                <Row gutter={16}>
                    <Col span={5}>
                        <Title level={4} >By Content Type</Title>
                        <Divider />
                        <Menu
                            onClick={this.handleTypeClick}
                            defaultSelectedKeys={[type]}
                            mode="inline"
                        >
                            <Menu.Item key="all_types"> All Types</Menu.Item>
                            <Menu.Item key="questions_asked"> Questions Asked</Menu.Item>
                            <Menu.Item key="questions_followed"> Questions Followed</Menu.Item>
                            <Menu.Item key="answers">Answers</Menu.Item>
                        </Menu>
                        <Title level={4} >By Year</Title>
                        <Divider />
                        <Menu
                            onClick={this.hanleYearClick}
                            defaultSelectedKeys={[year]}
                            mode="inline"
                        >
                            <Menu.Item key="all_time">All Time</Menu.Item>
                            <Menu.Item key="2019">2019</Menu.Item>
                            <Menu.Item key="2018">2018</Menu.Item>
                            <Menu.Item key="2017">2017</Menu.Item>
                            <Menu.Item key="2016">2016</Menu.Item>
                        </Menu>
                        <Title level={4} >Sort Order</Title>
                        <Divider />
                        <Menu
                            onClick={this.hanldeSortClick}
                            defaultSelectedKeys={[order_direction]}
                            mode="inline"
                        >
                            <Menu.Item key="newest_first">Newest First</Menu.Item>
                            <Menu.Item key="oldest_first">Oldest First</Menu.Item>
                        </Menu>
                    </Col>
                    <Col span={14}>
                        {/* <Card className="card"> */}
                        <Title level={4} >Your Questions</Title>
                        <Divider />
                        <List
                            itemLayout="horizontal"
                            dataSource={data}
                            renderItem={item => (
                                <List.Item className="list-item" onClick={() => this.handleItemClick(item)}>
                                    <List.Item.Meta
                                        // avatar={<Avatar src={item.userId} />}
                                        title={<a >{item.answered ? "Your answer to " + item.questionText : item.questionText}</a>}
                                        description={moment(item.createdAt).format('MMMM Do YYYY, h:mm:ss a')}
                                    />
                                </List.Item>
                            )}
                        />

                        {/* </Card> */}
                    </Col>
                </Row>
            </div>
        )
    }
}

export default YourContentLayout;