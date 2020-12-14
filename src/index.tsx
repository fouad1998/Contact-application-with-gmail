import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { connectionManagerContext } from './context/ConnectionManager';
import reportWebVitals from './reportWebVitals';
import ConnectionManager from './utils/ConnectionManager/ConnectionManager';
import { ConnectionManagerContext } from './interfaces/context/ConnectionManager';

declare global {
  interface Window {
    gapi: any;
  }
}

export interface IndexProps {}

const Index: React.FC<IndexProps> = () => {
  const [isAuthorized, setAuthorized] = useState<boolean>(false);
  const [allowedServices, setAllowedServices] = useState<string[]>([]);

  const isAuthorizedListener = (status: boolean) => setAuthorized(status);
  const authorizedServiceListener = (services: string[]) => setAllowedServices(services);

  const connectionManager = ConnectionManager.getInstance({
    isAuthorizedListener,
    authorizedServiceListener,
  });

  const contextValues: ConnectionManagerContext = {
    isAuthorized,
    connectionManager,
    authorizedService: allowedServices,
  };

  return (
    <React.StrictMode>
      <connectionManagerContext.Provider value={contextValues}>
        <App />
      </connectionManagerContext.Provider>
    </React.StrictMode>
  );
};

export default React.memo(Index);

ReactDOM.render(<Index />, document.getElementById('root'));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
