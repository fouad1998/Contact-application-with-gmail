export const ConnectGoogle = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    window.gapi.load('client:auth2', {
      callback: () => {
        window.gapi.client
          .init({
            // Client id you can get it from the google console
            clientId: '235492535889-jmsviunp6r5fusumtql8jlou7tm7vhs8.apps.googleusercontent.com',
            // The API key you can get one from the google console too
            apiKey: 'AIzaSyDAOanQqHi86xX943ff1vyvhl0y5D4K2UM',
            // Scope are the permission needed (the permission we are asking for)
            scope: 'https://www.google.com/m8/feeds https://mail.google.com/',
            // The tools we will use with this API
            discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest'],
          })
          .then(resolve, reject);
      },
      onerror: () => console.error('Faild to load the auth2 module'),
      timeout: 30000, //30s
      ontimeout: () => console.error("Timeout the module couldn't be load"),
    });
  });
};
