import React from 'react';
import { Loader2 } from 'lucide-react';

const ActionLoader = ({ size = 20, className = '' }) => {
  return (
    <Loader2 size={size} className={`animate-spin ${className}`} />
  );
};

export default ActionLoader;
