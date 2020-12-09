import { Col, Row, Select } from 'antd';
import React, { useContext } from 'react';
import { GmailContext } from '../../context/Gmail';
import EmailText from '../design/EmailText';
import EmailHTML from '../design/EmailHTML';

interface ListMessagesProps {
  messages: Array<any>;
  messageShowModel: string;
  userEmail: string;
}

const ListMessages: React.FC<ListMessagesProps> = ({ messages, messageShowModel, userEmail }) => {
  const { state } = useContext(GmailContext);
  const hasMoreThanOneEmail = state!.selectedContact.emails.length > 1;
  return (
    <Row className="result">
      <Col span={24} className="header">
        <Row className="inherit-height">
          <Col span={hasMoreThanOneEmail ? 12 : 24} className="kickname">
            {state!.selectedContact.kickname}
          </Col>
          {hasMoreThanOneEmail && (
            <Col span={12} className="select-other-email">
              <Select value={state!.currentContact}>
                {['ALL', ...state!.selectedContact.emails].map((email, index) => (
                  <Select.Option value={email} key={index}>
                    {email}
                  </Select.Option>
                ))}
              </Select>
            </Col>
          )}
        </Row>
      </Col>
      <Col span={24} className="messages-container">
        <Row>
          <Col span={24}>
            {messages.map((message) => {
              const sameUser =
                message.payload.headers.find((header: any) => header.name === 'From').value.indexOf(userEmail) !== -1;
              const subject = message.payload.headers.find((header: any) => header.name === 'Subject').value;
              if (messageShowModel !== 'complete as html') {
                /** Sinppet version */
                return (
                  <EmailText
                    key={message.id}
                    isSameUser={sameUser}
                    subject={subject}
                    messageShowModel={messageShowModel}
                    message={message}
                  />
                );
              } else {
                /** Complete version */
                return <EmailHTML key={message.id} subject={subject} message={message} />;
              }
            })}
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default React.memo(ListMessages);
