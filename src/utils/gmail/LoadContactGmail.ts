import Axios from 'axios';
import { Contact } from '../../interfaces/data/Contact';
import { grabContact } from './GrabContact';

// Load contacts from gmail API
export const loadContacts = (email: string): Promise<Contact[]> => {
  const token = window.gapi.client.getToken();

  return new Promise((resolve, reject) => {
    // Success getting the contacts
    const onContactsSuccess = (response: any) => {
      const { data } = response;
      const contacts = grabContact(data);
      resolve(contacts);
    };
    // Fetch the contacts
    Axios.get(
      `https://www.google.com/m8/feeds/contacts/${email}/full?&alt=json&max-results=500&v=3.0&access_token=${token.access_token}`
    )
      .then(onContactsSuccess)
      .catch(reject);
  });
};
