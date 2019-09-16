import React, { Component } from 'react'
import { Input, List, Avatar, Icon, Typography } from 'antd';
import URL from '../../constants';
import { call } from '../../api';

import "./PeopleSearch.css"

const { Text } = Typography;


function debounce(fn, delay) {
    let timerId;
    return function (...args) {
        if (timerId) {
            clearTimeout(timerId);
        }
        timerId = setTimeout(() => {
            fn(...args);
            timerId = null;
        }, delay);
    }
}

class PeopleSearch extends Component {
    constructor() {
        super();
        this.state = {
            loading: false,
            data: [],
            user: {}
        }
        // this.deboucedChange = debounce(this.handleChange.bind(this), 300)
    }


    debounceChange = debounce((text) => {
        if (text.length > 2) {

            this.setState({
                loading: true
            })
            call({
                method: "get",
                url: `/conversations/sendto?q=${text}&limit=5`
                // conversations/sendto?q=wef&limit=1&token={{token}}
            })
                .then(data => {
                    data = data.users;
                    this.setState({
                        loading: false,
                        data
                    })
                })
                .catch(err => {
                    console.log(err)
                    this.setState({
                        loading: true
                    })
                })
        }
    }, 300)

    handleClick = (item) => {
        const { handleClick } = this.props;
        this.setState({
            data: [],
            user: item
        })
        handleClick(item.userId)
    }

    handleClearSelection = () => {
        this.setState({
            user: {}
        })
    }

    render() {
        const { loading, data, user } = this.state;
        console.log(data)
        return (
            <div className="people-search">
                {
                    Object.keys(user).length > 0 ?
                        <>
                            <Avatar src={`https://s3.ap-south-1.amazonaws.com/checkapp-dev/profiles/${user.userId}`} />
                            <Text>{user.firstName + " " + user.lastName} </Text>
                            <a onClick={this.handleClearSelection}> Change </a>
                        </>
                        :
                        <Input
                            onChange={(e) => this.debounceChange(e.target.value)}
                            placeholder="Please enter minimun 3 characters to start searching"
                        />
                }
                {loading ? <Icon type="loading" /> : null}
                {
                    data.length > 0 ?
                        <List
                            className="list"
                            itemLayout="horizontal"
                            dataSource={data}
                            renderItem={item => (
                                <List.Item onClick={() => this.handleClick(item)}>
                                    <List.Item.Meta
                                        avatar={<Avatar src={`https://s3.ap-south-1.amazonaws.com/checkapp-dev/profiles/${user.userId}`} />}
                                        title={<a >{"  " + item.firstName + " " + item.lastName} </a>}
                                        description={item.profileCredential}
                                    />
                                </List.Item>
                            )}
                        /> :
                        null
                }

            </div>
        )
    }
}

export default PeopleSearch;