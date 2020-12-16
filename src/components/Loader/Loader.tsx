import { CircularProgress } from '@material-ui/core';
import React from 'react';

interface LoaderProps {
  size?: number | string;
  transparent?: boolean;
}

export const Loader: React.FC<LoaderProps> = ({ size, transparent }) => {
  return (
    <div className={'loader' + (transparent ? ' transparent' : '')}>
      <CircularProgress size={size || 40} color="inherit" />
    </div>
  );
};
