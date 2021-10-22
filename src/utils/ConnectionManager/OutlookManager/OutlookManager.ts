import { CheckOutlookConnection } from "../../outlook/CheckOutlook";
import { signIn } from "../../outlook/Connect";
import Model from "../Model/Model";
import { GmailHeaders } from "../../../interfaces/gmail/SendMail";
import { Messages } from "../interface/Messages";
import { Contact } from "../../../interfaces/data/Contact";

export default class OutlookManager extends Model {
  getContacts(): Promise<Contact> {
    throw new Error("Method not implemented.");
  }
  private googleAuth: any = null;
  private static gapiNotLoadedError = new Error("Graph is not loaded yet!");
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
    this.onLoad && this.onLoad();
    this.checkConnectionStatus();
  }

  checkConnectionStatus(): Promise<boolean> {
    return new Promise((resolve) => {
      CheckOutlookConnection()
        .then((status) => {
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

  connect = (): Promise<boolean> => {
    return new Promise((resolve) => {
      signIn()
        .then(() => {
          resolve(true);
          this.updateSigningStatus(true);
        })
        .catch(() => {
          resolve(false);
          this.updateSigningStatus(false);
        });
    });
  };

  sendMessage(message: string, headers: GmailHeaders): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  sendMessageWithAttachments(message: string, headers: GmailHeaders, files: any[]): Promise<boolean> {
    throw new Error("Method not implemented.");
  }

  getMessages(emails: string[], label: string, pageToken?: string): Promise<Messages> {
    throw new Error("Method not implemented.");
  }

  private updateSigningStatus = (connected: boolean) => {
    this.connected = connected;
    this.authListener(connected);
  };
}
