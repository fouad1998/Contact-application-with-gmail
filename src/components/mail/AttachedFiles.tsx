import { FormatSizeTwoTone } from '@material-ui/icons';
import { Col, Row, Typography } from 'antd';
import { Base64 } from 'js-base64';
import React from 'react';
import { FileIcon, defaultStyles } from 'react-file-icon';

interface AttachedFilesProps {
  message: any;
}

const transformFileSizeUnit = (size: number) => {
  let i = 0;
  const units = ['B', 'KB', 'MB', 'KB', 'GB', 'TB'];
  while (size / 1024 > 1) {
    ++i;
    size /= 1024;
  }
  return `${size.toFixed(2)}${units[i]}`;
};

const AttachedFiles: React.FC<AttachedFilesProps> = ({ message }) => {
  const {
    payload: { parts },
  } = message;

  const downloadFile = async (attachementId: string, part: any) => {
    const { filename, mimeType } = part;
    const params = {
      userId: 'me',
      messageId: message.id,
      id: attachementId,
    };
    console.log('Sending request to download', params);
    //@ts-ignore
    const response = await gapi.client.gmail.users.messages.attachments.get(params);
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
    let urlBlob = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = urlBlob;
    a.download = filename;
    a.click();
    a.remove();
  };

  const attachmentParts = Array.isArray(parts) ? parts.filter((part: any) => part.body.attachmentId !== void 0) : [];
  return (
    <Row className="attachements">
      {attachmentParts.length > 0 && (
        <Col span={24} className="attachement-title">
          <Typography.Title level={5}>Attached files</Typography.Title>
        </Col>
      )}
      {attachmentParts.map((attachementPart: any, index: number) => {
        const extention = attachementPart.filename.replace(/^.+\.([a-zA-Z0-9]+)$/, '$1');
        const size = transformFileSizeUnit(attachementPart.body.size);
        console.log(attachementPart);
        return (
          <Col span={4} key={index} className="file-attached" onClick={() => downloadFile(attachementPart.body.attachmentId, attachementPart)}>
            <Row>
              <Col span={24} className="file-icon">
                <span className="file-size">{size}</span>
                {/**@ts-ignore */}
                <FileIcon extension={extention} {...defaultStyles[extention]} />
              </Col>
            </Row>
            <Row>
              <Col span={24} className="file-name">
                {attachementPart.filename}
              </Col>
            </Row>
          </Col>
        );
      })}
    </Row>
  );
};

export default React.memo(AttachedFiles);
