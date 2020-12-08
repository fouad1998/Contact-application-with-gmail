import { GmailReducerInterface } from '../reducer/gmailReducer';

export const emailRegexp = /([a-zA-Z0-9\-\.]{1,}@[a-zA-Z0-9\-\.]{1,}\.[a-zA-Z0-9]{1,})/;

export const initialReducerValue: GmailReducerInterface = {
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
