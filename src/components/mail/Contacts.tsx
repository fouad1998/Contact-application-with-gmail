import { Col, Row } from 'antd';
import React, { useContext } from 'react';
import { Loader } from '../Loader/Loader';
import { GmailContext } from '../../context/Gmail';
import ErrorLoading from '../Error/ErrorLoading';
import ContactItem from '../design/ContactItem';
import GeneralSettings from '../settings/global/GeneralSettings';

interface ContactProps {}

const Contacts: React.FC<ContactProps> = () => {
  const { state, loadingContacts, errorLoadingContacts, selectContact, reloadContacts } = useContext(GmailContext);

  return (
    <Row>
      {loadingContacts && <Loader />}
      <Col span={24} className="title">
        <h3>Contacts</h3>
      </Col>
      <Col span={24} className="contacts">
        {errorLoadingContacts ? (
          <ErrorLoading title="Couldn't load contacts" actionTitle="Reload" actionFunction={reloadContacts!} />
        ) : (
          <Row>
            <Col span={24}>
              {state!.contacts.map((contact, index) => {
                const isActive =
                  state!.currentContact === 'ALL'
                    ? contact.emails.reduce((acc, email) => acc && state!.currentContact.includes(email), true)
                    : contact.emails.includes(state!.currentContact);

                return <ContactItem isActive={isActive} key={index} contact={contact} select={selectContact!} />;
              })}
            </Col>
          </Row>
        )}
      </Col>
      <Col span={24}>
        <GeneralSettings />
      </Col>
    </Row>
  );
};

export default React.memo(Contacts);
