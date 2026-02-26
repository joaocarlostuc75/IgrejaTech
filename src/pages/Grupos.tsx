import React, { useState } from 'react';
import { 
  Network, 
  Users, 
  MapPin, 
  Plus, 
  Search, 
  MoreVertical,
  Calendar,
  CheckCircle2
} from 'lucide-react';
import clsx from 'clsx';

const initialGroups = [
  { id: 1, name: 'Célula Betel', leader: 'João Silva', members: 12, address: 'Rua das Flores, 123', meetingDay: 'Quinta-feira', time: '20:00', status: 'Ativo' },
  { id: 2, name: 'Célula Peniel', leader: 'Maria Oliveira', members: 8, address: 'Av. Principal, 456', meetingDay: 'Sexta-feira', time: '19:30', status: 'Ativo' },
  { id: 3, name: 'Célula Ebenézer', leader: 'Carlos Santos', members: 15, address: 'Rua do Sol, 789', meetingDay: 'Quarta-feira', time: '20:00', status: 'Ativo' },
];

export function Grupos() {
  const [groups, setGroups] = useState(initialGroups);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingGroup, setEditingGroup] = useState<any>(null);
  const [viewingGroup, setViewingGroup] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    leader: '',
    address: '',
    meetingDay: 'Quinta-feira',
    time: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.leader) return;

    if (editingGroup) {
      setGroups(prev => prev.map(g => g.id === editingGroup.id ? {
        ...g,
        name: formData.name,
        leader: formData.leader,
        address: formData.address,
        meetingDay: formData.meetingDay,
        time: formData.time
      } : g));
      setEditingGroup(null);
    } else {
      const newGroup = {
        id: Date.now(),
        name: formData.name,
        leader: formData.leader,
        members: 0,
        address: formData.address,
        meetingDay: formData.meetingDay,
        time: formData.time,
        status: 'Ativo'
      };
      setGroups(prev => [...prev, newGroup]);
    }

    setIsModalOpen(false);
    setFormData({ name: '', leader: '', address: '', meetingDay: 'Quinta-feira', time: '' });
  };

  const handleEdit = (group: any) => {
    setEditingGroup(group);
    setFormData({
      name: group.name,
      leader: group.leader,
      address: group.address,
      meetingDay: group.meetingDay,
      time: group.time
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Tem certeza que deseja excluir este grupo?')) {
      setGroups(prev => prev.filter(g => g.id !== id));
    }
  };

  const filteredGroups = groups.filter(g => 
    g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.leader.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Grupos Pequenos</h1>
          <p className="text-sm text-secondary-500">Gestão de células, grupos familiares e discipulado.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => {
              setIsModalOpen(true);
              setEditingGroup(null);
              setFormData({ name: '', leader: '', address: '', meetingDay: 'Quinta-feira', time: '' });
            }}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Novo Grupo
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white p-6 rounded-xl border border-secondary-200 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
              <Network className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-secondary-500">Total de Grupos</h3>
          <p className="text-2xl font-bold text-secondary-900 mt-1">{groups.length}</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-secondary-200 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center text-green-600">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-secondary-500">Membros em Grupos</h3>
          <p className="text-2xl font-bold text-secondary-900 mt-1">
            {groups.reduce((acc, curr) => acc + curr.members, 0)}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-secondary-200 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-secondary-500">Reuniões na Semana</h3>
          <p className="text-2xl font-bold text-secondary-900 mt-1">{groups.length}</p>
        </div>
      </div>

      {/* Search and List */}
      <div className="bg-white p-4 rounded-xl border border-secondary-200 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-96">
          <Search className="w-5 h-5 text-secondary-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Buscar grupo ou líder..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredGroups.map((group) => (
          <div key={group.id} className="bg-white rounded-xl border border-secondary-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
            <div className="p-5 flex-1">
              <div className="flex justify-between items-start mb-4">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                  {group.status}
                </span>
                <div className="relative group/menu">
                  <button className="text-secondary-400 hover:text-secondary-600 transition-colors p-1 rounded-md hover:bg-secondary-100">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                  <div className="absolute right-0 mt-1 w-32 bg-white border border-secondary-200 rounded-lg shadow-lg opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-10">
                    <button onClick={() => handleEdit(group)} className="w-full text-left px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50">Editar</button>
                    <button onClick={() => handleDelete(group.id)} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">Excluir</button>
                  </div>
                </div>
              </div>
              <h3 className="text-lg font-bold text-secondary-900 mb-1">{group.name}</h3>
              <p className="text-sm text-secondary-500 mb-4">Líder: {group.leader}</p>
              
              <div className="space-y-2.5">
                <div className="flex items-center text-sm text-secondary-600 gap-2.5">
                  <Calendar className="w-4 h-4 text-secondary-400" />
                  {group.meetingDay} às {group.time}
                </div>
                <div className="flex items-center text-sm text-secondary-600 gap-2.5">
                  <MapPin className="w-4 h-4 text-secondary-400" />
                  {group.address}
                </div>
              </div>
            </div>
            <div className="bg-secondary-50 px-5 py-3.5 border-t border-secondary-200 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-secondary-600 font-medium">
                <Users className="w-4 h-4 text-secondary-400" />
                {group.members} membros
              </div>
              <button 
                onClick={() => setViewingGroup(group)}
                className="text-sm font-medium text-primary-600 hover:text-primary-700"
              >
                Ver detalhes
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Novo/Editar Grupo */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-secondary-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-secondary-200">
              <h2 className="text-xl font-bold text-secondary-900">{editingGroup ? 'Editar Grupo' : 'Novo Grupo Pequeno'}</h2>
              <button 
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingGroup(null);
                  setFormData({ name: '', leader: '', address: '', meetingDay: 'Quinta-feira', time: '' });
                }}
                className="text-secondary-400 hover:text-secondary-600 transition-colors"
              >
                <Plus className="w-6 h-6 rotate-45" />
              </button>
            </div>
            <div className="p-6">
              <form id="add-group-form" onSubmit={handleAddGroup} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-secondary-700">Nome do Grupo *</label>
                  <input required name="name" value={formData.name} onChange={handleInputChange} type="text" className="w-full px-4 py-2 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Ex: Célula Betel" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-secondary-700">Líder *</label>
                  <input required name="leader" value={formData.leader} onChange={handleInputChange} type="text" className="w-full px-4 py-2 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Nome do líder" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-secondary-700">Endereço</label>
                  <input name="address" value={formData.address} onChange={handleInputChange} type="text" className="w-full px-4 py-2 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Local das reuniões" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-secondary-700">Dia da Reunião</label>
                    <select name="meetingDay" value={formData.meetingDay} onChange={handleInputChange} className="w-full px-4 py-2 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                      <option>Segunda-feira</option>
                      <option>Terça-feira</option>
                      <option>Quarta-feira</option>
                      <option>Quinta-feira</option>
                      <option>Sexta-feira</option>
                      <option>Sábado</option>
                      <option>Domingo</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-secondary-700">Horário</label>
                    <input name="time" value={formData.time} onChange={handleInputChange} type="time" className="w-full px-4 py-2 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                  </div>
                </div>
              </form>
            </div>
            <div className="flex items-center justify-end gap-3 p-6 border-t border-secondary-200 bg-secondary-50">
              <button 
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingGroup(null);
                  setFormData({ name: '', leader: '', address: '', meetingDay: 'Quinta-feira', time: '' });
                }}
                type="button"
                className="px-4 py-2 bg-white border border-secondary-200 rounded-lg text-sm font-medium text-secondary-700 hover:bg-secondary-50 transition-colors"
              >
                Cancelar
              </button>
              <button type="submit" form="add-group-form" className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors shadow-sm">
                {editingGroup ? 'Salvar Alterações' : 'Salvar Grupo'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Ver Detalhes */}
      {viewingGroup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-secondary-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-secondary-200">
              <h2 className="text-xl font-bold text-secondary-900">Detalhes do Grupo</h2>
              <button 
                onClick={() => setViewingGroup(null)}
                className="text-secondary-400 hover:text-secondary-600 transition-colors"
              >
                <Plus className="w-6 h-6 rotate-45" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-sm font-medium text-secondary-500">Nome</h3>
                <p className="text-lg font-bold text-secondary-900">{viewingGroup.name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-secondary-500">Líder</h3>
                <p className="text-base text-secondary-900">{viewingGroup.leader}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-secondary-500">Reuniões</h3>
                <p className="text-base text-secondary-900">{viewingGroup.meetingDay} às {viewingGroup.time}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-secondary-500">Endereço</h3>
                <p className="text-base text-secondary-900">{viewingGroup.address}</p>
              </div>
              <div className="pt-4 border-t border-secondary-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-secondary-500">Membros Ativos</h3>
                  <span className="text-lg font-bold text-primary-600">{viewingGroup.members}</span>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-secondary-200 bg-secondary-50">
              <button 
                onClick={() => setViewingGroup(null)}
                className="w-full px-4 py-2 bg-white border border-secondary-200 rounded-lg text-sm font-medium text-secondary-700 hover:bg-secondary-50 transition-colors shadow-sm"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
