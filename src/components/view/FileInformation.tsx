import { Typography } from '@material-ui/core';
import { Col, Row } from 'antd';
import React from 'react';
import { defaultStyles, FileIcon } from 'react-file-icon';

interface FileInformationProps {
  extension: string;
  filename: string;
}

const FileInformation: React.FC<FileInformationProps> = ({ filename, extension }) => {
  return (
    <Row className="information">
      <Col className="icon">
        {/**@ts-ignore */}
        <FileIcon extension={extension} {...defaultStyles[extension]} />
      </Col>
      <Col className="name" span={24}>
        <Typography>{filename.length > 20 ? filename.substr(0, 17) + '...' : filename}</Typography>
      </Col>
    </Row>
  );
};

export default React.memo(FileInformation);
