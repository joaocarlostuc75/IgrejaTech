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
  Clock
} from 'lucide-react';
import clsx from 'clsx';

const initialBeneficiaries = [
  { id: 1, name: 'Família Souza', members: 4, priority: 'Alta', lastAssistance: '15/10/2023', status: 'Ativo' },
  { id: 2, name: 'João Batista', members: 1, priority: 'Média', lastAssistance: '02/11/2023', status: 'Ativo' },
  { id: 3, name: 'Maria Silva', members: 3, priority: 'Baixa', lastAssistance: '20/09/2023', status: 'Inativo' },
  { id: 4, name: 'Família Oliveira', members: 6, priority: 'Alta', lastAssistance: '10/11/2023', status: 'Ativo' },
];

const initialResources = [
  { id: 1, name: 'Cesta Básica', category: 'Alimentos', quantity: 45, unit: 'unidades', status: 'Suficiente' },
  { id: 2, name: 'Leite em Pó', category: 'Alimentos', quantity: 12, unit: 'latas', status: 'Baixo' },
  { id: 3, name: 'Roupas de Inverno', category: 'Vestuário', quantity: 150, unit: 'peças', status: 'Suficiente' },
  { id: 4, name: 'Fraldas Infantis', category: 'Higiene', quantity: 5, unit: 'pacotes', status: 'Crítico' },
];

export function SocialAction() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'beneficiarios' | 'recursos'>('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [beneficiaries, setBeneficiaries] = useState(initialBeneficiaries);
  const [resources, setResources] = useState(initialResources);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    beneficiaryId: '',
    resourceId: '',
    quantity: '1',
    date: '',
    notes: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddAssistance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.beneficiaryId || !formData.resourceId || !formData.date) return;

    const resourceId = parseInt(formData.resourceId);
    const quantity = parseInt(formData.quantity);

    // Update resource quantity
    setResources(prev => prev.map(r => {
      if (r.id === resourceId) {
        const newQuantity = Math.max(0, r.quantity - quantity);
        return {
          ...r,
          quantity: newQuantity,
          status: newQuantity === 0 ? 'Crítico' : newQuantity < 10 ? 'Baixo' : 'Suficiente'
        };
      }
      return r;
    }));

    // Update beneficiary last assistance
    setBeneficiaries(prev => prev.map(b => {
      if (b.id === parseInt(formData.beneficiaryId)) {
        return {
          ...b,
          lastAssistance: new Date(formData.date).toLocaleDateString('pt-BR')
        };
      }
      return b;
    }));

    setIsModalOpen(false);
    setFormData({ beneficiaryId: '', resourceId: '', quantity: '1', date: '', notes: '' });
  };

  const filteredBeneficiaries = beneficiaries.filter(b => 
    b.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredResources = resources.filter(r => 
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Ação Social</h1>
          <p className="text-sm text-secondary-500">Gestão de beneficiários e recursos assistenciais.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-white border border-secondary-200 rounded-lg text-sm font-medium text-secondary-700 hover:bg-secondary-50 transition-colors">
            Exportar
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nova Assistência
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-secondary-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'dashboard', name: 'Dashboard' },
            { id: 'beneficiarios', name: 'Beneficiários' },
            { id: 'recursos', name: 'Recursos' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={clsx(
                "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors",
                activeTab === tab.id
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300"
              )}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-white p-6 rounded-xl border border-secondary-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                  <Users className="w-6 h-6" />
                </div>
              </div>
              <h3 className="text-sm font-medium text-secondary-500">Famílias Atendidas (Mês)</h3>
              <p className="text-2xl font-bold text-secondary-900 mt-1">42</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-secondary-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center text-green-600">
                  <Package className="w-6 h-6" />
                </div>
              </div>
              <h3 className="text-sm font-medium text-secondary-500">Cestas Distribuídas</h3>
              <p className="text-2xl font-bold text-secondary-900 mt-1">156</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-secondary-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center text-orange-600">
                  <AlertCircle className="w-6 h-6" />
                </div>
              </div>
              <h3 className="text-sm font-medium text-secondary-500">Casos Prioritários</h3>
              <p className="text-2xl font-bold text-secondary-900 mt-1">8</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Priority Cases */}
            <div className="bg-white p-6 rounded-xl border border-secondary-200 shadow-sm">
              <h2 className="text-lg font-bold text-secondary-900 mb-6">Casos Prioritários</h2>
              <div className="space-y-4">
                {beneficiaries.filter(b => b.priority === 'Alta').map((b) => (
                  <div key={b.id} className="flex items-center justify-between p-4 rounded-lg border border-red-100 bg-red-50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                        <AlertCircle className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-red-900">{b.name}</p>
                        <p className="text-xs text-red-700">Última assistência: {b.lastAssistance}</p>
                      </div>
                    </div>
                    <button className="px-3 py-1.5 bg-white border border-red-200 rounded-md text-xs font-medium text-red-700 hover:bg-red-50 transition-colors">
                      Atender
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Assistances */}
            <div className="bg-white p-6 rounded-xl border border-secondary-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-secondary-900">Últimas Assistências</h2>
                <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">Ver todas</button>
              </div>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary-50 transition-colors border border-transparent hover:border-secondary-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-secondary-900">Cesta Básica - João Batista</p>
                        <p className="text-xs text-secondary-500">Entregue por: Voluntário A</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-secondary-500 flex items-center gap-1 justify-end">
                        <Clock className="w-3 h-3" /> Hoje, 10:30
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'beneficiarios' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-secondary-200 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div className="relative w-full sm:w-96">
              <Search className="w-5 h-5 text-secondary-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Buscar beneficiário..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-secondary-200 rounded-lg text-sm font-medium text-secondary-700 hover:bg-secondary-50 transition-colors w-full sm:w-auto justify-center">
              <Filter className="w-4 h-4" />
              Filtros
            </button>
          </div>

          <div className="bg-white rounded-xl border border-secondary-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-secondary-600">
                <thead className="bg-secondary-50 text-secondary-700 font-medium border-b border-secondary-200">
                  <tr>
                    <th className="px-6 py-4">Nome / Família</th>
                    <th className="px-6 py-4">Membros</th>
                    <th className="px-6 py-4">Prioridade</th>
                    <th className="px-6 py-4">Última Assistência</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-secondary-200">
                  {filteredBeneficiaries.map((b) => (
                    <tr key={b.id} className="hover:bg-secondary-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-secondary-900">{b.name}</td>
                      <td className="px-6 py-4">{b.members} pessoas</td>
                      <td className="px-6 py-4">
                        <span className={clsx(
                          "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium",
                          b.priority === 'Alta' ? "bg-red-100 text-red-700" :
                          b.priority === 'Média' ? "bg-yellow-100 text-yellow-700" :
                          "bg-green-100 text-green-700"
                        )}>
                          {b.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-secondary-500">{b.lastAssistance}</td>
                      <td className="px-6 py-4">
                        <span className={clsx(
                          "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium",
                          b.status === 'Ativo' ? "bg-green-100 text-green-700" : "bg-secondary-100 text-secondary-700"
                        )}>
                          {b.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-2 text-secondary-400 hover:text-secondary-600 transition-colors rounded-lg hover:bg-secondary-100">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'recursos' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-secondary-200 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div className="relative w-full sm:w-96">
              <Search className="w-5 h-5 text-secondary-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Buscar recurso..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors w-full sm:w-auto justify-center">
              <Plus className="w-4 h-4" />
              Novo Recurso
            </button>
          </div>

          <div className="bg-white rounded-xl border border-secondary-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-secondary-600">
                <thead className="bg-secondary-50 text-secondary-700 font-medium border-b border-secondary-200">
                  <tr>
                    <th className="px-6 py-4">Item</th>
                    <th className="px-6 py-4">Categoria</th>
                    <th className="px-6 py-4">Quantidade</th>
                    <th className="px-6 py-4">Status de Estoque</th>
                    <th className="px-6 py-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-secondary-200">
                  {filteredResources.map((r) => (
                    <tr key={r.id} className="hover:bg-secondary-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-secondary-900">{r.name}</td>
                      <td className="px-6 py-4">{r.category}</td>
                      <td className="px-6 py-4 font-medium">{r.quantity} <span className="text-secondary-500 font-normal">{r.unit}</span></td>
                      <td className="px-6 py-4">
                        <span className={clsx(
                          "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium",
                          r.status === 'Suficiente' ? "bg-green-100 text-green-700" :
                          r.status === 'Baixo' ? "bg-yellow-100 text-yellow-700" :
                          "bg-red-100 text-red-700"
                        )}>
                          {r.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-2 text-secondary-400 hover:text-secondary-600 transition-colors rounded-lg hover:bg-secondary-100">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modal Nova Assistência */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-secondary-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-secondary-200">
              <h2 className="text-xl font-bold text-secondary-900">Registrar Assistência</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-secondary-400 hover:text-secondary-600 transition-colors"
              >
                <Plus className="w-6 h-6 rotate-45" />
              </button>
            </div>
            <div className="p-6">
              <form id="add-assistance-form" onSubmit={handleAddAssistance} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-secondary-700">Beneficiário / Família *</label>
                  <select required name="beneficiaryId" value={formData.beneficiaryId} onChange={handleInputChange} className="w-full px-4 py-2 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <option value="">Selecione...</option>
                    {beneficiaries.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-secondary-700">Recurso Fornecido *</label>
                  <select required name="resourceId" value={formData.resourceId} onChange={handleInputChange} className="w-full px-4 py-2 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <option value="">Selecione o item...</option>
                    {resources.map(r => <option key={r.id} value={r.id}>{r.name} (Estoque: {r.quantity})</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-secondary-700">Quantidade *</label>
                    <input required name="quantity" value={formData.quantity} onChange={handleInputChange} type="number" min="1" className="w-full px-4 py-2 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-secondary-700">Data *</label>
                    <input required name="date" value={formData.date} onChange={handleInputChange} type="date" className="w-full px-4 py-2 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-secondary-700">Observações</label>
                  <textarea name="notes" value={formData.notes} onChange={handleInputChange} rows={3} className="w-full px-4 py-2 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Detalhes adicionais..."></textarea>
                </div>
              </form>
            </div>
            <div className="flex items-center justify-end gap-3 p-6 border-t border-secondary-200 bg-secondary-50">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-white border border-secondary-200 rounded-lg text-sm font-medium text-secondary-700 hover:bg-secondary-50 transition-colors"
              >
                Cancelar
              </button>
              <button type="submit" form="add-assistance-form" className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
                Salvar Registro
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
