import { apiKey, clientId, discoveryDocs, scope } from '../../config/gmail/config';

export const loadAuth = () => {
  return new Promise((resolve, reject) => {
    window.gapi.load('client:auth2', {
      callback: () => {
        window.gapi.client
          .init({
            // Client id you can get it from the google console
            clientId,
            // The API key you can get one from the google console too
            apiKey,
            // Scope are the permission needed (the permission we are asking for)
            scope,
            // The tools we will use with this API
            discoveryDocs,
          })
          .then(resolve, reject);
      },
      onerror: () => console.error('Faild to load the auth2 module'),
      timeout: 30000, //30s
      ontimeout: () => console.error("Timeout the module couldn't be load"),
    });
  });
};
