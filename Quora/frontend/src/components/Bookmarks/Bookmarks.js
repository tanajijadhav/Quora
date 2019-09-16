import React, { Component } from 'react';
import { Row, Col, Menu, Icon, Card, Typography, Avatar } from 'antd';
import jwtDecode from 'jwt-decode'
import './Bookmarks.css';
import { call } from '../../api';
import BottomScrollListener from 'react-bottom-scroll-listener';
import { TestDisplayQuestion } from '../DisplayQuestion/DisplayQuestion';

const { Title, Text } = Typography;




class Bookmarks extends Component {
    state = {
        data: [],
        pageNumber: 1,
        allDataFetched: false,

    };

    setData = () => {
        let { data, allDataFetched, pageNumber, selected } = this.state;
        let userId = localStorage.getItem("userId")
        call({
            method: 'get',
            url: `/users/${userId}/bookmarkedAnswers?page=${pageNumber}`
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
    render = () => {
        const { data } = this.state;
        console.log(data)

        return (
            <div className="home">
                <Card className="card">
                    <TestDisplayQuestion data={data} />
                    <BottomScrollListener onBottom={this.handleScrollToBottom} />
                </Card>
            </div>
        );
    };
}


export default Bookmarks;