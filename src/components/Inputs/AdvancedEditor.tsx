import { Button, Col, Row } from 'antd';
import React, { useCallback, useState } from 'react';
import ReactQuill from 'react-quill'; // ES6
import 'react-quill/dist/quill.snow.css'; // ES6

interface AdvancedEditorProps {
  to: string;
  onSubmit: (content: string, header: string) => any;
}

const AdvancedEditor: React.FC<AdvancedEditorProps> = ({ to, onSubmit }) => {
  const [content, setContent] = useState<string>('');

  const onChangeHandler = useCallback((content: string) => {
    setContent(content);
  }, []);

  const onClearClickHandler = useCallback(() => {
    setContent('');
  }, []);

  const onSendClickHandler = useCallback(() => {
    onSubmit(content, 'Content-Type: text/html; charset="UTF-8"\r\n');
    setContent('');
  }, [content]);

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
      ['link', 'image'],
      ['clean'],
    ],
  };

  const formats = [
    'header',
    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'indent',
    'link',
    'image',
    'color',
  ];

  return (
    <Row className="editor-advanced-container" dir="column">
      <Col span={24} className="editor-core-container">
        <ReactQuill
          placeholder={`Message ${to}`}
          modules={modules}
          formats={formats}
          theme={'snow'} // pass false to use minimal theme
          value={content}
          onChange={onChangeHandler}
        />
      </Col>

      <Col span={24} className="actions">
        <Button danger={true} onClick={onClearClickHandler}>
          Clear
        </Button>
        <Button type="primary" onClick={onSendClickHandler}>
          Send
        </Button>
      </Col>
    </Row>
  );
};

export default React.memo(AdvancedEditor);
