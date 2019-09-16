import React, { Component } from 'react'
import { Card, Icon, Avatar, Button } from 'antd';
import { withRouter } from 'react-router-dom';

const { Meta } = Card;

class FollowCard extends Component {
    handleClick = () => {
        const { userId, history } = this.props;
        history.push(`/profile/${userId}`);
    }
    render() {
        const { noOfFollowers, profileImage, name, profileCredential, followText, handleFollowClick, _id, userId } = this.props;
       
        return (
            <div>
                <Card
                    actions={[<Button type="primary" icon="user" ghost={followText === "Following"} onClick={() => handleFollowClick(userId)}>{followText } &nbsp;{noOfFollowers}</Button>]}
                >
                    <Meta
                        avatar={<Avatar src={`https://s3.ap-south-1.amazonaws.com/checkapp-dev/profiles/${userId}`} />}
                        title={<a onClick={this.handleClick}>{name}</a>}
                        description={profileCredential}
                    />
                </Card>,
      </div>
        )
    }
}

export default withRouter(FollowCard);