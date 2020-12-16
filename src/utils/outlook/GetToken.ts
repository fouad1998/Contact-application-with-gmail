import { msalRequest } from '../../config/outlook/config';
import { signIn } from './Connect';
import { msalClient } from './MSALClient';
import * as msal from '@azure/msal-browser';

export const getToken = async (): Promise<string> => {
  let account = sessionStorage.getItem('msalAccount');
  if (!account) {
    throw new Error('User account missing from session. Please sign out and sign in again.');
  }

  try {
    // First, attempt to get the token silently
    const silentRequest = {
      scopes: msalRequest.scopes,
      account: msalClient.getAccountByUsername(account)!,
    };

    const silentResult = await msalClient.acquireTokenSilent(silentRequest);
    return silentResult.accessToken;
  } catch (silentError) {
    // If silent requests fails with InteractionRequiredAuthError,
    // attempt to get the token interactively
    if (silentError instanceof msal.InteractionRequiredAuthError) {
      const token = (await signIn()) as string;
      return token;
    } else {
      throw silentError;
    }
  }
};
