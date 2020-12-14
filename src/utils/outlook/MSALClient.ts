import * as msal from '@azure/msal-browser';
import { msalConfig } from '../../config/outlook/config';

export const msalClient = new msal.PublicClientApplication(msalConfig);
