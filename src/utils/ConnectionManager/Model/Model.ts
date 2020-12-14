export default abstract class Model {
  protected authListener: (status: boolean) => void;
  protected ready: boolean = false;
  protected connected: boolean = false;
  protected onLoad?: () => void;
  protected onFaild?: () => void;

  constructor(authListener: (status: boolean) => void, onLoad?: () => void, onFaild?: () => void) {
    this.authListener = authListener;
    this.onLoad = onLoad;
    this.onFaild = onFaild;
  }

  setConfig() {}

  abstract checkConnectionStatus(): Promise<boolean>;
  abstract connect(): void;
  abstract isConnected(): boolean;
  abstract sendMessage(message: string, headers: Headers, additionsHeaders?: string): Promise<boolean>;
  abstract sendMessageWithAttachments(message: string, headers: Headers, files: Array<any>, additionsHeaders?: string): boolean;
}
