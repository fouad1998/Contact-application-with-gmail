import { Col, Row, Tag, Button, Modal, Alert, Input, Select, Form } from 'antd';
import React, { useCallback, useContext, useState } from 'react';
import AddIcon from '@material-ui/icons/Add';
import SettingsIcon from '@material-ui/icons/Settings';
import { GmailContext, GmailSettings } from '../Gmail';
import { Loader } from '../Loader/Loader';

export interface Contact {
  kickname: string;
  emails: string[];
}

interface ContactProps {}

const Contacts: React.FC<ContactProps> = () => {
  const { state, loadingContacts, saveSettings, selectContact } = useContext(GmailContext);

  const [contactAdd, setContactAdd] = useState<{ addContact: boolean; errorAdding: boolean; errorContent: string; contact: Contact }>({
    addContact: false,
    errorAdding: false,
    errorContent: '',
    contact: {
      kickname: '',
      emails: [],
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

  const addContactEmailChangeHandler = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    const value = event.target.value;
    //FIXME: handle adding more than one email in mean time
    setContactAdd((state) => ({ ...state, contact: { ...state.contact } }));
  }, []);

  const addContactKicknameChangeHandler = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    const value = event.target.value;
    setContactAdd((state) => ({ ...state, contact: { ...state.contact, kickname: value } }));
  }, []);

  const addContactSaveHandler = useCallback(
    (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
      event.stopPropagation();
      //FIXME: handle the add contact
      if (typeof contactAdd.contact.emails === 'string' && contactAdd.contact.emails !== '') {
        if (/^[a-zA-Z0-9\.\-]+@[a-zA-Z0-9]+\.[a-z]+$/.test(contactAdd.contact.emails as string)) {
          if (state!.contacts.findIndex((contact) => contact.emails === contactAdd.contact.emails) === -1) {
            //setContacts((state) => [...state, { ...(contactAdd.contact as Contact) }]);
            setContactAdd({
              errorAdding: false,
              addContact: false,
              contact: {
                kickname: '',
                emails: [],
              },
              errorContent: '',
            });
          } else {
            setContactAdd((state) => ({ ...state, errorAdding: true, errorContent: 'Contact already exists' }));
          }
        } else {
          setContactAdd((state) => ({ ...state, errorAdding: true, errorContent: 'The given email it is not correct mail address' }));
        }
      } else {
        setContactAdd((state) => ({ ...state, errorAdding: true, errorContent: 'Cannot add contact without email address' }));
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
                : contact.emails.indexOf(state!.currentContact);

            return (
              <Col span={24} className={'item' + (isActive ? ' active' : '')} key={index} onClick={() => selectContact && selectContact(contact)}>
                {contact.kickname}
                <Row>
                  <Col span={24}>
                    {contact.emails.map((email) => (
                      <Tag color="blue">{email}</Tag>
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
            <Input value={contactAdd.contact.kickname} addonBefore={'Kickname'} onChange={addContactKicknameChangeHandler} />
          </Col>
          <Col span={24} className="section">
            <Row>
              {contactAdd.contact.emails!.map((email, index) => (
                <Col span={24} key={index}>
                  <Input value={email} addonBefore={'Email'} onChange={addContactEmailChangeHandler} />
                </Col>
              ))}
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
