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
  FileText
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import clsx from 'clsx';

const data = [
  { name: 'Jan', receitas: 4000, despesas: 2400 },
  { name: 'Fev', receitas: 3000, despesas: 1398 },
  { name: 'Mar', receitas: 2000, despesas: 9800 },
  { name: 'Abr', receitas: 2780, despesas: 3908 },
  { name: 'Mai', receitas: 1890, despesas: 4800 },
  { name: 'Jun', receitas: 2390, despesas: 3800 },
];

const initialTransactions = [
  { id: 1, type: 'income', category: 'Dízimo', description: 'Dízimo - João Silva', amount: 500.00, date: '15/06/2023', status: 'Concluído' },
  { id: 2, type: 'expense', category: 'Luz', description: 'Conta de Energia (Enel)', amount: -350.00, date: '14/06/2023', status: 'Concluído' },
  { id: 3, type: 'income', category: 'Oferta', description: 'Oferta Culto de Domingo', amount: 1250.50, date: '12/06/2023', status: 'Concluído' },
  { id: 4, type: 'expense', category: 'Aluguel', description: 'Aluguel do Templo', amount: -2500.00, date: '10/06/2023', status: 'Pendente' },
  { id: 5, type: 'income', category: 'Doação', description: 'Doação para Ação Social', amount: 800.00, date: '08/06/2023', status: 'Concluído' },
];

export function Financial() {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAllTransactions, setShowAllTransactions] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [formData, setFormData] = useState({
    type: 'income',
    amount: '',
    description: '',
    category: 'Dízimo',
    date: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || !formData.description || !formData.date) return;

    const amountNum = parseFloat(formData.amount);
    const finalAmount = formData.type === 'expense' ? -Math.abs(amountNum) : Math.abs(amountNum);

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
    setIsModalOpen(false);
    setFormData({ type: 'income', amount: '', description: '', category: 'Dízimo', date: '' });
  };

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + Math.abs(curr.amount), 0);
  const balance = totalIncome - totalExpense;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Financeiro</h1>
          <p className="text-sm text-secondary-500">Gestão de dízimos, ofertas e despesas.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowReportModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-secondary-200 rounded-lg text-sm font-medium text-secondary-700 hover:bg-secondary-50 transition-colors"
          >
            <Download className="w-4 h-4" />
            Relatório
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nova Transação
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white p-6 rounded-xl border border-secondary-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center text-green-600">
              <ArrowUpRight className="w-6 h-6" />
            </div>
            <span className="flex items-center text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
              +15%
            </span>
          </div>
          <h3 className="text-sm font-medium text-secondary-500">Receitas (Total)</h3>
          <p className="text-2xl font-bold text-secondary-900 mt-1">R$ {totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-secondary-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center text-red-600">
              <ArrowDownRight className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-secondary-500">Despesas (Total)</h3>
          <p className="text-2xl font-bold text-secondary-900 mt-1">R$ {totalExpense.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-secondary-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
              <Wallet className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-secondary-500">Saldo Atual</h3>
          <p className="text-2xl font-bold text-secondary-900 mt-1">R$ {balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
        </div>
      </div>

      {/* Chart & Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-secondary-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-secondary-900">Fluxo de Caixa</h2>
            <select className="text-sm border-secondary-200 rounded-lg focus:ring-primary-500 focus:border-primary-500">
              <option>Últimos 6 meses</option>
              <option>Este ano</option>
            </select>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `R$ ${value}`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => [`R$ ${value}`, '']}
                  cursor={{fill: '#f1f5f9'}}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#64748b' }} />
                <Bar dataKey="receitas" name="Receitas" fill="#22c55e" radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Bar dataKey="despesas" name="Despesas" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white p-6 rounded-xl border border-secondary-200 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-secondary-900">Transações Recentes</h2>
            <button 
              onClick={() => setShowAllTransactions(true)}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Ver todas
            </button>
          </div>
          <div className="space-y-4 flex-1 overflow-y-auto pr-2">
            {transactions.slice(0, 4).map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary-50 transition-colors border border-transparent hover:border-secondary-100">
                <div className="flex items-center gap-3">
                  <div className={clsx(
                    "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                    tx.type === 'income' ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                  )}>
                    {tx.type === 'income' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-secondary-900 truncate max-w-[150px]">{tx.description}</p>
                    <p className="text-xs text-secondary-500">{tx.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={clsx(
                    "text-sm font-bold",
                    tx.type === 'income' ? "text-green-600" : "text-red-600"
                  )}>
                    {tx.type === 'income' ? '+' : ''}R$ {Math.abs(tx.amount).toFixed(2)}
                  </p>
                  <span className={clsx(
                    "text-[10px] font-medium px-1.5 py-0.5 rounded-full",
                    tx.status === 'Concluído' ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                  )}>
                    {tx.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal Nova Transação */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-secondary-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-secondary-200">
              <h2 className="text-xl font-bold text-secondary-900">Nova Transação</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
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
                    <div className="p-3 text-center border border-secondary-200 rounded-lg peer-checked:border-green-500 peer-checked:bg-green-50 peer-checked:text-green-700 font-medium transition-colors">
                      Receita
                    </div>
                  </label>
                  <label className="flex-1 cursor-pointer">
                    <input type="radio" name="type" value="expense" checked={formData.type === 'expense'} onChange={handleInputChange} className="peer sr-only" />
                    <div className="p-3 text-center border border-secondary-200 rounded-lg peer-checked:border-red-500 peer-checked:bg-red-50 peer-checked:text-red-700 font-medium transition-colors">
                      Despesa
                    </div>
                  </label>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-secondary-700">Valor (R$) *</label>
                    <input required name="amount" value={formData.amount} onChange={handleInputChange} type="number" step="0.01" className="w-full px-4 py-2 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-lg font-bold" placeholder="0,00" />
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
                    <div className="border-2 border-dashed border-secondary-300 rounded-lg p-6 text-center hover:bg-secondary-50 transition-colors cursor-pointer">
                      <FileText className="w-8 h-8 text-secondary-400 mx-auto mb-2" />
                      <p className="text-sm text-secondary-600">Clique para fazer upload ou arraste o arquivo</p>
                      <p className="text-xs text-secondary-400 mt-1">PNG, JPG, PDF até 5MB</p>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div className="flex items-center justify-end gap-3 p-6 border-t border-secondary-200 bg-secondary-50">
              <button 
                onClick={() => setIsModalOpen(false)}
                type="button"
                className="px-4 py-2 bg-white border border-secondary-200 rounded-lg text-sm font-medium text-secondary-700 hover:bg-secondary-50 transition-colors"
              >
                Cancelar
              </button>
              <button type="submit" form="add-transaction-form" className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
                Salvar Transação
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
                  <div key={transaction.id} className="flex items-center justify-between p-4 border border-secondary-200 rounded-lg hover:bg-secondary-50 transition-colors">
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
                      <p className="text-sm text-secondary-500">{transaction.status}</p>
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
                className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
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
