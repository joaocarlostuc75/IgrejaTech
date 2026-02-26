import React from 'react';
import { HeartHandshake, Mail, Lock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export function Login() {
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-secondary-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-secondary-200 overflow-hidden">
        <div className="p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600 mb-4">
              <HeartHandshake className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-secondary-900">Bem-vindo de volta</h1>
            <p className="text-sm text-secondary-500 mt-1">Acesse o painel de gestão da sua igreja.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-secondary-700">Email</label>
              <div className="relative">
                <Mail className="w-5 h-5 text-secondary-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="email" 
                  className="w-full pl-10 pr-4 py-3 border border-secondary-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow" 
                  placeholder="seu@email.com" 
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-secondary-700">Senha</label>
                <Link to="/recuperar-senha" className="text-xs font-medium text-primary-600 hover:text-primary-700">
                  Esqueceu a senha?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-5 h-5 text-secondary-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="password" 
                  className="w-full pl-10 pr-4 py-3 border border-secondary-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow" 
                  placeholder="••••••••" 
                  required
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" id="remember" className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500" />
              <label htmlFor="remember" className="text-sm text-secondary-600">Lembrar de mim</label>
            </div>

            <button 
              type="submit"
              className="w-full py-3 bg-primary-600 text-white rounded-xl text-sm font-bold hover:bg-primary-700 transition-colors shadow-sm shadow-primary-600/20"
            >
              Entrar no Sistema
            </button>
          </form>
        </div>
        <div className="bg-secondary-50 p-6 text-center border-t border-secondary-200">
          <p className="text-sm text-secondary-600">
            Ainda não tem uma conta?{' '}
            <a href="#" className="font-bold text-primary-600 hover:text-primary-700">
              Cadastre sua igreja
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
