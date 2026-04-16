import React from 'react';

interface AuthLoaderProps {
  message?: string;
}

export const AuthLoader: React.FC<AuthLoaderProps> = ({ message = 'Autenticando...' }) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-lg font-medium text-gray-700">{message}</p>
    </div>
  );
};
