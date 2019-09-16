import React, { Component } from 'react';
import 'antd/dist/antd.css';
import { Row, Col } from 'antd';

import axios from 'axios';
import { post, get, put } from './../../api.js';
import moment from 'moment';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Typography, Avatar, Icon, Button, Tooltip, Comment, message, Form, Input, Checkbox } from 'antd';
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';
import './../../style.css';
const { Title, Text } = Typography;
const TextArea = Input.TextArea;

export class Answer extends Component {
    state = {
        edit_answer: false,
        answerText: this.props.data.answerText
    }

    updateAnswerText = (answerText) => {
        console.log('In updateAnswer ', answerText)
        this.setState({
            answerText: answerText,
            edit_answer: false
        })
    }

    editAnswer = () => {
        this.setState({
            edit_answer: !this.state.edit_answer
        })
    }

    render = () => {
        let data = this.props.data;
        console.log('Answer data ', data);
        let cant_follow = this.props.data.cant_follow;
        // console.log('Comments ', comments);
        // console.log('Parse comments ', parseComments('1-0-0', null));

        // parseComments('1-0-0', 'I am awesome');
        // console.log('Updated comments ', comments);
        let showComments = true;
        if (this.props.showComments !== undefined) {
            showComments = this.props.showComments;
        }
        let answer_comments = null;

        if (data.comments !== null && data.comments !== undefined) {
            console.log('Data is not null');
            answer_comments = data.comments;
        }

        let userName = '';

        if (data.hasOwnProperty('answererName')) {
            userName = data.answererName;
        }

        // console.log('Render has got the answ ', this.state.answerText);
        let userIsFollowingAnswerer = this.props.data.userIsFollowingAnswerer;

        return (
            <div className="AnswerBase">
                <Row>
                    <AnswererInfo answererId={data.answererId} userName={userName} profileCredential={data.profileCredential} answerDate={data.createdAt} cant_follow={cant_follow} isAnonymous={data.isAnonymous} userIsFollowingAnswerer={userIsFollowingAnswerer} />
                </Row>
                <Row>
                    {this.state.edit_answer === true
                        ?
                        <EditAnswer data={data} answerText={this.state.answerText} updateAnswerText={this.updateAnswerText} />
                        :
                        <AnswerText data={data} answerText={this.state.answerText} />
                    }
                </Row>
                <Row>
                    <VotingAndBookMark data={data} editAnswer={this.editAnswer} edit_answer={this.state.edit_answer} />
                </Row>
                {showComments === true
                    ?
                    <Row>
                        <CommentFull answerId={data.answerId} comments={answer_comments} thisUserData={this.props.thisUserData} />
                    </Row>
                    :
                    null
                }

            </div>
        )
    }
}

class EditAnswer extends Component {

    state = {
        edited_answer: this.props.answerText,
        isAnonymous: this.props.data.isAnonymous
    }

    handleAnswerChange = (value) => {
        this.setState({
            edited_answer: value
        });
    }


    handleSubmitAnswer = () => {
        console.log('In handle submit answer ')
        message.success("Edited answer");
        this.props.updateAnswerText(this.state.edited_answer);
        let post_data = {
            answerId: this.props.data.answerId,
            answerText: this.state.edited_answer,
            isAnonymous: this.state.isAnonymous
        }

        put('/answers/' + this.props.data.answerId, post_data, (response) => {
            console.log('Response successs');
            message.success("Edited answer");
            this.props.updateAnswerText(this.state.edited_answer);
        }, () => {

            message.error('Error updating answer');
        })

    }

    onAnonymousChange = () => {
        this.setState({
            isAnonymous: !this.state.isAnonymous
        });
    }

    render = () => {
        return (
            <>
                <Row style={{ paddingBottom: 48, marginBottom: 27 }} className="marginBottom-l">
                    <ReactQuill value={this.state.edited_answer}
                        style={{ height: 100 }}
                        theme="snow"
                        onChange={this.handleAnswerChange}
                        modules={EditAnswer.modules}
                        formats={EditAnswer.formats}
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
        )
    }
}

export class AnswererInfo extends Component {
    state = {
        userIsFollowingAnswerer: this.props.userIsFollowingAnswerer
    }


    handleOnFollowClick = () => {
        let component = this;
        console.log('ON FOLLOW CLICK ')
        let updatedUserIsFollowingAnswerer = !this.state.userIsFollowingAnswerer;

        // make api call
        post('/follow/' + this.props.answererId, {}, (response) => {
            // in success
            message.success('You are following ' + this.props.userName);
            component.setState({
                userIsFollowingAnswerer: updatedUserIsFollowingAnswerer
            });
        }, () => { message.error('Error following') })

    }

    handleUnfollowClick = () => {
        let component = this;
        console.log('ON unFOLLOW CLICK ')
        let updatedUserIsFollowingAnswerer = !this.state.userIsFollowingAnswerer;

        // make api call
        post('/unfollow/' + this.props.answererId, {}, (response) => {
            // in success
            message.success('You have unfollowed ' + this.props.userName);
            component.setState({
                userIsFollowingAnswerer: updatedUserIsFollowingAnswerer
            });
        }, () => { message.error('Error following') })

    }
    render = () => {
        // let data = this.props.data;
        let answererId = this.props.answererId;
        let profileCredential = this.props.profileCredential;
        if (profileCredential === null || profileCredential === undefined || profileCredential === "" || profileCredential === "null") {
            profileCredential = "";
        } else {
            profileCredential = ", " + profileCredential;
        }

        let userName = this.props.userName;
        let answerDate = this.props.answerDate;
        var date = null;
        if (answerDate !== undefined && answerDate !== null) {
            date = moment(answerDate, moment.ISO_8601).format('MMM D, YYYY');

        }

        let thisUserId = localStorage.getItem("userId");

        let cant_follow = this.props.cant_follow;
        // let image_src = 'http://10.0.0.86:7836/v1/users/' + answererId + '/image/';

        // image_src = "https://qph.fs.quoracdn.net/main-thumb-16193221-200-EO9EO7XcPOETr1ZfTiWvDKKVxqAzgtzG.jpeg"
        let image_src = `https://s3.ap-south-1.amazonaws.com/checkapp-dev/profiles/${answererId}`
        let userIsFollowingAnswerer = this.state.userIsFollowingAnswerer;

        console.log('User is follwoing Answerer  ', userIsFollowingAnswerer);

        return (
            <>
                <Row className="text_color_black paddingTop-s paddingBottom-s" gutter={16} type="flex" justify="space-around" align="middle">
                    <Col span={2}>
                        {this.props.isAnonymous === true
                            ?
                            <Avatar size="large" />
                            :
                            <Avatar size="large" src={image_src} />
                        }

                    </Col>
                    <Col span={19}>
                        {this.props.isAnonymous === true
                            ?
                            <Row type="flex" justify="start" align="top">
                                Anonymous
                            </Row>
                            :
                            <Row type="flex" justify="start" align="top">
                                {userName} {profileCredential}
                            </Row>
                        }

                        {date !== null ?
                            <Row>
                                <Text className="font_size_xs text_color_quora_faint_text" disabled>Answered {date}</Text>
                            </Row>
                            :
                            <Row>{""}</Row>
                        }
                    </Col>
                    {answererId !== thisUserId
                        ?
                        <>
                            {userIsFollowingAnswerer === true
                                ?
                                <Col span={2}>
                                    <Avatar size="medium" icon="user-add" className="text_color_white bg_color_quora_blue pointer" style={{ backgroundColor: "#eaf4ff" }} onClick={this.handleUnfollowClick} />
                                </Col>
                                :
                                <Col span={2}>
                                    <Avatar size="medium" icon="user-add" className="text_color_blue pointer" style={{ backgroundColor: "#eaf4ff" }} onClick={this.handleOnFollowClick} />
                                </Col>

                            }
                        </>
                        :
                        <Col span={2}>
                        </Col>
                    }
                </Row>

            </>
        )
    }
}

const options = {
    decodeEntities: true,
    transform
}

function transform(node, index) {
    if (node.type === 'tag' && node.name === 'p') {
        node.attribs = { style: "margin-bottom: 0" };
        return convertNodeToElement(node, index, transform);
    }

    if (node.type === 'tag' && node.name === 'img') {
        return convertNodeToElement(node, index, transform);
    }
}


class AnswerText extends Component {
    render = () => {
        let data = this.props.data;
        // console.log('DATA IN ANSER TEXT ', data);

        return (<>
            <Row className="marginTop-m">
                <Text className="quora_answer_text">

                    {ReactHtmlParser(this.props.answerText, options)}
                    {/* {data.answerText} */}

                </Text>
            </Row>
            <Row className="marginTop-s">
                <Text className="font_size_xs">{data.noOfTimesViewed} Views</Text>
            </Row>
        </>)
    }
}

class VotingAndBookMark extends Component {

    state = {
        userUpvoted: this.props.data.userUpvoted,
        upvotes: this.props.data.upvotes,
        userDownvoted: this.props.data.userDownvoted,
        userBookmarked: this.props.data.userBookmarked,
        canEdit: false
    }

    componentDidMount = () => {
        console.log('in cdm of voting ');
        let userId = localStorage.getItem("userId");

        if (userId === this.props.data.answererId) {
            this.setState({
                canEdit: true
            })
        }

    }

    handleUpvoteChange = () => {
        let component = this;
        // console.log("In handle upvote change ");
        let userUpvoted = this.state.userUpvoted;
        let updatedUpvoteStatus = !userUpvoted;


        let answerId = this.props.data.answerId;
        let data = {
            "isUpvote": updatedUpvoteStatus,
            "answerId": answerId
        }

        post('/answers/' + answerId + '/vote', data, (response) => {
            console.log('sUCEESSFULL UPVOTE CHANGE ', response.data);

            // In success

            let upvotes = component.state.upvotes;

            if (updatedUpvoteStatus === false) {
                upvotes = upvotes - 1;
            } else {
                upvotes = upvotes + 1;
            }

            component.setState({
                userUpvoted: updatedUpvoteStatus,
                upvotes: upvotes
            });
        }, () => {
            message.error('Error in upvoting');
        })

    }


    handleDownVoting = () => {
        let component = this;

        let userDownvoted = this.state.userDownvoted;

        let updatedDownVoteStatus = !userDownvoted;
        let answerId = this.props.data.answerId;

        let data = {
            "isDownvote": updatedDownVoteStatus,
            "answerId": answerId
        }

        post('/answers/' + answerId + '/vote', data, (response) => {
            // console.log('sUCEESSFULL dowbvote CHANGE ', response.data);

            component.setState({
                userDownvoted: updatedDownVoteStatus
            })
            component.setState({
                userUpvoted: updatedDownVoteStatus
            });
        }, () => {
            message.error('Error in upvoting');
        });
    }


    handleBookMarking = () => {
        let component = this;
        let updatedBookMarkStatus = !this.state.userBookmarked;
        let answerId = this.props.data.answerId;
        // Make an api call
        let data = {
            "isBookmark": updatedBookMarkStatus,
            "answerId": answerId
        };

        post('/answers/' + answerId + '/bookmark', data, () => {
            component.setState({
                userBookmarked: updatedBookMarkStatus
            })
        }, () => {
            message.error('Failed bookmarking');
        })
    }

    render = () => {

        return (
            <>
                <Row className="marginTop-m" gutter={16}>
                    <Col span={3}>
                        {this.state.userUpvoted === true
                            ?
                            <Button shape="round" icon="caret-up" size="small" className="no_border text_color_blue pointer" style={{ paddingLeft: 0 }} onClick={this.handleUpvoteChange} onFocus={() => { }}>Upvoted &nbsp;·&nbsp;{this.state.upvotes}</Button>
                            :
                            <Button shape="round" icon="caret-up" size="small" className="no_border pointer" style={{ paddingLeft: 0 }} onClick={this.handleUpvoteChange} onFocus={() => { }}>Upvote &nbsp;·&nbsp;{this.state.upvotes}</Button>

                        }

                    </Col>
                    {this.state.canEdit
                        ?
                        <>
                            <Col offset={15} span={1}>
                                {this.state.userDownvoted === true
                                    ?
                                    <Button shape="circle" icon="caret-down" theme="filled" size="small" className="no_border text_color_blue pointer" onClick={this.handleDownVoting}></Button>
                                    :
                                    <Button shape="circle" icon="caret-down" theme="empty" size="small" className="no_border pointer" onClick={this.handleDownVoting}></Button>
                                }

                            </Col>


                            <Col span={3}>
                                {this.props.edit_answer === true
                                    ?
                                    <Button shape="round" icon="edit" size="small" className="no_border text_color_white bg_color_quora_red pointer paddingRight-m" onClick={this.props.editAnswer}>Edit</Button>
                                    :
                                    <Button shape="round" icon="edit" size="small" className="no_border text_color_blue pointer" onClick={this.props.editAnswer}>Edit</Button>
                                }

                            </Col>
                        </>
                        :
                        <Col offset={18} span={1} className="paddingRight-l marginRight-m">
                            {this.state.userDownvoted === true
                                ?
                                <Button shape="circle" icon="caret-down" theme="filled" size="small" className="no_border text_color_white bg_color_blue pointer" onClick={this.handleDownVoting}></Button>
                                :
                                <Button shape="circle" icon="caret-down" theme="empty" size="small" className="no_border pointer" onClick={this.handleDownVoting}></Button>
                            }

                        </Col>


                    }

                    <Col span={2}>
                        {this.state.userBookmarked === true
                            ?
                            <Button shape="circle" icon="book" size="small" className="no_border text_color_white bg_color_blue pointer" onClick={this.handleBookMarking} ></Button>
                            :
                            <Button shape="circle" icon="book" theme="filled" size="small" className="no_border pointer" onClick={this.handleBookMarking}></Button>
                        }

                    </Col>
                </Row>
            </>
        )
    }
}



class TextEditor extends Component {

    state = {
        value: ''
    }

    onChange = (e) => {
        // console.log('In onchange ', e.target.value)
        this.setState({
            value: e.target.value
        })
    }
    onSubmit = () => {
        // console.log('IN ON SUBMIT ');
        let thisUserData = this.props.thisUserData;
        this.props.updateComments(this.state.value, this.props.commentId);
        this.props.handleCommentReply();
    }
    render = () => {
        // console.log('In render of TEXT EDITOR ', this.props.thisUserData);
        // console.log(this.props.comment);
        let thisUserData = this.props.thisUserData;
        let thisUserId = localStorage.getItem("userId");
        let thisUserName = localStorage.getItem("userName");
        let thisprofileCredential = localStorage.getItem("profileCredential");
        return (<>
            <div>
                <AnswererInfo answererId={thisUserId} userName={thisUserName} profileCredential={thisprofileCredential} cant_follow={false} />
                <Form.Item style={{ marginBottom: 5 }}>
                    <TextArea placeholder="Add a comment..." autosize={{ minRows: 1, maxRows: 6 }} onChange={this.onChange} value={this.state.value} />
                </Form.Item>
                <Form.Item>
                    <Button
                        htmlType="submit"
                        onClick={this.onSubmit}
                        type="primary"
                        style={{ marginTop: 0, paddingTop: 0 }}
                    >
                        Add Comment
                 </Button>
                </Form.Item>
            </div>
        </>)
    }
}


class CommentComponent extends Component {

    state = {
        reply: false
    }

    handleCommentReply = () => {
        this.setState({
            reply: !this.state.reply
        });
    };

    render = () => {
        let props = this.props;
        let image_src = `https://s3.ap-south-1.amazonaws.com/checkapp-dev/profiles/${props.comment.userId}`
        return (<Comment
            actions={[<span onClick={() => { this.handleCommentReply(props.comment) }} style={{ marginBottom: 0 }}>Reply to</span>]}
            author={<a>{props.comment.userName}</a>}
            style={{ marginTop: '10px', marginBottom: 0, paddingTop: '0px', paddingBottom: '0px' }}
            avatar={(
                <Avatar
                    src={image_src}
                    alt={props.comment.userName}
                />
            )}
            content={<>{props.comment.commentText}

            </>}
        >
            {this.state.reply === true ? <TextEditor thisUserData={this.props.thisUserData} commentId={this.props.commentId} comment={props.comment} updateComments={this.props.updateComments} handleCommentReply={this.handleCommentReply} /> : null}
            {props.children}
        </Comment>)
    }

}



class CommentFull extends Component {

    state = {
        comments: this.props.comments,
        answer_comment: null,
        showButton: false,
        view_comments: false
    }

    parseComments = (search_id, new_comment) => {


        // convert the string to ['1', '1-0', '1-0-0']

        // how?
        var splits = search_id.split('-');
        // console.log('splits ', splits);

        var path = []
        let prev = null;
        for (var i = 0; i < splits.length; i++) {
            if (prev === null) {
                path.push(splits[i]);
                prev = splits[i];
            } else {
                path.push(prev + '-' + splits[i]);
                prev = prev + '-' + splits[i];
            }
        }

        // console.log('path ', path);

        // search for 1 in comments
        // in 1's child search for 1-0
        // in 1-0's child search for 1-0-0
        let original_comments = this.state.comments;
        let search_object = this.state.comments;
        let search_key_index = 0;
        let parent = null;
        let found_child = null;
        while (search_key_index < path.length) {
            // console.log('For search object: ', search_object);
            if (search_object.hasOwnProperty(path[search_key_index])) {
                // console.log('Found child ', search_object[path[search_key_index]]);
                found_child = search_object[path[search_key_index]];
                search_object = found_child.comments;

                search_key_index += 1;
            }
        }

        // console.log('Found comment: ', found_child.commentText)
        if (new_comment !== null) {
            var new_id_index = Object.keys(found_child.comments).length;

            console.log('new id ', search_id + '-' + new_id_index)
            var new_id = search_id + '-' + new_id_index;

            found_child.comments[new_id] = new_comment;

            // parseComments(new_id, null)
        }

        // console.log('Search object finally ', original_comments);
        // this.setState({
        //     comments: original_comments
        // })

        return original_comments
    }


    updateComments = (new_comment_text, parentCommentId) => {
        let thisUserId = localStorage.getItem("userId");
        let thisUserName = localStorage.getItem("userName");
        let thisprofileCredential = localStorage.getItem("profileCredential");
        // console.log('In update comments');
        let component = this;
        let new_comment = {
            commentText: new_comment_text,
            userName: thisUserName,
            profileCredential: thisprofileCredential,
            userId: thisUserId,
            comments: {}
        }
        // console.log('nEW COMMENT ', new_comment, ' ', typeof parentCommentId, ' ', parentCommentId)
        let updated_comments = this.parseComments(parentCommentId, new_comment)
        // console.log('Posting updated  comments ', updated_comments);

        // api call answer id,
        let post_data = {
            'comments': updated_comments,
            'answerId': this.props.answerId
        }

        // console.log('Post data for comments ', post_data);
        post('/answers/' + this.props.answerId + '/comments', post_data, (response) => {

            // do in success
            component.setState({
                comments: updated_comments,
                showButton: false,
                answer_comment: null,
                view_comments: true
            });

        }, () => { console.log('Error postging comment '); })
        // updated comment

        // make api call here
    }

    commentGenerator = (simple_comment_id, comment, thisUserData, updateComments) => {
        // console.log(' Comment ', comment);
        // console.log('Comment text ', comment.commentText);
        // console.log('Object keys ', Object.keys(comment.comments));
        return (
            <CommentComponent commentId={simple_comment_id} comment={comment} thisUserData={thisUserData} updateComments={updateComments}>
                {Object.keys(comment.comments).map((sub_comment_id) => {
                    return (this.commentGenerator(sub_comment_id, comment.comments[sub_comment_id], thisUserData, updateComments))
                })}
            </CommentComponent>
        )
    }

    onChange = (e) => {
        // console.log('E targe:', e.target.value, '.')
        if (e.target.value.trim() !== "") {
            this.setState({
                showButton: true,
                answer_comment: e.target.value
            })
        } else {
            this.setState({
                showButton: false,
                answer_comment: e.target.value
            })
        }
    }

    onSubmit = () => {
        // console.log('IN on submit ');
        let new_answer_comment = this.state.answer_comment;
        let thisUserData = this.props.thisUserData;
        let comments = this.state.comments;
        let thisUserId = localStorage.getItem("userId");
        let thisUserName = localStorage.getItem("userName");
        let profileCredential = localStorage.getItem("profileCredential");

        let new_comment = {
            commentText: new_answer_comment,
            userName: thisUserName,
            profileCredential: profileCredential,
            userId: thisUserId,
            comments: {}
        }
        let update = {};
        update[Object.keys(comments).length] = new_comment
        let updated_comments = Object.assign({}, comments, update);


        // api call answer id,
        let post_data = {
            'comments': updated_comments,
            'answerId': this.props.answerId
        }

        // console.log('Post data for comments ', post_data);
        post('/answers/' + this.props.answerId + '/comments', post_data, (response) => {

            // do in success
            this.setState({
                comments: updated_comments,
                showButton: false,
                answer_comment: null,
                view_comments: true
            });

        }, () => { console.log('Error postging comment '); })
        // updated comment


    }

    handleShowComments = () => {
        this.setState({
            view_comments: !this.state.view_comments
        })
    }

    render = () => {
        // console.log('REnder of Comments full ', this.state.comments);
        return (

            <>
                <Form.Item style={{ marginBottom: 5 }}>
                    <Row>
                        <Col span={18}>
                            <TextArea size="small" placeholder="Add a comment..." autosize={{ minRows: 1, maxRows: 6 }} onChange={this.onChange} value={this.state.answer_comment} />
                        </Col>
                        <Col offset={1} span={5} style={{ paddingTop: 3 }}>
                            {this.state.showButton === true
                                ?
                                <Button
                                    htmlType="submit"
                                    onClick={this.onSubmit}
                                    type="primary"
                                    style={{ marginTop: 0, paddingTop: 1, paddingBottom: 1 }}
                                    className="font_size_xs no_border"
                                    shape="round"
                                >
                                    Add Comment
                        </Button>
                                :
                                <Button
                                    htmlType="submit"

                                    type="primary"
                                    style={{ marginTop: 0, paddingTop: 1, paddingBottom: 1 }}
                                    className="font_size_xs no_border"
                                    shape="round"
                                    disabled
                                >
                                    Add Comment
                        </Button>
                            }

                        </Col>
                    </Row>
                </Form.Item>
                {this.state.view_comments === true
                    ?
                    Object.keys(this.state.comments).map((simple_comment_id) => {

                        return (this.commentGenerator(simple_comment_id, this.state.comments[simple_comment_id], this.props.thisUserData, this.updateComments))

                    })
                    :
                    <Row type="flex" justify="center">
                        <Text className="text_color_quora_blue paddingTop-m pointer" onClick={this.handleShowComments}>View Comments</Text>
                    </Row>

                }
            </>
        )
    }
}



let simple_comments = {
    '0': {
        commentText: 'Good answer',
        comments: {
            '0-1': {
                commentText: 'Thanks',
                comments: {}
            }
        }
    },
    '1': {
        commentText: 'Very well written',
        comments: {
            '0-1': {
                commentText: 'Thanks buddy!',
                comments: {}
            }
        }
    }
}

var comments = {
    '0': {
        commentText: 'Nice answer. I always thought this was the right way of writing a piece of code or driving a vehical.',
        profileCredential: "Chang Wu",
        profileImage: "https://qph.fs.quoracdn.net/main-thumb-4287320-200-deggahgsqwmxhxzjpmfemzbepfhfjnso.jpeg",
        comments: {
            '0-1': {
                commentText: 'Thanks!',
                profileCredential: "Pat Peterson",
                profileImage: "https://qph.fs.quoracdn.net/main-thumb-71919532-200-txffendnscaqwhwdprafbtwvlrcyrikn.jpeg",
                comments: {}
            }
        },
    },
    '1': {
        commentText: 'Average answer and I think this is the shitiest way to explain',
        profileCredential: "David Seidman",
        profileImage: "https://qph.fs.quoracdn.net/main-thumb-1155184-200-nxjuemypbvqvsfjqjthukshaszbqecmr.jpeg",
        comments: {
            '1-0': {
                commentText: 'Alright! Thanks for feedback. Cannot have am answer that satisfies everyone. On another note, please check the answer by Scott Murpheys. That might apall you by any standards.',
                profileCredential: "Pat Peterson",
                profileImage: "https://qph.fs.quoracdn.net/main-thumb-71919532-200-txffendnscaqwhwdprafbtwvlrcyrikn.jpeg",
                comments: {
                    '1-0-0': {
                        commentText: 'I dont think u get what i meant. I meant that your delivery was inadequate. Not the topic.',
                        profileCredential: "David Seidman",
                        profileImage: "https://qph.fs.quoracdn.net/main-thumb-1155184-200-nxjuemypbvqvsfjqjthukshaszbqecmr.jpeg",

                        comments: {}
                    }
                }
            },
            '1-1': {
                commentText: 'Hey that was mean!',
                profileCredential: "Steve Baker",
                profileImage: "https://qph.fs.quoracdn.net/main-thumb-195634334-200-btyhbjupjzglczcwwynktjgdktzjfcxk.jpeg",

                comments: {
                    '1-1-0': {
                        commentText: 'No thats okay, I find criticism useful',
                        profileCredential: "Pat Peterson",
                        profileImage: "https://qph.fs.quoracdn.net/main-thumb-71919532-200-txffendnscaqwhwdprafbtwvlrcyrikn.jpeg",
                        comments: {
                            '1-1-0-0': {
                                commentText: 'It was less of a criticism and more of a ignorant prejudice. I dont know why such people are still allowed on quora',
                                profileCredential: "Steve Baker",
                                profileImage: "https://qph.fs.quoracdn.net/main-thumb-195634334-200-btyhbjupjzglczcwwynktjgdktzjfcxk.jpeg",
                                comments: {}
                            }
                        }
                    }
                }
            }
        }
    },

    '2': {
        commentText: 'Why do you say that all this is meaningless?',
        profileCredential: "Rob Neff",
        profileImage: "https://qph.fs.quoracdn.net/main-thumb-443523572-200-cnosbuvvnhoooxdsqwvlvtyemeczyeov.jpeg",
        comments: {
            '2-0': {
                commentText: 'Its just a feeling',
                profileCredential: "Pat Peterson",
                profileImage: "https://qph.fs.quoracdn.net/main-thumb-71919532-200-txffendnscaqwhwdprafbtwvlrcyrikn.jpeg",
                comments: {}
            }
        },
    },

    '10': {
        commentText: 'Reminds me of my childhood',
        profileCredential: "Divyendra Patil",
        profileImage: "https://qph.fs.quoracdn.net/main-thumb-199732985-200-woparytinkzfnnktzzdcnhdxunktttzl.jpeg",
        comments: {
            '10-0': {
                commentText: 'Oh sure it does',
                profileCredential: "Pat Peterson",
                profileImage: "https://qph.fs.quoracdn.net/main-thumb-71919532-200-txffendnscaqwhwdprafbtwvlrcyrikn.jpeg",

                comments: {}
            }
        }
    }
}


let outer_parseComments = (search_id, new_comment) => {


    // convert the string to ['1', '1-0', '1-0-0']

    // how?
    var splits = search_id.split('-');
    console.log('splits ', splits);

    var path = []
    let prev = null;
    for (var i = 0; i < splits.length; i++) {
        if (prev === null) {
            path.push(splits[i]);
            prev = splits[i];
        } else {
            path.push(prev + '-' + splits[i]);
            prev = prev + '-' + splits[i];
        }
    }

    console.log('path ', path);

    // search for 1 in comments
    // in 1's child search for 1-0
    // in 1-0's child search for 1-0-0

    let search_object = comments;
    let search_key_index = 0;
    let parent = null;
    let found_child = null;
    while (search_key_index < path.length) {
        // console.log('For search object: ', search_object);
        if (search_object.hasOwnProperty(path[search_key_index])) {
            // console.log('Found child ', search_object[path[search_key_index]]);
            found_child = search_object[path[search_key_index]];
            search_object = found_child.comments;

            search_key_index += 1;
        }
    }

    console.log('Found comment: ', found_child.commentText)

    if (new_comment !== null) {
        var new_id_index = Object.keys(found_child.comments).length;

        console.log('new id ', search_id + '-' + new_id_index)
        var new_id = search_id + '-' + new_id_index;

        found_child.comments[new_id] = new_comment;

        // parseComments(new_id, null)
    }

    console.log('Search object finally ', comments);
}


// parseComments('2', 'This is a new comment ');

// // add a new comment
// parseComments('1-0-0', 'This is a new comment')

// // Find a node
// parseComments('1-0', null);


/* 
 * Quill modules to attach to editor
 * See https://quilljs.com/docs/modules/ for complete options
 */
EditAnswer.modules = {
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
EditAnswer.formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video'
]



