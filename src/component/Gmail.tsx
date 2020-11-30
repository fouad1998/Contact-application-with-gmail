import { Alert, Button, Col, Form, Input, Modal, Row, Select, Tag } from 'antd';
import React, { useCallback, useContext, useEffect, useReducer, useState } from 'react';
import { GmailReducer, GmailReducerInterface, GMAIL_REDUCER_TYPE } from '../reducer/gmailReducer';
import AddIcon from '@material-ui/icons/Add';
import SettingsIcon from '@material-ui/icons/Settings';
import { Base64 } from 'js-base64';
import { Loader } from './Loader/Loader';
import ListMessages from './mail/ListMessages';
import Editor from './mail/Editor';

interface GmailInterface {}

interface Contact {
  kickname: string;
  email: string;
}

const Gmail: React.FC<GmailInterface> = (props) => {
  const initialReducerValue: GmailReducerInterface = {
    currentLabel: 'ALL',
    nextPageToken: '',
    cache: [],
    labels: [],
    currentContact: '',
    messageShowModel: 'snippet',
    userEmail: '',
    editor: 'simple',
    messageThread: 'new thread',
  };

  const [state, dispatch] = useReducer(GmailReducer, initialReducerValue);
  const [contacts, setContacts] = useState<Array<Contact>>([
    { email: 'mboumediene@inttic.dz', kickname: 'Mohamed' },
    ...new Array(20).fill({ kickname: 'hfouad', email: 'hachour5fouad@gmail.com' }).map((e) => ({
      ...e,
      email:
        new Array(10)
          .fill('')
          .map((e) => String.fromCharCode(Math.random() * 25 + 97))
          .join('') + '@gmail.com',
    })),
  ]);
  const [contactAdd, setContactAdd] = useState<{ addContact: boolean; errorAdding: boolean; errorContent: string; contact: Partial<Contact> }>({
    addContact: false,
    errorAdding: false,
    errorContent: '',
    contact: {},
  });
  const [settings, setSettings] = useState({
    showSettings: false,
    selectedLabel: state.currentLabel,
    messageShowModel: 'snippet',
    editor: 'simple',
    messageThread: 'new thread',
  });
  const [messages, setMessages] = useState<Array<any>>([]);
  const [editorCompleteContent, setEditorCompleteContent] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    //@ts-ignore
    const request = gapi.client.gmail.users.labels.list({
      userId: 'me',
    });
    //@ts-ignore
    const profileRequest = gapi.client.gmail.users.getProfile({
      userId: 'me',
    });

    request.execute((response: any) => {
      console.log(response);
      dispatch({
        type: GMAIL_REDUCER_TYPE.SET_LABELS,
        payload: { labels: ['ALL', ...response.result.labels.map((e: any) => e.id)] },
      });
    });

    profileRequest.execute((response: any) => {
      console.log(response);
      dispatch({
        type: GMAIL_REDUCER_TYPE.SET_USER_EMAIL,
        payload: { userEmail: response.result.emailAddress },
      });
    });
  }, []);

  useEffect(() => {
    if (state.currentContact === '') {
      setMessages([]);
    } else {
      const contact = state.cache.find((contact) => state.currentContact === contact.email);
      if (contact) {
        setMessages(contact.messages);
      } else {
        setLoading(true);
        //@ts-ignore
        const request = gapi.client.gmail.users.messages.list({
          userId: 'me',
          labelIds: state.currentLabel === 'ALL' ? void 0 : state.currentLabel,
          maxResults: 200,
          q: `from:${state.currentContact} OR to:${state.currentContact}`,
        });

        request.execute((res: any) => {
          console.log('Messages   ', res);
          const func = async () => {
            const messages: any = [];
            for (const message of res.result.messages) {
              //@ts-ignore
              const request = await gapi.client.gmail.users.messages.get({
                userId: 'me',
                id: message.id,
                format: 'full',
              });
              messages.push(request.result);
              console.log(request.result, messages.length);

              // await request.execute((res: any) => {
              //   console.log(res);
              // });
            }
            setLoading(false);
            setMessages(messages.reverse());
          };
          if (res.error === void 0) {
            if (res.result.resultSizeEstimate > 0) {
              func();
            } else {
              // no message in  discussion
              setMessages([]);
              setLoading(false);
            }
          } else {
            // show error message by using res.result.message
            setLoading(false);
          }
        });
      }
    }
  }, [state.currentContact, state.currentLabel]);
  const sendMessage = useCallback(
    (content: string, headers = { From: state.userEmail, To: state.currentContact, Subject: '' }) => {
      if (content !== '' && !/^\s+$/.test(content)) {
        let email = '';

        for (const header in headers) {
          email += `${header}: ${headers[header]}\r\n`;
        }

        email += `\r\n${content}`;

        const base64EncodedEmail = Base64.encodeURI(email);
        console.log(email, base64EncodedEmail);
        //@ts-ignore
        window.gapi.client.gmail.users.messages
          .send({
            userId: 'me',
            resource: {
              raw: base64EncodedEmail,
            },
          })
          .then(
            (e: any) => console.log('send', e),
            (e: any) => console.error('error, ', e)
          );
      }
    },
    [state.currentContact, state.userEmail]
  );

  const selectContact = useCallback((email: string) => {
    dispatch({
      type: GMAIL_REDUCER_TYPE.SET_CURRENT_CONTACT,
      payload: { currentContact: email },
    });
  }, []);

  const addContactClickHandler = useCallback((event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    event.stopPropagation();
    setContactAdd((state) => ({ ...state, addContact: !state.addContact }));
  }, []);

  const addContactEmailChangeHandler = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    const value = event.target.value;
    setContactAdd((state) => ({ ...state, contact: { ...state.contact, email: value } }));
  }, []);

  const addContactKicknameChangeHandler = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    const value = event.target.value;
    setContactAdd((state) => ({ ...state, contact: { ...state.contact, kickname: value } }));
  }, []);

  const addContactSaveHandler = useCallback(
    (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
      event.stopPropagation();
      if (typeof contactAdd.contact.email === 'string' && contactAdd.contact.email !== '') {
        if (/^[a-zA-Z0-9\.\-]+@[a-zA-Z0-9]+\.[a-z]+$/.test(contactAdd.contact.email as string)) {
          if (contacts.findIndex((contact) => contact.email === contactAdd.contact.email) === -1) {
            setContacts((state) => [...state, { ...(contactAdd.contact as Contact) }]);
            setContactAdd({
              errorAdding: false,
              addContact: false,
              contact: {},
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

  const addContactCancelHandler = useCallback((event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    event.stopPropagation();
    setContactAdd((state) => ({ ...state, addContact: false }));
  }, []);

  const settingsClickHandler = useCallback(() => {
    setSettings({
      selectedLabel: state.currentLabel,
      showSettings: true,
      messageShowModel: state.messageShowModel,
      editor: state.editor,
      messageThread: state.messageThread,
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
    dispatch({
      type: GMAIL_REDUCER_TYPE.SET_CURRENT_LABEL,
      payload: { currentLabel: settings.selectedLabel },
    });
    dispatch({
      type: GMAIL_REDUCER_TYPE.SET_MESSAGE_MODEL_SHOW,
      payload: { messageShowModel: settings.messageShowModel as 'snippet' | 'complete as text' | 'complete as html' },
    });
    dispatch({
      type: GMAIL_REDUCER_TYPE.SET_MESSAGE_THREAD,
      payload: { messageThread: settings.messageShowModel as 'new thread' | 'last thread' },
    });
    dispatch({
      type: GMAIL_REDUCER_TYPE.SET_EDITOR_TYPE,
      payload: { editor: settings.editor as 'simple' | 'advanced' },
    });
    setSettings((state) => ({ ...state, showSettings: false }));
  }, [settings]);

  return (
    <Row className="gmail-interface">
      <Col span={24} className="inherit-height">
        <Row className="inherit-height">
          <Col span={24} className="inherit-height">
            <Row className="inherit-height application">
              <Col span={5} className="left-side">
                <Row dir="column">
                  <Col span={24} className="title">
                    <h3>Contacts</h3>
                  </Col>
                  <Col span={24} className="contacts">
                    <Row>
                      {contacts.map((contact, index) => (
                        <Col
                          span={24}
                          className={'item' + (contact.email === state.currentContact ? ' active' : '')}
                          key={index}
                          onClick={() => selectContact(contact.email)}
                        >
                          {contact.kickname} <Tag color="blue">{contact.email}</Tag>
                        </Col>
                      ))}
                    </Row>
                  </Col>
                  <Col span={24}>
                    <Row className="controls">
                      <Col span={19} className="contacts-number">
                        Number of contacts
                        <Tag color="green" className="tag">
                          {contacts.length}
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
                </Row>
              </Col>
              <Col span={19} className="right-side">
                <Row className="message-info">
                  {/** No selected contact */}
                  {state.currentContact === '' && (
                    <Col span={24} className="no-selected-contact">
                      No Contact Selected Yet!
                    </Col>
                  )}
                  {/** Empty Box */}
                  {state.currentContact !== '' && messages.length === 0 && (
                    <Col span={24} className="empty-box">
                      Empty box (No message is sent in this contact)
                    </Col>
                  )}
                </Row>
                {/** Loading messages */}
                {loading && <Loader />}
                {/** List messages (emails) */}
                {messages.length > 0 && <ListMessages messageShowModel={state.messageShowModel} messages={messages} userEmail={state.userEmail} />}
                {/** The editor (input) */}
                {state.currentContact !== '' && <Editor currentContact={state.currentContact} editor={state.editor} sendMessage={sendMessage} />}
              </Col>
            </Row>
          </Col>
        </Row>
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
              <Input value={contactAdd.contact.email} addonBefore={'Email'} onChange={addContactEmailChangeHandler} />
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
                    {state.labels.map((label, index) => (
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
      </Col>
    </Row>
  );
};

export default Gmail;
