import { msalRequest } from '../../config/outlook/config';
import { msalClient } from './MSALClient';

export const signIn = () => {
  return new Promise((resolve, reject) => {
    msalClient
      .loginPopup(msalRequest)
      .then((authResult) => {
        sessionStorage.setItem('msalAccount', authResult.account!.username);
        resolve(authResult.accessToken);
      })
      .catch(reject);
  });
};
