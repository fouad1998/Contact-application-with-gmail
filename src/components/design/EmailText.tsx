import { Col, Row, Tag } from 'antd';
import React from 'react';
import { getMessageBodyAsText } from '../../utils/gmail/getMessageBodyAsText';
import AttachedFiles from '../mail/AttachedFiles';

interface EmailTextProps {
  subject: string;
  isSameUser: boolean;
  message: any;
  messageShowModel: string;
}

const EmailText: React.FC<EmailTextProps> = ({ subject, isSameUser, messageShowModel, message }) => {
  const messageContent = messageShowModel === 'snippet' ? message.snippet : getMessageBodyAsText(message);

  return (
    <Row>
      <Col span={14} offset={isSameUser ? 10 : 0} className={'message' + (isSameUser ? ' me' : '')}>
        <Row>
          {subject !== '' && !/^[\s]+$/.test(subject) && (
            <Col span={24} className="tags">
              <Tag color="green">Subject: {subject}</Tag>
            </Col>
          )}
          <Col span={24} className="message-content" dangerouslySetInnerHTML={{ __html: messageContent }}></Col>
          <Col span={24} className="attached-files">
            <AttachedFiles message={message} />
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default React.memo(EmailText);
