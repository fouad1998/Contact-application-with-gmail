import { Typography, Button } from '@material-ui/core';
import { ArrowDownward } from '@material-ui/icons';
import { Col, Row } from 'antd';
import React from 'react';
import { FileIcon, defaultStyles } from 'react-file-icon';
import { getFileSize } from '../../utils/utils/GetFileSize';

interface AttachedFilesProps {
  readonly message: any;
  readonly withTitle?: boolean;
}

const AttachedFiles: React.FC<AttachedFilesProps> = ({ message, withTitle }) => {
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
    const response = await window.gapi.client.gmail.users.messages.attachments.get(params);
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

  if (attachmentParts.length === 0) {
    return <span></span>;
  }

  return (
    <Row className={'attachements ' + (withTitle ? 'with-title' : '')}>
      {withTitle && (
        <Col span={24} className="attachement-title">
          <Typography>Attached files</Typography>
        </Col>
      )}
      <Col span={24}>
        <Row className="files-container">
          {attachmentParts.map((attachementPart: any, index: number) => {
            const extention = attachementPart.filename.replace(/^.+\.([a-zA-Z0-9]+)$/, '$1');
            const size = getFileSize(attachementPart.body.size);
            return (
              <Col span={6} key={index} className="file-attached">
                <Row>
                  <Col span={24} className="file">
                    <Row className="information">
                      <Col className="icon">
                        {/**@ts-ignore */}
                        <FileIcon extension={extention} {...defaultStyles[extention]} />
                      </Col>
                      <Col className="name">
                        <Typography>{attachementPart.filename}</Typography>
                      </Col>
                    </Row>
                    <Row className="down">
                      <Col className="size">
                        <Typography>{size}</Typography>
                      </Col>
                      <Col>
                        <Button onClick={() => downloadFile(attachementPart.body.attachmentId, attachementPart)}>
                          <ArrowDownward />
                        </Button>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Col>
            );
          })}
        </Row>
      </Col>
    </Row>
  );
};

export default React.memo(AttachedFiles);
