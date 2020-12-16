import { Button, Col, Row, Tag } from 'antd';
import React, { useCallback, useContext, useState } from 'react';
import SettingsIcon from '@material-ui/icons/Settings';
import AddIcon from '@material-ui/icons/Add';
import { GmailContext } from '../../../context/Gmail';
import { Contacts } from '@material-ui/icons';
import ContactAdd from '../ContactAdd/ContactAdd';
import Settings from '../settings/Settings';

const GeneralSettings = () => {
  const [showSettings, setShowSettings] = useState(false);
  const [showAddContact, setShowAddContact] = useState(false);

  const { state } = useContext(GmailContext);

  const settingsShowHandler = useCallback(() => {
    setShowSettings((state) => !state);
  }, []);

  const addContactShowHandler = useCallback(() => {
    setShowAddContact((state) => !state);
  }, []);

  return (
    <Row className="controls">
      <Col span={19} className="contacts-number">
        Number of contacts
        <Tag color="green" className="tag">
          {state!.contacts.length}
        </Tag>
      </Col>
      <Col span={5} className="controllers">
        <Button type="ghost" onClick={addContactShowHandler}>
          <AddIcon />
        </Button>
        <Button type="ghost" onClick={settingsShowHandler}>
          <SettingsIcon />
        </Button>
      </Col>
      <ContactAdd visible={showAddContact} onOk={addContactShowHandler} onCancel={addContactShowHandler} />
      <Settings visible={showSettings} onOk={settingsShowHandler} onCancel={settingsShowHandler} />
    </Row>
  );
};

export default React.memo(GeneralSettings);
