export interface GmailReducerInterface {
  cache: Array<{ email: string[]; nextPageToken: string; messages: Array<{ email: string; message: any }> }>;
  nextPageToken: string;
  currentLabel: string;
  labels: string[];
  contacts: { kickname: string; emails: string[] }[];
  selectedContact: { kickname: string; emails: string[] };
  currentContact: string;
  userEmail: string;
  messageShowModel: 'snippet' | 'complete as text' | 'complete as html';
  editor: 'simple' | 'advanced';
  messageThread: 'new thread' | 'last thread';
}
