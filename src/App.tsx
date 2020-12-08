import React, { useState, useEffect } from 'react';
import { Layout, Row, Col } from 'antd';
import Gmail from './components/Gmail';
import Signin from './components/Signin';
import { SnackbarProvider } from 'notistack';
import 'antd/dist/antd.css';
import './scss/home.scss';
import './scss/signin.scss';
import './scss/mailBoxInterface.scss';

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

  useEffect(() => {
    const LoadGoogleAuth = async () => {
      window.gapi.load('client:auth2', {
        callback: () => {
          window.gapi.client
            .init({
              // Client id you can get it from the google console
              clientId: '235492535889-jmsviunp6r5fusumtql8jlou7tm7vhs8.apps.googleusercontent.com',
              // The API key you can get one from the google console too
              apiKey: 'AIzaSyDAOanQqHi86xX943ff1vyvhl0y5D4K2UM',
              // Scope are the permission needed (the permission we are asking for)
              scope: 'https://www.google.com/m8/feeds https://mail.google.com/',
              // The tools we will use with this API
              discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest'],
            })
            .then(
              () => {
                //@ts-ignore
                const GoogleAuth = gapi.auth2.getAuthInstance();
                GoogleAuth.isSignedIn.listen(updateSigninStatus);
                const status = GoogleAuth.isSignedIn.get();
                //@ts-ignore
                updateSigninStatus(status);
                setGoogleAuth(GoogleAuth);
              },
              () => {
                setLoading(false);
                setError(true);
              }
            );
        },
        onerror: () => console.error('Faild to load the auth2 module'),
        timeout: 30000, //30s
        ontimeout: () => console.error("Timeout the module couldn't be load"),
      });
    };
    LoadGoogleAuth();
  }, []);

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
      <Layout style={{ height: '100vh' }}>
        <Row className="home">
          <Col span={24} className="title">
            <h1>Contacts Application with Gmail</h1>
          </Col>
          <Col span={24}>
            {loading && <strong>Loading....</strong>}
            {error && <strong>Error...</strong>}
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
