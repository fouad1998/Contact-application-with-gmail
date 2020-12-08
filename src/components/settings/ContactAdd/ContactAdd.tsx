import { Modal, Row, Col, Input, Button, Alert } from 'antd';
import React, { useCallback, useContext, useState } from 'react';
import AddIcon from '@material-ui/icons/Add';
import { Remove } from '@material-ui/icons';
import { GmailContext } from '../../../context/Gmail';
import { Contact } from '../../mail/Contacts';

interface ContactAddProps {
  visible: boolean;
  onOk: () => void;
  onCancel: () => void;
}

const ContactAdd: React.FC<ContactAddProps> = ({ visible, onCancel, onOk }) => {
  const { state, setContacts } = useContext(GmailContext);

  const [contactAdd, setContactAdd] = useState<{
    errorAdding: boolean;
    errorContent: string;
    contact: Contact;
  }>({
    errorAdding: false,
    errorContent: '',
    contact: {
      kickname: '',
      emails: [''],
    },
  });

  const addContactCancelHandler = useCallback((event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    event.stopPropagation();
    setContactAdd((state) => ({ ...state, addContact: false }));
  }, []);

  const addContactEmailChangeHandler = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
      event.stopPropagation();
      const value = event.target.value;
      contactAdd.contact.emails[index] = value;
      setContactAdd((state) => ({ ...state, contact: { ...state.contact } }));
    },
    [contactAdd]
  );

  const removeContactEmailHandler = useCallback(
    (index: number) => {
      contactAdd.contact.emails.splice(index, 1);
      setContactAdd((state) => ({ ...state }));
    },
    [contactAdd]
  );

  const addContactEmailHandler = useCallback(() => {
    setContactAdd((state) => ({ ...state, contact: { ...state.contact, emails: [...state.contact.emails, ''] } }));
  }, []);

  const addContactKicknameChangeHandler = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    const value = event.target.value;
    setContactAdd((state) => ({ ...state, contact: { ...state.contact, kickname: value } }));
  }, []);

  const addContactSaveHandler = useCallback(
    (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
      event.stopPropagation();
      if (contactAdd.contact.kickname === '') {
        setContactAdd((state) => ({ ...state, errorAdding: true, errorContent: 'Cannot accept an empty name' }));
      } else {
        if (state!.contacts.map((contact) => contact.kickname).includes(contactAdd.contact.kickname)) {
          setContactAdd((state) => ({ ...state, errorAdding: true, errorContent: 'Given name already exists' }));
        } else {
          for (const contact of contactAdd.contact.emails) {
            if (typeof contact === 'string' && contact !== '') {
              if (/^[a-zA-Z0-9\.\-]+@[a-zA-Z0-9\.]+\.[a-zA-Z0-9]+$/.test(contact)) {
                if (state!.contacts.findIndex((contactCache) => contactCache.emails.includes(contact)) === -1) {
                  setContacts && setContacts([...state!.contacts, { ...(contactAdd.contact as Contact) }]);
                  setContactAdd({
                    errorAdding: false,
                    contact: {
                      kickname: '',
                      emails: [''],
                    },
                    errorContent: '',
                  });
                  onOk();
                } else {
                  setContactAdd((state) => ({
                    ...state,
                    errorAdding: true,
                    errorContent: `Contact ${contact} already exists`,
                  }));
                  return void 0;
                }
              } else {
                setContactAdd((state) => ({
                  ...state,
                  errorAdding: true,
                  errorContent: `The given email (${contact}) it is not correct mail address`,
                }));
                return void 0;
              }
            } else {
              setContactAdd((state) => ({
                ...state,
                errorAdding: true,
                errorContent: 'Cannot add contact without email address',
              }));
              return void 0;
            }
          }
        }
      }
    },
    [contactAdd]
  );

  return (
    <Modal title="Add new contact" visible={visible} onOk={addContactSaveHandler} onCancel={onCancel}>
      <Row className="add-contact-modal">
        {contactAdd.errorAdding && (
          <Col span={24} className="section">
            <Alert type="error" message={contactAdd.errorContent} closable={true} />
          </Col>
        )}
        <Col span={24} className="section">
          <Row>
            <Col span={6}>Kickname</Col>
            <Col span={18}>
              <Input value={contactAdd.contact.kickname} onChange={addContactKicknameChangeHandler} />
            </Col>
          </Row>
        </Col>
        <Col span={24} className="section">
          <Row>
            <Col span={6}>Email</Col>
            <Col span={18}>
              {contactAdd.contact.emails!.map((email, index) => (
                <Row key={index}>
                  <Col span={18}>
                    <Input value={email} onChange={(e) => addContactEmailChangeHandler(e, index)} />
                  </Col>
                  <Col span={4} offset={2}>
                    {index === 0 ? (
                      <Button onClick={addContactEmailHandler}>
                        <AddIcon />
                      </Button>
                    ) : (
                      <Button onClick={() => removeContactEmailHandler(index)}>
                        <Remove />
                      </Button>
                    )}
                  </Col>
                </Row>
              ))}
            </Col>
          </Row>
        </Col>
      </Row>
    </Modal>
  );
};

export default React.memo(ContactAdd);
