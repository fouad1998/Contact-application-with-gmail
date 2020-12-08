import { getReceiveEmail } from './emails';

export const getEmailsContent = (emailsId: string[], userMail: string): Promise<{ email: string; message: any }[]> => {
  return new Promise((resolve, reject) => {
    const messages: { email: string; message: any }[] = [];
    (async function () {
      for (const messageId of emailsId) {
        const request = await window.gapi.client.gmail.users.messages.get({
          userId: 'me',
          id: messageId,
          format: 'full',
        });
        messages.push({ email: getReceiveEmail(request.result, userMail), message: request.result });
      }
      resolve(messages);
    })();
  });
};
