import React, { Component } from 'react'
import { call } from '../../api'
import { TestDisplayQuestion } from '../DisplayQuestion/DisplayQuestion';
import { Skeleton } from 'antd';


class UserQuestions extends Component {
    state = {
        data: [],
        loading: true
    }
    componentDidMount() {
        const userId = localStorage.getItem("userId")
        call({
            method: 'get',
            url: `/users/${userId}/questions`
        })
            .then(response => {

                console.log(response)
                this.setState({
                    data: response.data.map(d => ({
                        hasAnswer: false,
                        ...d
                    })),
                    loading: false
                })
            })
            .catch(err => {
                console.log(err)
            })
    }
    render() {
        const { data, loading } = this.state;
        return (
            <div>
                {
                    loading ?
                        <Skeleton active /> :

                        <TestDisplayQuestion data={data} />
                }
            </div>
        )
    }
}

export default UserQuestions;