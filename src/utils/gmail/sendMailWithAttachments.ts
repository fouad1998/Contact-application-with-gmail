import { GmailHeaders } from "../../interfaces/gmail/SendMail";
import { sendMail } from "./SendMail";

export const sendMailWithAttachments = (message: string, headers: GmailHeaders, files: Array<any>) => {
  const email = `--emplorium_boundary
    
    ${message}
    ${files
      .map(
        (file) => `
    
    --emplorium_boundary
    Content-Type: ${file.type}
    Content-Transfer-Encoding: base64
    Content-Disposition: attachment; filename="${file.filename}"
    
    ${file.content}
    
    `
      )
      .join("")}
    
    --emplorium_boundary--
    `;

  const additionHeaders = 'Content-Type: multipart/mixed; boundary="emplorium_boundary"\r\nMIME-Version: 1.0\r\n';

  return new Promise((resolve, reject) => {
    sendMail(email, headers, additionHeaders).then(resolve).catch(reject);
  });
};
