import React from 'react';
import { 
  Users, 
  TrendingUp, 
  Calendar, 
  HeartHandshake,
  ArrowUpRight,
  ArrowDownRight,
  Wallet
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const data = [
  { name: 'Jan', dízimos: 4000, ofertas: 2400 },
  { name: 'Fev', dízimos: 3000, ofertas: 1398 },
  { name: 'Mar', dízimos: 2000, ofertas: 9800 },
  { name: 'Abr', dízimos: 2780, ofertas: 3908 },
  { name: 'Mai', dízimos: 1890, ofertas: 4800 },
  { name: 'Jun', dízimos: 2390, ofertas: 3800 },
  { name: 'Jul', dízimos: 3490, ofertas: 4300 },
];

const stats = [
  { name: 'Total de Membros', value: '1,245', icon: Users, change: '+12%', changeType: 'positive' },
  { name: 'Arrecadação (Mês)', value: 'R$ 45.231', icon: TrendingUp, change: '+8.1%', changeType: 'positive' },
  { name: 'Eventos Próximos', value: '4', icon: Calendar, change: '2 esta semana', changeType: 'neutral' },
  { name: 'Ações Sociais', value: '12', icon: HeartHandshake, change: '3 em andamento', changeType: 'neutral' },
];

export function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Dashboard Geral</h1>
          <p className="text-sm text-secondary-500">Visão geral da sua igreja.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-white border border-secondary-200 rounded-lg text-sm font-medium text-secondary-700 hover:bg-secondary-50 transition-colors">
            Exportar Relatório
          </button>
          <button className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
            Novo Registro
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-xl border border-secondary-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center text-primary-600">
                <stat.icon className="w-6 h-6" />
              </div>
              {stat.changeType === 'positive' && (
                <span className="flex items-center text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  {stat.change}
                </span>
              )}
              {stat.changeType === 'negative' && (
                <span className="flex items-center text-sm font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full">
                  <ArrowDownRight className="w-4 h-4 mr-1" />
                  {stat.change}
                </span>
              )}
              {stat.changeType === 'neutral' && (
                <span className="text-sm font-medium text-secondary-500">
                  {stat.change}
                </span>
              )}
            </div>
            <h3 className="text-sm font-medium text-secondary-500">{stat.name}</h3>
            <p className="text-2xl font-bold text-secondary-900 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Charts & Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-secondary-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-secondary-900">Arrecadação vs Despesas</h2>
            <select className="text-sm border-secondary-200 rounded-lg focus:ring-primary-500 focus:border-primary-500">
              <option>Últimos 6 meses</option>
              <option>Este ano</option>
            </select>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorDizimos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorOfertas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `R$ ${value}`} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => [`R$ ${value}`, '']}
                />
                <Area type="monotone" dataKey="dízimos" stroke="#22c55e" fillOpacity={1} fill="url(#colorDizimos)" />
                <Area type="monotone" dataKey="ofertas" stroke="#3b82f6" fillOpacity={1} fill="url(#colorOfertas)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Notifications / Recent Activity */}
        <div className="bg-white p-6 rounded-xl border border-secondary-200 shadow-sm">
          <h2 className="text-lg font-bold text-secondary-900 mb-6">Atividades Recentes</h2>
          <div className="space-y-6">
            {[
              { title: 'Novo membro cadastrado', desc: 'Maria Silva foi adicionada.', time: 'Há 2 horas', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
              { title: 'Doação recebida', desc: 'R$ 500,00 via PIX.', time: 'Há 4 horas', icon: Wallet, color: 'text-green-600', bg: 'bg-green-50' },
              { title: 'Evento atualizado', desc: 'Culto de Jovens mudou de horário.', time: 'Ontem', icon: Calendar, color: 'text-orange-600', bg: 'bg-orange-50' },
              { title: 'Ação Social', desc: 'Cesta básica entregue para Família Souza.', time: 'Ontem', icon: HeartHandshake, color: 'text-purple-600', bg: 'bg-purple-50' },
            ].map((activity, i) => (
              <div key={i} className="flex gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${activity.bg} ${activity.color}`}>
                  <activity.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-secondary-900">{activity.title}</p>
                  <p className="text-sm text-secondary-500">{activity.desc}</p>
                  <p className="text-xs text-secondary-400 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-2 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors">
            Ver todas as atividades
          </button>
        </div>
      </div>
    </div>
  );
}
