import { Button, Col, Row } from 'antd';
import React, { useContext, useState } from 'react';
import { EditorState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import { EditorContext } from '../../context/CreateEditorContext';
import { TextAreaChat } from '../Inputs/TextareaChat';
import ReactQuill from 'react-quill';

interface EditorProps {
  editor: string;
  currentContact: string;
  sendMessage: (content: string) => any;
}

const EditorI: React.FC<EditorProps> = ({ editor, currentContact, sendMessage }) => {
  const [editorContent, setEditorContent] = useState<string>('');

  console.log(editorContent);

  return (
    <Row className={'editor' + (editor !== 'simple' ? ' editor-advanced' : '')}>
      <Col span={24} className="editor-container">
        {editor === 'simple' ? (
          <TextAreaChat onSubmit={sendMessage} to={currentContact} />
        ) : (
          <Row className="editor-advanced-container">
            <Col span={24}>
              {/* {<Editor
                editorState={editorContent}
                wrapperClassName="editor-wrapper"
                editorClassName="editor-engine"
                onEditorStateChange={(content) => setEditorContent(content)}
                placeholder="The message goes here..."
              />} */}
              {/* <ReactQuill value={editorContent} onChange={(state) => setEditorContent(state)} /> */}
            </Col>
            <Col span={24} className="actions">
              <Button>Cancel</Button>
              <Button>Send</Button>
            </Col>
          </Row>
        )}
      </Col>
    </Row>
  );
};

export default React.memo(EditorI);
