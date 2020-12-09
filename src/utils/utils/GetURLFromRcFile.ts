import { RcFile } from 'antd/lib/upload/interface';

export const getURLFromRcFile = (file: RcFile): Promise<string> => {
  return new Promise((resolve, reject) => {
    file!
      .arrayBuffer()
      .then((response) => {
        const array = new Array(new Uint8Array(response));
        const blob = new Blob(array, { type: file!.type });
        const urlBlob = URL.createObjectURL(blob);
        resolve(urlBlob);
      })
      .catch(reject);
  });
};
