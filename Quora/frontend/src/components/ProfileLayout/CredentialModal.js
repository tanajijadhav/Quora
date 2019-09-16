import React, { Component } from 'react'
import { Modal, Typography, Icon, Input } from 'antd';

const { Text, Title } = Typography;

class CredentialModal extends Component {
    render() {
        const { children, visible, handleOk, toggleModal, className, footer } = this.props;
        return (
            <Modal
            className={className}
                style={{ top: "20px" }}
                title={
                    <>
                        <Title level={4} className="edit-credentials-title">Edit credentials</Title>
                        <Text type="secondary">Credentials also appear on answers you write.</Text>
                    </>
                }
                visible={visible}
                onOk={handleOk}
                onCancel={toggleModal}
            >
                {children}
            </Modal>
        )
    }
}

export default CredentialModal;