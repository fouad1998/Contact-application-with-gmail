import { Button, Col, Row } from 'antd';
import React, { useState } from 'react';
import { TextAreaChat } from '../Inputs/TextareaChat';
import AdvancedEditor from '../Inputs/AdvancedEditor';

interface EditorProps {
  editor: string;
  currentContact: string;
  sendMessage: (content: string, header: string) => any;
}

const EditorI: React.FC<EditorProps> = ({ editor, currentContact, sendMessage }) => {
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
