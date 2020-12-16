import { Button, Col, Row } from 'antd';
import React, { useCallback, useState } from 'react';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { Header } from 'antd/lib/layout/layout';

interface HeadersProps {
  headers: Array<{ name: string; value: string }>;
}

const dateTimeFormat = (dateString: string): string => {
  const date = new Date(dateString);
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return date.toLocaleDateString('en-US', options);
};

const Headers: React.FC<HeadersProps> = ({ headers }) => {
  const neededHeaders = ['From', 'To', 'Date', 'Subject'];
  const [showHeaders, setShowHeaders] = useState(false);

  const showHeaderCLickHandler = useCallback(() => {
    setShowHeaders((state) => !state);
  }, []);

  return (
    <Row className="headers">
      <Col span={24}>
        <Row>
          <Col span={24} className="from">
            {headers.find((header) => header.name === 'From')?.value}
          </Col>
          <Col span={24} className="to">
            to me{' '}
            <Button ghost className="arrow-header" onClick={showHeaderCLickHandler}>
              <ArrowDropDownIcon />
            </Button>
          </Col>
        </Row>
      </Col>
      {showHeaders && (
        <Col span={24} className="headers-container">
          {neededHeaders.map((headerAttribute, index) => {
            const value = headers.find((header) => header.name === headerAttribute)?.value;
            if (value === void 0 || value === '') {
              return void 0;
            }
            return (
              <Col span={24} key={index}>
                <Row className="header-attribute">
                  <Col span={4} className="attribute-name">
                    {headerAttribute}
                  </Col>
                  <Col span={20} className="attribute-value">
                    {headerAttribute === 'Date' ? dateTimeFormat(value) : value}
                  </Col>
                </Row>
              </Col>
            );
          })}
        </Col>
      )}
    </Row>
  );
};

export default React.memo(Headers);
