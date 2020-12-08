import { Modal, Row, Col, Form, Select } from 'antd';
import React, { useCallback, useContext, useState } from 'react';
import { GmailContext } from '../../../context/Gmail';
import { GmailSettings } from '../../Gmail';

interface SettingsProps {
  visible: boolean;
  onOk: () => void;
  onCancel: () => void;
}

const Settings: React.FC<SettingsProps> = ({ visible, onCancel, onOk }) => {
  const { state, saveSettings } = useContext(GmailContext);

  const [settings, setSettings] = useState<GmailSettings>({
    selectedLabel: state!.currentLabel,
    messageShowModel: state!.messageShowModel,
    editor: state!.editor,
    messageThread: state!.messageThread,
  });

  const settingsLabelChangeHandler = useCallback((label: string) => {
    setSettings((state) => ({ ...state, selectedLabel: label }));
  }, []);

  const settingsMessageModelChangeHandler = useCallback((model: string) => {
    setSettings((state) => ({ ...state, messageShowModel: model }));
  }, []);

  const settingsEditorTypeChangeHandler = useCallback((editorType: string) => {
    setSettings((state) => ({ ...state, editor: editorType }));
  }, []);

  const settingsMessageThreadChangeHandler = useCallback((thread: string) => {
    setSettings((state) => ({ ...state, messageThread: thread }));
  }, []);

  const settingsSaveHandler = useCallback(() => {
    saveSettings && saveSettings(settings);
    onOk();
  }, [settings]);

  const settingsCancelHandler = useCallback(() => {
    setSettings({
      selectedLabel: state!.currentLabel,
      messageShowModel: state!.messageShowModel,
      editor: state!.editor,
      messageThread: state!.messageThread,
    });
    onCancel();
  }, [state]);

  return (
    <Modal title="Settings" visible={visible} onOk={settingsSaveHandler} onCancel={settingsCancelHandler}>
      <Row>
        <Col span={24}>
          <Form>
            <Form.Item label="Label">
              <Select defaultValue={'ALL'} value={settings.selectedLabel} onChange={settingsLabelChangeHandler}>
                {state!.labels.map((label, index) => (
                  <Select.Option value={label} key={index}>
                    {label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="Model">
              <Select
                defaultValue={'snippet'}
                value={settings.messageShowModel}
                onChange={settingsMessageModelChangeHandler}
              >
                {['snippet', 'complete as text', 'complete as html'].map((label, index) => (
                  <Select.Option value={label} key={index}>
                    {label.toLocaleUpperCase()}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="Editor">
              <Select defaultValue={'simple'} value={settings.editor} onChange={settingsEditorTypeChangeHandler}>
                {['simple', 'advanced'].map((label, index) => (
                  <Select.Option value={label} key={index}>
                    {label.toLocaleUpperCase()}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="Message thread">
              <Select
                defaultValue={'last thread'}
                value={settings.messageThread}
                onChange={settingsMessageThreadChangeHandler}
              >
                {['new thread', 'last thread'].map((label, index) => (
                  <Select.Option value={label} key={index}>
                    {label.toLocaleUpperCase()}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </Modal>
  );
};

export default React.memo(Settings);
