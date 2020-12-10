export const downloadFileFromGmail = (attachementId: string, messageId: string, mimeType: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const params = {
      userId: 'me',
      messageId: messageId,
      id: attachementId,
    };
    window.gapi.client.gmail.users.messages.attachments
      .get(params)
      .then((response: any) => {
        const { data, size } = response.result;
        const contentType = mimeType || '';
        const sliceSize = size || 512;

        var byteCharacters = atob(data.replace(/-/g, '+').replace(/_/g, '/'));
        var byteArrays = [];

        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
          var slice = byteCharacters.slice(offset, offset + sliceSize);

          var byteNumbers = new Array(slice.length);
          for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
          }

          var byteArray = new Uint8Array(byteNumbers);

          byteArrays.push(byteArray);
        }

        const blob = new Blob(byteArrays, { type: contentType });
        const urlBlob = URL.createObjectURL(blob);

        resolve(urlBlob);
      })
      .catch(reject);
  });
};
