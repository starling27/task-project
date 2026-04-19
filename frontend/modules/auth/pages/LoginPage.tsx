import React from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { GoogleLoginButton } from '../components/GoogleLoginButton';

export const LoginPage: React.FC = () => {
  const loginWithGoogle = useAuthStore((state) => state.loginWithGoogle);
  const loading = useAuthStore((state) => state.loading);

  return (
    <div className="flex items-center justify-center h-screen bg-slate-100">
      <div className="w-full max-w-sm p-8 space-y-8 bg-white rounded-2xl shadow-xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900">Welcome Back</h1>
          <p className="mt-2 text-sm text-slate-600">Sign in to access your backlog.</p>
        </div>
        <GoogleLoginButton onClick={loginWithGoogle} disabled={loading} />
      </div>
    </div>
  );
};
