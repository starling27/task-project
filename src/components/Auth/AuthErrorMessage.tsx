import React from 'react';
import { AlertCircle } from 'lucide-react';

interface AuthErrorMessageProps {
  message: string;
}

export const AuthErrorMessage: React.FC<AuthErrorMessageProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 animate-in fade-in slide-in-from-top-1">
      <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
      <div className="text-sm font-medium">{message}</div>
    </div>
  );
};
