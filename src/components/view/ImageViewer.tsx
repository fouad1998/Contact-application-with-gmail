import { Col, Row } from 'antd';
import { RcFile } from 'antd/lib/upload';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { getURLFromRcFile } from '../../utils/utils/GetURLFromRcFile';
import { Loader } from '../Loader/Loader';

interface ImageViewerProps {
  readonly isFile: boolean;
  readonly file?: RcFile;
  readonly attachmentId?: string;
}

const ImageViewer: React.FC<ImageViewerProps> = ({ isFile, file, attachmentId }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [imageURL, setImageURL] = useState<string>('');

  useEffect(() => {
    if (isFile) {
      getURLFromRcFile(file!)
        .then((response) => {
          setImageURL(response);
          setLoading(false);
        })
        .catch(() => {});
    } else {
    }
  }, []);

  return (
    <Row className="image-viewer">
      <Col span={24}>{loading ? <Loader /> : <img src={imageURL} />}</Col>
    </Row>
  );
};

export default React.memo(ImageViewer);
