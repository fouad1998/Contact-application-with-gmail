import { emailRegexp } from '../../constant/constant';

export const getReceiveEmail = (message: any, ignore: string): string => {
  const email = message.payload.headers.find((header: any) => header.name === 'To').value.match(emailRegexp)[0];
  if (email === ignore) {
    const email = message.payload.headers.find((header: any) => header.name === 'From').value.match(emailRegexp)[0];
    return email;
  }
  return email;
};
