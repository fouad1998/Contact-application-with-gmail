import { Contact } from '../data/Contact';
import { GmailReducerInterface } from './GmailReducer';
import { GmailSettings } from './GmailSettings';

export interface GmailContextInterface {
  state: GmailReducerInterface;
  loadingContacts: boolean;
  loadingMessages: boolean;
  errorLoadingContacts: boolean;
  errorLoadingMessage: boolean;
  messages: Array<any>;
  sendMessage: (content: string, header: string) => void;
  saveSettings: (settings: GmailSettings) => any;
  selectContact: (contact: { kickname: string; emails: string[] }) => any;
  setContacts: (contacts: Contact[]) => any;
  reloadContacts: () => void;
  reloadMessages: () => void;
}
