import { Col, Row } from 'antd';
import React, { useCallback, useEffect, useReducer, useState } from 'react';
import { GmailReducer } from '../reducer/gmailReducer';
import Contacts from './mail/Contacts';
import { useSnackbar } from 'notistack';
import { Button, Typography } from '@material-ui/core';
import { initialReducerValue } from '../constant/constant';
import { GmailContext } from '../context/Gmail';
import { loadContacts } from '../utils/gmail/LoadContactGmail';
import { getProfileEmail } from '../utils/gmail/GetProfileEmail';
import { getLabels } from '../utils/gmail/Label';
import { getListEmailId } from '../utils/gmail/ListEmailId';
import { getEmailsContent } from '../utils/gmail/EmailContentFetch';
import { sendMail } from '../utils/gmail/SendMail';
import { GmailSettings } from '../interfaces/gmail/GmailSettings';
import { Contact } from '../interfaces/data/Contact';
import { GMAIL_REDUCER_TYPE } from '../enum/gmail/GmailReducer';
import { GmailContextInterface } from '../interfaces/gmail/GmailContext';
import RightSide from './mail/RightSide';

interface GmailProps {}

const Gmail: React.FC<GmailProps> = () => {
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
  const [reloadContacts, setReloadContacts] = useState<() => void>(() => {});
  const { enqueueSnackbar } = useSnackbar();

  // Load messages
  const loadMessages = () => {
    if (state.currentContact.length === 0) {
      setMessages([]);
    } else {
      const contact = state.cache.find((contact) => {
        const emails = contact.email;
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
        // Load Email List for specific query
        const loadEmailList = () => {
          getListEmailId(state.currentContact, state.currentLabel, state.selectedContact.emails)
            .then((response) => {
              if (response.messagesId.length > 0) {
                getEmailsContent(response.messagesId, state.userEmail).then((emailsContent) => {
                  dispatch({
                    type: GMAIL_REDUCER_TYPE.SET_MESSAGES,
                    payload: {
                      cache: [
                        {
                          email: state.selectedContact.emails,
                          messages: emailsContent,
                          nextPageToken: response.nextTokenPage,
                        },
                      ],
                    },
                  });
                  setMessages(messages.map((e) => e.message).reverse());
                  setMessagesStatus((state) => ({ ...state, loading: false }));
                });
              } else {
                // no message in discussion
                setMessages([]);
                setMessagesStatus((state) => ({ ...state, loading: false }));
              }
            })
            .catch(() => {
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
            });
        };

        // Starts
        loadEmailList();
      }
    }
  };

  useEffect(() => {
    const Profile = () => {
      getProfileEmail()
        .then((email) => {
          // Load contacts
          const contacts = () => {
            loadContacts(email)
              .then((contacts) => {
                dispatch({
                  type: GMAIL_REDUCER_TYPE.SET_CONTACTS,
                  payload: { contacts: contacts },
                });
                setContactsStatus({ loading: false, error: false });
              })
              .catch(() => {
                // Faild loading contacts
                setReloadContacts(contacts);
                setContactsStatus({ loading: false, error: true });
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
              });
          };

          contacts();

          dispatch({
            type: GMAIL_REDUCER_TYPE.SET_USER_EMAIL,
            payload: { userEmail: email },
          });
        })
        .catch(() => {
          setReloadContacts(Profile);
          setContactsStatus({ loading: false, error: true });
          enqueueSnackbar(
            <Row justify="space-between" align="middle">
              <Col>
                <Typography>Error loading the Contacts...</Typography>
              </Col>
              <Col>
                <Button onClick={Profile}>Reload</Button>
              </Col>
            </Row>,
            { variant: 'error' }
          );
        });
    };

    Profile();

    getLabels().then((labels) => {
      dispatch({
        type: GMAIL_REDUCER_TYPE.SET_LABELS,
        payload: { labels: ['ALL', ...labels] },
      });
    });
  }, []);

  useEffect(loadMessages, [state.currentContact, state.currentLabel, state.selectedContact, state.cache]);

  const sendMessage = useCallback(
    (content: string, header: string = '') => {
      sendMail(
        content,
        { From: state.userEmail, To: state.currentContact, Subject: '', Date: new Date().toString() },
        header
      )
        .then((message) => {
          //TODO: ADD message to cache
          setMessages((state) => [...state, message]);
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
        })
        .catch(() => {
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
        });
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
    loadingMessages: messagesStatus.loading,
    errorLoadingContacts: contactsStatus.error,
    errorLoadingMessage: messagesStatus.error,
    messages,
    saveSettings: settingsSaveHandler,
    selectContact,
    setContacts,
    reloadContacts,
    sendMessage,
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
              <RightSide />
            </Col>
          </Row>
        </Col>
      </Row>
    </GmailContext.Provider>
  );
};

export default Gmail;
