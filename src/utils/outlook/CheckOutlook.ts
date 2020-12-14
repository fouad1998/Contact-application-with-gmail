import { msalRequest } from '../../config/outlook/config';
import { msalClient } from './MSALClient';

export const CheckOutlookConnection = async () => {
  const account = sessionStorage.getItem('msalAccount');
  if (account) {
    const silentRequest = {
      scopes: msalRequest.scopes,
      account: msalClient.getAccountByUsername(account)!,
    };

    try {
      const silentResult = await msalClient.acquireTokenSilent(silentRequest);
      if (typeof silentResult.accessToken === 'string') {
        return true;
      } else {
        return false;
      }
    } catch {
      return false;
    }
  } else {
    return false;
  }
};
