import { Row, Col, Button } from 'antd';
import React, { useCallback, useState } from 'react';
import { getToken } from '../utils/outlook/GetToken';
import { Loader } from './Loader/Loader';

interface SigninInterface {
  signin: () => any;
  loading: boolean;
}

const Signin: React.FC<SigninInterface> = (props) => {
  const [clicked, setClicked] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(props.loading);

  let signinClickHandler = useCallback(() => {
    if (!clicked) {
      setClicked(true);
      setLoading(true);
      props.signin();
    }
  }, [clicked, props.signin]);

  return (
    <Row className="signin-container">
      <Col>
        <Row className="signin">
          <Col span={24} className="title">
            <h2>Signin</h2>
          </Col>
          <Col span={24}>
            <Button onClick={signinClickHandler} className="google-signin" disabled={clicked}>
              {loading && <Loader transparent={true} />}Gmail
            </Button>
            <Button onClick={getToken} className="outlook-signin">
              {loading && <Loader transparent={true} />}Outlook
            </Button>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default React.memo(Signin);
