import { Base64 } from 'js-base64';

export const getMessageBodyAsHTML = (message: any) => {
  const encodedBody =
    message.payload.parts === void 0
      ? message.payload.body.data
      : message.payload.parts.find((part: any) => part.mimeType === 'text/html')?.body?.data;
  const decode = Base64.decode(encodedBody || '');
  const index = decode.indexOf('<div class="gmail_quote"');
  const cleanHTML = index > -1 ? decode.substring(0, index) : decode;
  return cleanHTML;
};
