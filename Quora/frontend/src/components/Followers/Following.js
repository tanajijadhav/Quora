import React, { Component } from 'react'
import { Col, Row, Skeleton, message } from 'antd';
import FollowerCard from './FollowerCard';
import { call } from '../../api'

class Following extends Component {
  state = {
    following: [],
    loading: true
  }

  componentDidMount() {
    const userId = this.props.match.params.id
    call({
      method: "get",
      url: `/users/${userId}/following`
    })
      .then(data => {
        console.log(data)
        const following = data.following;
        this.setState({
          following,
          loading: false
        })
      })
      .catch(err => {
        console.log(err)
      })
  }
  handleFollowClick = (userId) => {
    let loggedInUserId = localStorage.getItem("userId");
    call({
      method: "post",
      url: `/unfollow/${loggedInUserId}`
    })
      .then(data => {
        let { following } = this.state;
        let person = following.filter(following => following.userId === userId)[0];
        following = following.filter(following => following.userId !== userId)
        message.success(`Unfollowed ${person.firstName}`)
        this.setState({
          following
        })
      })
      .catch(err => {
        console.log(err)
      })

  }
  render() {
    let { following, loading } = this.state;
    console.log(following)
    following = following.map(d => {
      const { followers, profileImage, firstName, lastName, profileCredential, followingBack, _id, userId } = d;
      return <Col span={12} key={_id}>
        <FollowerCard
          _id={_id}
          userId={userId}
          noOfFollowers={followers}
          profileImage={profileImage}
          name={firstName + " " + lastName}
          profileCredential={profileCredential}
          followText="Following"
          handleFollowClick={this.handleFollowClick}
        />
      </Col>
    })
    return (
      <div>
        <Row gutter={8}>
          {
            loading ?
              <Skeleton active /> :
              following
          }

        </Row>
        {/* <FollowersList data={following} handleFollowClick={this.handleFollowClick} /> */}
      </div>
    )
  }
}

export default Following;