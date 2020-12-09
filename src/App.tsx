import React, { useState, useEffect } from 'react';
import { Layout, Row, Col } from 'antd';
import Gmail from './components/Gmail';
import Signin from './components/Signin';
import { SnackbarProvider } from 'notistack';
import 'antd/dist/antd.css';
import './scss/home.scss';
import './scss/signin.scss';
import './scss/mailBoxInterface.scss';
import { ConnectGoogle } from './utils/gmail/Connect';
import { Loader } from './components/Loader/Loader';
import ErrorLoading from './components/Error/ErrorLoading';

declare global {
  interface Window {
    gapi: any;
  }
}

window.gapi = window.gapi || {};

export default function App() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [GoogleAuth, setGoogleAuth] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const LoadGoogleAuth = () => {
    ConnectGoogle()
      .then(() => {
        const GoogleAuth = window.gapi.auth2.getAuthInstance();
        GoogleAuth.isSignedIn.listen(updateSigninStatus);
        const status = GoogleAuth.isSignedIn.get();
        //@ts-ignore
        updateSigninStatus(status);
        setGoogleAuth(GoogleAuth);
      })
      .catch(() => {
        setLoading(false);
        setError(true);
      });
  };

  useEffect(LoadGoogleAuth, []);

  function updateSigninStatus(isSignedIn: boolean) {
    setLoading(false);
    if (isSignedIn) {
      setIsAuthorized(true);
    } else {
      setIsAuthorized(false);
    }
  }

  return (
    <SnackbarProvider maxSnack={3}>
      <Layout style={{ height: '100vh', position: 'relative' }}>
        {(loading || error) && (
          <Row style={{ position: 'absolute', left: 0, top: 0, zIndex: 10 }}>
            {loading && <Loader />}
            {error && <ErrorLoading title="Error loading" actionTitle="Reload" actionFunction={LoadGoogleAuth} />}
          </Row>
        )}
        <Row className="home">
          <Col span={24} className="title">
            <h1>Contacts Application with Gmail</h1>
          </Col>
          <Col span={24}>
            {/**@ts-ignore */}
            {isAuthorized && !loading && !error && <Gmail />}
            {/**@ts-ignore */}
            {!isAuthorized && !loading && !error && <Signin signin={GoogleAuth.signIn} loading={loading} />}
          </Col>
        </Row>
      </Layout>
    </SnackbarProvider>
  );
}
