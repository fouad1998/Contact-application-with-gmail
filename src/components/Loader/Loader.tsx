import { CircularProgress } from '@material-ui/core';
import React from 'react';

interface LoaderProps {
  size?: number | string;
}

export const Loader: React.FC<LoaderProps> = ({ size }) => {
  return (
    <div className="loader">
      <CircularProgress size={size || 40} color="inherit" />
    </div>
  );
};
