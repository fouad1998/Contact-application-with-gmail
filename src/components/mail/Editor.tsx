import { Button, Col, Row } from 'antd';
import React, { useContext, useState } from 'react';
import { TextAreaChat } from '../Inputs/TextareaChat';
import AdvancedEditor from '../Inputs/AdvancedEditor';
import { GmailContext } from '../../context/Gmail';

interface EditorProps {}

const EditorI: React.FC<EditorProps> = () => {
  const { state, sendMessage } = useContext(GmailContext);

  const { editor, currentContact } = state!;

  return (
    <Row className={'editor' + (editor !== 'simple' ? ' editor-advanced' : '')}>
      <Col span={24} className="editor-container">
        {editor === 'simple' ? (
          <TextAreaChat onSubmit={sendMessage!} to={currentContact} />
        ) : (
          <AdvancedEditor to={currentContact} onSubmit={sendMessage!} />
        )}
      </Col>
    </Row>
  );
};

export default React.memo(EditorI);
