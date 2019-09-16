import React, { Component } from 'react';
import { Typography, Button, Input, Icon, message, Skeleton } from 'antd';
import { call } from '../../api';
import "./Name.css";
const { Title, Text } = Typography;


class Name extends Component {
    constructor(props) {
        super(props);
        const { firstName, lastName } = props;
        const name = firstName + " " + lastName;
        console.log(name)
        this.state = {
            editing: false,
            loading: false,
            name,
            userId: props.userId
        }
    }

    // static getDerivedStateFromProps(nextProps, prevState) {
    //     console.log(nextProps, prevState)
    //     if (prevState.firstName !== nextProps.firstName || prevState.lastName !== nextProps.lastName) {
    //         const { firstName, lastName } = nextProps;
    //         const name = firstName + " " + lastName;
    //         return {
    //             name
    //         }
    //     }
    //     return null;
    // }
    // componentWillReceiveProps(nextProps) {
    //     console.log(nextProps.firstName, this.props.firstName)
    //     if (this.props.firstName !== nextProps.firstName) {
    //         const { firstName, lastName } = nextProps;
    //         const name = firstName + " " + lastName;
    //         this.setState({
    //             name
    //         })
    //     }
    // }
    handleChange = (e) => {
        console.log(e.target.value)
        this.setState({
            name: e.target.value
        })
    }

    toggleEditing = () => {
        this.setState((state, props) => ({
            editing: !state.editing
        }))
    }

    handleUpdate = () => {
        const { userId } = this.props;
        const { name } = this.state;
        let split = name.split(" ");
        const firstName = split[0] || "";
        const lastName = split[1] || "";
        console.log(firstName, lastName)
        if (firstName && lastName) {
            this.setState({
                loading: true
            })
            call({
                method: "put",
                url: `/users/${userId}`,
                data: {
                    firstName,
                    lastName
                }
            })
                .then(data => {
                    console.log(data)
                    message.success(data.response[0].message)
                    this.setState((state, props) => ({
                        editing: !state.editing,
                        loading: false
                    }))
                })
                .catch(err => {
                    console.log(err)
                    // message.error(err.message)
                    this.setState((state, props) => ({
                        loading: false
                    }))
                })
        } else {
            message.error("Please enter your full name")
        }

    }

    render() {
        const { editing, name, loading, userId } = this.state;
        return (
            <div className="name">

                {
                    editing ?
                        <>
                            <Input onChange={this.handleChange} value={name} size="large" required />
                            <div className="name-buttons-div">
                                <Text type="secondary" onClick={this.toggleEditing} >Cancel</Text>
                                <Button type="primary" onClick={this.handleUpdate} icon={loading ? "loading" : null}>Update</Button>
                            </div>
                        </>
                        :

                        <div className="edit-name">
                            {
                                name ?
                                    <div>
                                        <Title level={2}>{name}</Title>
                                        {
                                            userId === localStorage.getItem("userId") ?

                                                <Text underline type="secondary" onClick={this.toggleEditing} className="edit">Edit</Text>
                                                : null
                                        }
                                    </div>

                                    :
                                    userId === localStorage.getItem("userId") ?
                                        <Text type="secondary" onClick={this.toggleEditing} >Your name</Text>
                                        : null
                            }
                        </div>



                }

            </div>

        )
    }
}

export default Name;