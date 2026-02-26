import React, { useState } from 'react';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight, 
  Plus, 
  Filter, 
  Search, 
  MoreVertical,
  Download,
  FileText,
  TrendingUp,
  PieChart as PieChartIcon,
  CreditCard,
  DollarSign,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import clsx from 'clsx';

const monthlyData = [
  { name: 'Jan', receitas: 4000, despesas: 2400, saldo: 1600 },
  { name: 'Fev', receitas: 3000, despesas: 1398, saldo: 3202 },
  { name: 'Mar', receitas: 2000, despesas: 9800, saldo: -4598 },
  { name: 'Abr', receitas: 2780, despesas: 3908, saldo: -5726 },
  { name: 'Mai', receitas: 1890, despesas: 4800, saldo: -8636 },
  { name: 'Jun', receitas: 2390, despesas: 3800, saldo: -10046 },
];

const expenseCategories = [
  { name: 'Manutenção', value: 3500, color: '#ef4444' },
  { name: 'Pessoal', value: 4500, color: '#f97316' },
  { name: 'Eventos', value: 2000, color: '#eab308' },
  { name: 'Missões', value: 1500, color: '#3b82f6' },
  { name: 'Outros', value: 800, color: '#64748b' },
];

const initialTransactions = [
  { id: 1, type: 'income', category: 'Dízimo', description: 'Dízimo - João Silva', amount: 500.00, date: '15/06/2023', status: 'Concluído' },
  { id: 2, type: 'expense', category: 'Luz', description: 'Conta de Energia (Enel)', amount: -350.00, date: '14/06/2023', status: 'Concluído' },
  { id: 3, type: 'income', category: 'Oferta', description: 'Oferta Culto de Domingo', amount: 1250.50, date: '12/06/2023', status: 'Concluído' },
  { id: 4, type: 'expense', category: 'Aluguel', description: 'Aluguel do Templo', amount: -2500.00, date: '10/06/2023', status: 'Pendente' },
  { id: 5, type: 'income', category: 'Doação', description: 'Doação para Ação Social', amount: 800.00, date: '08/06/2023', status: 'Concluído' },
  { id: 6, type: 'expense', category: 'Internet', description: 'Fatura Vivo Fibra', amount: -120.00, date: '05/06/2023', status: 'Concluído' },
];

export function Financial() {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAllTransactions, setShowAllTransactions] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [formData, setFormData] = useState({
    type: 'income',
    amount: '',
    description: '',
    category: 'Dízimo',
    date: ''
  });

  const [editingTransaction, setEditingTransaction] = useState<any>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || !formData.description || !formData.date) return;

    const amountNum = parseFloat(formData.amount);
    const finalAmount = formData.type === 'expense' ? -Math.abs(amountNum) : Math.abs(amountNum);

    if (editingTransaction) {
      setTransactions(prev => prev.map(t => t.id === editingTransaction.id ? {
        ...t,
        type: formData.type,
        category: formData.category,
        description: formData.description,
        amount: finalAmount,
        date: formData.date.includes('-') ? new Date(formData.date).toLocaleDateString('pt-BR') : formData.date,
        status: 'Concluído' // Or keep existing status
      } : t));
      setEditingTransaction(null);
    } else {
      const newTx = {
        id: Date.now(),
        type: formData.type,
        category: formData.category,
        description: formData.description,
        amount: finalAmount,
        date: new Date(formData.date).toLocaleDateString('pt-BR'),
        status: 'Concluído'
      };
      setTransactions(prev => [newTx, ...prev]);
    }

    setIsModalOpen(false);
    setFormData({ type: 'income', amount: '', description: '', category: 'Dízimo', date: '' });
  };

  const handleEdit = (transaction: any) => {
    setEditingTransaction(transaction);
    // Convert DD/MM/YYYY to YYYY-MM-DD
    const [day, month, year] = transaction.date.split('/');
    setFormData({
      type: transaction.type,
      amount: Math.abs(transaction.amount).toString(),
      description: transaction.description,
      category: transaction.category,
      date: `${year}-${month}-${day}`
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Tem certeza que deseja excluir esta transação?')) {
      setTransactions(prev => prev.filter(t => t.id !== id));
    }
  };

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + Math.abs(curr.amount), 0);
  const balance = totalIncome - totalExpense;
  const pendingExpense = transactions.filter(t => t.type === 'expense' && t.status === 'Pendente').reduce((acc, curr) => acc + Math.abs(curr.amount), 0);

  const filteredTransactions = transactions.filter(t => {
    if (filterType === 'all') return true;
    if (filterType === 'income') return t.type === 'income';
    if (filterType === 'expense') return t.type === 'expense';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Financeiro</h1>
          <p className="text-sm text-secondary-500">Gestão completa de dízimos, ofertas e despesas.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowReportModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-secondary-200 rounded-xl text-sm font-medium text-secondary-700 hover:bg-secondary-50 transition-colors shadow-sm"
          >
            <Download className="w-4 h-4" />
            Exportar
          </button>
          <button 
            onClick={() => {
              setIsModalOpen(true);
              setEditingTransaction(null);
              setFormData({ type: 'income', amount: '', description: '', category: 'Dízimo', date: '' });
            }}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Nova Transação
          </button>
        </div>
      </div>

      {/* Enhanced KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-6 rounded-xl border border-secondary-200 shadow-sm flex flex-col relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Wallet className="w-16 h-16 text-primary-600" />
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center text-primary-600">
              <Wallet className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium text-secondary-500">Saldo Atual</span>
          </div>
          <p className="text-2xl font-bold text-secondary-900">R$ {balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
          <div className="mt-2 flex items-center gap-2 text-xs text-green-600 bg-green-50 w-fit px-2 py-1 rounded-full">
            <TrendingUp className="w-3 h-3" />
            <span>+12% vs mês anterior</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-secondary-200 shadow-sm flex flex-col relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <ArrowUpRight className="w-16 h-16 text-green-600" />
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-green-600">
              <ArrowUpRight className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium text-secondary-500">Receitas</span>
          </div>
          <p className="text-2xl font-bold text-secondary-900">R$ {totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
          <div className="mt-2 flex items-center gap-2 text-xs text-secondary-500">
            <span>42 lançamentos este mês</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-secondary-200 shadow-sm flex flex-col relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <ArrowDownRight className="w-16 h-16 text-red-600" />
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center text-red-600">
              <ArrowDownRight className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium text-secondary-500">Despesas</span>
          </div>
          <p className="text-2xl font-bold text-secondary-900">R$ {totalExpense.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
          <div className="mt-2 flex items-center gap-2 text-xs text-secondary-500">
            <span>Dentro do orçamento</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-secondary-200 shadow-sm flex flex-col relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <AlertCircle className="w-16 h-16 text-orange-600" />
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center text-orange-600">
              <AlertCircle className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium text-secondary-500">A Pagar (Pendente)</span>
          </div>
          <p className="text-2xl font-bold text-secondary-900">R$ {pendingExpense.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
          <div className="mt-2 flex items-center gap-2 text-xs text-orange-600 bg-orange-50 w-fit px-2 py-1 rounded-full">
            <span>Vence em breve</span>
          </div>
        </div>
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cash Flow Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-secondary-200 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-secondary-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-secondary-400" />
              Fluxo de Caixa
            </h2>
            <div className="flex gap-2">
              <select className="text-sm border border-secondary-200 rounded-lg focus:ring-primary-500 focus:border-primary-500 py-1.5 px-3 bg-white shadow-sm">
                <option>Últimos 6 meses</option>
                <option>Este ano</option>
              </select>
            </div>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorReceitas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorDespesas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `R$${value/1000}k`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => [`R$ ${value}`, '']}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#64748b', paddingTop: '10px' }} />
                <Area type="monotone" dataKey="receitas" name="Receitas" stroke="#22c55e" strokeWidth={2} fillOpacity={1} fill="url(#colorReceitas)" />
                <Area type="monotone" dataKey="despesas" name="Despesas" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorDespesas)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expense Breakdown */}
        <div className="bg-white p-6 rounded-xl border border-secondary-200 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-secondary-900 flex items-center gap-2">
              <PieChartIcon className="w-5 h-5 text-secondary-400" />
              Despesas por Categoria
            </h2>
          </div>
          <div className="h-64 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseCategories}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {expenseCategories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => [`R$ ${value}`, '']}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Text */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <p className="text-xs text-secondary-500">Total</p>
                <p className="text-lg font-bold text-secondary-900">R$ 12.3k</p>
              </div>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            {expenseCategories.map((cat) => (
              <div key={cat.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }}></div>
                  <span className="text-secondary-600">{cat.name}</span>
                </div>
                <span className="font-medium text-secondary-900">R$ {cat.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Transactions Section */}
      <div className="bg-white rounded-xl border border-secondary-200 shadow-sm overflow-hidden flex flex-col">
        <div className="p-6 border-b border-secondary-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-secondary-900">Transações Recentes</h2>
          <div className="flex items-center gap-3">
            <div className="flex bg-secondary-100 p-1 rounded-lg">
              <button 
                onClick={() => setFilterType('all')}
                className={clsx(
                  "px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
                  filterType === 'all' ? "bg-white text-secondary-900 shadow-sm" : "text-secondary-600 hover:text-secondary-900"
                )}
              >
                Todas
              </button>
              <button 
                onClick={() => setFilterType('income')}
                className={clsx(
                  "px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
                  filterType === 'income' ? "bg-white text-secondary-900 shadow-sm" : "text-secondary-600 hover:text-secondary-900"
                )}
              >
                Entradas
              </button>
              <button 
                onClick={() => setFilterType('expense')}
                className={clsx(
                  "px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
                  filterType === 'expense' ? "bg-white text-secondary-900 shadow-sm" : "text-secondary-600 hover:text-secondary-900"
                )}
              >
                Saídas
              </button>
            </div>
            <button className="p-2 border border-secondary-200 rounded-lg hover:bg-secondary-50 text-secondary-500">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-secondary-600">
            <thead className="bg-secondary-50 text-secondary-700 font-medium border-b border-secondary-200">
              <tr>
                <th className="px-6 py-4">Descrição</th>
                <th className="px-6 py-4">Categoria</th>
                <th className="px-6 py-4">Data</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Valor</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary-200">
              {filteredTransactions.slice(0, 5).map((tx) => (
                <tr key={tx.id} className="hover:bg-secondary-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={clsx(
                        "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                        tx.type === 'income' ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                      )}>
                        {tx.type === 'income' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                      </div>
                      <span className="font-medium text-secondary-900">{tx.description}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-secondary-100 text-secondary-700">
                      {tx.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-secondary-500">
                    {tx.date}
                  </td>
                  <td className="px-6 py-4">
                    <span className={clsx(
                      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold",
                      tx.status === 'Concluído' ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                    )}>
                      <span className={clsx("w-1.5 h-1.5 rounded-full", tx.status === 'Concluído' ? "bg-green-500" : "bg-yellow-500")}></span>
                      {tx.status}
                    </span>
                  </td>
                  <td className={clsx(
                    "px-6 py-4 text-right font-bold",
                    tx.type === 'income' ? "text-green-600" : "text-red-600"
                  )}>
                    {tx.type === 'income' ? '+' : '-'} R$ {Math.abs(tx.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="relative group inline-block">
                      <button className="text-secondary-400 hover:text-secondary-600 transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      <div className="absolute right-0 mt-1 w-32 bg-white border border-secondary-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 text-left">
                        <button onClick={() => handleEdit(tx)} className="w-full text-left px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50">Editar</button>
                        <button onClick={() => handleDelete(tx.id)} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">Excluir</button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-secondary-200 bg-secondary-50 text-center">
          <button 
            onClick={() => setShowAllTransactions(true)}
            className="text-sm font-medium text-primary-600 hover:text-primary-700 hover:underline"
          >
            Ver todas as transações
          </button>
        </div>
      </div>

      {/* Modal Nova Transação */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-secondary-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-secondary-200">
              <h2 className="text-xl font-bold text-secondary-900">{editingTransaction ? 'Editar Transação' : 'Nova Transação'}</h2>
              <button 
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingTransaction(null);
                  setFormData({ type: 'income', amount: '', description: '', category: 'Dízimo', date: '' });
                }}
                className="text-secondary-400 hover:text-secondary-600 transition-colors"
              >
                <Plus className="w-6 h-6 rotate-45" />
              </button>
            </div>
            <div className="p-6">
              <form id="add-transaction-form" onSubmit={handleAddTransaction} className="space-y-6">
                <div className="flex gap-4">
                  <label className="flex-1 cursor-pointer">
                    <input type="radio" name="type" value="income" checked={formData.type === 'income'} onChange={handleInputChange} className="peer sr-only" />
                    <div className="p-3 text-center border border-secondary-200 rounded-lg peer-checked:border-green-500 peer-checked:bg-green-50 peer-checked:text-green-700 font-medium transition-colors flex flex-col items-center gap-2">
                      <ArrowUpRight className="w-6 h-6" />
                      Receita
                    </div>
                  </label>
                  <label className="flex-1 cursor-pointer">
                    <input type="radio" name="type" value="expense" checked={formData.type === 'expense'} onChange={handleInputChange} className="peer sr-only" />
                    <div className="p-3 text-center border border-secondary-200 rounded-lg peer-checked:border-red-500 peer-checked:bg-red-50 peer-checked:text-red-700 font-medium transition-colors flex flex-col items-center gap-2">
                      <ArrowDownRight className="w-6 h-6" />
                      Despesa
                    </div>
                  </label>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-secondary-700">Valor (R$) *</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400 font-bold">R$</span>
                      <input required name="amount" value={formData.amount} onChange={handleInputChange} type="number" step="0.01" className="w-full pl-10 pr-4 py-3 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-lg font-bold" placeholder="0,00" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-secondary-700">Descrição *</label>
                    <input required name="description" value={formData.description} onChange={handleInputChange} type="text" className="w-full px-4 py-2 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Ex: Dízimo de João" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-secondary-700">Categoria</label>
                      <select name="category" value={formData.category} onChange={handleInputChange} className="w-full px-4 py-2 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                        <option>Dízimo</option>
                        <option>Oferta</option>
                        <option>Doação</option>
                        <option>Evento</option>
                        <option>Luz</option>
                        <option>Água</option>
                        <option>Aluguel</option>
                        <option>Outros</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-secondary-700">Data *</label>
                      <input required name="date" value={formData.date} onChange={handleInputChange} type="date" className="w-full px-4 py-2 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-secondary-700">Comprovante / Anexo</label>
                    <div className="border-2 border-dashed border-secondary-300 rounded-lg p-6 text-center hover:bg-secondary-50 transition-colors cursor-pointer group">
                      <FileText className="w-8 h-8 text-secondary-400 mx-auto mb-2 group-hover:text-primary-500 transition-colors" />
                      <p className="text-sm text-secondary-600">Clique para fazer upload ou arraste o arquivo</p>
                      <p className="text-xs text-secondary-400 mt-1">PNG, JPG, PDF até 5MB</p>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div className="flex items-center justify-end gap-3 p-6 border-t border-secondary-200 bg-secondary-50">
              <button 
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingTransaction(null);
                  setFormData({ type: 'income', amount: '', description: '', category: 'Dízimo', date: '' });
                }}
                type="button"
                className="px-4 py-2 bg-white border border-secondary-200 rounded-lg text-sm font-medium text-secondary-700 hover:bg-secondary-50 transition-colors"
              >
                Cancelar
              </button>
              <button type="submit" form="add-transaction-form" className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors shadow-sm">
                {editingTransaction ? 'Salvar Alterações' : 'Salvar Transação'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Ver Todas as Transações */}
      {showAllTransactions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-secondary-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-secondary-200 shrink-0">
              <h2 className="text-xl font-bold text-secondary-900">Todas as Transações</h2>
              <button 
                onClick={() => setShowAllTransactions(false)}
                className="text-secondary-400 hover:text-secondary-600 transition-colors"
              >
                <Plus className="w-6 h-6 rotate-45" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border border-secondary-200 rounded-xl hover:bg-secondary-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={clsx(
                        "w-10 h-10 rounded-full flex items-center justify-center",
                        transaction.type === 'income' ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                      )}>
                        {transaction.type === 'income' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                      </div>
                      <div>
                        <p className="font-bold text-secondary-900">{transaction.description}</p>
                        <p className="text-sm text-secondary-500">{transaction.category} • {transaction.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={clsx(
                        "font-bold",
                        transaction.type === 'income' ? "text-green-600" : "text-red-600"
                      )}>
                        {transaction.type === 'income' ? '+' : '-'} R$ {Math.abs(transaction.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                      <p className="text-sm font-medium text-secondary-500 mt-1">{transaction.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-6 border-t border-secondary-200 bg-secondary-50 shrink-0">
              <button 
                onClick={() => setShowAllTransactions(false)}
                className="w-full px-4 py-2 bg-white border border-secondary-200 rounded-lg text-sm font-medium text-secondary-700 hover:bg-secondary-50 transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Relatórios Financeiros */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-secondary-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-secondary-200">
              <h2 className="text-xl font-bold text-secondary-900">Gerar Relatório Financeiro</h2>
              <button 
                onClick={() => setShowReportModal(false)}
                className="text-secondary-400 hover:text-secondary-600 transition-colors"
              >
                <Plus className="w-6 h-6 rotate-45" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-secondary-700">Tipo de Relatório</label>
                <select className="w-full px-4 py-2 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <option>Fluxo de Caixa Detalhado</option>
                  <option>Resumo de Dízimos e Ofertas</option>
                  <option>Despesas por Categoria</option>
                  <option>Balanço Mensal</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-secondary-700">Data Inicial</label>
                  <input type="date" className="w-full px-4 py-2 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-secondary-700">Data Final</label>
                  <input type="date" className="w-full px-4 py-2 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-secondary-700">Formato</label>
                <select className="w-full px-4 py-2 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <option>PDF</option>
                  <option>Excel (XLSX)</option>
                  <option>CSV</option>
                </select>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-6 border-t border-secondary-200 bg-secondary-50">
              <button 
                onClick={() => setShowReportModal(false)}
                className="px-4 py-2 bg-white border border-secondary-200 rounded-lg text-sm font-medium text-secondary-700 hover:bg-secondary-50 transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={() => {
                  alert('Relatório gerado com sucesso!');
                  setShowReportModal(false);
                }}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors shadow-sm"
              >
                Gerar Relatório
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
