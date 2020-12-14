import { CheckOutlookConnection } from '../../outlook/CheckOutlook';
import { signIn } from '../../outlook/Connect';
import Model from '../Model/Model';

export default class OutlookManager extends Model {
  private googleAuth: any = null;
  private static gapiNotLoadedError = new Error('Graph is not loaded yet!');
  private static callAuthLoad = true;
  private static outlookManagerInstance: null | OutlookManager = null;

  static getInstance = (authListener: (status: boolean) => void, onLoad?: () => void, onFaild?: () => void) => {
    // This function has for objective to garuante there is only one instance of this class
    if (OutlookManager.outlookManagerInstance) {
      return OutlookManager.outlookManagerInstance;
    } else {
      OutlookManager.outlookManagerInstance = new OutlookManager(authListener, onLoad, onFaild);
      return OutlookManager.outlookManagerInstance;
    }
  };

  private constructor(authListener: (status: boolean) => void, onLoad?: () => void, onFaild?: () => void) {
    super(authListener, onLoad, onFaild);
    this.ready = true;

    this.checkConnectionStatus();
  }

  checkConnectionStatus(): Promise<boolean> {
    return new Promise(resolve => {
      CheckOutlookConnection()
        .then(status => {
          if (status) {
            this.updateSigningStatus(true);
            resolve(true);
          } else {
            this.updateSigningStatus(false);
            resolve(false);
          }
        })
        .catch(() => {
          //This case means the user isn't connected
          this.updateSigningStatus(false);
          resolve(false);
        });
    });
  }

  isConnected(): boolean {
    return this.connected;
  }

  connect = () => {
    signIn()
      .then(() => {
        this.updateSigningStatus(true);
      })
      .catch(() => this.updateSigningStatus(false));
  };

  sendMessage(message: string, headers: Headers, additionsHeaders?: string | undefined): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  sendMessageWithAttachments(message: string, headers: Headers, files: any[], additionsHeaders?: string | undefined): boolean {
    throw new Error('Method not implemented.');
  }

  private updateSigningStatus = (connected: boolean) => {
    this.connected = connected;
    this.authListener(connected);
  };
}
