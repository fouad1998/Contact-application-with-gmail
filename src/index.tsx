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
  const [state, setState] = useState<{loading: boolean; error: boolean; reload: () => void}>({
    loading: true, 
    error: false,
    reload: () => {}
  })

  const isAuthorizedListener = (status: boolean) => setAuthorized(status);
  const authorizedServiceListener = (services: string[]) => setAllowedServices(services);
  const onLoad  = () => 
    setState({
      loading: false, 
      error: false,
      reload: () => {}
    })
  
  const onFaild = (reload: () => void) => 
    setState({
      loading: false, 
      error: true,
      reload,
    })
  

  const connectionManager = ConnectionManager.getInstance({
    isAuthorizedListener,
    authorizedServiceListener,
    onFaild,
    onLoad,
  });

  const contextValues: ConnectionManagerContext = {
    isAuthorized,
    connectionManager,
    authorizedService: allowedServices,
    loading: state.loading,
    error: state.error,
    reload: state.reload
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
