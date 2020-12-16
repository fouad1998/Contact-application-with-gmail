import { Row, Col } from 'antd';
import React, { useContext } from 'react';
import { GmailContext } from '../../context/Gmail';
import { Loader } from '../Loader/Loader';
import Editor from './Editor';
import ListMessages from './ListMessages';

export default function RightSide() {
  const { state, messages, loadingMessages } = useContext(GmailContext);

  const { currentContact } = state!;

  return (
    <Row className="inherit-height">
      <Col span={24} className="right-side-container">
        {(currentContact === '' || (currentContact !== '' && messages!.length === 0)) && (
          <Row className="message-info">
            {/** No selected contact */}
            {currentContact === '' && (
              <Col span={24} className="no-selected-contact">
                No Contact Selected Yet!
              </Col>
            )}
            {/** Empty Box */}
            {currentContact !== '' && messages!.length === 0 && (
              <Col span={24} className="empty-box">
                Empty box (No message is sent in this contact)
              </Col>
            )}
          </Row>
        )}
        {/** Loading messages */}
        {loadingMessages && <Loader />}
        {/** List messages (emails) */}
        {messages!.length > 0 && <ListMessages />}
        {/** The editor (input) */}
        {currentContact !== '' && <Editor />}
      </Col>
    </Row>
  );
}
