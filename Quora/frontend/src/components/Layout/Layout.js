import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { LastLocationProvider } from 'react-router-last-location';
import Navbar from '../Navbar/Navbar';
import './Layout.css';
import QuestionPage from '../questions/question_page.js';
import { TestDisplayQuestion } from '../DisplayQuestion/DisplayQuestion.js';
import HomeLayout from '../HomeLayout/HomeLayout';
import ProfileLayout from '../ProfileLayout/ProfileLayout';
import AnswerLayout from '../AnswerLayout/AnswerLayout';
import Messages from '../Messages/Messages';
import NewMessage from '../Messages/NewMessage';
import Thread from '../Messages/Thread';
import YourContentLayout from '../YourContentLayout/YourContentLayout';

import Stats from "../Stats/Stats";
import Dashboard from "../Dashboard/Dashboard";

class Layout extends Component {
    previousLocation = this.props.location;

    componentWillUpdate(nextProps) {
        let { location } = this.props;

        // set previousLocation if props.location is not modal
        if (
            nextProps.history.action !== "POP" &&
            (!location.state || !location.state.modal)
        ) {
            this.previousLocation = this.props.location;
        }
    }


    render = () => {
        let { location } = this.props;

        let isModal = !!(
            location.state &&
            location.state.modal &&
            this.previousLocation !== location
        );
        return (
            <div>
                <LastLocationProvider>
                    <Navbar />
                    <div className="content">
                        <Switch location={isModal ? this.previousLocation : location}>x
                            <Route path="/profile/:id" component={ProfileLayout} />
                            <Route path="/answer" component={AnswerLayout} />
                            <Route path="/question/:id" component={QuestionPage} />
                            <Route path="/displayQuestion" component={TestDisplayQuestion} />
                            <Route path="/content" component={YourContentLayout} />
                            <Route path="/stats" component={Stats} />
                            <Route path="/" component={HomeLayout} />
                        </Switch>
                        {isModal ?
                            <>
                                <Switch>
                                    <Route path="/messages/new" component={NewMessage} />
                                    <Route path="/messages/thread/:id" component={Thread} />
                                    <Route path="/messages" component={Messages} />
                                </Switch>
                            </>
                            :
                            null}
                    </div>
                </LastLocationProvider>
            </div>
        );
    };
}


export default Layout;