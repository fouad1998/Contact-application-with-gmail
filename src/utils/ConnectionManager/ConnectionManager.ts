import GoogleManager from './GoogleManager/GoogleManager';
import OutlookManager from './OutlookManager/OutlookManager';

export default class ConnectionManager {
  googleManager: GoogleManager;
  outlookManager: OutlookManager;
  connectionStatus = { google: false, outlook: false };
  allowedToUse = { google: false, outlook: false };

  constructor() {
    this.googleManager = GoogleManager.getInstance((status) => this.updateSigninStatus(status, 'google'));
    this.outlookManager = OutlookManager.getInstance((status) => this.updateSigninStatus(status, 'outlook'));
  }

  private updateSigninStatus = (status: boolean, which: string) => {
    switch (which) {
      case 'google':
        this.connectionStatus.google = status;
        break;

      case 'outlook':
        this.connectionStatus.outlook = status;
        break;

      default:
        return void 0;
    }
  };
}
