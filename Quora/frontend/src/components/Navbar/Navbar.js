import React, { Component } from 'react';
import { Menu, Icon, Input, Button, List, Popover, Avatar } from 'antd';
import { withRouter } from 'react-router-dom';
import logo from '../../assets/quora-logo.png';
import './Navbar.css';
import URL from '../../constants';
import Search from './../Search/Search.js';
import Notification from '../Notification/Notification';
import { AskQuestion } from './../AskQuestion/AskQuestion.js';


const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

class Navbar extends Component {
    state = {
        current: 'home',
        visible: false,
        addQuestion: false,
    }

    handleClick = ({ key }) => {
        const { history } = this.props;
        if (key === "notification") return false;
        const userId = localStorage.getItem("userId");
        if (key === 'logout') {
            localStorage.clear();
            return history.push('/login')
        }
        this.setState({
            current: key,
        });
        let url = "";

        let modal = false
        if (key === "messages") modal = true;

        if (key === "profile")
            url = `profile/${userId}` // insert _id here
        else if (key !== "home")
            url = key
        history.push({
            pathname: `/${url}`,
            state: { modal }
        });

    }

    handleVisibleChange = (visible) => {
        this.setState({ visible });
    }

    handleShowAddQuestion = (newQuestionId = null) => {
        console.log('IN SHOW ADD QUESTION');
        this.setState({
            addQuestion: !this.state.addQuestion
        })
        // console.log('New question ', newQuestionId);
        if (newQuestionId !== undefined && newQuestionId !== null) {

            console.log('in ifff ', newQuestionId);

            this.props.history.push('/question/' + newQuestionId);
            window.location.reload();
        }
    }


    handleRedirection = (selected_data) => {
        console.log('In handle redirrection ', selected_data);
        if (selected_data.type === 'PROFILE') {
            this.props.history.push('/profile/' + selected_data.id);
        } else if (selected_data.type === 'QUESTION') {
            console.log('IN SELECTED DATA TYPE')
            this.props.history.push('/question/' + selected_data.id);

        } else if (selected_data.type === 'TOPIC') {
            this.props.history.push('/topic/' + selected_data.id);
        }

        window.location.reload();
    }

    render() {
        let userId = localStorage.getItem("userId");
        let userName = localStorage.getItem("userName");
        let profileCredential = localStorage.getItem("profileCredential");
        console.log('in Navbar render ', userId);
        let profileImage = `https://s3.ap-south-1.amazonaws.com/checkapp-dev/profiles/${userId}`
        return (
            <div className="navbar">

                <img src={logo} className="logo" alt="logo" />

                <Menu
                    onClick={this.handleClick}
                    selectedKeys={[this.state.current]}
                    mode="horizontal"
                    style={{ lineHeight: '50px', border: 'none' }}
                >
                    <Menu.Item key="home">
                        <Icon type="book" />Home
                        </Menu.Item>
                    <Menu.Item key="answer">
                        <Icon type="edit" />Answer
                        </Menu.Item>
                    {/* <Menu.Item key="spaces">
                        <Icon type="team" />Spaces
                        </Menu.Item> */}
                    <Menu.Item key="notification">
                        <Popover
                            visible={this.state.visible}
                            onVisibleChange={this.handleVisibleChange}
                            placement="bottom"
                            title="Notifications"
                            content={<Notification handleItemClick={this.handleVisibleChange} />}
                            trigger="click">
                            {/* <Menu.Item key="notification"> */}
                            <Icon type="bell" />Notification
                            {/* </Menu.Item> */}
                        </Popover>

                    </Menu.Item>



                    <Menu.Item className="navbar-search" disabled>
                        <Search handleRedirection={this.handleRedirection} />
                    </Menu.Item>
                    <SubMenu title={<Avatar src={profileImage} />}>
                        <MenuItemGroup >
                            <Menu.Item key="profile">Profile</Menu.Item>
                            <Menu.Item key="messages">Messages</Menu.Item>
                            <Menu.Item key="content">Your Content</Menu.Item>
                            <Menu.Item key="stats">Stats</Menu.Item>
                            <Menu.Item key="logout">Logout</Menu.Item>
                        </MenuItemGroup>
                    </SubMenu>
                    <Menu.Item className="navbar-button" style={{ paddingLeft: 0 }} disabled>
                        <Button type="primary" size="small" className="quora_button_red text_color_white font_size_xs" onClick={() => { this.handleShowAddQuestion() }}>Add Question or Link</Button>
                        <AskQuestion handleShowAddQuestion={this.handleShowAddQuestion} visible={this.state.addQuestion} userId={userId} userName={userName} profileCredential={profileCredential} />
                    </Menu.Item>


                </Menu>
            </div >

        );
    }
}

export default withRouter(Navbar);
