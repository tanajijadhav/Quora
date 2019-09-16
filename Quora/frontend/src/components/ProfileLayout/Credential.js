import React, { Component } from 'react';
import { Typography, Modal, Icon, Input } from 'antd';
import './Credential.css';

import CredentialModal from './CredentialModal';
const { Text, Title } = Typography;


class Credential extends Component {

    render() {
        const { credential, label, modalContent, handleOk, visible, toggleModal, icon } = this.props;
        const labelHTML =
            icon ?
                <div className="title">
                    {icon}
                    <span onClick={toggleModal}>{label}</span>
                </div>
                :
                <Text type="secondary" onClick={toggleModal}>{label}</Text>


        return (
            <>
                <div className="credential">
                    {credential ?
                        <div>
                            {icon}
                            <Title level={4}>{credential}</Title>
                            <Text type="secondary" onClick={toggleModal} className="edit">Edit</Text>
                        </div>
                        :
                        labelHTML
                    }

                </div>
                <CredentialModal toggleModal={toggleModal} handleOk={handleOk} visible={visible}>
                    {modalContent}
                </CredentialModal>
            </>
        )
    }
}

export default Credential;