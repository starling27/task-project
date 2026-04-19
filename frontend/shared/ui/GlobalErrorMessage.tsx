import React from 'react';
import { AlertCircle, X } from 'lucide-react';

interface GlobalErrorMessageProps {
  message: string;
  onClear?: () => void;
}

export const GlobalErrorMessage: React.FC<GlobalErrorMessageProps> = ({ message, onClear }) => {
  if (!message) return null;

  return (
    <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 animate-in fade-in slide-in-from-top-1 mb-6">
      <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
      <div className="flex-1 text-sm font-medium">{message}</div>
      {onClear && (
        <button onClick={onClear} className="p-1 hover:bg-red-100 rounded-md transition-colors">
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
