import { Base64 } from 'js-base64';
import parse from 'node-html-parser';
import { getMessageBodyAsHTML } from './getMessageBodyAsHTML';

export const getMessageBodyAsText = (message: any) => {
  const parsedHTML = parse(getMessageBodyAsHTML(message));
  const cleanText = parsedHTML.innerText;
  //TODO: continue to enhance this feature
  const encodedBody =
    message.payload.parts === void 0
      ? message.payload.body.data
      : message.payload.parts.find((part: any) => part.mimeType === 'text/plain')?.body?.data;
  const decode = Base64.decode(encodedBody || '');
  return cleanText;
};
