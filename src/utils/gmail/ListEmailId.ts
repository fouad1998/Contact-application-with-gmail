export const getListEmailId = (
  emails: string[],
  label: string,
  pageToken?: string,
): Promise<{ nextTokenPage: string; messagesId: string[] }> => {
  return new Promise((resolve, reject) => {
    // When the user select the ALL as current contact that means we have to send the mail
    // to all email that user has
    const query = emails.map((email) => `from:${email} OR to:${email}`).join(' OR ')

    // Load Email list (emails id)
    window.gapi.client.gmail.users.messages
      .list({
        userId: 'me',
        labelIds: label === 'ALL' ? void 0 : label,
        maxResults: 20,
        q: query,
        nextTokenPage: pageToken,
      })
      .then((response: any) => {
        if (response.error === void 0) {
          console.log(response);
          if (response.result.resultSizeEstimate === 0) {
            resolve({ messagesId: [], nextTokenPage: '' });
          } else {
            const messagesId = response.result.messages.map((message: any) => message.id) as string[];
            const nextTokenPage = response.result.nextTokenPage;
            resolve({ messagesId, nextTokenPage: nextTokenPage || '' });
          }
        } else {
          reject(response.error);
        }
      }, reject);
  });
};
