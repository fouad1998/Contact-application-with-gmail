import { Button } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { Col, Row } from 'antd';
import React from 'react';
import { UploadSelection } from '../../interfaces/gmail/UploadSelection';
import ImageViewer from './ImageViewer';

interface UploaderViewerProps {
  filesContent: Array<UploadSelection>;
  remove: (uid: string) => void;
}

const UploaderViewer: React.FC<UploaderViewerProps> = ({ filesContent, remove }) => {
  return (
    <Row className="upload-viewer">
      {filesContent.map((file, index) => (
        <Col key={index} className="view">
          <Button className="remove" color="primary" onClick={() => remove(file.id)}>
            <Close />
          </Button>
          <ImageViewer isFile={true} file={file.file} />
        </Col>
      ))}
    </Row>
  );
};

export default React.memo(UploaderViewer);
