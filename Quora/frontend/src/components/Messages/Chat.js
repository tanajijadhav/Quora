import React, { Component } from 'react'
import { Avatar, Card } from 'antd';
import moment from 'moment';
import './Chat.css';

class ChatCard extends Component {

    render() {
        const { justifyContent, profileImage, message, date, userId } = this.props;
        return (
            <div className="chat-div">

                {
                    justifyContent === "flex-start"
                        ?
                        <div className="chat" style={{ justifyContent }}>
                            <Avatar src={`https://s3.ap-south-1.amazonaws.com/checkapp-dev/profiles/${userId}`} />
                            <Card style={{ background: "#e6e6e6" }}>
                                {message}
                            </Card>
                        </div>
                        :
                        <div className="chat" style={{ justifyContent }}>
                            <Card style={{ background: "#379BFB", color: "#fff" }}>
                                {message}
                            </Card>
                            <Avatar src={`https://s3.ap-south-1.amazonaws.com/checkapp-dev/profiles/${userId}`} />
                        </div>
                }
                <div style={{ textAlign: justifyContent === "flex-start" ? "left" : "right" }}>{moment(date).format("MMM Do YY")}</div>

            </div>
        )
    }
}

export default ChatCard;