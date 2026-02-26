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
  Sparkles,
  Calendar,
  FileText,
  UserCheck,
  LayoutDashboard
} from 'lucide-react';
import clsx from 'clsx';
import { generateLessonTopics } from '../services/ai';

// Mock Data
const initialClasses = [
  { id: 1, name: 'Jovens', teacher: 'Pr. Eduardo', students: 25, attendance: '85%', topic: 'Atos dos Apóstolos', schedule: 'Domingo, 09:00' },
  { id: 2, name: 'Adultos', teacher: 'Pb. Marcos', students: 40, attendance: '92%', topic: 'Epístolas Paulinas', schedule: 'Domingo, 09:00' },
  { id: 3, name: 'Infantil', teacher: 'Tia Ana', students: 15, attendance: '100%', topic: 'Heróis da Bíblia', schedule: 'Domingo, 09:00' },
  { id: 4, name: 'Novos Convertidos', teacher: 'Dc. Carlos', students: 12, attendance: '75%', topic: 'Fundamentos da Fé', schedule: 'Terça, 19:30' },
];

const initialLessons = [
  { id: 1, classId: 1, title: 'O Pentecostes', date: '2023-11-05', status: 'Concluída', description: 'Descida do Espírito Santo e início da Igreja.' },
  { id: 2, classId: 1, title: 'A Cura do Coxo', date: '2023-11-12', status: 'Concluída', description: 'O milagre na Porta Formosa.' },
  { id: 3, classId: 1, title: 'Estêvão, o Primeiro Mártir', date: '2023-11-19', status: 'Planejada', description: 'A defesa da fé e o martírio.' },
  { id: 4, classId: 2, title: 'Justificação pela Fé', date: '2023-11-05', status: 'Concluída', description: 'Estudo de Romanos 3-5.' },
];

const initialStudents = [
  { id: 1, name: 'Ana Souza', classId: 1, attendance: '90%', status: 'Ativo' },
  { id: 2, name: 'Carlos Ferreira', classId: 1, attendance: '80%', status: 'Ativo' },
  { id: 3, name: 'Beatriz Lima', classId: 2, attendance: '95%', status: 'Ativo' },
  { id: 4, name: 'Daniel Costa', classId: 3, attendance: '100%', status: 'Ativo' },
  { id: 5, name: 'Eduardo Santos', classId: 4, attendance: '70%', status: 'Irregular' },
];

const initialTeachers = [
  { id: 1, name: 'Pr. Eduardo', classId: 1, email: 'eduardo@igreja.com', phone: '(11) 99999-9999' },
  { id: 2, name: 'Pb. Marcos', classId: 2, email: 'marcos@igreja.com', phone: '(11) 98888-8888' },
  { id: 3, name: 'Tia Ana', classId: 3, email: 'ana@igreja.com', phone: '(11) 97777-7777' },
  { id: 4, name: 'Dc. Carlos', classId: 4, email: 'carlos@igreja.com', phone: '(11) 96666-6666' },
];

export function EBD() {
  const [activeTab, setActiveTab] = useState('overview');
  const [classes, setClasses] = useState(initialClasses);
  const [lessons, setLessons] = useState(initialLessons);
  const [students, setStudents] = useState(initialStudents);
  const [teachers, setTeachers] = useState(initialTeachers);
  
  // Modals State
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  // Form Data State
  const [classFormData, setClassFormData] = useState({ name: '', teacher: '', topic: '', schedule: '' });
  const [lessonFormData, setLessonFormData] = useState({ classId: '', title: '', date: '', description: '', status: 'Planejada' });
  const [studentFormData, setStudentFormData] = useState({ name: '', classId: '', status: 'Ativo' });
  const [teacherFormData, setTeacherFormData] = useState({ name: '', classId: '', email: '', phone: '' });
  
  // AI State
  const [aiPrompt, setAiPrompt] = useState({ classProfile: '', topic: '' });
  const [aiSuggestions, setAiSuggestions] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Handlers
  const handleAddClass = (e: React.FormEvent) => {
    e.preventDefault();
    setClasses([...classes, { id: Date.now(), ...classFormData, students: 0, attendance: '0%' }]);
    setIsClassModalOpen(false);
    setClassFormData({ name: '', teacher: '', topic: '', schedule: '' });
  };

  const handleAddLesson = (e: React.FormEvent) => {
    e.preventDefault();
    setLessons([...lessons, { id: Date.now(), ...lessonFormData, classId: Number(lessonFormData.classId) }]);
    setIsLessonModalOpen(false);
    setLessonFormData({ classId: '', title: '', date: '', description: '', status: 'Planejada' });
  };

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    setStudents([...students, { id: Date.now(), ...studentFormData, classId: Number(studentFormData.classId), attendance: '0%' }]);
    setIsStudentModalOpen(false);
    setStudentFormData({ name: '', classId: '', status: 'Ativo' });
  };

  const handleAddTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    setTeachers([...teachers, { id: Date.now(), ...teacherFormData, classId: Number(teacherFormData.classId) }]);
    setIsTeacherModalOpen(false);
    setTeacherFormData({ name: '', classId: '', email: '', phone: '' });
  };

  const handleGenerateAiSuggestions = async () => {
    setIsGenerating(true);
    const suggestions = await generateLessonTopics(aiPrompt.classProfile, aiPrompt.topic);
    setAiSuggestions(suggestions || 'Não foi possível gerar sugestões.');
    setIsGenerating(false);
  };

  // Render Functions
  const renderOverview = () => (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-6 rounded-xl border border-secondary-200 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
              <BookOpen className="w-6 h-6" />
            </div>
            <span className="text-sm font-medium text-secondary-500 bg-secondary-100 px-2.5 py-1 rounded-full">Ativas</span>
          </div>
          <h3 className="text-sm font-medium text-secondary-500">Total de Classes</h3>
          <p className="text-2xl font-bold text-secondary-900 mt-1">{classes.length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-secondary-200 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center text-green-600">
              <Users className="w-6 h-6" />
            </div>
            <span className="text-sm font-medium text-green-600 bg-green-50 px-2.5 py-1 rounded-full">+5 este mês</span>
          </div>
          <h3 className="text-sm font-medium text-secondary-500">Alunos Matriculados</h3>
          <p className="text-2xl font-bold text-secondary-900 mt-1">{students.length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-secondary-200 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600">
              <GraduationCap className="w-6 h-6" />
            </div>
            <span className="text-sm font-medium text-secondary-500 bg-secondary-100 px-2.5 py-1 rounded-full">Ativos</span>
          </div>
          <h3 className="text-sm font-medium text-secondary-500">Professores</h3>
          <p className="text-2xl font-bold text-secondary-900 mt-1">{teachers.length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-secondary-200 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center text-orange-600">
              <TrendingUp className="w-6 h-6" />
            </div>
            <span className="text-sm font-medium text-green-600 bg-green-50 px-2.5 py-1 rounded-full">+2% vs mês anterior</span>
          </div>
          <h3 className="text-sm font-medium text-secondary-500">Média de Frequência</h3>
          <p className="text-2xl font-bold text-secondary-900 mt-1">88%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Lessons */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-secondary-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-secondary-200 flex justify-between items-center">
            <h3 className="text-lg font-bold text-secondary-900">Próximas Lições</h3>
            <button onClick={() => setActiveTab('lessons')} className="text-sm text-primary-600 hover:text-primary-700 font-medium">Ver todas</button>
          </div>
          <div className="divide-y divide-secondary-200">
            {lessons.slice(0, 3).map((lesson) => (
              <div key={lesson.id} className="p-4 hover:bg-secondary-50 transition-colors flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center text-primary-600">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-secondary-900">{lesson.title}</h4>
                    <p className="text-sm text-secondary-500">{classes.find(c => c.id === lesson.classId)?.name} • {new Date(lesson.date).toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>
                <span className={clsx(
                  "px-2.5 py-1 rounded-full text-xs font-medium",
                  lesson.status === 'Concluída' ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                )}>
                  {lesson.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Insights Card */}
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
                A classe "Novos Convertidos" teve uma queda de 15% na frequência. Sugere-se contato pastoral.
              </p>
            </div>
            <div className="bg-white/60 backdrop-blur-sm p-4 rounded-lg border border-indigo-100">
              <h3 className="text-sm font-bold text-indigo-900 mb-1">Sugestão de Tópico</h3>
              <p className="text-sm text-indigo-800/80">
                Para a classe de Jovens, o tema "Ansiedade e Fé" tem alta relevância atual.
              </p>
            </div>
          </div>
          <button 
            onClick={() => setIsAiModalOpen(true)}
            className="w-full mt-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Gerar Plano de Aula
          </button>
        </div>
      </div>
    </div>
  );

  const renderClasses = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-secondary-900">Gerenciar Classes</h2>
        <button 
          onClick={() => setIsClassModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Nova Classe
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((cls) => (
          <div key={cls.id} className="bg-white rounded-xl border border-secondary-200 shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center text-primary-600">
                <Users className="w-5 h-5" />
              </div>
              <button className="text-secondary-400 hover:text-secondary-600">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
            <h3 className="text-lg font-bold text-secondary-900 mb-1">{cls.name}</h3>
            <p className="text-sm text-secondary-500 mb-4">{cls.teacher}</p>
            <div className="space-y-2 text-sm text-secondary-600">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-secondary-400" />
                {cls.schedule}
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-secondary-400" />
                {cls.topic}
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-secondary-200 flex justify-between items-center">
              <span className="text-sm font-medium text-secondary-600">{cls.students} Alunos</span>
              <span className={clsx(
                "text-xs font-bold px-2 py-1 rounded-full",
                parseInt(cls.attendance) > 80 ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
              )}>
                {cls.attendance} Freq.
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderLessons = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-secondary-900">Lições e Estudos</h2>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsAiModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-lg text-sm font-medium hover:bg-indigo-100 transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            Sugestões IA
          </button>
          <button 
            onClick={() => setIsLessonModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Nova Lição
          </button>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-secondary-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm text-secondary-600">
          <thead className="bg-secondary-50 text-secondary-700 font-medium border-b border-secondary-200">
            <tr>
              <th className="px-6 py-4">Título</th>
              <th className="px-6 py-4">Classe</th>
              <th className="px-6 py-4">Data</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-secondary-200">
            {lessons.map((lesson) => (
              <tr key={lesson.id} className="hover:bg-secondary-50 transition-colors">
                <td className="px-6 py-4 font-medium text-secondary-900">{lesson.title}</td>
                <td className="px-6 py-4">{classes.find(c => c.id === lesson.classId)?.name}</td>
                <td className="px-6 py-4">{new Date(lesson.date).toLocaleDateString('pt-BR')}</td>
                <td className="px-6 py-4">
                  <span className={clsx(
                    "px-2.5 py-1 rounded-full text-xs font-medium",
                    lesson.status === 'Concluída' ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                  )}>
                    {lesson.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-secondary-400 hover:text-secondary-600">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderStudents = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-secondary-900">Alunos Matriculados</h2>
        <button 
          onClick={() => setIsStudentModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Novo Aluno
        </button>
      </div>
      <div className="bg-white rounded-xl border border-secondary-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm text-secondary-600">
          <thead className="bg-secondary-50 text-secondary-700 font-medium border-b border-secondary-200">
            <tr>
              <th className="px-6 py-4">Nome</th>
              <th className="px-6 py-4">Classe</th>
              <th className="px-6 py-4">Frequência</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-secondary-200">
            {students.map((student) => (
              <tr key={student.id} className="hover:bg-secondary-50 transition-colors">
                <td className="px-6 py-4 font-medium text-secondary-900">{student.name}</td>
                <td className="px-6 py-4">{classes.find(c => c.id === student.classId)?.name}</td>
                <td className="px-6 py-4">{student.attendance}</td>
                <td className="px-6 py-4">
                  <span className={clsx(
                    "px-2.5 py-1 rounded-full text-xs font-medium",
                    student.status === 'Ativo' ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  )}>
                    {student.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-secondary-400 hover:text-secondary-600">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Escola Bíblica Dominical</h1>
          <p className="text-sm text-secondary-500">Gestão completa de ensino, classes e alunos.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative hidden sm:block w-64">
            <Search className="w-4 h-4 text-secondary-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Buscar..." 
              className="w-full pl-9 pr-4 py-2 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex overflow-x-auto pb-2 border-b border-secondary-200 gap-6">
        {[
          { id: 'overview', label: 'Visão Geral', icon: LayoutDashboard },
          { id: 'classes', label: 'Classes', icon: Users },
          { id: 'lessons', label: 'Lições', icon: BookOpen },
          { id: 'students', label: 'Alunos', icon: GraduationCap },
          { id: 'teachers', label: 'Professores', icon: UserCheck },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={clsx(
              "flex items-center gap-2 pb-2 text-sm font-medium transition-colors whitespace-nowrap",
              activeTab === tab.id 
                ? "text-primary-600 border-b-2 border-primary-600" 
                : "text-secondary-500 hover:text-secondary-700"
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'classes' && renderClasses()}
        {activeTab === 'lessons' && renderLessons()}
        {activeTab === 'students' && renderStudents()}
        {activeTab === 'teachers' && (
          <div className="text-center py-12 text-secondary-500">
            <UserCheck className="w-12 h-12 mx-auto mb-4 text-secondary-300" />
            <h3 className="text-lg font-medium text-secondary-900">Gestão de Professores</h3>
            <p>Funcionalidade similar à de Alunos. Implementada em breve.</p>
          </div>
        )}
      </div>

      {/* Modals */}
      {/* Class Modal */}
      {isClassModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-secondary-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-secondary-200">
              <h2 className="text-xl font-bold text-secondary-900">Nova Classe</h2>
              <button onClick={() => setIsClassModalOpen(false)}><Plus className="w-6 h-6 rotate-45 text-secondary-400" /></button>
            </div>
            <form onSubmit={handleAddClass} className="p-6 space-y-4">
              <input required placeholder="Nome da Classe" value={classFormData.name} onChange={e => setClassFormData({...classFormData, name: e.target.value})} className="w-full px-4 py-2 border rounded-lg text-sm" />
              <input required placeholder="Professor Responsável" value={classFormData.teacher} onChange={e => setClassFormData({...classFormData, teacher: e.target.value})} className="w-full px-4 py-2 border rounded-lg text-sm" />
              <input placeholder="Tópico Atual" value={classFormData.topic} onChange={e => setClassFormData({...classFormData, topic: e.target.value})} className="w-full px-4 py-2 border rounded-lg text-sm" />
              <input placeholder="Horário (Ex: Domingo, 09:00)" value={classFormData.schedule} onChange={e => setClassFormData({...classFormData, schedule: e.target.value})} className="w-full px-4 py-2 border rounded-lg text-sm" />
              <button type="submit" className="w-full py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700">Salvar Classe</button>
            </form>
          </div>
        </div>
      )}

      {/* Lesson Modal */}
      {isLessonModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-secondary-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-secondary-200">
              <h2 className="text-xl font-bold text-secondary-900">Nova Lição</h2>
              <button onClick={() => setIsLessonModalOpen(false)}><Plus className="w-6 h-6 rotate-45 text-secondary-400" /></button>
            </div>
            <form onSubmit={handleAddLesson} className="p-6 space-y-4">
              <select required value={lessonFormData.classId} onChange={e => setLessonFormData({...lessonFormData, classId: e.target.value})} className="w-full px-4 py-2 border rounded-lg text-sm">
                <option value="">Selecione a Classe</option>
                {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <input required placeholder="Título da Lição" value={lessonFormData.title} onChange={e => setLessonFormData({...lessonFormData, title: e.target.value})} className="w-full px-4 py-2 border rounded-lg text-sm" />
              <input required type="date" value={lessonFormData.date} onChange={e => setLessonFormData({...lessonFormData, date: e.target.value})} className="w-full px-4 py-2 border rounded-lg text-sm" />
              <textarea placeholder="Descrição breve" value={lessonFormData.description} onChange={e => setLessonFormData({...lessonFormData, description: e.target.value})} className="w-full px-4 py-2 border rounded-lg text-sm" rows={3} />
              <button type="submit" className="w-full py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700">Salvar Lição</button>
            </form>
          </div>
        </div>
      )}

      {/* Student Modal */}
      {isStudentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-secondary-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-secondary-200">
              <h2 className="text-xl font-bold text-secondary-900">Novo Aluno</h2>
              <button onClick={() => setIsStudentModalOpen(false)}><Plus className="w-6 h-6 rotate-45 text-secondary-400" /></button>
            </div>
            <form onSubmit={handleAddStudent} className="p-6 space-y-4">
              <input required placeholder="Nome do Aluno" value={studentFormData.name} onChange={e => setStudentFormData({...studentFormData, name: e.target.value})} className="w-full px-4 py-2 border rounded-lg text-sm" />
              <select required value={studentFormData.classId} onChange={e => setStudentFormData({...studentFormData, classId: e.target.value})} className="w-full px-4 py-2 border rounded-lg text-sm">
                <option value="">Selecione a Classe</option>
                {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <select value={studentFormData.status} onChange={e => setStudentFormData({...studentFormData, status: e.target.value})} className="w-full px-4 py-2 border rounded-lg text-sm">
                <option value="Ativo">Ativo</option>
                <option value="Inativo">Inativo</option>
                <option value="Irregular">Irregular</option>
              </select>
              <button type="submit" className="w-full py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700">Matricular Aluno</button>
            </form>
          </div>
        </div>
      )}

      {/* AI Modal */}
      {isAiModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-secondary-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-secondary-200">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                <h2 className="text-xl font-bold text-secondary-900">Gerador de Tópicos IA</h2>
              </div>
              <button onClick={() => setIsAiModalOpen(false)}><Plus className="w-6 h-6 rotate-45 text-secondary-400" /></button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-secondary-500">Descreva o perfil da classe e o tema geral para receber sugestões de aulas.</p>
              <div className="space-y-2">
                <label className="text-sm font-medium text-secondary-700">Perfil da Classe</label>
                <input 
                  placeholder="Ex: Jovens universitários, novos convertidos..." 
                  value={aiPrompt.classProfile}
                  onChange={e => setAiPrompt({...aiPrompt, classProfile: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-secondary-700">Tema Geral</label>
                <input 
                  placeholder="Ex: Vida de Oração, Livro de Gênesis..." 
                  value={aiPrompt.topic}
                  onChange={e => setAiPrompt({...aiPrompt, topic: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              
              {aiSuggestions && (
                <div className="mt-4 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                  <h3 className="text-sm font-bold text-indigo-900 mb-2">Sugestões Geradas:</h3>
                  <div className="text-sm text-indigo-800 whitespace-pre-line">
                    {aiSuggestions}
                  </div>
                </div>
              )}

              <button 
                onClick={handleGenerateAiSuggestions}
                disabled={isGenerating || !aiPrompt.classProfile || !aiPrompt.topic}
                className="w-full py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isGenerating ? 'Gerando...' : 'Gerar Sugestões'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
