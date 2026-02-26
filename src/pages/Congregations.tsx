import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Users, 
  Phone, 
  Mail, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical,
  Calendar,
  DollarSign,
  TrendingUp
} from 'lucide-react';
import clsx from 'clsx';

const initialCongregations = [
  { 
    id: 1, 
    name: 'Sede Central', 
    address: 'Av. Principal, 1000 - Centro', 
    leader: 'Pr. João Silva', 
    members: 450, 
    founded: '1985',
    phone: '(11) 3333-4444',
    email: 'sede@igreja.com',
    status: 'Ativa',
    image: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=2073&auto=format&fit=crop'
  },
  { 
    id: 2, 
    name: 'Congregação Norte', 
    address: 'Rua das Palmeiras, 45 - Jd. Norte', 
    leader: 'Pb. Marcos Santos', 
    members: 120, 
    founded: '2010',
    phone: '(11) 3333-5555',
    email: 'norte@igreja.com',
    status: 'Ativa',
    image: 'https://images.unsplash.com/photo-1548625361-e88c60eb35d2?q=80&w=2069&auto=format&fit=crop'
  },
  { 
    id: 3, 
    name: 'Ponto de Pregação Sul', 
    address: 'Av. do Sol, 890 - Vila Sul', 
    leader: 'Dc. Pedro Oliveira', 
    members: 45, 
    founded: '2022',
    phone: '(11) 99999-8888',
    email: 'sul@igreja.com',
    status: 'Em Crescimento',
    image: 'https://images.unsplash.com/photo-1478147427282-58a87a120781?q=80&w=2070&auto=format&fit=crop'
  },
];

const stats = [
  { name: 'Total de Congregações', value: '12', icon: Building2, change: '+2 este ano', color: 'blue' },
  { name: 'Membros Totais', value: '1,245', icon: Users, change: '+15% crescimento', color: 'green' },
  { name: 'Média por Local', value: '103', icon: TrendingUp, change: 'Membros ativos', color: 'purple' },
  { name: 'Ofertas (Mês)', value: 'R$ 45.2k', icon: DollarSign, change: '+8% vs mês anterior', color: 'orange' },
];

export function Congregations() {
  const [congregations, setCongregations] = useState(initialCongregations);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    leader: '',
    phone: '',
    email: '',
    status: 'Ativa'
  });

  const [editingCongregation, setEditingCongregation] = useState<any>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddCongregation = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingCongregation) {
      setCongregations(prev => prev.map(c => c.id === editingCongregation.id ? {
        ...c,
        ...formData
      } : c));
      setEditingCongregation(null);
    } else {
      const newCongregation = {
        id: Date.now(),
        ...formData,
        members: 0,
        founded: new Date().getFullYear().toString(),
        image: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=2073&auto=format&fit=crop'
      };
      setCongregations([...congregations, newCongregation]);
    }
    
    setIsModalOpen(false);
    setFormData({ name: '', address: '', leader: '', phone: '', email: '', status: 'Ativa' });
  };

  const handleEdit = (congregation: any) => {
    setEditingCongregation(congregation);
    setFormData({
      name: congregation.name,
      address: congregation.address,
      leader: congregation.leader,
      phone: congregation.phone,
      email: congregation.email,
      status: congregation.status
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Tem certeza que deseja excluir esta congregação?')) {
      setCongregations(prev => prev.filter(c => c.id !== id));
    }
  };

  const filteredCongregations = congregations.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.leader.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Congregações</h1>
          <p className="text-sm text-secondary-500">Gerencie as filiais e pontos de pregação.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative hidden sm:block w-64">
            <Search className="w-4 h-4 text-secondary-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Buscar congregação..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white shadow-sm"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-secondary-200 rounded-xl text-sm font-medium text-secondary-700 hover:bg-secondary-50 transition-colors shadow-sm">
            <Filter className="w-4 h-4" />
            Filtrar
          </button>
          <button 
            onClick={() => {
              setIsModalOpen(true);
              setEditingCongregation(null);
              setFormData({ name: '', address: '', leader: '', phone: '', email: '', status: 'Ativa' });
            }}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Nova Congregação
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

      {/* Congregations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCongregations.map((congregation) => (
          <div key={congregation.id} className="bg-white rounded-xl border border-secondary-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col group">
            <div className="h-48 overflow-hidden relative">
              <img 
                src={congregation.image} 
                alt={congregation.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 right-4">
                <span className={clsx(
                  "px-3 py-1 rounded-full text-xs font-bold shadow-sm backdrop-blur-md",
                  congregation.status === 'Ativa' ? "bg-green-500/90 text-white" : "bg-blue-500/90 text-white"
                )}>
                  {congregation.status}
                </span>
              </div>
            </div>
            <div className="p-5 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-bold text-secondary-900">{congregation.name}</h3>
                  <p className="text-sm text-secondary-500 flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {congregation.address}
                  </p>
                </div>
                <div className="relative group">
                  <button className="text-secondary-400 hover:text-secondary-600 transition-colors p-1 rounded-md hover:bg-secondary-100">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                  <div className="absolute right-0 mt-1 w-32 bg-white border border-secondary-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                    <button onClick={() => handleEdit(congregation)} className="w-full text-left px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50">Editar</button>
                    <button onClick={() => handleDelete(congregation.id)} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">Excluir</button>
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-3 flex-1">
                <div className="flex items-center justify-between text-sm py-2 border-b border-secondary-100">
                  <span className="text-secondary-500 flex items-center gap-2">
                    <Users className="w-4 h-4" /> Membros
                  </span>
                  <span className="font-medium text-secondary-900">{congregation.members}</span>
                </div>
                <div className="flex items-center justify-between text-sm py-2 border-b border-secondary-100">
                  <span className="text-secondary-500 flex items-center gap-2">
                    <Building2 className="w-4 h-4" /> Liderança
                  </span>
                  <span className="font-medium text-secondary-900">{congregation.leader}</span>
                </div>
                <div className="flex items-center justify-between text-sm py-2">
                  <span className="text-secondary-500 flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> Fundação
                  </span>
                  <span className="font-medium text-secondary-900">{congregation.founded}</span>
                </div>
              </div>

              <div className="mt-6 flex gap-2">
                <button className="flex-1 px-3 py-2 bg-white border border-secondary-200 rounded-lg text-sm font-medium text-secondary-700 hover:bg-secondary-50 transition-colors flex items-center justify-center gap-2">
                  <Phone className="w-4 h-4" />
                  Ligar
                </button>
                <button className="flex-1 px-3 py-2 bg-white border border-secondary-200 rounded-lg text-sm font-medium text-secondary-700 hover:bg-secondary-50 transition-colors flex items-center justify-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Nova Congregação */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-secondary-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-secondary-200">
              <h2 className="text-xl font-bold text-secondary-900">{editingCongregation ? 'Editar Congregação' : 'Nova Congregação'}</h2>
              <button 
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingCongregation(null);
                  setFormData({ name: '', address: '', leader: '', phone: '', email: '', status: 'Ativa' });
                }}
                className="text-secondary-400 hover:text-secondary-600 transition-colors"
              >
                <Plus className="w-6 h-6 rotate-45" />
              </button>
            </div>
            <div className="p-6">
              <form id="add-congregation-form" onSubmit={handleAddCongregation} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-secondary-700">Nome da Congregação *</label>
                  <input required name="name" value={formData.name} onChange={handleInputChange} type="text" className="w-full px-4 py-2 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Ex: Congregação Norte" />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-secondary-700">Líder Responsável *</label>
                    <input required name="leader" value={formData.leader} onChange={handleInputChange} type="text" className="w-full px-4 py-2 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Nome do Pastor/Líder" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-secondary-700">Status</label>
                    <select name="status" value={formData.status} onChange={handleInputChange} className="w-full px-4 py-2 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                      <option>Ativa</option>
                      <option>Em Crescimento</option>
                      <option>Em Reforma</option>
                      <option>Inativa</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-secondary-700">Telefone</label>
                    <input name="phone" value={formData.phone} onChange={handleInputChange} type="tel" className="w-full px-4 py-2 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="(00) 0000-0000" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-secondary-700">Email</label>
                    <input name="email" value={formData.email} onChange={handleInputChange} type="email" className="w-full px-4 py-2 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="email@igreja.com" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-secondary-700">Endereço Completo *</label>
                  <input required name="address" value={formData.address} onChange={handleInputChange} type="text" className="w-full px-4 py-2 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Rua, Número, Bairro, Cidade - UF" />
                </div>
              </form>
            </div>
            <div className="flex items-center justify-end gap-3 p-6 border-t border-secondary-200 bg-secondary-50">
              <button 
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingCongregation(null);
                  setFormData({ name: '', address: '', leader: '', phone: '', email: '', status: 'Ativa' });
                }}
                type="button"
                className="px-4 py-2 bg-white border border-secondary-200 rounded-lg text-sm font-medium text-secondary-700 hover:bg-secondary-50 transition-colors"
              >
                Cancelar
              </button>
              <button type="submit" form="add-congregation-form" className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors shadow-sm">
                {editingCongregation ? 'Salvar Alterações' : 'Cadastrar Congregação'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
