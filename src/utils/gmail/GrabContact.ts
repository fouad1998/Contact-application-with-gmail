import { Contact } from '../../components/mail/Contacts';

export const grabContact = (data: any) => {
  const contacts = [];

  for (let i = 0; i < data.feed.entry.length; i++) {
    const entry = data.feed.entry[i];
    const contact: Contact = {
      kickname: entry['title']['$t'],
      emails: [],
    };

    if (entry['gd$email']) {
      const emails = entry['gd$email'];
      for (let j = 0; j < emails.length; j++) {
        const email: any = emails[j];
        contact['emails'].push(email['address']);
      }
    }

    if (!contact['kickname']) {
      contact['kickname'] = contact['emails'][0] || '<Unknown>';
    }

    contacts.push(contact);
  }

  return contacts;
};
