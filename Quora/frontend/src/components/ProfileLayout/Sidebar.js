import React, { Component } from 'react'
import { Typography, Divider, Menu, Row, Col } from 'antd';
import { Route, Switch } from 'react-router-dom'
import { withRouter } from 'react-router-dom';
import './Sidebar.css';
import Profile from '../Profile/Profile';
import Followers from '../Followers/Followers';
import Following from '../Followers/Following'
import UserQuestions from '../UserQuestions.js/UserQuestions';
import UserAnswers from '../UserAnswers/UserAnswers';

const { Title, Text } = Typography;

class Sidebar extends Component {
    constructor() {
        super();
        const currentPath = window.location.pathname.split('/')[3];
        const selected = currentPath ? currentPath : "profile";
        this.state = {
            selected
        }
    }
    handleClick = ({ key }) => {
        console.log(key)
        const { match, history } = this.props;
        const userId = match.params.id
        this.setState({
            selected: key
        });
        if (key === 'profile')
            history.push(`/profile/${userId}`)
        else
            history.push(`/profile/${userId}/${key}`)
    }
    render() {
        const { selected } = this.state;
        return (
            <div>
                <Row gutter={16}>
                    <Col span={4}>
                        <div className="profile-sidebar">
                            <Title level={4} >Feeds</Title>
                            <Divider />
                            <Menu
                                onClick={this.handleClick}
                                defaultSelectedKeys={[selected]}
                                mode="inline"
                            >
                                <Menu.Item key="profile">Profile</Menu.Item>
                                <Menu.Item key="answers">Answers</Menu.Item>
                                <Menu.Item key="questions">Questions</Menu.Item>
                                <Menu.Item key="followers">Followers</Menu.Item>
                                <Menu.Item key="following">Following</Menu.Item>
                            </Menu>
                        </div>
                    </Col>
                    <Col span={20}>
                        <div className="profile-sidebar-content">
                            <Title level={4} >{selected}</Title>
                            <Divider />
                            <Switch>
                                <Route path="/profile/:id/followers" component={Followers} />
                                <Route path="/profile/:id/following" component={Following} />
                                <Route path="/profile/:id/questions" component={UserQuestions} />
                                <Route path="/profile/:id/answers" component={UserAnswers} />
                                <Route path="/profile/:id" component={UserAnswers} />
                            </Switch>
                        </div>
                    </Col>
                </Row>
                <div>

                </div>
            </div>
        )
    }
}

export default withRouter(Sidebar);
