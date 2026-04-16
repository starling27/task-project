import React, { useState } from 'react';
import { Mail, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { AuthErrorMessage } from './AuthErrorMessage';

export const EmailEntryForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const partialUser = useAuthStore((state) => state.partialUser);
  const completeRegistration = useAuthStore((state) => state.completeRegistration);
  const loading = useAuthStore((state) => state.loading);
  const error = useAuthStore((state) => state.error);

  if (!partialUser) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      await completeRegistration(email);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="bg-blue-600 p-6 text-white">
          <h2 className="text-xl font-bold">Casi listo</h2>
          <p className="text-blue-100 text-sm mt-1">
            Google no nos proporcionó tu email. Por favor, introdúcelo para completar tu perfil.
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="flex items-center gap-4 mb-6">
            {partialUser.avatarUrl && (
              <img
                src={partialUser.avatarUrl}
                alt={partialUser.name}
                className="w-12 h-12 rounded-full border-2 border-gray-100"
              />
            )}
            <div>
              <p className="font-medium text-gray-900">{partialUser.name}</p>
              <p className="text-sm text-gray-500">Iniciando sesión con Google</p>
            </div>
          </div>

          <AuthErrorMessage message={error || ''} />

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Correo electrónico
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@correo.com"
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                disabled={loading}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !email}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Procesando...' : 'Completar registro'}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>
      </div>
    </div>
  );
};
