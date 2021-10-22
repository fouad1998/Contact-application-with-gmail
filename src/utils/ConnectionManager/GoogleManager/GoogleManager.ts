import { clientId } from "../../../config/gmail/config";
import { loadAuth } from "../../gmail/LoadAuth";
import { sendMail } from "../../gmail/SendMail";
import Model from "../Model/Model";
import { GmailHeaders } from "../../../interfaces/gmail/SendMail";
import { Messages } from "../interface/Messages";
import { getListEmailId } from "../../gmail/ListEmailId";
import { getEmailsContent } from "../../gmail/EmailContentFetch";
import { getMessageBodyAsText } from "../../gmail/getMessageBodyAsText";
import { getMessageBodyAsHTML } from "../../gmail/getMessageBodyAsHTML";
import { Contact } from "../../../interfaces/data/Contact";
import { defaultUser } from "../../../constant/data/user";
import { sendMailWithAttachments } from "../../gmail/sendMailWithAttachments";

export default class GoogleManager extends Model {
  private googleAuth: any = null;
  private static gapiNotLoadedError = new Error("gapi is not loaded yet!");
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

  connect = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (this.ready) {
        this.googleAuth
          .signIn()
          .then((e: any) => {
            console.log("The content of the google auth", e);
            resolve(true);
            this.updateSigningStatus(true);
          })
          .catch(() => {
            this.updateSigningStatus(false);
            resolve(false);
          });
      } else {
        this.updateSigningStatus(false);
        resolve(false);
      }
    });
  };

  getContacts(): Promise<Contact> {
    return new Promise((resolve, reject) => {});
  }

  sendMessage(message: string, headers: GmailHeaders): Promise<boolean> {
    const additionHeaders = 'Content-Type: text/plain; charset="UTF-8"\r\n';
    return new Promise((resolve) => {
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
    return new Promise((resolve) =>
      sendMailWithAttachments(message, headers, files)
        .then(() => resolve(true))
        .catch(() => resolve(false))
    );
  }

  getMessages(email: string[], label: string, pageToken?: string): Promise<Messages> {
    return new Promise((resolve, reject) => {
      getListEmailId(email, label, pageToken)
        .then((response) => {
          if (response.messagesId.length > 0) {
            //FIXME: add the user mail here
            getEmailsContent(response.messagesId, "").then((emailsContent) => {
              const messages: Messages = {
                nextTokenPage: response.nextTokenPage,
                messages: emailsContent.map((email) => ({
                  email: email.email,
                  html: getMessageBodyAsHTML(email.message),
                  text: getMessageBodyAsText(email.message),
                  id: "",
                  attachments: [],
                  isSender: false,
                })),
              };
              resolve(messages);
            });
          } else {
            // no message in discussion
            resolve({ nextTokenPage: "", messages: [] });
          }
        })
        .catch(reject);
    });
  }

  private updateSigningStatus = (connected: boolean) => {
    this.connected = connected;
    this.authListener(connected);
    if (connected) {
      const profile = this.googleAuth.currentUser.get().getBasicProfile();
      this.user = {
        email: profile.getEmail(),
        imageURL: profile.getImageUrl(),
        lastname: profile.getFamilyName(),
        name: profile.getGivenName(),
        username: profile.getName(),
      };
      console.log("Full Name: ", this.user);
    } else {
      this.user = defaultUser;
    }
  };
}
