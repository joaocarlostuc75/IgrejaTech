import React, { useState } from 'react';
import { 
  ClipboardList, 
  Calendar, 
  Users, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical,
  CheckCircle2,
  Clock
} from 'lucide-react';
import clsx from 'clsx';

const initialRosters = [
  { id: 1, event: 'Culto de Domingo', date: '12/11/2023', time: '18:00', team: 'Louvor', members: ['Ana Souza', 'Carlos Ferreira', 'Beatriz Lima'], status: 'Confirmado' },
  { id: 2, event: 'Culto de Domingo', date: '12/11/2023', time: '18:00', team: 'Recepção', members: ['Daniel Costa', 'Eduardo Santos'], status: 'Pendente' },
  { id: 3, event: 'Culto de Ensino', date: '15/11/2023', time: '20:00', team: 'Mídia', members: ['João Silva'], status: 'Confirmado' },
];

export function Escalas() {
  const [rosters, setRosters] = useState(initialRosters);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedRosterId, setExpandedRosterId] = useState<number | null>(null);
  const [editingRoster, setEditingRoster] = useState<any>(null);
  const [formData, setFormData] = useState({
    event: '',
    date: '',
    time: '',
    team: 'Louvor',
    members: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddRoster = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.event || !formData.date || !formData.team) return;

    if (editingRoster) {
      setRosters(prev => prev.map(r => r.id === editingRoster.id ? {
        ...r,
        event: formData.event,
        date: formData.date.includes('-') ? new Date(formData.date).toLocaleDateString('pt-BR') : formData.date,
        time: formData.time,
        team: formData.team,
        members: formData.members.split(',').map(m => m.trim()).filter(m => m),
      } : r));
      setEditingRoster(null);
    } else {
      const newRoster = {
        id: Date.now(),
        event: formData.event,
        date: new Date(formData.date).toLocaleDateString('pt-BR'),
        time: formData.time,
        team: formData.team,
        members: formData.members.split(',').map(m => m.trim()).filter(m => m),
        status: 'Pendente'
      };
      setRosters(prev => [...prev, newRoster]);
    }

    setIsModalOpen(false);
    setFormData({ event: '', date: '', time: '', team: 'Louvor', members: '' });
  };

  const handleEdit = (roster: any) => {
    setEditingRoster(roster);
    // Convert DD/MM/YYYY to YYYY-MM-DD for input type="date"
    const [day, month, year] = roster.date.split('/');
    setFormData({
      event: roster.event,
      date: `${year}-${month}-${day}`,
      time: roster.time,
      team: roster.team,
      members: roster.members.join(', ')
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Tem certeza que deseja excluir esta escala?')) {
      setRosters(prev => prev.filter(r => r.id !== id));
    }
  };

  const handleNotify = (team: string) => {
    alert(`Notificação enviada para a equipe de ${team}!`);
  };

  const filteredRosters = rosters.filter(r => 
    r.event.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.team.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Escalas de Voluntários</h1>
          <p className="text-sm text-secondary-500">Organize as equipes para os cultos e eventos.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-white border border-secondary-200 rounded-xl text-sm font-medium text-secondary-700 hover:bg-secondary-50 transition-colors shadow-sm">
            Exportar
          </button>
          <button 
            onClick={() => {
              setIsModalOpen(true);
              setEditingRoster(null);
              setFormData({ event: '', date: '', time: '', team: 'Louvor', members: '' });
            }}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Nova Escala
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white p-6 rounded-xl border border-secondary-200 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
              <ClipboardList className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-secondary-500">Escalas Ativas</h3>
          <p className="text-2xl font-bold text-secondary-900 mt-1">{rosters.length}</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-secondary-200 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center text-green-600">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-secondary-500">Voluntários Escalados</h3>
          <p className="text-2xl font-bold text-secondary-900 mt-1">
            {rosters.reduce((acc, curr) => acc + curr.members.length, 0)}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-secondary-200 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center text-orange-600">
              <Clock className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-secondary-500">Aguardando Confirmação</h3>
          <p className="text-2xl font-bold text-secondary-900 mt-1">
            {rosters.filter(r => r.status === 'Pendente').length}
          </p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-xl border border-secondary-200 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-96">
          <Search className="w-5 h-5 text-secondary-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Buscar por evento ou equipe..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-secondary-200 rounded-lg text-sm font-medium text-secondary-700 hover:bg-secondary-50 transition-colors w-full sm:w-auto justify-center shadow-sm">
            <Filter className="w-4 h-4" />
            Filtros
          </button>
        </div>
      </div>

      {/* Rosters List */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredRosters.map((roster) => (
          <div key={roster.id} className="bg-white rounded-xl border border-secondary-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
            <div className="p-5 flex-1">
              <div className="flex justify-between items-start mb-4">
                <span className={clsx(
                  "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium",
                  roster.team === 'Louvor' ? "bg-purple-100 text-purple-700" :
                  roster.team === 'Recepção' ? "bg-blue-100 text-blue-700" :
                  roster.team === 'Mídia' ? "bg-green-100 text-green-700" :
                  "bg-secondary-100 text-secondary-700"
                )}>
                  {roster.team}
                </span>
                <div className="relative group">
                  <button className="text-secondary-400 hover:text-secondary-600 transition-colors p-1 rounded-md hover:bg-secondary-100">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                  <div className="absolute right-0 mt-1 w-32 bg-white border border-secondary-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                    <button onClick={() => handleEdit(roster)} className="w-full text-left px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50">Editar</button>
                    <button onClick={() => handleDelete(roster.id)} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">Excluir</button>
                  </div>
                </div>
              </div>
              <h3 className="text-lg font-bold text-secondary-900 mb-3">{roster.event}</h3>
              <div className="space-y-2.5 mb-4">
                <div className="flex items-center text-sm text-secondary-600 gap-2.5">
                  <Calendar className="w-4 h-4 text-secondary-400" />
                  {roster.date}
                </div>
                <div className="flex items-center text-sm text-secondary-600 gap-2.5">
                  <Clock className="w-4 h-4 text-secondary-400" />
                  {roster.time}
                </div>
              </div>
              
              <div>
                <div 
                  className="flex items-center justify-between cursor-pointer mb-2"
                  onClick={() => setExpandedRosterId(expandedRosterId === roster.id ? null : roster.id)}
                >
                  <h4 className="text-xs font-bold text-secondary-500 uppercase tracking-wider">Voluntários ({roster.members.length})</h4>
                  <span className="text-xs text-primary-600 font-medium">{expandedRosterId === roster.id ? 'Ocultar' : 'Ver todos'}</span>
                </div>
                
                {expandedRosterId === roster.id ? (
                  <ul className="space-y-1 mt-2">
                    {roster.members.map((member, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-secondary-700 bg-secondary-50 px-2 py-1.5 rounded-md">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary-500"></div>
                        {member}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {roster.members.slice(0, 3).map((member, idx) => (
                      <span key={idx} className="inline-flex items-center px-2 py-1 rounded bg-secondary-50 border border-secondary-200 text-xs font-medium text-secondary-700">
                        {member}
                      </span>
                    ))}
                    {roster.members.length > 3 && (
                      <span className="inline-flex items-center px-2 py-1 rounded bg-secondary-50 border border-secondary-200 text-xs font-medium text-secondary-500">
                        +{roster.members.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="bg-secondary-50 px-5 py-3.5 border-t border-secondary-200 flex items-center justify-between">
              <span className={clsx(
                "text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1.5",
                roster.status === 'Confirmado' ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
              )}>
                {roster.status === 'Confirmado' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                {roster.status}
              </span>
              <button 
                onClick={() => handleNotify(roster.team)}
                className="text-sm font-medium text-primary-600 hover:text-primary-700"
              >
                Notificar equipe
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Nova Escala */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-secondary-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-secondary-200">
              <h2 className="text-xl font-bold text-secondary-900">{editingRoster ? 'Editar Escala' : 'Nova Escala'}</h2>
              <button 
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingRoster(null);
                  setFormData({ event: '', date: '', time: '', team: 'Louvor', members: '' });
                }}
                className="text-secondary-400 hover:text-secondary-600 transition-colors"
              >
                <Plus className="w-6 h-6 rotate-45" />
              </button>
            </div>
            <div className="p-6">
              <form id="add-roster-form" onSubmit={handleAddRoster} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-secondary-700">Evento *</label>
                  <input required name="event" value={formData.event} onChange={handleInputChange} type="text" className="w-full px-4 py-2 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Ex: Culto de Domingo" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-secondary-700">Data *</label>
                    <input required name="date" value={formData.date} onChange={handleInputChange} type="date" className="w-full px-4 py-2 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-secondary-700">Horário</label>
                    <input name="time" value={formData.time} onChange={handleInputChange} type="time" className="w-full px-4 py-2 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-secondary-700">Equipe/Ministério *</label>
                  <select required name="team" value={formData.team} onChange={handleInputChange} className="w-full px-4 py-2 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <option>Louvor</option>
                    <option>Recepção</option>
                    <option>Mídia</option>
                    <option>Infantil</option>
                    <option>Segurança</option>
                    <option>Limpeza</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-secondary-700">Voluntários (separados por vírgula)</label>
                  <textarea name="members" value={formData.members} onChange={handleInputChange} rows={3} className="w-full px-4 py-2 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Ex: João Silva, Maria Oliveira..."></textarea>
                </div>
              </form>
            </div>
            <div className="flex items-center justify-end gap-3 p-6 border-t border-secondary-200 bg-secondary-50">
              <button 
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingRoster(null);
                  setFormData({ event: '', date: '', time: '', team: 'Louvor', members: '' });
                }}
                type="button"
                className="px-4 py-2 bg-white border border-secondary-200 rounded-lg text-sm font-medium text-secondary-700 hover:bg-secondary-50 transition-colors"
              >
                Cancelar
              </button>
              <button type="submit" form="add-roster-form" className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors shadow-sm">
                {editingRoster ? 'Salvar Alterações' : 'Salvar Escala'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
