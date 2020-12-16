import GoogleManager from './GoogleManager/GoogleManager';
import { ConnectionManagerConfig, ConnectionManagerProps } from './interface/ConnectionManager';
import OutlookManager from './OutlookManager/OutlookManager';

export default class ConnectionManager {
  googleManager: GoogleManager;
  outlookManager: OutlookManager;
  connectionStatus = { google: false, microsoft: false };
  loadSerives = { google: false, microsoft: false };
  services: string[] = [];
  config: ConnectionManagerConfig = { selectedService: 'google' };
  isAuthorizedListener: (status: boolean) => void;
  authorizedServicesListener: (services: string[]) => void;
  onLoad?: () => void;
  onFaild?: (reloadFunc: () => void) => void;

  private static connectionManagerInstance: ConnectionManager | null = null;

  static getInstance(props: ConnectionManagerProps) {
    if (ConnectionManager.connectionManagerInstance) {
      return ConnectionManager.connectionManagerInstance;
    } else {
      ConnectionManager.connectionManagerInstance = new ConnectionManager(props);
      return ConnectionManager.connectionManagerInstance;
    }
  }

  private constructor(props: ConnectionManagerProps) {
    this.googleManager = GoogleManager.getInstance(
      status => this.updateSigninStatus(status, 'google'),
      () => this.onLoadService('google')
    );
    this.outlookManager = OutlookManager.getInstance(
      status => this.updateSigninStatus(status, 'outlook'),
      () => this.onLoadService('microsoft')
    );
    this.isAuthorizedListener = props.isAuthorizedListener;
    this.authorizedServicesListener = props.authorizedServiceListener;
    this.onLoad = props.onLoad
    this.onFaild = props.onFaild
  }

  connect(which: 'google' | 'microsoft') {
    switch (which) {
      case 'google':
        return this.googleManager.connect();

      case 'microsoft':
        return this.outlookManager.connect();

      default:
        return void 0;
    }
  }

  private onLoadService(which: 'google' | 'microsoft') {
    switch (which) {
      case 'google':
        this.loadSerives.google = true;
        break;
      case 'microsoft':
        this.loadSerives.microsoft = true;
        break;

      default:
        return void 0;
    }

    if (Object.values(this.loadSerives).reduce((prev, curr) => prev && curr, true)) {
      // All service are loaded
      this.onLoad && this.onLoad();
    }
  }

  private onFaildService(which: 'google' | 'microsoft', reload: () => void) {
    //TODO: Enhance this method
    this.onFaild && this.onFaild(reload);
  }

  private updateSigninStatus = (status: boolean, which: string) => {
    switch (which) {
      case 'google':
        this.connectionStatus.google = status;
        this.updateAuthorizedServices('google', status);
        break;

      case 'microsoft':
        this.connectionStatus.microsoft = status;
        this.updateAuthorizedServices('microsoft', status);
        break;

      default:
        return void 0;
    }

    // Update the authorized status
    this.isAuthorizedListener(Object.values(this.connectionStatus).reduce((prev, curr) => prev || curr, false));
  };

  private updateAuthorizedServices = (service: string, status: boolean) => {
    if (status) {
      this.services.push(service);
    } else {
      this.services = this.services.filter(value => value !== service);
    }

    this.authorizedServicesListener([...this.services]);
  };
}
