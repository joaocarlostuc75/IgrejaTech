import React from 'react';
import { HeartHandshake, Mail, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export function RecoverPassword() {
  const handleRecover = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Instruções enviadas para o seu email.');
  };

  return (
    <div className="min-h-screen bg-secondary-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-secondary-200 overflow-hidden">
        <div className="p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600 mb-4">
              <HeartHandshake className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-secondary-900">Recuperar Senha</h1>
            <p className="text-sm text-secondary-500 mt-1 text-center">Informe seu email para receber as instruções de redefinição.</p>
          </div>

          <form onSubmit={handleRecover} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-secondary-700">Email Cadastrado</label>
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

            <button 
              type="submit"
              className="w-full py-3 bg-primary-600 text-white rounded-xl text-sm font-bold hover:bg-primary-700 transition-colors shadow-sm shadow-primary-600/20"
            >
              Enviar Instruções
            </button>
          </form>
        </div>
        <div className="bg-secondary-50 p-6 text-center border-t border-secondary-200">
          <Link to="/login" className="inline-flex items-center gap-2 text-sm font-bold text-secondary-600 hover:text-secondary-900 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Voltar para o Login
          </Link>
        </div>
      </div>
    </div>
  );
}
