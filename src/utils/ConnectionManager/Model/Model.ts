import { Contact } from "../../../interfaces/data/Contact";
import { User } from "../../../interfaces/data/User";
import { GmailHeaders } from "../../../interfaces/gmail/SendMail";
import { Messages } from "../interface/Messages";

export default abstract class Model {
  protected readonly authListener: (status: boolean) => void;
  protected ready: boolean = false;
  protected connected: boolean = false;
  protected readonly onLoad?: () => void;
  protected readonly onFaild?: () => void;
  protected labels: string[] = [];
  protected user: User = {
    email: "Unknown",
    imageURL: "Unknown",
    lastname: "Unknown",
    name: "Unknown",
    username: "Unknown",
  };

  constructor(authListener: (status: boolean) => void, onLoad?: () => void, onFaild?: () => void) {
    this.authListener = authListener;
    this.onLoad = onLoad;
    this.onFaild = onFaild;
  }

  setConfig() {}

  abstract checkConnectionStatus(): Promise<boolean>;
  abstract connect(): Promise<boolean>;
  abstract isConnected(): boolean;
  abstract getContacts(): Promise<Contact>;
  abstract sendMessage(message: string, headers: GmailHeaders): Promise<boolean>;
  abstract sendMessageWithAttachments(message: string, headers: GmailHeaders, files: Array<any>): Promise<boolean>;
  abstract getMessages(emails: string[], label: string, pageToken?: string): Promise<Messages>;
}
