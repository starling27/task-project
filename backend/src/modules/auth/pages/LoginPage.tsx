import React from 'react';
import { GoogleLoginButton } from '../components/GoogleLoginButton';
import { ErrorMessage as AuthErrorMessage } from '@shared/ui/ErrorMessage';
import { useAuthStore } from '../store/useAuthStore';
import { Layout } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const error = useAuthStore((state) => state.error);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-slate-100">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600 text-white mb-6 shadow-lg shadow-indigo-200">
            <Layout size={32} />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Backlog Sync
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Gestiona tu backlog y sincroniza con Jira de forma inteligente.
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <AuthErrorMessage message={error || ''} />
          
          <div className="flex flex-col gap-4">
            <GoogleLoginButton />
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-slate-500 font-medium">
                Seguridad de nivel empresarial
              </span>
            </div>
          </div>
          
          <p className="text-center text-xs text-slate-400">
            Al continuar, aceptas nuestros Términos de Servicio y Política de Privacidad.
          </p>
        </div>
      </div>
    </div>
  );
};
