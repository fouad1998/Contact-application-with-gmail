import { createContext } from 'react';
import { Contact } from '../components/mail/Contacts';
import { GmailSettings } from '../interfaces/gmail/GmailSettings';
import { GmailReducerInterface } from '../reducer/gmailReducer';

export interface GmailContextInterface {
  state: GmailReducerInterface;
  loadingContacts: boolean;
  errorLoadingContacts: boolean;
  errorLoadingMessage: boolean;
  saveSettings: (settings: GmailSettings) => any;
  selectContact: (contact: { kickname: string; emails: string[] }) => any;
  setContacts: (contacts: Contact[]) => any;
  reloadContacts: () => void;
  reloadMessages: () => void;
}

export const GmailContext = createContext<Partial<GmailContextInterface>>({});
