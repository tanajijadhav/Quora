import React, { Component } from 'react';
import { Icon, Input, Row, Col, Typography, Form, Select, Checkbox } from 'antd';

import CredentialModal from './CredentialModal';

const { Text, Title } = Typography;
const { Option } = Select;

let states = [
    {
        "name": "Alabama",
        "abbreviation": "AL"
    },
    {
        "name": "Alaska",
        "abbreviation": "AK"
    },
    {
        "name": "American Samoa",
        "abbreviation": "AS"
    },
    {
        "name": "Arizona",
        "abbreviation": "AZ"
    },
    {
        "name": "Arkansas",
        "abbreviation": "AR"
    },
    {
        "name": "California",
        "abbreviation": "CA"
    },
    {
        "name": "Colorado",
        "abbreviation": "CO"
    },
    {
        "name": "Connecticut",
        "abbreviation": "CT"
    },
    {
        "name": "Delaware",
        "abbreviation": "DE"
    },
    {
        "name": "District Of Columbia",
        "abbreviation": "DC"
    },
    {
        "name": "Federated States Of Micronesia",
        "abbreviation": "FM"
    },
    {
        "name": "Florida",
        "abbreviation": "FL"
    },
    {
        "name": "Georgia",
        "abbreviation": "GA"
    },
    {
        "name": "Guam",
        "abbreviation": "GU"
    },
    {
        "name": "Hawaii",
        "abbreviation": "HI"
    },
    {
        "name": "Idaho",
        "abbreviation": "ID"
    },
    {
        "name": "Illinois",
        "abbreviation": "IL"
    },
    {
        "name": "Indiana",
        "abbreviation": "IN"
    },
    {
        "name": "Iowa",
        "abbreviation": "IA"
    },
    {
        "name": "Kansas",
        "abbreviation": "KS"
    },
    {
        "name": "Kentucky",
        "abbreviation": "KY"
    },
    {
        "name": "Louisiana",
        "abbreviation": "LA"
    },
    {
        "name": "Maine",
        "abbreviation": "ME"
    },
    {
        "name": "Marshall Islands",
        "abbreviation": "MH"
    },
    {
        "name": "Maryland",
        "abbreviation": "MD"
    },
    {
        "name": "Massachusetts",
        "abbreviation": "MA"
    },
    {
        "name": "Michigan",
        "abbreviation": "MI"
    },
    {
        "name": "Minnesota",
        "abbreviation": "MN"
    },
    {
        "name": "Mississippi",
        "abbreviation": "MS"
    },
    {
        "name": "Missouri",
        "abbreviation": "MO"
    },
    {
        "name": "Montana",
        "abbreviation": "MT"
    },
    {
        "name": "Nebraska",
        "abbreviation": "NE"
    },
    {
        "name": "Nevada",
        "abbreviation": "NV"
    },
    {
        "name": "New Hampshire",
        "abbreviation": "NH"
    },
    {
        "name": "New Jersey",
        "abbreviation": "NJ"
    },
    {
        "name": "New Mexico",
        "abbreviation": "NM"
    },
    {
        "name": "New York",
        "abbreviation": "NY"
    },
    {
        "name": "North Carolina",
        "abbreviation": "NC"
    },
    {
        "name": "North Dakota",
        "abbreviation": "ND"
    },
    {
        "name": "Northern Mariana Islands",
        "abbreviation": "MP"
    },
    {
        "name": "Ohio",
        "abbreviation": "OH"
    },
    {
        "name": "Oklahoma",
        "abbreviation": "OK"
    },
    {
        "name": "Oregon",
        "abbreviation": "OR"
    },
    {
        "name": "Palau",
        "abbreviation": "PW"
    },
    {
        "name": "Pennsylvania",
        "abbreviation": "PA"
    },
    {
        "name": "Puerto Rico",
        "abbreviation": "PR"
    },
    {
        "name": "Rhode Island",
        "abbreviation": "RI"
    },
    {
        "name": "South Carolina",
        "abbreviation": "SC"
    },
    {
        "name": "South Dakota",
        "abbreviation": "SD"
    },
    {
        "name": "Tennessee",
        "abbreviation": "TN"
    },
    {
        "name": "Texas",
        "abbreviation": "TX"
    },
    {
        "name": "Utah",
        "abbreviation": "UT"
    },
    {
        "name": "Vermont",
        "abbreviation": "VT"
    },
    {
        "name": "Virgin Islands",
        "abbreviation": "VI"
    },
    {
        "name": "Virginia",
        "abbreviation": "VA"
    },
    {
        "name": "Washington",
        "abbreviation": "WA"
    },
    {
        "name": "West Virginia",
        "abbreviation": "WV"
    },
    {
        "name": "Wisconsin",
        "abbreviation": "WI"
    },
    {
        "name": "Wyoming",
        "abbreviation": "WY"
    }
]

class LocationCredential extends Component {
    constructor(props) {
        super(props)
        let editLocation = {
            location: "",
            startYear: "",
            endYear: "",
            current: false,
            zipCode: "",
            state: "",
            ...props.location
        }
        this.state = {
            visible: props.visible,
            hideText: props.hideText,
            location: props.location || {},
            editLocation,
            userId: props.userId,
            zipCodeError: "",
            stateError: ""
        }
    }

    toggleModal = () => {
        const { toggleModal } = this.props;
        if (toggleModal) {
            toggleModal("addLocationModal")
        }
        this.setState((state, props) => ({
            visible: !state.visible
        }))
    }


    handleOk = () => {
        console.log("handleok")
        const { stateError } = this.props;
        const { handleAdd, zipCodeError } = this.state;
        if (!zipCodeError && !stateError) {

            if (handleAdd) {
                handleAdd(this.state.editLocation)
            }
            this.setState((state, props) => ({
                visible: !state.visible,
                location: { ...state.editLocation }
            }))
        }
    }

    handleChange = (e, type) => {
        console.log(e, type)
        let name, value;
        if (e.target) {
            name = e.target.name;
            if (e.target.value !== undefined) {
                value = e.target.value
            } else if (e.target.checked !== undefined) {
                value = e.target.checked
            }
        }
        else {
            name = type;
            value = e
        }
        let zipCodeError = "";
        let stateError = "";
        if (name === "zipCode") {
            var regex = /^\d{5}(?:[-\s]\d{4})?$/
            if (!regex.test(value)) {
                zipCodeError = "Please enter valid zipcode"
            }
        }
        if (name === "state") {
            let exists = states.filter(s => {
                return s.name.toLowerCase() === value.toLowerCase() || s.abbreviation.toLowerCase() === value.toLowerCase()
            }).length > 0
            if (!exists) stateError = "Please enter a valid state"
        }

        console.log(name, value)
        this.setState((state) => {
            let editLocation = state.editLocation;
            editLocation[name] = value;
            return {
                editLocation,
                zipCodeError,
                stateError
            }
        })
    }
    render() {
        const { visible, location, editLocation, hideText, userId, stateError, zipCodeError } = this.state;
        const { startYear, endYear, current } = location;
        let currentLocation = location.location;
        var options = [];
        for (var i = 2019; i > 1900; i--) {
            options.push(<Option value={i} key={i}>{i}</Option>)
        }
        return (
            <>
                <div className="credential">
                    {
                        !hideText ?
                            currentLocation ?
                                <div>
                                    <Icon type="pushpin" />
                                    <Title level={4}>{currentLocation}</Title>
                                    {
                                        userId === localStorage.getItem("userId") ?
                                            <Text type="secondary" onClick={this.toggleModal} className="edit">Edit</Text> : null
                                    }
                                </div>
                                :
                                <div className="title">
                                    <Icon type="idcard" />
                                    <span onClick={this.toggleModal}>Add Location Credential</span>
                                </div> : null
                    }

                </div>
                <CredentialModal toggleModal={this.toggleModal} handleOk={this.handleOk} visible={visible}>
                    <div>
                        <span><Icon type="idcard" /> Add Location credential</span>
                        <Form.Item>

                            <Row gutter={8}>
                                <Col span={6}><Text>location</Text></Col>
                                <Col span={18}><Input placeholder="San Jose" onChange={this.handleChange} name="location" value={editLocation.location} /></Col>
                            </Row>
                        </Form.Item>
                        <Form.Item>

                            <Row gutter={8}>
                                <Col span={6}><Text>State</Text></Col>
                                <Col span={18}>
                                    <Input placeholder="CA" onChange={this.handleChange} name="state" value={editLocation.state} />
                                    {stateError ? <span style={{color: 'red'}}>{stateError}</span> : null}
                                </Col>
                            </Row>
                        </Form.Item>
                        <Form.Item>

                            <Row gutter={8}>
                                <Col span={6}><Text>ZipCode</Text></Col>
                                <Col span={18}>
                                    <Input placeholder="zipCode" onChange={this.handleChange} name="zipCode" value={editLocation.zipCode} />
                                    {zipCodeError ? <span style={{color: 'red'}}>{zipCodeError}</span> : null}
                                </Col>
                            </Row>
                        </Form.Item>
                        <Form.Item>
                            <Row gutter={8}>
                                <Col span={6}><Text>Start Year</Text></Col>
                                <Col span={18}>
                                    <Select defaultValue="lucy" style={{ width: 120 }} name="startYear" value={editLocation.startYear} onChange={(e) => this.handleChange(e, "startYear")}>
                                        {
                                            options
                                        }
                                    </Select>
                                </Col>
                            </Row>
                        </Form.Item>
                        <Form.Item>
                            <Row gutter={8}>
                                <Col span={6}><Text>End Year</Text></Col>
                                <Col span={18}>
                                    <Select defaultValue="lucy" style={{ width: 120 }} name="endYear" value={editLocation.endYear} onChange={(e) => this.handleChange(e, "endYear")}>
                                        {
                                            options
                                        }
                                    </Select>
                                </Col>
                            </Row>
                        </Form.Item>
                        <Form.Item>
                            <Row gutter={8}>
                                <Col span={6}><Text>I currenty live here</Text></Col>
                                <Col span={18}>
                                    <Checkbox
                                        checked={editLocation.current}
                                        name="current"
                                        onChange={this.handleChange}
                                    >
                                        Current
                                    </Checkbox>
                                </Col>
                            </Row>
                        </Form.Item>
                    </div>
                </CredentialModal>
            </>
        )


    }
}

export default LocationCredential;