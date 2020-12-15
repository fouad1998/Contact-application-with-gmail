import { clientId } from '../../../config/gmail/config';
import { loadAuth } from '../../gmail/LoadAuth';
import { sendMail } from '../../gmail/SendMail';
import Model from '../Model/Model';
import { GmailHeaders } from '../../../interfaces/gmail/SendMail';

export default class GoogleManager extends Model {
  private googleAuth: any = null;
  private static gapiNotLoadedError = new Error('gapi is not loaded yet!');
  private static callAuthLoad = true;
  private static googleManagerInstance: null | GoogleManager = null;

  static getInstance = (authListener: (status: boolean) => void, onLoad?: () => void, onFaild?: () => void) => {
    // This function has for objective to garuante there is only one instance of this class
    if (GoogleManager.googleManagerInstance) {
      return GoogleManager.googleManagerInstance;
    } else {
      GoogleManager.googleManagerInstance = new GoogleManager(authListener, onLoad, onFaild);
      return GoogleManager.googleManagerInstance;
    }
  };

  private constructor(authListener: (status: boolean) => void, onLoad?: () => void, onFaild?: () => void) {
    super(authListener, onLoad, onFaild);
    if (GoogleManager.callAuthLoad) {
      // We didn't load the google auth yet!
      loadAuth()
        .then(() => {
          this.onLoad && this.onLoad();
          GoogleManager.callAuthLoad = false;
          this.ready = true;
          this.googleAuth = window.gapi.auth2.getAuthInstance();
          this.googleAuth.isSignedIn.listen(this.updateSigningStatus);
        })
        .catch(() => {
          this.onFaild && this.onFaild();
        });
    } else {
      // Google auth is loaded
      //TODO: Look how can we handle this case too
    }
  }

  checkConnectionStatus(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (this.ready) {
        window.gapi.auth.checkSessionState(clientId, (e: boolean) => resolve(e));
      } else {
        reject(GoogleManager.gapiNotLoadedError);
      }
    });
  }

  isConnected(): boolean {
    if (this.ready) {
      return this.connected;
    } else {
      throw GoogleManager.gapiNotLoadedError;
    }
  }

  connect = () => {
    if (this.ready) {
      this.googleAuth.signIn();
    } else {
      throw GoogleManager.gapiNotLoadedError;
    }
  };

  sendMessage(message: string, headers: GmailHeaders): Promise<boolean> {
    const additionHeaders = 'Content-Type: text/plain; charset="UTF-8"\r\n';
    return new Promise(resolve => {
      sendMail(message, headers, additionHeaders)
        .then(() => {
          resolve(true);
        })
        .catch(() => {
          resolve(false);
        });
    });
  }

  sendMessageWithAttachments(message: string, headers: GmailHeaders, files: any[]): Promise<boolean> {
    const email = `--emplorium_boundary
    
    ${message}
    ${files
      .map(
        file => `
    
    --emplorium_boundary
    Content-Type: ${file.type}
    Content-Transfer-Encoding: base64
    Content-Disposition: attachment; filename="${file.filename}"
    
    ${file.content}
    
    `
      )
      .join('')}
    
    --emplorium_boundary--
    `;

    const additionHeaders = 'Content-Type: multipart/mixed; boundary="emplorium_boundary"\r\nMIME-Version: 1.0\r\n';
    return new Promise(resolve =>
      sendMail(email, headers, additionHeaders)
        .then(e => resolve(true))
        .catch(e => resolve(false))
    );
  }

  private updateSigningStatus = (connected: boolean) => {
    this.connected = connected;
    this.authListener(connected);
  };
}
