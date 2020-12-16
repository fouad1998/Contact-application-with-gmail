import { Typography, Button } from '@material-ui/core';
import { ArrowDownward } from '@material-ui/icons';
import { Col, Row } from 'antd';
import React from 'react';
import { downloadFileFromGmail } from '../../utils/gmail/DownloadFile';
import { getFileSize } from '../../utils/utils/GetFileSize';
import FileInformation from '../view/FileInformation';
import ImageViewer from '../view/ImageViewer';

interface AttachedFilesProps {
  readonly message: any;
  readonly withTitle?: boolean;
  readonly isSameUser?: boolean;
}

const AttachedFiles: React.FC<AttachedFilesProps> = ({ message, withTitle, isSameUser }) => {
  const {
    payload: { parts },
  } = message;

  const downloadFile = (attachmentId: string, messageId: string, part: any) => {
    const { filename, mimeType } = part;
    downloadFileFromGmail(attachmentId, messageId, mimeType)
      .then((URL) => {
        const a = document.createElement('a');
        a.href = URL;
        a.download = filename;
        a.click();
        a.remove();
      })
      .catch(() => {
        //TODO: Handle this case
      });
  };

  const attachmentParts = Array.isArray(parts) ? parts.filter((part: any) => part.body.attachmentId !== void 0) : [];

  if (attachmentParts.length === 0) {
    return <span></span>;
  }

  return (
    <Row className={'attachements' + (withTitle ? ' with-title' : '') + (isSameUser ? ' me' : '')}>
      {withTitle && (
        <Col span={24} className="attachement-title">
          <Typography>Attached files</Typography>
        </Col>
      )}
      <Col span={24}>
        <Row className="files-container">
          {attachmentParts.map((attachmentPart: any, index: number) => {
            const extension = attachmentPart.filename.replace(/^.+\.([a-zA-Z0-9]+)$/, '$1');
            const filename = attachmentPart.filename;
            const mimeType = attachmentPart.mimeType;
            const isImage = /image\/.+/.test(mimeType);
            const size = getFileSize(attachmentPart.body.size);
            const attachmentId = attachmentPart.body.attachmentId;
            const messageId = message.id;

            return (
              <Col span={6} key={index} className="file-attached">
                <Row>
                  <Col span={24} className="file">
                    {isImage ? (
                      <ImageViewer isFile={false} attachment={{ attachmentId, messageId, mimeType }} />
                    ) : (
                      <FileInformation filename={filename} extension={extension} />
                    )}
                    <Row className="down">
                      <Col className="size">
                        <Typography>{size}</Typography>
                      </Col>
                      <Col>
                        <Button onClick={() => downloadFile(attachmentId, messageId, attachmentPart)}>
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
