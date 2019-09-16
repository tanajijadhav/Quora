import React, { Component } from 'react';
import 'antd/dist/antd.css';
import { Row, Col } from 'antd';

import axios from 'axios';
import { post, get } from './../../api.js';
import { Typography, Avatar, Icon, Button, Modal, Spin, message, Select } from 'antd';
import './../../style.css';
import { Answer, AnswererInfo } from './../answer/Answer.js';
import { Input } from 'antd';
const Option = Select.Option;
const { TextArea } = Input;

const { Title, Text } = Typography;


export class AskQuestion extends React.Component {
    state = {
        questionText: null,
        selectTopics: null,
        topics: [],
        disableTopics: true,
        selected_topics: []
    }

    handleOk = (e) => {
        console.log(e);
        // this.setState({
        //     visible: false,
        // });
        this.props.handleShowAddQuestion();
    }

    handleCancel = (e) => {
        console.log(e);
        // this.setState({
        //     visible: false,
        // });

        this.props.handleShowAddQuestion();
    }

    handleQuestionTextChange = (e) => {
        if (e.target.value.trim === "") {
            this.setState({
                disableTopics: true
            })
        } else {
            this.setState({
                disableTopics: false
            })
        };


        this.setState({
            questionText: e.target.value
        })
    }

    handleSelectTopicChange = (value) => {

        if (this.state.questionText === null || this.state.questionText.trim() === "") {
            message.error("Please provide a question first");
            return;
        }
        console.log('HANDLE topic ', value);
        this.setState({
            selected_topics: value
        })
    }

    componentDidMount = () => {
        this.getTopics();
    }

    getTopics = () => {
        // get a list of topics
        let topics_data = []
        console.log('Getting topics');
        get('/topics', '', (response) => {
            // console.log('Res ', response);
            // console.log('res data ', response.data);
            // console.log('res data ', response.data.data);
            topics_data = response.data.data;


            let topics = [];
            // console.log('Topucs  data', topics_data);
            for (let i = 0; i < topics_data.length; i++) {
                // console.log(topics_data[i]);
                topics.push(<Option key={topics_data[i].topicId}>{topics_data[i].topicText}</Option>);
            }

            // console.log('Topics ', topics);


            this.setState({
                topics: topics
            })
        }, () => {
            message.error('Error fetching topics');
        });


        // let topics_data = ['Programming', 'Computer Science', 'Software Engineering', 'Coding', 'Hacking', 'Mathematics', 'Amatuer Programmers', 'Competitive Programming', 'Hackathons'];
        // let topics_data = [
        //     {
        //         id: "91203ad",
        //         topicText: "Programming"
        //     },
        //     {
        //         id: "1239dd",
        //         topicText: "Computer Science"
        //     },
        //     {
        //         id: "92031",
        //         topicText: "Software Engineering"
        //     },
        //     {
        //         id: "1323039",
        //         topicText: "Coding"
        //     },
        //     {
        //         id: "003181982",
        //         topicText: "Hacking"
        //     }
        // ]


    }


    handleSubmitQuestion = () => {
        console.log('In handle SUbmit question ');
        let component = this;

        if (this.state.questionText === null || this.state.questionText.trim() === "") {
            message.error("Please provide a question first");
            return;
        }

        if (this.state.selected_topics.length < 1) {
            message.error("Please select a topic");
            return;
        }

        let data = {
            questionText: this.state.questionText,
            topics: this.state.selected_topics
        }


        post('/questions', data, (response) => {
            console.log('Got succcesss response on posting question ', response);
            message.success('Posted question successfully');
            let questionId = response.data.data;
            console.log('Question id ', questionId);
            this.props.handleShowAddQuestion(questionId);

        }, () => {
            message.error('Error posting question');
        })
    }

    render() {
        let visible = this.props.visible;
        let userId = this.props.userId;
        let profileCredential = this.props.profileCredential;
        let userName = this.props.userName;

        return (
            <div>
                <Modal
                    title={<Text className="text_color_quora_red">Add Question</Text>}
                    visible={visible}
                    bodyStyle={{ height: 230 }}
                    closable={true}
                    onCancel={this.handleCancel}
                    footer={[
                        <Text key="back" onClick={this.handleCancel} className="marginRight-l paddingRight-l text_color_quora_faint_text pointer">Cancel</Text>,
                        <Button key="submit" size="medium" className="text_color_white quora_button_blue pointer no_border" onClick={this.handleSubmitQuestion}>
                            Add Question
                        </Button>,
                    ]}
                >
                    <AnswererInfo profileImage={userId} userName={userName} profileCredential={profileCredential} cant_follow={true} />

                    <TextArea size="large" onChange={(e) => { this.handleQuestionTextChange(e) }} placeholder='Start your question with "What","How","Why",etc.' className="quora_new_question_text marginTop-m no_border" value={this.state.questionText} />

                    <Select
                        mode="tags"
                        style={{ width: '100%' }}
                        placeholder="Tag Topics"
                        className="marginTop-l"
                        disabled={this.state.disableTopics}
                        onChange={(e) => { this.handleSelectTopicChange(e) }}
                    >
                        {this.state.topics}
                    </Select>
                </Modal>
            </div >
        );
    }
}