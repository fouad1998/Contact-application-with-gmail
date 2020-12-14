export default abstract class Model {
  protected authListener: (status: boolean) => void;
  protected ready: boolean = false;
  protected connected: boolean = false;

  constructor(authListener: (status: boolean) => void) {
    this.authListener = authListener;
  }

  abstract checkConnectionStatus(): Promise<boolean>;
  abstract connect(): void;
  abstract isConnected(): boolean;
  abstract sendMessage(message: string): Promise<boolean>;
  abstract sendMessageWithAttachments(message: string, files: Array<any>): boolean;
}
