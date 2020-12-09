import { Row, Col, Typography, Avatar } from 'antd';
import React from 'react';
import { getMessageBodyAsHTML } from '../../utils/gmail/getMessageBodyAsHTML';
import AttachedFiles from '../mail/AttachedFiles';
import Headers from '../mail/Headers';

interface EmailHTMLProps {
  subject: string;
  message: any;
}

const EmailHTML: React.FC<EmailHTMLProps> = ({ subject, message }) => {
  const { headers } = message;

  return (
    <Row className="message-html">
      <Col span={24}>
        <Row>
          <Col span={4} className="avatar"></Col>
          <Col span={20} className="subject">
            <Typography.Title level={3}> {subject === '' ? '(No title)' : subject} </Typography.Title>
          </Col>
        </Row>
      </Col>
      <Col span={24}>
        <Row>
          <Col span={4} className="avatar">
            <Avatar />
          </Col>
          <Col span={20}>
            <Row>
              <Col span={24}>
                <Headers headers={headers} />
              </Col>
              <Col span={24}>
                <div dangerouslySetInnerHTML={{ __html: getMessageBodyAsHTML(message) }} className="iframes" />
              </Col>
              <Col span={24} className="attached-files">
                <AttachedFiles message={message} />
              </Col>
            </Row>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default React.memo(EmailHTML);
