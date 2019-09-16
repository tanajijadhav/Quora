import React, { Component } from 'react'
import { Input, Button } from 'antd';

import './ThreadFooter.css';

class ThreadFooter extends Component {
    state = {
        message: ""
    }
    handleChange = (e) => {
        this.setState({
            message: e.target.value
        })
    }

    render() {
        const { message } = this.state;
        const { handleSubmit } = this.props;
        return (
            <div className="thread-footer" key="1">
                <Input onChange={this.handleChange} value={message} />
                <Button type="primary" onClick={() => {
                    this.setState({ message: "" })
                    handleSubmit(message)
                }}>Send</Button>
            </div>

        )
    }
}

export default ThreadFooter;
