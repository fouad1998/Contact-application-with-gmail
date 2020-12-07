import { Col, Row, Tag, Button, Modal, Alert, Input, Select, Form } from 'antd';
import React, { useCallback, useContext, useState } from 'react';
import AddIcon from '@material-ui/icons/Add';
import SettingsIcon from '@material-ui/icons/Settings';
import { Remove } from '@material-ui/icons';
import { GmailContext, GmailSettings } from '../Gmail';
import { Loader } from '../Loader/Loader';

export interface Contact {
  kickname: string;
  emails: string[];
}

interface ContactProps {}

const Contacts: React.FC<ContactProps> = () => {
  const { state, loadingContacts, saveSettings, selectContact, setContacts } = useContext(GmailContext);

  const [contactAdd, setContactAdd] = useState<{ addContact: boolean; errorAdding: boolean; errorContent: string; contact: Contact }>({
    addContact: false,
    errorAdding: false,
    errorContent: '',
    contact: {
      kickname: '',
      emails: [''],
    },
  });

  const [settings, setSettings] = useState<GmailSettings>({
    showSettings: false,
    selectedLabel: state!.currentLabel,
    messageShowModel: 'snippet',
    editor: 'simple',
    messageThread: 'new thread',
  });

  const addContactClickHandler = useCallback((event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    event.stopPropagation();
    setContactAdd((state) => ({ ...state, addContact: !state.addContact }));
  }, []);

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
                    addContact: false,
                    contact: {
                      kickname: '',
                      emails: [''],
                    },
                    errorContent: '',
                  });
                } else {
                  setContactAdd((state) => ({ ...state, errorAdding: true, errorContent: `Contact ${contact} already exists` }));
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
              setContactAdd((state) => ({ ...state, errorAdding: true, errorContent: 'Cannot add contact without email address' }));
              return void 0;
            }
          }
        }
      }
    },
    [contactAdd]
  );

  const settingsClickHandler = useCallback(() => {
    setSettings({
      selectedLabel: state!.currentLabel,
      showSettings: true,
      messageShowModel: state!.messageShowModel,
      editor: state!.editor,
      messageThread: state!.messageThread,
    });
  }, [state]);

  const settingsLabelChangeHandler = useCallback((label: string) => {
    setSettings((state) => ({ ...state, selectedLabel: label }));
  }, []);

  const settingsMessageModelChangeHandler = useCallback((model: string) => {
    setSettings((state) => ({ ...state, messageShowModel: model }));
  }, []);

  const settingsEditorTypeChangeHandler = useCallback((editorType: string) => {
    setSettings((state) => ({ ...state, editor: editorType }));
  }, []);

  const settingsMessageThreadChangeHandler = useCallback((thread: string) => {
    setSettings((state) => ({ ...state, messageThread: thread }));
  }, []);

  const settingsCancelHandler = useCallback(() => {
    setSettings((state) => ({ ...state, showSettings: false }));
  }, []);

  const settingsSaveHandler = useCallback(() => {
    setSettings((state) => ({ ...state, showSettings: false }));
    saveSettings && saveSettings(settings);
  }, [settings]);

  return (
    <Row dir="column">
      {loadingContacts && <Loader />}
      <Col span={24} className="title">
        <h3>Contacts</h3>
      </Col>
      <Col span={24} className="contacts">
        <Row>
          {state!.contacts.map((contact, index) => {
            const isActive =
              state!.currentContact === 'ALL'
                ? contact.emails.reduce((acc, email) => acc && state!.currentContact.includes(email), true)
                : contact.emails.includes(state!.currentContact);

            return (
              <Col span={24} className={'item' + (isActive ? ' active' : '')} key={index} onClick={() => selectContact && selectContact(contact)}>
                {contact.kickname}
                <Row>
                  <Col span={24}>
                    {contact.emails.map((email, index) => (
                      <Tag color="blue" key={index}>
                        {email}
                      </Tag>
                    ))}
                  </Col>
                </Row>
              </Col>
            );
          })}
        </Row>
      </Col>
      <Col span={24}>
        <Row className="controls">
          <Col span={19} className="contacts-number">
            Number of contacts
            <Tag color="green" className="tag">
              {state!.contacts.length}
            </Tag>
          </Col>
          <Col span={5} className="controllers">
            <Button type="ghost" onClick={addContactClickHandler}>
              <AddIcon />
            </Button>
            <Button type="ghost" onClick={settingsClickHandler}>
              <SettingsIcon />
            </Button>
          </Col>
        </Row>
      </Col>
      {/** Add new contact */}
      <Modal title="Add new contact" visible={contactAdd.addContact} onOk={addContactSaveHandler} onCancel={addContactCancelHandler}>
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
      {/** Settings */}
      <Modal title="Settings" visible={settings.showSettings} onOk={settingsSaveHandler} onCancel={settingsCancelHandler}>
        <Row>
          <Col span={24}>
            <Form>
              <Form.Item label="Label">
                <Select defaultValue={'ALL'} value={settings.selectedLabel} onChange={settingsLabelChangeHandler}>
                  {state!.labels.map((label, index) => (
                    <Select.Option value={label} key={index}>
                      {label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item label="Model">
                <Select defaultValue={'snippet'} value={settings.messageShowModel} onChange={settingsMessageModelChangeHandler}>
                  {['snippet', 'complete as text', 'complete as html'].map((label, index) => (
                    <Select.Option value={label} key={index}>
                      {label.toLocaleUpperCase()}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item label="Editor">
                <Select defaultValue={'simple'} value={settings.editor} onChange={settingsEditorTypeChangeHandler}>
                  {['simple', 'advanced'].map((label, index) => (
                    <Select.Option value={label} key={index}>
                      {label.toLocaleUpperCase()}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item label="Message thread">
                <Select defaultValue={'last thread'} value={settings.messageThread} onChange={settingsMessageThreadChangeHandler}>
                  {['new thread', 'last thread'].map((label, index) => (
                    <Select.Option value={label} key={index}>
                      {label.toLocaleUpperCase()}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </Modal>
    </Row>
  );
};

export default React.memo(Contacts);
