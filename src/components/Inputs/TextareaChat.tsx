import React, { useCallback, useState } from 'react';
import { Button, Col, Input, Row, Upload, Modal } from 'antd';
import { Add } from '@material-ui/icons';
import { RcFile, UploadFile } from 'antd/lib/upload/interface';
import { UploadSelection } from '../../interfaces/gmail/UploadSelection';
import UploaderViewer from '../view/UploaderViewer';

const { TextArea } = Input;

const { error } = Modal;

interface TextAreaInterface {
  to: string;
  onSubmit: (content: string, header: string) => any;
}

export const TextAreaChat: React.FC<TextAreaInterface> = ({ onSubmit, to }) => {
  const [content, setContent] = useState<string>('');
  const [filesContent, setFilesContent] = useState<UploadSelection[]>([]);

  const onChangeHandler = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
    event.stopPropagation();
    const {
      target: { value },
    } = event;
    setContent(value);
  }, []);

  const onKeyDownHandler = useCallback(
    (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      event.stopPropagation();
      const { altKey, shiftKey, code, keyCode } = event;

      if ((altKey || shiftKey) && (code === '\n' || keyCode === 13)) {
        return void 0;
      } else if (code === '\n' || keyCode === 13) {
        event.preventDefault();
        setContent('');
        setFilesContent([]);
      }
    },
    [content, filesContent]
  );

  const beforeUpload = useCallback(
    (file: RcFile) => {
      let totalSize = file.size;
      for (const file of filesContent) {
        totalSize += file.size;
      }
      if (totalSize / 1024 ** 2 > 25) {
        error({
          title: 'Limit exceed',
          content: 'Cannot select files more than 25MB in Total',
        });
      } else {
        const { size, name, type, uid } = file;
        file
          .text()
          .then(str => {
            console.log(str);
            setFilesContent(state => [...state, { size, type, filename: name, content: str, file, id: uid }]);
          })
          .catch(() =>
            error({
              title: 'Faild to parse the file to a text',
              content:
                "The process of parsing the file to text couldn't be done of some reason, we are sorry if you can not upload that file.\nSo please try again :)",
            })
          );
      }
      return false;
    },
    [filesContent]
  );

  const onRemove = useCallback((uid: string) => {
    setFilesContent(state => state.filter(file => file.id !== uid));
  }, []);

  return (
    <Row className="textarea-chat">
      {filesContent.length > 0 && (
        <Col span={24}>
          <UploaderViewer filesContent={filesContent!} remove={onRemove} />
        </Col>
      )}
      <Col span={24}>
        <Row className="input-section">
          <Col span={4}>
            <Upload beforeUpload={beforeUpload} fileList={filesContent.map(e => e.file)} itemRender={() => void 0}>
              <Button>
                <Add />
              </Button>
            </Upload>
          </Col>
          <Col span={20}>
            <TextArea
              onKeyDown={onKeyDownHandler}
              onChange={onChangeHandler}
              placeholder={`Message to ${to}`}
              value={content}
              autoSize={{ maxRows: 5, minRows: 1 }}
              className="textarea-chat"
            />
          </Col>
        </Row>
      </Col>
    </Row>
  );
};
