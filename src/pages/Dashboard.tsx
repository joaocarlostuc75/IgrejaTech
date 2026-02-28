import React from 'react';
import { 
  Users, 
  TrendingUp, 
  Calendar, 
  HeartHandshake,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  Sparkles,
  AlertCircle,
  ArrowRight,
  Clock,
  MapPin
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const memberData = [
  { name: 'Jan', membros: 180 },
  { name: 'Fev', membros: 195 },
  { name: 'Mar', membros: 210 },
  { name: 'Abr', membros: 225 },
  { name: 'Mai', membros: 238 },
  { name: 'Jun', membros: 245 },
];

const socialData = [
  { name: 'Cestas Básicas', value: 45, color: '#3b82f6' },
  { name: 'Atendimentos', value: 30, color: '#10b981' },
  { name: 'Visitas', value: 25, color: '#f59e0b' },
];

const stats = [
  { name: 'Membros Ativos', value: '245', icon: Users, change: '+5%', changeType: 'positive', color: 'blue' },
  { name: 'Dízimos do Mês', value: 'R$ 12.500', icon: Wallet, change: '+12%', changeType: 'positive', color: 'green' },
  { name: 'Eventos Próximos', value: '4', icon: Calendar, change: 'Esta semana', changeType: 'neutral', color: 'purple' },
  { name: 'Beneficiários Sociais', value: '32', icon: HeartHandshake, change: '+3%', changeType: 'positive', color: 'orange' },
];

import { generateDashboardInsights } from '../services/ai';

export function Dashboard() {
  const [insight, setInsight] = React.useState('');
  const [isGeneratingInsight, setIsGeneratingInsight] = React.useState(false);

  const handleGenerateInsight = async () => {
    setIsGeneratingInsight(true);
    const result = await generateDashboardInsights(stats, memberData, socialData);
    setInsight(result);
    setIsGeneratingInsight(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Bem-vindo, Pastor João</h1>
          <p className="text-sm text-secondary-500">Aqui está o resumo das atividades da igreja hoje.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-white border border-secondary-200 rounded-lg text-sm font-medium text-secondary-700 hover:bg-secondary-50 transition-colors shadow-sm">
            Exportar
          </button>
          <button className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors shadow-sm">
            Novo Membro
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
              {stat.changeType === 'positive' && (
                <span className="flex items-center text-sm font-medium text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  {stat.change}
                </span>
              )}
              {stat.changeType === 'negative' && (
                <span className="flex items-center text-sm font-medium text-red-600 bg-red-50 px-2.5 py-1 rounded-full">
                  <ArrowDownRight className="w-4 h-4 mr-1" />
                  {stat.change}
                </span>
              )}
              {stat.changeType === 'neutral' && (
                <span className="text-sm font-medium text-secondary-500 bg-secondary-100 px-2.5 py-1 rounded-full">
                  {stat.change}
                </span>
              )}
            </div>
            <h3 className="text-sm font-medium text-secondary-500">{stat.name}</h3>
            <p className="text-2xl font-bold text-secondary-900 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Chart */}
          <div className="bg-white p-6 rounded-xl border border-secondary-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-secondary-900">Crescimento de Membros</h2>
              <select className="text-sm border-secondary-200 rounded-lg focus:ring-primary-500 focus:border-primary-500 bg-secondary-50">
                <option>Últimos 6 meses</option>
                <option>Este ano</option>
              </select>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <AreaChart data={memberData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorMembros" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area type="monotone" dataKey="membros" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorMembros)" activeDot={{ r: 6, fill: '#2563eb', stroke: '#fff', strokeWidth: 2 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Assistência Social Donut */}
            <div className="bg-white p-6 rounded-xl border border-secondary-200 shadow-sm">
              <h2 className="text-lg font-bold text-secondary-900 mb-6">Assistência Social</h2>
              <div className="h-48 relative">
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                  <PieChart>
                    <Pie
                      data={socialData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {socialData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-2xl font-bold text-secondary-900">100</span>
                  <span className="text-xs text-secondary-500">Ações</span>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                {socialData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="text-secondary-600">{item.name}</span>
                    </div>
                    <span className="font-medium text-secondary-900">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Próximo Evento */}
            <div className="bg-primary-600 p-6 rounded-xl shadow-sm text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Calendar className="w-32 h-32" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-white/20 px-2.5 py-1 rounded-full text-xs font-medium backdrop-blur-sm">Próximo Evento</span>
                </div>
                <h3 className="text-2xl font-bold mb-2">Culto de Jovens</h3>
                <div className="space-y-2 mb-6 text-primary-100 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>Sábado, 19:30</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>Templo Principal</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <img 
                        key={i}
                        className="w-8 h-8 rounded-full border-2 border-primary-600" 
                        src={`https://picsum.photos/seed/${i}/32/32`} 
                        alt="Avatar"
                        referrerPolicy="no-referrer"
                      />
                    ))}
                    <div className="w-8 h-8 rounded-full border-2 border-primary-600 bg-primary-500 flex items-center justify-center text-xs font-medium">
                      +42
                    </div>
                  </div>
                  <button className="text-sm font-medium hover:text-primary-100 transition-colors flex items-center gap-1">
                    Ver detalhes <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Assistente IA */}
          <div className="bg-secondary-900 p-6 rounded-xl shadow-sm text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Sparkles className="w-32 h-32" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-primary-400" />
                <span className="text-xs font-bold tracking-wider text-primary-400 uppercase">Assistente IA</span>
              </div>
              <h3 className="text-lg font-bold mb-2">Análise de Tendências</h3>
              <p className="text-sm text-secondary-400 mb-6 leading-relaxed">
                {insight || "Clique abaixo para gerar uma análise inteligente dos dados do seu dashboard."}
              </p>
              <button 
                onClick={handleGenerateInsight}
                disabled={isGeneratingInsight}
                className="w-full py-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGeneratingInsight ? 'Gerando...' : 'Gerar Insights com Gemini'} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Alertas e Notificações */}
          <div className="bg-white p-6 rounded-xl border border-secondary-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-secondary-900">Alertas e Notificações</h2>
              <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-full">2 Novos</span>
            </div>
            <div className="space-y-4">
              <div className="flex gap-4 p-3 rounded-lg bg-red-50 border border-red-100">
                <div className="mt-0.5">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-red-900">Urgência Social: Alta</p>
                  <p className="text-sm text-red-700 mt-0.5">Família Silva necessita de cesta básica com urgência.</p>
                  <p className="text-xs text-red-500 mt-2">Há 10 min</p>
                </div>
              </div>
              
              <div className="flex gap-4 p-3 rounded-lg hover:bg-secondary-50 transition-colors cursor-pointer">
                <div className="mt-0.5">
                  <Users className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-secondary-900">Novo Membro Cadastrado</p>
                  <p className="text-sm text-secondary-600 mt-0.5">Carlos Eduardo concluiu o cadastro via app.</p>
                  <p className="text-xs text-secondary-400 mt-2">Há 2 horas</p>
                </div>
              </div>

              <div className="flex gap-4 p-3 rounded-lg hover:bg-secondary-50 transition-colors cursor-pointer">
                <div className="mt-0.5">
                  <Wallet className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-secondary-900">Meta Financeira Atingida</p>
                  <p className="text-sm text-secondary-600 mt-0.5">A campanha de missões atingiu 100% da meta.</p>
                  <p className="text-xs text-secondary-400 mt-2">Ontem</p>
                </div>
              </div>
            </div>
            <button className="w-full mt-4 py-2 text-sm font-medium text-secondary-600 hover:text-secondary-900 transition-colors border border-secondary-200 rounded-lg">
              Ver todas as notificações
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
