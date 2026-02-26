import React from 'react';
import { HeartHandshake, Mail, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export function RecoverPassword() {
  const handleRecover = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Instruções enviadas para o seu email.');
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center"
      style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1438032005730-c779502df39b?q=80&w=2071&auto=format&fit=crop")' }}
    >
      <div className="absolute inset-0 bg-secondary-900/40 backdrop-blur-sm"></div>

      <div className="w-full max-w-[480px] bg-white rounded-2xl shadow-2xl overflow-hidden relative z-10">
        <div className="p-8 sm:p-10">
          <div className="flex flex-col items-center mb-10">
            <div className="w-14 h-14 bg-primary-50 rounded-full flex items-center justify-center text-primary-600 mb-5">
              <HeartHandshake className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-bold text-secondary-900 mb-2">Recuperar Senha</h1>
            <p className="text-sm text-secondary-500 text-center">Informe seu email para receber as instruções de redefinição.</p>
          </div>

          <form onSubmit={handleRecover} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-secondary-900">Email Cadastrado</label>
              <div className="relative">
                <input 
                  type="email" 
                  className="w-full pl-4 pr-10 py-3 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow" 
                  placeholder="seu@email.com" 
                  required
                />
                <Mail className="w-5 h-5 text-secondary-400 absolute right-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full py-3 bg-primary-600 text-white rounded-lg text-sm font-semibold hover:bg-primary-700 transition-colors shadow-sm mt-2"
            >
              Enviar Instruções
            </button>
          </form>

          <div className="mt-8 relative">
             <div className="absolute inset-0 flex items-center">
               <div className="w-full border-t border-secondary-200"></div>
             </div>
             <div className="relative flex justify-center text-xs">
               <span className="bg-white px-4 text-secondary-400 uppercase tracking-wider">Ou</span>
             </div>
           </div>

          <div className="mt-6 text-center">
            <Link to="/login" className="inline-flex items-center gap-2 text-sm font-medium text-secondary-600 hover:text-secondary-900 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Voltar para o Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
