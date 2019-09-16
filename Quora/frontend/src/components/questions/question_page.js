import React, { Component } from 'react';
import 'antd/dist/antd.css';
import { Row, Col } from 'antd';

import axios from 'axios';
import { post, get } from './../../api.js';
import moment from 'moment';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Typography, Avatar, Icon, Modal, Button, Skeleton, Spin, message, Checkbox } from 'antd';
import { AskQuestion } from './../AskQuestion/AskQuestion.js';
import './../../style.css';
import { Answer, AnswererInfo } from './../answer/Answer.js';
import { Input } from 'antd';

const { TextArea } = Input;
const { Title, Text } = Typography;

class QuestionPage extends Component {

    state = {
        result: null,
        thisUserData: null,
        new_answer: '',
        addNewAnswer: false,
        submitAnswerLoading: false,
        userHasAnswered: false,
        related_questions: [],
        addQuestion: false,
        isAnonymous: false,
        userIsFollowingTheQuestion: null
    };

    componentDidMount = () => {
        console.log('IN CDM ', this.props.match.params.id);
        this.getQuestionAndAnswers();

    }

    getQuestionAndAnswers = () => {
        let component = this;
        let url = '/questions/'
        // let question_id = '  977716b0-695d-11e9-99d1-6fafc8c77cbc';
        let question_id = this.props.match.params.id;
        console.log('question ID for get ', question_id);
        let onSuccess = (response) => {
            // console.log('gOT Response ', response);
            console.log('Result : ', response.data.data);
            let result = response.data.data;
            let thisUserData = {
                userName: result.userName,
                profileCredential: result.profileCredential,
                userId: result.userId
            }

            this.getRelatedQuestions(result);

            component.setState({
                result: result,
                userHasAnswered: response.data.data.userHasAnswered,
                userIsFollowingTheQuestion: response.data.data.userIsFollowingTheQuestion,
                thisUserData: thisUserData
            });

        }

        let onFailure = (error) => {
            console.log('Error msg ', error.response.data);
        }

        get(url, question_id, onSuccess, onFailure);

        // let result = {
        //     questionId: 2,
        //     questionText: "What's the most satisfying thing about working as a computer programmer?",
        //     userIsFollowingTheQuestion: false,
        //     profileCredential: "Hrishikesh Waikar, Love building systems that transform my surroundings.",
        //     userId: '12345',
        //     userHasAnswered: false,
        //     followersCount: 10,
        //     topics: ['Computer Science', 'Programming', 'Sc'],
        //     answers: [
        //         {
        //             answerId: 1,
        //             isAnonymous: false,
        //             profileCredential: "Roger Scott, Product Architect at GammaTech, Inc. (2015-present)",
        //             createdAt: '2018-04-10T10:20:30Z',
        //             answererId: 21,
        //             answerText: "As an engineer, I like to build things. I’m also not very patient. Programming is then a good occupation because I can build interesting things that work much more quickly (and cheaply, at least in terms of materials) than I would be able to do in pretty much any other engineering discipline. I also like to help other people (you know, the whole messiah complex thing ;->), so seeing my work used by others is gratifying.",
        //             upvotes: 252,
        //             downvotes: 50,
        //             userUpvoted: false,
        //             userDownvoted: false,
        //             comments: [],
        //             userBookmarked: false,
        //             userIsFollowingAnswerer: false
        //         },
        //         {
        //             answerId: 2,
        //             isAnonymous: false,
        //             profileCredential: "Mason Porter, Professor, Department of Mathematics, UCLA",
        //             createdAt: '2017-02-17T10:20:30Z',
        //             answererId: 45,
        //             answerText: "Knowledge is not a scalar quantity, so I can’t answer this question in precisely the way that it was asked. (It is not well-defined in such broad, all-encompassing terms.) Obviously, for every student with whom I have ever interacted, there will exist a topic — presumably a large number of topics — about which they know more than me. Whether this topic has anything to do with, for example, a course that I am teaching is another story entirely. I have certainly had students who know more than me about specific topics, especially when I teach advanced courses (e.g., with Ph.D. students taking it). For example, I teach a graduate-level networks courses, and I expect the statistics Ph.D. students in it to know more about statistical methods than I do, as the focus of their studies is different from my main expertise. And when it comes to research advisees, I not only have had students who know more than me about many topics, I expect all such students — and I do mean literally all of them — to ultimately know their specific topics (e.g., of their dissertation or of the papers on which they are first author) better than I do. They are the ones leading the project, whereas I am the mentor. So, yes, in the senses that I indicated above, I have had numerous students who “know more” than I do.  Thanks for the A2A.",
        //             upvotes: 100,
        //             downvotes: 0,
        //             userUpvoted: true,
        //             userDownvoted: false,
        //             comments: [],
        //             userBookmarked: true,
        //             userIsFollowingAnswerer: true

        //         }
        //     ]
        // }
        // var delayInMilliseconds = 2000; //1 second

        // let thisUserData = {
        //     profileName: 'Hrishikesh',
        //     profileCredential: result.profileCredential,
        //     userId: result.userId,
        // }

        // setTimeout(function () {
        //     //your code to be executed after 1 second
        //     component.setState({ result: result, userHasAnswered: result.userHasAnswered, thisUserData: thisUserData });
        // }, delayInMilliseconds);

    }


    getRelatedQuestions = (result) => {

        get('/topicQuestions?page=1&topic=', result.topics[0].topicId,
            (response) => {
                console.log('Got questions related to topic ', response.data.data);

                this.setState({
                    related_questions: response.data.data
                })

            }, () => { })



        // let related_questions = [
        //     {
        //         'id': 2,
        //         'questionText': 'What is the programming language of your choice?'
        //     },
        //     {
        //         'id': 3,
        //         'questionText': 'Why does everybody love coding in python?'
        //     },
        //     {
        //         'id': 3,
        //         'questionText': 'What makes one a good programmer - skills or logic?'
        //     },
        //     {
        //         'id': 4,
        //         'questionText': 'Which one is better for building secured applications, Python or java?'
        //     },
        //     {
        //         'id': 5,
        //         'questionText': 'How does a python program convert into machine level set of instructions??'
        //     },
        //     {
        //         'id': 6,
        //         'questionText': 'What is the difference between compiled and interpreted langauge? Which one is better for critical systems?'
        //     },
        //     {
        //         'id': 7,
        //         'questionText': 'Why is there a language named after a mathematician Ada Lovelace?'
        //     },
        //     {
        //         'id': 8,
        //         'questionText': 'Is C really better than python for competitive programming?'
        //     },
        // ]

        // this.setState({
        //     related_questions
        // })
    }

    handleShowAddQuestion = (newQuestionId = null) => {
        // console.log('IN SHOW ADD QUESTION');
        this.setState({
            addQuestion: !this.state.addQuestion
        })
        // console.log('New question ', newQuestionId);
        if (newQuestionId !== undefined && newQuestionId !== null) {
            this.props.history.push('/question/' + newQuestionId);
            window.location.reload();
        }
    }

    handleNewAnswerChange = (value) => {
        console.log("In handle ans change ", value);
        this.setState({ new_answer: value });
    }

    handleSubmitAnswer = () => {
        let answer = this.state.new_answer;
        let component = this;
        //make an api call to submit the answer
        if (this.state.answerText === null && this.state.answerText === '') {
            message.error('Please provide an answer');
        }

        console.log('Result ', this.state.result);
        let data = {
            questionId: this.state.result.questionId,
            answerText: this.state.new_answer,
            isAnonymous: this.state.isAnonymous
        }

        console.log('DataBoyyy  ', data);

        post('/answers', data, (response) => {
            console.log('pOSTED SUCCESSFULLY ')
            console.log('gOT Response ', response);
            console.log('Result : ', response.data.data);
            this.setState({
                new_answer: '',
                userHasAnswered: true,
                addNewAnswer: false
            });
            // this.getAnotherResult();
            message.success('Answer posted successfully');

            this.getQuestionAndAnswers();
            // component.setState({
            //     userHasAnswered: true
            // });

        }, () => {

        })
        //in successs
        // this.setState({
        //     new_answer: '',
        //     userHasAnswered: true,
        //     addNewAnswer: false
        // });
        // this.getAnotherResult();
        // message.success('Answer posted successfully');
    }

    handleUserWantsToAnswer = () => {
        this.setState({
            addNewAnswer: !this.state.addNewAnswer
        })
    }

    handleFollowQuestion = () => {
        let component = this;
        let userIsFollowingTheQuestion = this.state.userIsFollowingTheQuestion;
        let update = !userIsFollowingTheQuestion;
        let questionId = this.state.result.questionId;
        let data = {
            "isFollow": update,
            "questionId": questionId
        }

        post('/questions/' + questionId + '/follow/', data, (response) => {
            console.log('got success in fpollow ');
            component.setState({
                userIsFollowingTheQuestion: update
            });
        }, () => {
            message.error('Error in following');
        })

    }

    handleOnRelatedQuestionClick = (questionId) => {
        console.log('IN handle relatedd qu click');
        this.props.history.push('/question/' + questionId);
        window.location.reload();
    }

    onAnonymousChange = () => {
        // console.log('In onchange anonymou');
        this.setState({
            isAnonymous: !this.state.isAnonymous
        })
    }

    render = () => {
        let result = this.state.result;
        // console.log('Result in render ', result);

        return (
            <div>
                <Row className="marginTop-l text_color_black">
                    <Col span={15}>
                        <Row>
                            {result != null
                                ?
                                <Title level={3} className="quora_question_text">{result.questionText}</Title>
                                :
                                <>
                                    <Skeleton active />
                                </>
                            }

                        </Row>

                        <Row type="flex" justify="start" align="top">
                            <Col span={4}>
                                {result !== null ?
                                    <Button shape="round" icon="edit" size="small" className="no_border pointer" onClick={this.handleUserWantsToAnswer} style={{ paddingLeft: 0 }} disabled={this.state.userHasAnswered}>
                                        Answer
                                    </Button>
                                    : null}
                            </Col>
                            <Col span={4}>
                                {result !== null ? <Button shape="round" icon="wifi" size="small" className="no_border pointer" style={{ paddingLeft: 0 }} onClick={this.handleFollowQuestion} disabled={result.userIsFollowingTheQuestion}>Follow &nbsp;·&nbsp;{result.followersCount}</Button> : null}
                            </Col>
                        </Row>


                        {this.state.addNewAnswer === true ?

                            <>
                                <Row className="bg_color_light_gray paddingLeft-s marginTop-m">
                                    <AnswererInfo answererId={result.userId} userName={this.state.thisUserData.userName} profileCredential={result.profileCredential} cant_follow={true} />
                                </Row>
                                <Row style={{ paddingBottom: 48, marginBottom: 27 }} className="marginBottom-l">

                                    <ReactQuill value={this.state.new_answer}
                                        style={{ height: 100 }}
                                        theme="snow"
                                        onChange={this.handleNewAnswerChange}
                                        modules={QuestionPage.modules}
                                        formats={QuestionPage.formats}
                                    />
                                </Row>
                                <Row className="marginTop-l" type="flex" justify="start">
                                    <Col><Button type="primary" size="small" className="quora_button_blue pointer" onClick={this.handleSubmitAnswer}>
                                        Submit
                                    </Button></Col>
                                    <Col offset={1}>
                                        <Checkbox className="" onChange={this.onAnonymousChange} value={this.state.isAnonymous}>Answer Anonymously</Checkbox>
                                    </Col>
                                </Row>
                            </>
                            :
                            null
                        }


                        <Row className="marginTop-m paddingTop-s">
                            {result !== null
                                ?
                                <Text strong>{result.answers.length} Answers</Text>
                                :
                                <>
                                    <hr />
                                    <Spin className="marginTop-l" size="large" />

                                </>
                            }

                        </Row>

                        <Row className="marginTop-m">
                            {result !== null
                                ?
                                result.answers.map((answer) => {
                                    return (
                                        <Answer data={answer} thisUserData={this.state.thisUserData} />
                                    )
                                })
                                :
                                <Skeleton className="marginTop-l" active />
                            }

                        </Row>
                    </Col>
                    <Col offset={1} span={5}>
                        <Row className="marginTop-s">
                            <Text>Related Questions</Text>
                            <hr />
                        </Row>
                        {this.state.related_questions !== null
                            ?
                            this.state.related_questions.map((related_question) => {
                                if (related_question.questionId === this.state.result.questionId) {
                                    return null
                                } else {
                                    return (
                                        <Row className="marginTop-m paddingTop-s text_color_quora_blue font_size_xs pointer" onClick={() => { this.handleOnRelatedQuestionClick(related_question.questionId) }}>
                                            {related_question.questionText}
                                        </Row>
                                    )
                                }

                            })

                            :
                            <Skeleton className="marginTop-l" active />
                        }
                        <Row className="marginTop-m paddingTop-s">
                            <Button shape="round" icon="plus" size="small" className="no_border text_color_quora_blue font_bold pointer" style={{ paddingLeft: 0, fontSize: 13 }} onClick={() => { this.handleShowAddQuestion() }}>Ask New Question</Button>
                            {result !== null
                                ?
                                <AskQuestion handleShowAddQuestion={this.handleShowAddQuestion} visible={this.state.addQuestion} userId={result.userId} userName={this.state.thisUserData.userName} profileCredential={this.state.thisUserData.profileCredential} />
                                :
                                null
                            }

                        </Row>
                    </Col>
                </Row>
            </div>

        );
    };
}


/* 
 * Quill modules to attach to editor
 * See https://quilljs.com/docs/modules/ for complete options
 */
QuestionPage.modules = {
    toolbar: [
        [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
        [{ size: [] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' },
        { 'indent': '-1' }, { 'indent': '+1' }],
        ['link', 'image', 'video'],
        ['clean']
    ],
    clipboard: {
        // toggle to add extra line breaks when pasting HTML:
        matchVisual: true,
    }
}
/* 
 * Quill editor formats
 * See https://quilljs.com/docs/formats/
 */
QuestionPage.formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video'
]




export default QuestionPage;