import { Col, Row } from 'antd';
import React, { useCallback, useEffect, useReducer, useState } from 'react';
import { GmailReducer, GMAIL_REDUCER_TYPE } from '../reducer/gmailReducer';
import { Base64 } from 'js-base64';
import { Loader } from './Loader/Loader';
import ListMessages from './mail/ListMessages';
import Editor from './mail/Editor';
import Contacts, { Contact } from './mail/Contacts';
import { useSnackbar } from 'notistack';
import Axios from 'axios';
import { Button, Typography } from '@material-ui/core';
import { initialReducerValue } from '../constant/constant';
import { getReceiveEmail } from '../utils/emails';
import { GmailContext, GmailContextInterface } from '../context/Gmail';

interface GmailInterface {}

export interface GmailSettings {
  selectedLabel: string;
  messageShowModel: string;
  editor: string;
  messageThread: string;
}

const Gmail: React.FC<GmailInterface> = ({}) => {
  const [state, dispatch] = useReducer(GmailReducer, initialReducerValue);
  const [messages, setMessages] = useState<Array<any>>([]);
  const [messagesStatus, setMessagesStatus] = useState<{ loading: boolean; error: boolean }>({
    loading: false,
    error: false,
  });
  const [contactsStatus, setContactsStatus] = useState<{ loading: boolean; error: boolean }>({
    loading: true,
    error: true,
  });
  const { enqueueSnackbar } = useSnackbar();

  // Load contacts from gmail API
  const loadContacts = (email: string) => {
    //@ts-ignore
    const token = gapi.client.getToken();

    // Success getting the contacts
    const onContactsSuccess = (response: any) => {
      const { data } = response;
      const contacts = [];

      //@ts-ignore
      for (let i = 0; i < data.feed.entry.length; i++) {
        //@ts-ignore
        const entry = data.feed.entry[i];
        const contact = {
          kickname: entry['title']['$t'],
          emails: [],
        };

        if (entry['gd$email']) {
          const emails = entry['gd$email'];
          for (let j = 0, email; (email = emails[j]); j++) {
            //@ts-ignore
            contact['emails'].push(email['address']);
          }
        }

        if (!contact['kickname']) {
          contact['kickname'] = contact['emails'][0] || '<Unknown>';
        }

        contacts.push(contact);
      }

      dispatch({
        type: GMAIL_REDUCER_TYPE.SET_CONTACTS,
        payload: { contacts: contacts },
      });
      //TODO: After make the error to true
      setContactsStatus((state) => ({ ...state, error: true }));
    };

    // Faild loading contacts
    const onContactsFaild = () => {
      setContactsStatus((state) => ({ ...state, error: true }));
      enqueueSnackbar(
        <Row justify="space-between" align="middle">
          <Col>
            <Typography>Error loading the contacts...</Typography>
          </Col>
          <Col>
            <Button onClick={() => loadContacts(email)}>Reload</Button>
          </Col>
        </Row>,
        { variant: 'error' }
      );
    };

    // Fetch the contacts
    Axios.get(
      `https://www.google.com/m8/feeds/contacts/${email}/full?&alt=json&max-results=500&v=3.0&access_token=${token.access_token}`
    )
      .then(onContactsSuccess)
      .catch(onContactsFaild)
      .finally(() => setContactsStatus((state) => ({ ...state, loading: false })));
  };

  // Load messages
  const loadMessages = () => {
    if (state.currentContact.length === 0) {
      setMessages([]);
    } else {
      const contact = state.cache.find((contact) => {
        const emails = contact.email;
        //@ts-ignore
        const found = emails.reduceRight(
          (currentState, email) => currentState && state.currentContact.includes(email),
          true
        );
        return found;
      });

      if (contact) {
        setMessages(contact.messages.map((message) => message.message).reverse());
      } else {
        setMessagesStatus((state) => ({ ...state, loading: true }));

        // Function who retreive the email content including html and attachment
        const fetchEachEmailWithWholeContent = async (res: any) => {
          const messages: { email: string; message: any }[] = [];
          for (const message of res.result.messages) {
            //@ts-ignore
            const request = await gapi.client.gmail.users.messages.get({
              userId: 'me',
              id: message.id,
              format: 'full',
            });
            messages.push({ email: getReceiveEmail(request.result, state.userEmail), message: request.result });
          }
          dispatch({
            type: GMAIL_REDUCER_TYPE.SET_MESSAGES,
            payload: {
              cache: [{ email: state.selectedContact.emails, messages: messages, nextPageToken: res.nextPageToken }],
            },
          });
          setMessages(messages.map((e) => e.message).reverse());
          setMessagesStatus((state) => ({ ...state, loading: false }));
        };

        // Load Email List for specific query
        const loadEmailList = () => {
          // When the user select the ALL as current contact that means we have to send the mail
          // to all email that user has
          const query =
            state.currentContact === 'ALL'
              ? state.selectedContact.emails.map((email) => `from:${email} OR to:${email}`).join(' OR ')
              : `from:${state.currentContact} OR to:${state.currentContact}`;

          // Load Email list (emails id)
          //@ts-ignore
          const request = gapi.client.gmail.users.messages.list({
            userId: 'me',
            labelIds: state.currentLabel === 'ALL' ? void 0 : state.currentLabel,
            maxResults: 20,
            q: query,
          });

          // Start the request
          request.execute((res: any) => {
            if (res.error === void 0) {
              // No error in this case
              if (res.result.resultSizeEstimate > 0) {
                // The query has some results
                fetchEachEmailWithWholeContent(res);
              } else {
                // no message in discussion
                setMessages([]);
                setMessagesStatus((state) => ({ ...state, loading: false }));
              }
            } else {
              // show error message by using res.result.message
              setMessagesStatus((state) => ({ ...state, loading: false }));
              enqueueSnackbar(
                <Row justify="space-between" align="middle">
                  <Col>
                    <Typography>Error loading the emails...</Typography>
                  </Col>
                  <Col>
                    <Button onClick={loadEmailList}>Reload</Button>
                  </Col>
                </Row>,
                { variant: 'error' }
              );
            }
          });
        };

        // Starts
        loadEmailList();
      }
    }
  };

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
      const email = response.result.emailAddress;
      // Load contacts
      loadContacts(email);
      dispatch({
        type: GMAIL_REDUCER_TYPE.SET_USER_EMAIL,
        payload: { userEmail: response.result.emailAddress },
      });
    });
  }, []);

  useEffect(loadMessages, [state.currentContact, state.currentLabel, state.selectedContact, state.cache]);

  const sendMessage = useCallback(
    (content: string, header: string = '') => {
      const headers = { From: state.userEmail, To: state.currentContact, Subject: '', Date: new Date().toString() };
      // Success send message
      const onSendSuccess = async (e: { result: { id: string; labelIds: string[] } }) => {
        const {
          result: { id, labelIds },
        } = e;
        const found = labelIds.find((lable) => lable.toLocaleLowerCase() === 'sent');
        if (found) {
          // The message is sent correctly because it is in sent box

          // Now download the message from gmail
          //@ts-ignore
          const message = await gapi.client.gmail.users.messages.get({
            userId: 'me',
            id,
          });
          setMessages((state) => [...state, message.result]);
          enqueueSnackbar(
            <Row justify="space-between" align="middle">
              <Col>
                <Typography>Email sent successfuly</Typography>
              </Col>
              <Col>
                <Button>SENT</Button>
              </Col>
            </Row>,
            { variant: 'success' }
          );
        } else {
          // Very weird, this error shouldn't be here.
          // because this func is executed only when the request works
          onSendError();
        }
      };

      // Faild to send email
      const onSendError = () => {
        enqueueSnackbar(
          <Row justify="space-between" align="middle">
            <Col>
              <Typography>Faild to send the email</Typography>
            </Col>
            <Col>
              <Button>Try Again</Button>
            </Col>
          </Row>,
          { variant: 'error' }
        );
      };

      // If the email to send is not empty and is not a combination of special characters only
      if (content !== '' && !/^\s+$/.test(content)) {
        //Create the email content
        const email = `${header}Content-Transfer-Encoding: base64
From: ${headers.From}
To: ${headers.To}
Subject: ${headers.Subject}
Reply-To: ${headers.From}
Date: ${headers.Date}

${content}`;
        // Encode the email to BASE64
        const base64EncodedEmail = Base64.encodeURI(email).replace(/\+/g, '-').replace(/\//g, '_');
        //@ts-ignore
        window.gapi.client.gmail.users.messages
          .send({
            userId: 'me',
            resource: {
              raw: base64EncodedEmail,
            },
          })
          .then(onSendSuccess, onSendError);
      }
    },
    [state.currentContact, state.userEmail]
  );

  const selectContact = useCallback(
    (select: { kickname: string; emails: string[] }) => {
      dispatch({
        type: GMAIL_REDUCER_TYPE.SET_SELECT,
        payload: { selectedContact: select },
      });

      if (state.currentContact !== 'ALL') {
        // The user doesn't select the ALL option so we select the first entry
        dispatch({
          type: GMAIL_REDUCER_TYPE.SET_CURRENT_CONTACT,
          payload: { currentContact: select.emails[0] },
        });
      }
    },
    [state.currentContact]
  );

  const setContacts = useCallback((contacts: Contact[]) => {
    dispatch({
      type: GMAIL_REDUCER_TYPE.SET_CONTACTS,
      payload: { contacts },
    });
  }, []);

  const settingsSaveHandler = useCallback((settings: GmailSettings) => {
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
  }, []);

  const contextValues: GmailContextInterface = {
    state,
    loadingContacts: contactsStatus.loading,
    errorLoadingContacts: contactsStatus.error,
    errorLoadingMessage: messagesStatus.loading,
    saveSettings: settingsSaveHandler,
    selectContact,
    setContacts,
    reloadContacts: () => loadContacts(state.currentContact),
    reloadMessages: loadMessages,
  };

  return (
    <GmailContext.Provider value={contextValues}>
      <Row className="gmail-interface">
        <Col span={24} className="inherit-height">
          <Row className="inherit-height application">
            <Col span={5} className="left-side">
              <Contacts />
            </Col>
            <Col span={19} className="right-side">
              {(state.currentContact === '' || (state.currentContact !== '' && messages.length === 0)) && (
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
              )}
              {/** Loading messages */}
              {messagesStatus.loading && <Loader />}
              {/** List messages (emails) */}
              {messages.length > 0 && (
                <ListMessages
                  messageShowModel={state.messageShowModel}
                  messages={messages}
                  userEmail={state.userEmail}
                />
              )}
              {/** The editor (input) */}
              {state.currentContact.length > 0 && (
                <Editor currentContact={state.currentContact} editor={state.editor} sendMessage={sendMessage} />
              )}
            </Col>
          </Row>
        </Col>
      </Row>
    </GmailContext.Provider>
  );
};

export default Gmail;
