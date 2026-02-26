import React, { useState } from 'react';
import { 
  BookOpen, 
  Users, 
  GraduationCap, 
  TrendingUp, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical,
  CheckSquare,
  Sparkles
} from 'lucide-react';
import clsx from 'clsx';

const initialClasses = [
  { id: 1, name: 'Classe de Jovens', teacher: 'Pr. Eduardo', students: 25, attendance: '85%', topic: 'Atos dos Apóstolos' },
  { id: 2, name: 'Classe de Adultos', teacher: 'Pb. Marcos', students: 40, attendance: '92%', topic: 'Epístolas Paulinas' },
  { id: 3, name: 'Classe Infantil', teacher: 'Tia Ana', students: 15, attendance: '100%', topic: 'Heróis da Bíblia' },
  { id: 4, name: 'Novos Convertidos', teacher: 'Dc. Carlos', students: 12, attendance: '75%', topic: 'Fundamentos da Fé' },
];

export function EBD() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [classes, setClasses] = useState(initialClasses);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    classId: '',
    date: new Date().toISOString().split('T')[0],
    topic: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddAttendance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.classId || !formData.date || !formData.topic) return;

    // In a real app, we would save the attendance records here.
    // For now, we'll just update the topic of the selected class.
    setClasses(prev => prev.map(c => {
      if (c.id === parseInt(formData.classId)) {
        return { ...c, topic: formData.topic };
      }
      return c;
    }));

    setIsModalOpen(false);
    setFormData({ classId: '', date: new Date().toISOString().split('T')[0], topic: '' });
  };

  const filteredClasses = classes.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.teacher.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalStudents = classes.reduce((acc, curr) => acc + curr.students, 0);
  const averageAttendance = Math.round(classes.reduce((acc, curr) => acc + parseInt(curr.attendance), 0) / classes.length);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Escola Bíblica Dominical</h1>
          <p className="text-sm text-secondary-500">Gestão de classes, alunos e frequência.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-white border border-secondary-200 rounded-lg text-sm font-medium text-secondary-700 hover:bg-secondary-50 transition-colors">
            Relatório EBD
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
          >
            <CheckSquare className="w-4 h-4" />
            Registrar Frequência
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-6 rounded-xl border border-secondary-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
              <BookOpen className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-secondary-500">Total de Classes</h3>
          <p className="text-2xl font-bold text-secondary-900 mt-1">{classes.length}</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-secondary-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center text-green-600">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-secondary-500">Alunos Matriculados</h3>
          <p className="text-2xl font-bold text-secondary-900 mt-1">{totalStudents}</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-secondary-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600">
              <GraduationCap className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-secondary-500">Professores</h3>
          <p className="text-2xl font-bold text-secondary-900 mt-1">{classes.length}</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-secondary-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center text-orange-600">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-secondary-500">Média de Frequência</h3>
          <p className="text-2xl font-bold text-secondary-900 mt-1">{averageAttendance}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Classes List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-4 rounded-xl border border-secondary-200 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div className="relative w-full sm:w-96">
              <Search className="w-5 h-5 text-secondary-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Buscar classe ou professor..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-secondary-200 rounded-lg text-sm font-medium text-secondary-700 hover:bg-secondary-50 transition-colors w-full sm:w-auto justify-center">
              <Plus className="w-4 h-4" />
              Nova Classe
            </button>
          </div>

          <div className="bg-white rounded-xl border border-secondary-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-secondary-600">
                <thead className="bg-secondary-50 text-secondary-700 font-medium border-b border-secondary-200">
                  <tr>
                    <th className="px-6 py-4">Classe</th>
                    <th className="px-6 py-4">Professor</th>
                    <th className="px-6 py-4">Alunos</th>
                    <th className="px-6 py-4">Frequência Média</th>
                    <th className="px-6 py-4">Tópico Atual</th>
                    <th className="px-6 py-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-secondary-200">
                  {filteredClasses.map((c) => (
                    <tr key={c.id} className="hover:bg-secondary-50 transition-colors">
                      <td className="px-6 py-4 font-bold text-secondary-900">{c.name}</td>
                      <td className="px-6 py-4">{c.teacher}</td>
                      <td className="px-6 py-4">{c.students}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-secondary-200 rounded-full overflow-hidden">
                            <div 
                              className={clsx(
                                "h-full rounded-full",
                                parseInt(c.attendance) >= 90 ? "bg-green-500" :
                                parseInt(c.attendance) >= 75 ? "bg-yellow-500" : "bg-red-500"
                              )}
                              style={{ width: c.attendance }}
                            ></div>
                          </div>
                          <span className="text-xs font-medium">{c.attendance}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-secondary-500">{c.topic}</td>
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

        {/* AI Insights */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-100 shadow-sm flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
              <Sparkles className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-indigo-900">Sugestões da IA</h2>
          </div>
          
          <div className="space-y-4 flex-1">
            <div className="bg-white/60 backdrop-blur-sm p-4 rounded-lg border border-indigo-100">
              <h3 className="text-sm font-bold text-indigo-900 mb-1">Baixa Frequência Identificada</h3>
              <p className="text-sm text-indigo-800/80">
                A classe "Novos Convertidos" teve uma queda de 15% na frequência nas últimas 3 semanas. Sugere-se um contato pastoral.
              </p>
            </div>
            
            <div className="bg-white/60 backdrop-blur-sm p-4 rounded-lg border border-indigo-100">
              <h3 className="text-sm font-bold text-indigo-900 mb-1">Sugestão de Tópico</h3>
              <p className="text-sm text-indigo-800/80">
                Com base no perfil da Classe de Jovens, o tema "Ansiedade e Fé" tem alta probabilidade de engajamento para o próximo trimestre.
              </p>
            </div>
          </div>
          
          <button className="w-full mt-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
            Gerar Plano de Aula com IA
          </button>
        </div>
      </div>

      {/* Modal Frequência */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-secondary-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-secondary-200">
              <h2 className="text-xl font-bold text-secondary-900">Registrar Frequência</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-secondary-400 hover:text-secondary-600 transition-colors"
              >
                <Plus className="w-6 h-6 rotate-45" />
              </button>
            </div>
            <div className="p-6">
              <form id="add-attendance-form" onSubmit={handleAddAttendance} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-secondary-700">Classe *</label>
                  <select required name="classId" value={formData.classId} onChange={handleInputChange} className="w-full px-4 py-2 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <option value="">Selecione a classe...</option>
                    {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-secondary-700">Data da Aula *</label>
                  <input required name="date" value={formData.date} onChange={handleInputChange} type="date" className="w-full px-4 py-2 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-secondary-700">Tópico / Lição Ensinada *</label>
                  <input required name="topic" value={formData.topic} onChange={handleInputChange} type="text" className="w-full px-4 py-2 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Ex: Lição 4 - A jornada de Paulo" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-secondary-700">Lista de Presença</label>
                  <div className="border border-secondary-200 rounded-lg overflow-hidden max-h-48 overflow-y-auto">
                    {['Ana Souza', 'Carlos Ferreira', 'Beatriz Lima', 'Daniel Costa', 'Eduardo Santos'].map((aluno, i) => (
                      <label key={i} className="flex items-center gap-3 p-3 hover:bg-secondary-50 border-b border-secondary-100 last:border-0 cursor-pointer">
                        <input type="checkbox" className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500" defaultChecked={i !== 1} />
                        <span className="text-sm text-secondary-900">{aluno}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </form>
            </div>
            <div className="flex items-center justify-end gap-3 p-6 border-t border-secondary-200 bg-secondary-50">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-white border border-secondary-200 rounded-lg text-sm font-medium text-secondary-700 hover:bg-secondary-50 transition-colors"
                type="button"
              >
                Cancelar
              </button>
              <button type="submit" form="add-attendance-form" className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
                Salvar Frequência
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
