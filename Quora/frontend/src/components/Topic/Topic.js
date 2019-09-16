import React, { Component } from 'react';
import { Row, Col, Menu, Icon, Card, Typography, Avatar, Button, Tabs, Skeleton } from 'antd';
import { withRouter } from 'react-router-dom'
import './Topic.css';
import { call } from '../../api';
import BottomScrollListener from 'react-bottom-scroll-listener';
import { TestDisplayQuestion } from '../DisplayQuestion/DisplayQuestion';
const { Title, Text } = Typography;
const TabPane = Tabs.TabPane;



class Topic extends Component {
    state = {
        data: [],
        pageNumber: 1,
        allDataFetched: false,
        tab: "read",
        topicText: "",
        loadingTopicText: true
    };

    setData = (response) => {
        let { data, allDataFetched, pageNumber } = this.state;
        console.log(response)

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
                allDataFetched,
                loading: false
            })
        }
    }

    call = () => {
        let { tab, pageNumber } = this.state;
        if (tab === "read") {
            call({
                method: 'get',
                url: `/userfeeds?page=${pageNumber}&topic=${this.props.match.params.id}`
            })
                .then(response => {
                    response = response.data
                    this.setData(response)

                })
                .catch(err => {
                    console.log(err)
                })
        } else {
            call({
                method: 'get',
                url: `/topicQuestions?page=${pageNumber}&topic=${this.props.match.params.id}`
            })
                .then(response => {
                    response = response.data.map(d => ({
                        hasAnswer: false,
                        ...d
                    }))
                    this.setData(response)
                })
                .catch(err => {
                    console.log(err)
                })
        }

    }
    getTopicName = () => {
        console.log(this.props.match.params.id)
        call({
            method: 'get',
            url: `/topics/${this.props.match.params.id}`
        })
            .then(response => {
                console.log(response)
                this.setState({
                    topicText: response.topic.topicText,
                    loadingTopicText: false,
                    following: response.topic.following
                })
            })
            .catch(err => {
                console.log(err)
            })
    }
    componentDidMount() {
        console.log("componentdidmount")
        this.getTopicName()
        this.call()
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.match.params.id !== this.props.match.params.id) {
            // const id = nextProps.match.params.id
            this.getTopicName()
            this.call()
        }
    }
    handleClick = ({ key }) => {
        this.setState({
            selected: key
        })
    }
    handleScrollToBottom = () => {
        const { allDataFetched } = this.state;
        if (!allDataFetched)
            this.call()
        console.log("botton")
    }
    handleFollowClick = () => {
        const topicId = this.props.match.params.id;
        const { following } = this.state;
        const { topicText } = this.state
        const userId = localStorage.getItem("userId");
        console.log(topicId)

        if (!following) {
            call({
                method: "post",
                url: `/users/${userId}/topic`,
                data: {
                    topicId: this.props.match.params.id
                }
            })
                .then(response => {
                    console.log(response)
                    this.setState({
                        following: true
                    })
                })
        } else {
            call({
                method: "delete",
                url: `/users/${userId}/topic`,
                data: {
                    topicId: this.props.match.params.id
                }
            })
                .then(response => {
                    console.log(response)
                    this.setState({
                        following: false
                    })
                })
                .catch(err => {
                    console.log(err)
                })
        }

    }

    onTabChange = (key) => {
        console.log(key)
        this.setState({
            pageNumber: 1,
            tab: key,
            data: []
        }, () => {
            this.call()
        })
    }
    render = () => {
        const { data, loading, loadingTopicText, following, topicText } = this.state;
        console.log(data)
        const cardContent = <div>
            <Row gutter={24}>
                {
                    loadingTopicText ?
                        <Skeleton active />
                        :
                        <>
                            <Col span={6}>
                                <img alt="" style={{ width: "100%" }} src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />
                            </Col>
                            <Col span={18}>
                                < Title level={2}>{topicText} </Title>
                                <Button icon={following ? "check" : "info"} type="primary" ghost onClick={this.handleFollowClick}>{following ? "Following" : "Follow"}</Button>
                            </Col>
                        </>
                }
            </Row>


        </div>


        return (
            <div className="topic">
                <Card className="card">
                    {cardContent}

                    <Tabs defaultActiveKey="read" onChange={this.onTabChange}>
                        <TabPane tab="Read" key="read">
                            {
                                loading ?
                                    <Skeleton active /> :
                                    <>
                                        <TestDisplayQuestion data={data} />
                                        <BottomScrollListener onBottom={this.handleScrollToBottom} />
                                    </>
                            }
                        </TabPane>
                        <TabPane tab="Answer" key="answer">
                            {
                                loading ?
                                    <Skeleton active />
                                    :
                                    <>
                                        <TestDisplayQuestion data={data} />
                                        <BottomScrollListener onBottom={this.handleScrollToBottom} />
                                    </>
                            }

                        </TabPane>
                    </Tabs>

                </Card>
            </div>
        );
    };
}


export default withRouter(Topic);