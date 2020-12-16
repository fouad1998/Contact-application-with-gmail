import { createContext } from 'react';
import { GmailContextInterface } from '../interfaces/gmail/GmailContext';

export const GmailContext = createContext<Partial<GmailContextInterface>>({});
