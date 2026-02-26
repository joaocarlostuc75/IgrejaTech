import React, { useState } from 'react';
import { 
  HeartHandshake, 
  Users, 
  Package, 
  AlertCircle, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical,
  CheckCircle2,
  Clock,
  Sparkles,
  Box
} from 'lucide-react';
import clsx from 'clsx';

const stats = [
  { name: 'Famílias Atendidas', value: '156', icon: Users, change: '+12% este mês', color: 'blue' },
  { name: 'Cestas Distribuídas', value: '450', icon: Box, change: 'Últimos 30 dias', color: 'green' },
  { name: 'Voluntários Ativos', value: '48', icon: HeartHandshake, change: '3 projetos em andamento', color: 'purple' },
  { name: 'Casos Prioritários', value: '12', icon: AlertCircle, change: 'Atenção necessária', color: 'red' },
];

export function SocialAction() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Ação Social</h1>
          <p className="text-sm text-secondary-500">Gerencie os projetos sociais e atendimentos.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative hidden sm:block w-64">
            <Search className="w-4 h-4 text-secondary-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Buscar projeto..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white shadow-sm"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-secondary-200 rounded-xl text-sm font-medium text-secondary-700 hover:bg-secondary-50 transition-colors shadow-sm">
            <Filter className="w-4 h-4" />
            Filtrar
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl text-sm font-medium hover:bg-purple-700 transition-colors shadow-sm">
            <Sparkles className="w-4 h-4" />
            IA Ativa
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-xl border border-secondary-200 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center bg-${stat.color}-50 text-${stat.color}-600`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <span className="text-sm font-medium text-secondary-500 bg-secondary-100 px-2.5 py-1 rounded-full">
                {stat.change}
              </span>
            </div>
            <h3 className="text-sm font-medium text-secondary-500">{stat.name}</h3>
            <p className="text-2xl font-bold text-secondary-900 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Priority Cases */}
        <div className="bg-white p-6 rounded-xl border border-secondary-200 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-secondary-900">Casos Prioritários</h2>
            <button className="text-sm font-medium text-primary-600 hover:text-primary-700">Ver todos</button>
          </div>
          <div className="space-y-4 flex-1">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 rounded-xl border border-secondary-200 hover:border-red-200 hover:bg-red-50/30 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-secondary-900">Família Silva</h3>
                  <span className="bg-red-100 text-red-700 text-xs font-bold px-2.5 py-1 rounded-full">Urgente</span>
                </div>
                <p className="text-sm text-secondary-600 mb-4">Necessidade de cesta básica e roupas infantis. A família perdeu tudo na última enchente.</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-secondary-500 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> Há 2 dias
                  </span>
                  <button className="px-4 py-1.5 bg-white border border-secondary-200 rounded-xl text-sm font-medium text-secondary-700 hover:bg-secondary-50 transition-colors shadow-sm">
                    Atender
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Projects */}
        <div className="bg-white p-6 rounded-xl border border-secondary-200 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-secondary-900">Projetos em Andamento</h2>
            <button className="text-sm font-medium text-primary-600 hover:text-primary-700">Ver todos</button>
          </div>
          <div className="space-y-4 flex-1">
            {[1, 2].map((i) => (
              <div key={i} className="p-4 rounded-xl border border-secondary-200 hover:border-primary-200 hover:bg-primary-50/30 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-secondary-900">Sopão Solidário</h3>
                  <span className="bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full">Em andamento</span>
                </div>
                <p className="text-sm text-secondary-600 mb-4">Distribuição de sopa para pessoas em situação de rua no centro da cidade.</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-xs font-medium text-secondary-500">
                    <span>Progresso da Meta</span>
                    <span>75%</span>
                  </div>
                  <div className="w-full bg-secondary-100 rounded-full h-2">
                    <div className="bg-primary-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((j) => (
                      <img 
                        key={j}
                        className="w-7 h-7 rounded-full border-2 border-white" 
                        src={`https://picsum.photos/seed/${i}${j}/32/32`} 
                        alt="Voluntário"
                        referrerPolicy="no-referrer"
                      />
                    ))}
                    <div className="w-7 h-7 rounded-full border-2 border-white bg-secondary-100 flex items-center justify-center text-[10px] font-medium text-secondary-600">
                      +12
                    </div>
                  </div>
                  <button className="text-sm font-medium text-primary-600 hover:text-primary-700">
                    Ver detalhes
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
