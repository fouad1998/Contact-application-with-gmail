import { Col, Row } from 'antd';
import React, { createContext, useCallback, useEffect, useReducer, useState } from 'react';
import { GmailReducer, GmailReducerInterface, GMAIL_REDUCER_TYPE } from '../reducer/gmailReducer';
import { Base64 } from 'js-base64';
import { Loader } from './Loader/Loader';
import ListMessages from './mail/ListMessages';
import Editor from './mail/Editor';
import Contacts from './mail/Contacts';
import Axios from 'axios';

interface GmailInterface {}

export interface GmailSettings {
  selectedLabel: string;
  showSettings: boolean;
  messageShowModel: string;
  editor: string;
  messageThread: string;
}

export interface GmailContextInterface {
  state: GmailReducerInterface;
  loadingContacts: boolean;
  saveSettings: (settings: GmailSettings) => any;
  selectContact: (contact: { kickname: string; emails: string[] }) => any;
}

export const GmailContext = createContext<Partial<GmailContextInterface>>({});

const Gmail: React.FC<GmailInterface> = ({}) => {
  const initialReducerValue: GmailReducerInterface = {
    currentLabel: 'ALL',
    nextPageToken: '',
    cache: [],
    labels: [],
    contacts: [],
    selectedContact: { kickname: '', emails: [] },
    currentContact: '',
    messageShowModel: 'snippet',
    userEmail: '',
    editor: 'simple',
    messageThread: 'new thread',
  };

  const [state, dispatch] = useReducer(GmailReducer, initialReducerValue);
  const [messages, setMessages] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(false);
  const [loadingContacts, setLoadingContacts] = useState<boolean>(true);

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
      console.log(email);
      dispatch({
        type: GMAIL_REDUCER_TYPE.SET_USER_EMAIL,
        payload: { userEmail: response.result.emailAddress },
      });
      //@ts-ignore
      const token = gapi.client.getToken();
      //@ts-ignore
      Axios.get(`https://www.google.com/m8/feeds/contacts/${email}/full?&alt=json&max-results=500&v=3.0&access_token=${token.access_token}`)
        .then(({ data }) => {
          console.log(data);
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
          console.log(contacts);
          dispatch({
            type: GMAIL_REDUCER_TYPE.SET_CONTACTS,
            payload: { contacts: contacts },
          });
        })
        .catch((e) => console.log('Error con', e))
        .finally(() => setLoadingContacts(false));
    });
  }, []);

  useEffect(() => {
    if (state.currentContact.length === 0) {
      setMessages([]);
    } else {
      const contact = state.cache.find((contact) => {
        const emails = contact.email;
        //@ts-ignore
        const found = emails.reduceRight((currentState, email) => currentState && state.currentContact.includes(email), true);
        return found;
      });
      if (contact) {
        setMessages(contact.messages);
      } else {
        setLoading(true);
        //@ts-ignore
        const request = gapi.client.gmail.users.messages.list({
          userId: 'me',
          labelIds: state.currentLabel === 'ALL' ? void 0 : state.currentLabel,
          maxResults: 200,
          // When the user select the ALL as current contact that means we have to send the mail
          // to all email that user has
          q:
            state.currentContact === 'ALL'
              ? state.selectedContact.emails.map((email) => `from:${email} OR to:${email}`).join(' OR ')
              : `from:${state.currentContact} OR to:${state.currentContact}`,
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

  return (
    <GmailContext.Provider value={{ state, saveSettings: settingsSaveHandler, selectContact, loadingContacts }}>
      <Row className="gmail-interface">
        <Col span={24} className="inherit-height">
          <Row className="inherit-height">
            <Col span={24} className="inherit-height">
              <Row className="inherit-height application">
                <Col span={5} className="left-side">
                  <Contacts />
                </Col>
                <Col span={19} className="right-side">
                  <Row className="message-info">
                    {/** No selected contact */}
                    {state.currentContact.length === 0 && (
                      <Col span={24} className="no-selected-contact">
                        No Contact Selected Yet!
                      </Col>
                    )}
                    {/** Empty Box */}
                    {state.currentContact.length > 0 && messages.length === 0 && (
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
                  {state.currentContact.length > 0 && (
                    <Editor currentContact={state.currentContact} editor={state.editor} sendMessage={sendMessage} />
                  )}
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
    </GmailContext.Provider>
  );
};

export default Gmail;
