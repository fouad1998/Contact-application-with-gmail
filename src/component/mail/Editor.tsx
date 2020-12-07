import { Button, Col, Row } from 'antd';
import React, { useContext, useState } from 'react';
import { EditorState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import { EditorContext } from '../../context/CreateEditorContext';
import { TextAreaChat } from '../Inputs/TextareaChat';
import ReactQuill from 'react-quill';
import AdvancedEditor from '../Inputs/AdvancedEditor';

interface EditorProps {
  editor: string;
  currentContact: string;
  sendMessage: (content: string, multipart: boolean) => any;
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
          <AdvancedEditor to={currentContact} onSubmit={sendMessage} />
        )}
      </Col>
    </Row>
  );
};

export default React.memo(EditorI);
