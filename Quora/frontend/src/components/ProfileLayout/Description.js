import React, { Component } from 'react'
import { Typography, Input, Button, message } from 'antd';
import { call } from '../../api';

import './Description.css';
import App from '../../App';

const { TextArea } = Input;
const { Text, Title } = Typography;

class Description extends Component {
    state = {
        editing: false,
        description: this.props.description,
        editDescription: this.props.description,
        userId: this.props.userId
    }

    toggleEditing = () => {
        this.setState((state, props) => ({
            editDescription: state.description,
            editing: !state.editing
        }))
    }

    handleUpdate = () => {
        const { userId } = this.props;
        const { editDescription } = this.state;
        console.log("handleok")
        this.setState({
            loading: true
        })
        call({
            method: "put",
            url: `/users/${userId}`,
            data: {
                description: editDescription
            }
        })
            .then(data => {
                console.log(data)
                message.success(data.response[0].message)
                this.setState((state, props) => ({
                    editing: false,
                    description: state.editDescription
                }))
            })
            .catch(err => {
                console.log(err)
                message.error(err.message)
                this.setState((state, props) => ({
                    loading: false,

                }))
            })
    }

    handleChange = (e) => {
        console.log(e.target.value)
        this.setState({
            editDescription: e.target.value
        })
    }

    render() {
        const { editing, description, editDescription, userId } = this.state;
        return (
            <div className="description">

                {
                    editing ?
                        <>
                            <TextArea rows={4} onChange={this.handleChange} value={editDescription} />
                            <div className="description-buttons-div">
                                <Text type="secondary" onClick={this.toggleEditing} >Cancel</Text>
                                <Button type="primary" onClick={this.handleUpdate} >Update</Button>
                            </div>
                        </>
                        :

                        <div className="edit-description">
                            {
                                description ?
                                    <div>
                                        <Title level={4}>{description}</Title>
                                        {
                                            userId === localStorage.getItem("userId") ?

                                                <Text underline type="secondary" onClick={this.toggleEditing} className="edit">Edit</Text>
                                                : null
                                        }
                                    </div>

                                    :
                                    userId === localStorage.getItem("userId") ?
                                        <Text type="secondary" onClick={this.toggleEditing} >Write a description about yourself</Text>
                                        : null
                            }
                        </div>
                }

            </div>
        )
    }
}

export default Description;
