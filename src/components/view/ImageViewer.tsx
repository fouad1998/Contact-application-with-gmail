import { Col, Row } from 'antd';
import { RcFile } from 'antd/lib/upload';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { downloadFileFromGmail } from '../../utils/gmail/DownloadFile';
import { getURLFromRcFile } from '../../utils/utils/GetURLFromRcFile';
import { Loader } from '../Loader/Loader';

interface ImageViewerProps {
  readonly isFile: boolean;
  readonly file?: RcFile;
  readonly attachment?: { attachmentId: string; messageId: string; mimeType: string };
}

const ImageViewer: React.FC<ImageViewerProps> = ({ isFile, file, attachment }) => {
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
      if (attachment) {
        const { attachmentId, messageId, mimeType } = attachment;
        downloadFileFromGmail(attachmentId, messageId, mimeType)
          .then((URL) => {
            setImageURL(URL);
            setLoading(false);
          })
          .catch(() => {
            //TODO: Handle this case
          });
      }
    }
  }, []);

  return (
    <Row className="image-viewer">
      <Col span={24}>{loading ? <Loader /> : <img src={imageURL} />}</Col>
    </Row>
  );
};

export default React.memo(ImageViewer);
