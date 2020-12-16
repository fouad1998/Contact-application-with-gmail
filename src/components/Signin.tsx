import { Row, Col, Button } from 'antd';
import React, { useCallback, useState, useContext } from 'react';
import { getToken } from '../utils/outlook/GetToken';
import { Loader } from './Loader/Loader';
import { connectionManagerContext } from '../context/ConnectionManager';

interface SigninInterface {}

const Signin: React.FC<SigninInterface> = props => {
  const [clicked, setClicked] = useState<{ state: boolean; service: string }>({ state: false, service: '' });
  const [loading, setLoading] = useState<boolean>(false);

  const { connectionManager } = useContext(connectionManagerContext);

  const services = ['google', 'microsoft'];

  return (
    <Row className="signin-container">
      <Col>
        <Row className="signin">
          <Col span={24} className="title">
            <h2>Signin</h2>
          </Col>
          <Col span={24}>
            {services.map((service, index) => {
              const signin = () => {
                setClicked({ state: true, service });
                setLoading(true);
                connectionManager!.connect(service as 'google' | 'microsoft');
              };

              return (
                <Button onClick={signin} key={index} className={`${service}-signin`} disabled={clicked.state}>
                  {loading && clicked.service === service && <Loader transparent={true} />}
                  {service}
                </Button>
              );
            })}
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default React.memo(Signin);
