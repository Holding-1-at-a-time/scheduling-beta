<<<<<<< HEAD
"use client";

export default function Spinner() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-800">
      <div className="relative spinner-3d">
        <div className="absolute inset-0 spinner-layer layer-1"></div>
        <div className="absolute inset-0 spinner-layer layer-2"></div>
        <div className="absolute inset-0 spinner-layer layer-3"></div>
      </div>
    </div>
  );
}

export function spinner();
=======
// components/spinner.tsx
import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      <div className="absolute inset-0 spinner-layer layer-1"></div>
      <div className="absolute inset-0 spinner-layer layer-2"></div>
      <div className="absolute inset-0 spinner-layer layer-3"></div>
    </div>
  );
};

export default Spinner;
>>>>>>> development
