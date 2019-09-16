import React, { Component } from 'react';
import { Menu, Icon, Input, Button, Select, message } from 'antd';
import { post, get } from './../../api.js';
const Option = Select.Option;

class Search extends Component {

    state = {
        value: undefined,
        // data: [{ 'value': 'Hrishikesh Waikar', 'text': 'Hrishikesh Waikar', 'type': 'PROFILE', 'id': '129321bwejf' },
        // { 'value': 'What is the nature of black hole? Why are they not visible?', 'text': 'What is the nature of black hole? Why are they not visible?', 'type': 'QUESTION', 'id': '932o3rrjfn' },
        // { 'value': 'Black Holes', 'text': 'Black Holes', 'type': 'TOPIC', 'id': '0HFD2' }]
        data: []
    }

    handleSearch = (value) => {
        console.log('In handle search ', value.name);
        let component = this;
        // make api call sending the value and results are set to data for display and select 
        if (value.length === 0) {
            this.setState({
                data: []
            })

            return;
        }
        if (value.length > 2) {
            let post_data = {
                'searchTerm': value,
            }

            post('/search', post_data, (response) => {
                console.log('Got search response ', response.data.data);

                component.setState({
                    data: response.data.data
                })
            }, () => { message.error('Error getting search results') })
        }

    }


    handleChange = (value) => {
        console.log('In hamdle Change ', value);
        let data = this.state.data;

        for (var i = 0; i < data.length; i++) {
            if (value === data[i].value) {
                this.props.handleRedirection(data[i]);
            }
        }
    }

    render = () => {

        const options = this.state.data.map(d => <Option key={d.value}>{d.text}</Option>)
        return (<>

            <Select
                showSearch
                value={this.state.value}
                placeholder="Search on Quora"
                style={{ width: 250 }}
                defaultActiveFirstOption={false}
                showArrow={false}
                filterOption={false}
                onSearch={this.handleSearch}
                onChange={this.handleChange}
                notFoundContent={null}
            >
                {options}
            </Select>
        </>)
    }
}

export default Search;