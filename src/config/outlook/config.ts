// An Optional options for initializing the MSAL @see https://github.com/AzureAD/microsoft-authentication-library-for-js/wiki/MSAL-basics#configuration-options

export const msalConfig = {
  auth: {
    clientId: 'e1ce8f74-3d90-4bb1-beca-557cd4f08cda',
    redirectUri: 'http://localhost:3000',
  },
};

export const scopes = ['user.read', 'mailboxsettings.read', 'calendars.readwrite'];

export const msalRequest = {
  scopes,
};
