import React from 'react';

interface AuthErrorMessageProps {
  message: string;
}

export const AuthErrorMessage: React.FC<AuthErrorMessageProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="text-red-600 text-sm p-3 bg-red-50 rounded-lg border border-red-200">
      <p>{message}</p>
    </div>
  );
};
