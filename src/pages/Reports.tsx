import React, { useState } from 'react';
import { 
  BarChart3, 
  Download, 
  FileText, 
  PieChart as PieChartIcon, 
  TrendingUp,
  Filter,
  Calendar,
  Sparkles
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';

const demographicData = [
  { name: 'Jovens (18-25)', value: 35 },
  { name: 'Adultos (26-45)', value: 45 },
  { name: 'Idosos (46+)', value: 20 },
];

const COLORS = ['#3b82f6', '#22c55e', '#f59e0b'];

const growthData = [
  { name: 'Jan', membros: 120 },
  { name: 'Fev', membros: 125 },
  { name: 'Mar', membros: 132 },
  { name: 'Abr', membros: 140 },
  { name: 'Mai', membros: 145 },
  { name: 'Jun', membros: 156 },
];

export function Reports() {
  const [reportType, setReportType] = useState('geral');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Relatórios</h1>
          <p className="text-sm text-secondary-500">Análises detalhadas e métricas da igreja.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-secondary-200 rounded-lg text-sm font-medium text-secondary-700 hover:bg-secondary-50 transition-colors">
            <Filter className="w-4 h-4" />
            Filtros
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
            <Download className="w-4 h-4" />
            Exportar PDF
          </button>
        </div>
      </div>

      {/* Report Builder / Controls */}
      <div className="bg-white p-4 rounded-xl border border-secondary-200 shadow-sm flex flex-col sm:flex-row gap-4 items-center">
        <div className="flex-1 w-full flex gap-4">
          <div className="flex-1">
            <label className="block text-xs font-medium text-secondary-500 mb-1">Tipo de Relatório</label>
            <select 
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="geral">Visão Geral (Executivo)</option>
              <option value="financeiro">Financeiro Detalhado</option>
              <option value="membros">Crescimento de Membros</option>
              <option value="ebd">Frequência EBD</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-xs font-medium text-secondary-500 mb-1">Período</label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-secondary-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <select className="w-full pl-9 pr-3 py-2 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option>Últimos 6 meses</option>
                <option>Este ano</option>
                <option>Ano passado</option>
                <option>Personalizado...</option>
              </select>
            </div>
          </div>
        </div>
        <button className="px-6 py-2 bg-secondary-900 text-white rounded-lg text-sm font-medium hover:bg-secondary-800 transition-colors w-full sm:w-auto mt-5">
          Gerar Relatório
        </button>
      </div>

      {/* AI Narrative Summary */}
      <div className="bg-gradient-to-r from-primary-50 to-blue-50 p-6 rounded-xl border border-primary-100 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-primary-600" />
          <h2 className="text-lg font-bold text-secondary-900">Resumo Inteligente</h2>
        </div>
        <p className="text-secondary-700 leading-relaxed">
          Nos últimos 6 meses, a igreja apresentou um <strong className="text-green-600">crescimento de 30%</strong> no número de membros ativos, impulsionado principalmente pela classe de jovens. A arrecadação acompanhou esse crescimento, com um aumento de 15% nas ofertas voluntárias. No entanto, as despesas com manutenção do templo subiram 8%, sugerindo a necessidade de revisão de contratos de serviços. A frequência média da EBD está excelente (88%), mas a classe de Novos Convertidos precisa de atenção pastoral devido à queda recente.
        </p>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Demographics Pie Chart */}
        <div className="bg-white p-6 rounded-xl border border-secondary-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-secondary-900 flex items-center gap-2">
              <PieChartIcon className="w-5 h-5 text-secondary-400" />
              Demografia de Membros
            </h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={demographicData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {demographicData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => [`${value}%`, '']}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Growth Bar Chart */}
        <div className="bg-white p-6 rounded-xl border border-secondary-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-secondary-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-secondary-400" />
              Crescimento da Congregação
            </h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={growthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{fill: '#f1f5f9'}}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="membros" name="Total de Membros" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Reports List */}
      <div className="bg-white rounded-xl border border-secondary-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-secondary-200">
          <h3 className="text-lg font-bold text-secondary-900">Relatórios Salvos</h3>
        </div>
        <div className="divide-y divide-secondary-200">
          {[
            { name: 'Fechamento Financeiro - Outubro 2023', date: '01/11/2023', type: 'Financeiro', size: '2.4 MB' },
            { name: 'Censo de Membros Q3', date: '15/10/2023', type: 'Membros', size: '1.1 MB' },
            { name: 'Relatório de Ação Social - Campanha do Agasalho', date: '30/08/2023', type: 'Ação Social', size: '3.5 MB' },
          ].map((report, i) => (
            <div key={i} className="p-4 flex items-center justify-between hover:bg-secondary-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center text-red-500">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-secondary-900">{report.name}</p>
                  <div className="flex items-center gap-3 text-xs text-secondary-500 mt-1">
                    <span>{report.date}</span>
                    <span className="w-1 h-1 rounded-full bg-secondary-300"></span>
                    <span>{report.type}</span>
                    <span className="w-1 h-1 rounded-full bg-secondary-300"></span>
                    <span>{report.size}</span>
                  </div>
                </div>
              </div>
              <button className="p-2 text-secondary-400 hover:text-primary-600 transition-colors rounded-lg hover:bg-primary-50">
                <Download className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
