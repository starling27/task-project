import React from 'react';
import { LogIn } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

export const GoogleLoginButton: React.FC = () => {
  const loginWithGoogle = useAuthStore((state) => state.loginWithGoogle);
  const loading = useAuthStore((state) => state.loading);

  return (
    <button
      onClick={loginWithGoogle}
      disabled={loading}
      className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors w-full sm:w-auto font-medium text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <img
        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/smartlock/google.svg"
        alt="Google"
        className="w-5 h-5"
      />
      <span className="flex items-center gap-2">
        <LogIn className="w-4 h-4" />
        Continuar con Google
      </span>
    </button>
  );
};
