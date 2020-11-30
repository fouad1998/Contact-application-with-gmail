import { Col, Row, Typography } from 'antd';
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
  const attachementParts = Array.isArray(parts) ? parts.filter((part: any) => part.body.attachmentId !== void 0) : [];
  return (
    <Row className="attachements">
      {attachementParts.length > 0 && (
        <Col span={24} className="attachement-title">
          <Typography.Title level={5}>Attached files</Typography.Title>
        </Col>
      )}
      {attachementParts.map((attachementPart: any, index: number) => {
        const extention = attachementPart.filename.replace(/^.+\.([a-zA-Z0-9]+)$/, '$1');
        const size = transformFileSizeUnit(attachementPart.body.size);

        return (
          <Col span={4} key={index} className="file-attached">
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
