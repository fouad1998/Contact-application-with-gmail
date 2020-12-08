export const getProfileEmail = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    window.gapi.client.gmail.users
      .getProfile({
        userId: 'me',
      })
      .then((response: any) => {
        if (response.error !== void 0) {
          reject(response.error);
        }
        const email = response.result.emailAddress;
        resolve(email);
      }, reject);
  });
};
