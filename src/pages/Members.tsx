import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  MoreVertical,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  XCircle,
  BookOpen,
  Gift,
  ArrowUpRight
} from 'lucide-react';
import clsx from 'clsx';

const initialMembers = [
  { id: 1, name: 'Ana Souza', email: 'ana@email.com', phone: '(11) 98765-4321', status: 'Ativo', group: 'Jovens', joinDate: '12/05/2021', avatar: 'https://picsum.photos/seed/ana/40/40' },
  { id: 2, name: 'Carlos Ferreira', email: 'carlos@email.com', phone: '(11) 91234-5678', status: 'Inativo', group: 'Casais', joinDate: '01/08/2023', avatar: 'https://picsum.photos/seed/carlos/40/40' },
  { id: 3, name: 'Beatriz Lima', email: 'beatriz@email.com', phone: '(11) 99876-5432', status: 'Ativo', group: 'Liderança', joinDate: '15/02/2019', avatar: 'https://picsum.photos/seed/beatriz/40/40' },
  { id: 4, name: 'Daniel Costa', email: 'daniel@email.com', phone: '(11) 98765-1234', status: 'Ativo', group: 'Jovens', joinDate: '20/11/2022', avatar: 'https://picsum.photos/seed/daniel/40/40' },
  { id: 5, name: 'Eduardo Santos', email: 'eduardo@email.com', phone: '(11) 91234-9876', status: 'Ativo', group: 'Homens', joinDate: '05/01/2015', avatar: 'https://picsum.photos/seed/eduardo/40/40' },
];

const stats = [
  { name: 'Total de Membros', value: '1,245', icon: Users, change: '+12% este mês', color: 'blue' },
  { name: 'Novos Visitantes', value: '48', icon: Users, change: 'Últimos 30 dias', color: 'green' },
  { name: 'Em Discipulado', value: '156', icon: BookOpen, change: '3 turmas ativas', color: 'purple' },
  { name: 'Aniversariantes', value: '12', icon: Gift, change: 'Neste mês', color: 'orange' },
];

export function Members() {
  const [members, setMembers] = useState(initialMembers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    group: 'Jovens',
    status: 'Ativo'
  });

  const [editingMember, setEditingMember] = useState<any>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    if (editingMember) {
      setMembers(prev => prev.map(m => m.id === editingMember.id ? {
        ...m,
        name: formData.name,
        email: formData.email,
        phone: formData.phone || '(00) 00000-0000',
        status: formData.status,
        group: formData.group,
        avatar: m.avatar // Keep existing avatar
      } : m));
      setEditingMember(null);
    } else {
      const newMember = {
        id: Date.now(),
        name: formData.name,
        email: formData.email,
        phone: formData.phone || '(00) 00000-0000',
        status: formData.status,
        group: formData.group,
        joinDate: new Date().toLocaleDateString('pt-BR'),
        avatar: `https://picsum.photos/seed/${formData.name.split(' ')[0].toLowerCase()}/40/40`
      };
      setMembers(prev => [newMember, ...prev]);
    }

    setIsModalOpen(false);
    setFormData({ name: '', email: '', phone: '', group: 'Jovens', status: 'Ativo' });
  };

  const handleEdit = (member: any) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      email: member.email,
      phone: member.phone,
      group: member.group,
      status: member.status
    });
    setIsModalOpen(true);
  };

  const handleDeleteMember = (id: number) => {
    if (confirm('Tem certeza que deseja excluir este membro?')) {
      setMembers(prev => prev.filter(m => m.id !== id));
    }
  };

  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.phone.includes(searchQuery)
  );

  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedMembers = filteredMembers.slice(startIndex, startIndex + itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Membros</h1>
          <p className="text-sm text-secondary-500">Gerencie os membros da igreja.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative hidden sm:block w-64">
            <Search className="w-4 h-4 text-secondary-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Buscar membro..." 
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
              setEditingMember(null);
              setFormData({ name: '', email: '', phone: '', group: 'Jovens', status: 'Ativo' });
            }}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
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
              <span className="text-sm font-medium text-secondary-500 bg-secondary-100 px-2.5 py-1 rounded-full">
                {stat.change}
              </span>
            </div>
            <h3 className="text-sm font-medium text-secondary-500">{stat.name}</h3>
            <p className="text-2xl font-bold text-secondary-900 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Members Table */}
      <div className="bg-white rounded-xl border border-secondary-200 shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-secondary-600">
            <thead className="bg-secondary-50 text-secondary-700 font-medium border-b border-secondary-200">
              <tr>
                <th className="px-6 py-4">Nome</th>
                <th className="px-6 py-4">Contato</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Grupo</th>
                <th className="px-6 py-4">Data de Entrada</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary-200">
              {paginatedMembers.map((member) => (
                <tr key={member.id} className="hover:bg-secondary-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={member.avatar} 
                        alt={member.name} 
                        className="w-10 h-10 rounded-full bg-secondary-200 object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <p className="font-medium text-secondary-900">{member.name}</p>
                        <p className="text-xs text-secondary-500">{member.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span className="flex items-center gap-1 text-xs"><Phone className="w-3 h-3" /> {member.phone}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={clsx(
                      "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold",
                      member.status === 'Ativo' ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    )}>
                      {member.status === 'Ativo' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      {member.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-secondary-100 text-secondary-700">
                      {member.group}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-secondary-500">
                    {member.joinDate}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="relative group inline-block">
                      <button 
                        className="p-2 text-secondary-400 hover:text-secondary-600 transition-colors rounded-lg hover:bg-secondary-50"
                        title="Mais ações"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>
                      <div className="absolute right-0 mt-1 w-32 bg-white border border-secondary-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 text-left">
                        <button onClick={() => handleEdit(member)} className="w-full text-left px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50">Editar</button>
                        <button onClick={() => handleDeleteMember(member.id)} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">Excluir</button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-secondary-200 bg-secondary-50">
          <p className="text-sm text-secondary-500">
            Mostrando <span className="font-medium text-secondary-900">{filteredMembers.length === 0 ? 0 : startIndex + 1}</span> a <span className="font-medium text-secondary-900">{Math.min(startIndex + itemsPerPage, filteredMembers.length)}</span> de <span className="font-medium text-secondary-900">{filteredMembers.length}</span> resultados
          </p>
          <div className="flex items-center gap-2">
            <button 
              onClick={handlePrevPage} 
              disabled={currentPage === 1}
              className="px-3 py-1 border border-secondary-200 rounded-md text-sm font-medium text-secondary-600 hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              Anterior
            </button>
            <button 
              onClick={handleNextPage} 
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-3 py-1 border border-secondary-200 rounded-md text-sm font-medium text-secondary-600 hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              Próxima
            </button>
          </div>
        </div>
      </div>

      {/* Modal Novo Membro */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-secondary-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-secondary-200">
              <h2 className="text-xl font-bold text-secondary-900">{editingMember ? 'Editar Membro' : 'Novo Membro'}</h2>
              <button 
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingMember(null);
                  setFormData({ name: '', email: '', phone: '', group: 'Jovens', status: 'Ativo' });
                }}
                className="text-secondary-400 hover:text-secondary-600 transition-colors"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(100vh-200px)]">
              <form id="add-member-form" onSubmit={handleAddMember} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-secondary-700">Nome Completo *</label>
                    <input required name="name" value={formData.name} onChange={handleInputChange} type="text" className="w-full px-4 py-2 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Ex: João da Silva" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-secondary-700">Email *</label>
                    <input required name="email" value={formData.email} onChange={handleInputChange} type="email" className="w-full px-4 py-2 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="joao@email.com" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-secondary-700">Telefone</label>
                    <input name="phone" value={formData.phone} onChange={handleInputChange} type="tel" className="w-full px-4 py-2 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="(00) 00000-0000" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-secondary-700">Data de Nascimento</label>
                    <input type="date" className="w-full px-4 py-2 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-secondary-700">Grupo</label>
                    <select name="group" value={formData.group} onChange={handleInputChange} className="w-full px-4 py-2 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                      <option>Jovens</option>
                      <option>Casais</option>
                      <option>Liderança</option>
                      <option>Homens</option>
                      <option>Mulheres</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-secondary-700">Status</label>
                    <select name="status" value={formData.status} onChange={handleInputChange} className="w-full px-4 py-2 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                      <option>Ativo</option>
                      <option>Inativo</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-secondary-700">Endereço</label>
                  <input type="text" className="w-full px-4 py-2 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Rua, Número, Bairro, Cidade - UF" />
                </div>
              </form>
            </div>
            <div className="flex items-center justify-end gap-3 p-6 border-t border-secondary-200 bg-secondary-50">
              <button 
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingMember(null);
                  setFormData({ name: '', email: '', phone: '', group: 'Jovens', status: 'Ativo' });
                }}
                className="px-4 py-2 bg-white border border-secondary-200 rounded-lg text-sm font-medium text-secondary-700 hover:bg-secondary-50 transition-colors"
              >
                Cancelar
              </button>
              <button type="submit" form="add-member-form" className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors shadow-sm">
                {editingMember ? 'Salvar Alterações' : 'Salvar Membro'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
