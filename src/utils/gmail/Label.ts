export const getLabels = (): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    window.gapi.client.gmail.users.labels
      .list({
        userId: 'me',
      })
      .then((response: any) => {
        if (response.error !== void 0) {
          reject(response.error);
        }
        const email = response.result.labels.map((e: any) => e.id) as string[];
        resolve(email);
      }, reject);
  });
};
