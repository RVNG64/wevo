import React from 'react';
import "./WazaaLoading.css";

const LoadingAnimation = ({ isLoading }: { isLoading: boolean }) => {
  if (!isLoading) return null;

  return <div className="loading-animation">WAZAAA!</div>;
};

export default LoadingAnimation;
