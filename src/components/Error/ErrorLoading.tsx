import { Typography } from '@material-ui/core';
import { Col, Row, Button } from 'antd';
import React from 'react';

interface ErrorLoadingProps {
  title: string;
  actionTitle: string;
  actionFunction: () => void;
}

const ErrorLoading: React.FC<ErrorLoadingProps> = ({ title, actionTitle, actionFunction }) => {
  return (
    <Row className="error-loading">
      <Col span={24} className="error-title">
        <Typography>{title}</Typography>
        <Button type="primary" className="error-action" onClick={actionFunction}>
          {actionTitle}
        </Button>
      </Col>
    </Row>
  );
};

export default React.memo(ErrorLoading);
