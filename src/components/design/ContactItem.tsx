import { Col, Row, Tag, Typography } from 'antd';
import React from 'react';
import { Contact } from '../mail/Contacts';

interface ContactItemProps {
  isActive: boolean;
  contact: Contact;
  select: (contact: Contact) => void;
}

const ContactItem: React.FC<ContactItemProps> = ({ isActive, contact, select }) => {
  const { kickname, emails } = contact;

  return (
    <Row>
      <Col span={24} className={'item' + (isActive ? ' active' : '')} onClick={() => select(contact)}>
        <Typography>{kickname}</Typography>
        <Row>
          {emails.map((email, index) => (
            <Col span={24} key={index}>
              <Tag color="blue">{email}</Tag>
            </Col>
          ))}
        </Row>
      </Col>
    </Row>
  );
};

export default React.memo(ContactItem);
