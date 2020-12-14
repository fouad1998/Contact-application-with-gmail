import React, { useState, useEffect, useContext } from 'react';
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
import { connectionManagerContext } from './context/ConnectionManager';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const { isAuthorized } = useContext(connectionManagerContext);

  return (
    <SnackbarProvider maxSnack={3}>
      <Layout style={{ height: '100vh', position: 'relative' }}>
        <Row className="home">
          <Col span={24} className="title">
            <h1>Contacts Application with Gmail</h1>
          </Col>
          <Col span={24} style={{ position: 'relative', height: 'calc(100vh - 80px)' }}>
            {(loading || error) && (
              <Row style={{ position: 'absolute', left: 0, top: 40, right: 0, bottom: 0, zIndex: 10 }}>
                {loading && <Loader />}
                {error && <ErrorLoading title="Error loading" actionTitle="Reload" actionFunction={LoadGoogleAuth} />}
              </Row>
            )}
            {/**@ts-ignore */}
            {isAuthorized && !loading && !error && <Gmail />}
            {/**@ts-ignore */}
            {!isAuthorized && !loading && !error && <Signin />}
          </Col>
        </Row>
      </Layout>
    </SnackbarProvider>
  );
}
