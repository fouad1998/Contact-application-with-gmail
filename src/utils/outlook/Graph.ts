// Create an authentication provider
import { Client } from '@microsoft/microsoft-graph-client';
import { getToken } from './GetToken';

const authProvider = {
  getAccessToken: async () => {
    // Call getToken in auth.js
    return await getToken();
  },
};

// Initialize the Graph client
export const graphClient = Client.initWithMiddleware({ authProvider });
