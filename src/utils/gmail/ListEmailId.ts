export const getListEmailId = (
  currentContact: string,
  label: string,
  emails: string[]
): Promise<{ nextTokenPage: string; messagesId: string[] }> => {
  return new Promise((resolve, reject) => {
    // When the user select the ALL as current contact that means we have to send the mail
    // to all email that user has
    const query =
      currentContact === 'ALL'
        ? emails.map((email) => `from:${email} OR to:${email}`).join(' OR ')
        : `from:${currentContact} OR to:${currentContact}`;

    // Load Email list (emails id)
    window.gapi.client.gmail.users.messages
      .list({
        userId: 'me',
        labelIds: label === 'ALL' ? void 0 : label,
        maxResults: 20,
        q: query,
      })
      .then((response: any) => {
        if (response.error === void 0) {
          const messagesId = response.result.messages.map((message: any) => message.id) as string[];
          const nextTokenPage = response.result.nextTokenPage;
          resolve({ messagesId, nextTokenPage });
        } else {
          reject(response.error);
        }
      }, reject);
  });
};
