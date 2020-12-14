import { Base64 } from 'js-base64';

export interface Headers {
  From: string;
  To: string;
  Subject: string;
  Date: string;
}

export const sendMail = (content: string, headers: Headers, additionHeader: string = ''): Promise<any> => {
  return new Promise((resolve, reject) => {
    // If the email to send is not empty and is not a combination of special characters only
    if (content !== '' && !/^\s+$/.test(content)) {
      //Create the email content
      const email = `${additionHeader}Content-Transfer-Encoding: base64
From: ${headers.From}
To: ${headers.To}
Subject: ${headers.Subject}
Reply-To: ${headers.From}
Date: ${headers.Date}

${content}`;
      // Encode the email to BASE64
      const base64EncodedEmail = Base64.encodeURI(email).replace(/\+/g, '-').replace(/\//g, '_');
      //@ts-ignore
      window.gapi.client.gmail.users.messages
        .send({
          userId: 'me',
          resource: {
            raw: base64EncodedEmail,
          },
        })
        .then((response: any) => {
          const {
            result: { id, labelIds },
          } = response;
          const found = labelIds.find((lable: string) => lable.toLocaleLowerCase() === 'sent');

          if (found) {
            window.gapi.client.gmail.users.messages
              .get({
                userId: 'me',
                id,
              })
              .then((response: any) => {
                resolve(response.result);
              }, reject);
          } else {
            reject();
          }
        }, reject);
    } else {
      reject();
    }
  });
};
