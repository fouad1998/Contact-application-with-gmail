import { Avatar, Button, Col, Row, Tag, Typography } from 'antd';
import { Base64 } from 'js-base64';
import Headers from './Headers';
import React, { useContext } from 'react';
import { parse } from 'node-html-parser';
import AttachedFiles from './AttachedFiles';
import { GmailContext } from '../Gmail';

interface ListMessagesProps {
  messages: Array<any>;
  messageShowModel: string;
  userEmail: string;
}

export const getMessageBodyAsHTML = (message: any) => {
  const encodedBody =
    message.payload.parts === void 0
      ? message.payload.body.data
      : message.payload.parts.find((part: any) => part.mimeType === 'text/html')?.body?.data;
  const decode = Base64.decode(encodedBody || '');
  const index = decode.indexOf('class="gmail_quote"');
  const cleanHTML = index > -1 ? decode.substring(0, index) : decode;
  return cleanHTML;
};

export const getMessageBodyAsText = (message: any) => {
  const parsedHTML = parse(getMessageBodyAsHTML(message));
  const cleanText = parsedHTML.innerText;
  //TODO: continue to enhance this feature
  const encodedBody =
    message.payload.parts === void 0
      ? message.payload.body.data
      : message.payload.parts.find((part: any) => part.mimeType === 'text/plain')?.body?.data;
  const decode = Base64.decode(encodedBody || '');
  return cleanText;
};

const ListMessages: React.FC<ListMessagesProps> = ({ messages, messageShowModel, userEmail }) => {
  const { state } = useContext(GmailContext);

  return (
    <Row className="result">
      <Col span={24} className="header">
        <Row>
          <Col span={12}>{state!.selectedContact.kickname}</Col>
          <Col span={12}>
            <Button></Button>
          </Col>
        </Row>
      </Col>
      {messages.map((message) => {
        const sameUser = message.payload.headers.find((header: any) => header.name === 'From').value.indexOf(userEmail) !== -1;
        const subject = message.payload.headers.find((header: any) => header.name === 'Subject').value;
        if (messageShowModel !== 'complete as html') {
          const messageContent = messageShowModel === 'snippet' ? message.snippet : getMessageBodyAsText(message);
          /** Sinppet version */
          return (
            <Col span={24} key={message.id}>
              <Row>
                <Col span={14} offset={sameUser ? 10 : 0} className={'message' + (sameUser ? ' me' : '')}>
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
            </Col>
          );
        } else {
          /** Complete version */
          return (
            <Col span={24} className="complete-html">
              <Row className="message-html">
                <Col span={24}>
                  <Row>
                    <Col span={4} className="avatar"></Col>
                    <Col span={20} className="subject">
                      <Typography.Title level={3}> {subject === '' ? '(No title)' : subject} </Typography.Title>
                    </Col>{' '}
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
                          <Headers headers={message.payload.headers} />
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
            </Col>
          );
        }
      })}
    </Row>
  );
};

export default React.memo(ListMessages);
