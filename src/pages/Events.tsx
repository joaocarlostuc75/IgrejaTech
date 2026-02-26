import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Users, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical,
  AlertTriangle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import clsx from 'clsx';

const today = new Date();
const currentYear = today.getFullYear();
const currentMonth = String(today.getMonth() + 1).padStart(2, '0');

const initialEvents = [
  { id: 1, title: 'Culto de Domingo', date: `${currentYear}-${currentMonth}-05`, time: '18:00', location: 'Templo Principal', type: 'Culto', attendees: 150, status: 'Confirmado' },
  { id: 2, title: 'Encontro de Jovens', date: `${currentYear}-${currentMonth}-10`, time: '19:30', location: 'Salão Anexo', type: 'Jovens', attendees: 45, status: 'Confirmado' },
  { id: 3, title: 'Reunião de Liderança', date: `${currentYear}-${currentMonth}-12`, time: '20:00', location: 'Sala 02', type: 'Reunião', attendees: 12, status: 'Pendente' },
  { id: 4, title: 'Ação Social - Entrega de Cestas', date: `${currentYear}-${currentMonth}-18`, time: '09:00', location: 'Comunidade Local', type: 'Ação Social', attendees: 20, status: 'Confirmado' },
  { id: 5, title: 'Escola Bíblica Dominical', date: `${currentYear}-${currentMonth}-05`, time: '09:00', location: 'Salas EBD', type: 'Ensino', attendees: 80, status: 'Confirmado' },
];

export function Events() {
  const [events, setEvents] = useState(initialEvents);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [blockedPeriods, setBlockedPeriods] = useState<{date: string, reason: string}[]>([]);
  const [blockFormData, setBlockFormData] = useState({ date: '', reason: '' });
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    location: 'Templo Principal',
    type: 'Culto',
    description: ''
  });
  const [showConflictAlert, setShowConflictAlert] = useState(true);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.date || !formData.time) return;

    // Check for blocked dates
    const isBlocked = blockedPeriods.some(b => b.date === formData.date);
    if (isBlocked) {
      alert('Esta data está bloqueada para novos eventos.');
      return;
    }

    // Check for conflicts
    const hasConflict = events.some(ev => 
      ev.date === formData.date && 
      ev.time === formData.time && 
      ev.location === formData.location &&
      ev.id !== editingEvent?.id
    );

    if (hasConflict) {
      alert('Conflito de agendamento! Já existe um evento neste local e horário.');
      return;
    }

    if (editingEvent) {
      setEvents(prev => prev.map(ev => ev.id === editingEvent.id ? {
        ...ev,
        title: formData.title,
        date: formData.date,
        time: formData.time,
        location: formData.location,
        type: formData.type,
      } : ev));
      setEditingEvent(null);
    } else {
      const newEvent = {
        id: Date.now(),
        title: formData.title,
        date: formData.date,
        time: formData.time,
        location: formData.location,
        type: formData.type,
        attendees: 0,
        status: 'Confirmado'
      };
      setEvents(prev => [...prev, newEvent]);
    }

    setIsModalOpen(false);
    setFormData({ title: '', date: '', time: '', location: 'Templo Principal', type: 'Culto', description: '' });
  };

  const handleEdit = (event: any) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      date: event.date,
      time: event.time,
      location: event.location,
      type: event.type,
      description: ''
    });
    setIsModalOpen(true);
  };

  const handleAddBlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blockFormData.date || !blockFormData.reason) return;
    setBlockedPeriods(prev => [...prev, blockFormData]);
    setIsBlockModalOpen(false);
    setBlockFormData({ date: '', reason: '' });
  };

  const handleDeleteEvent = (id: number) => {
    if (confirm('Tem certeza que deseja excluir este evento?')) {
      setEvents(prev => prev.filter(e => e.id !== id));
    }
  };

  const filteredEvents = events.filter(e => 
    e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    
    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const days = getDaysInMonth(currentDate);
  const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getEventsForDate = (date: Date | null) => {
    if (!date) return [];
    const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    return events.filter(e => e.date === dateString);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Eventos</h1>
          <p className="text-sm text-secondary-500">Organize cultos, reuniões e atividades.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-secondary-100 p-1 rounded-lg">
            <button 
              onClick={() => setView('list')}
              className={clsx(
                "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
                view === 'list' ? "bg-white text-secondary-900 shadow-sm" : "text-secondary-600 hover:text-secondary-900"
              )}
            >
              Lista
            </button>
            <button 
              onClick={() => setView('calendar')}
              className={clsx(
                "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
                view === 'calendar' ? "bg-white text-secondary-900 shadow-sm" : "text-secondary-600 hover:text-secondary-900"
              )}
            >
              Calendário
            </button>
          </div>
          <button 
            onClick={() => setIsBlockModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-secondary-200 text-secondary-700 rounded-lg text-sm font-medium hover:bg-secondary-50 transition-colors"
          >
            Bloquear Data
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Novo Evento
          </button>
        </div>
      </div>

      {/* Urgent Alerts */}
      {showConflictAlert && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-bold text-orange-800">Atenção: Conflito de Agendamento</h3>
            <p className="text-sm text-orange-700 mt-1">
              O "Encontro de Jovens" e a "Reunião de Liderança" estão agendados para o mesmo horário na Sala 02 no dia 10/11.
            </p>
            <button 
              onClick={() => setShowConflictAlert(false)}
              className="text-sm font-medium text-orange-800 hover:text-orange-900 underline mt-2"
            >
              Resolver conflito
            </button>
          </div>
        </div>
      )}

      {view === 'list' ? (
        <>
          {/* Filters & Search */}
          <div className="bg-white p-4 rounded-xl border border-secondary-200 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div className="relative w-full sm:w-96">
              <Search className="w-5 h-5 text-secondary-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Buscar eventos..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <select className="px-4 py-2 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white">
                <option>Todos os Tipos</option>
                <option>Culto</option>
                <option>Reunião</option>
                <option>Ação Social</option>
              </select>
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-secondary-200 rounded-lg text-sm font-medium text-secondary-700 hover:bg-secondary-50 transition-colors w-full sm:w-auto justify-center">
                <Filter className="w-4 h-4" />
                Filtros
              </button>
            </div>
          </div>

          {/* Events List */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <div key={event.id} className="bg-white rounded-xl border border-secondary-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
                <div className="p-5 flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <span className={clsx(
                      "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium",
                      event.type === 'Culto' ? "bg-purple-100 text-purple-700" :
                      event.type === 'Jovens' ? "bg-blue-100 text-blue-700" :
                      event.type === 'Ação Social' ? "bg-green-100 text-green-700" :
                      "bg-secondary-100 text-secondary-700"
                    )}>
                      {event.type}
                    </span>
                    <div className="relative group">
                      <button className="text-secondary-400 hover:text-secondary-600 transition-colors p-1 rounded-md hover:bg-secondary-100">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                      <div className="absolute right-0 mt-1 w-32 bg-white border border-secondary-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                        <button onClick={() => handleEdit(event)} className="w-full text-left px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50">Editar</button>
                        <button onClick={() => handleDeleteEvent(event.id)} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">Excluir</button>
                      </div>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-secondary-900 mb-2">{event.title}</h3>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-secondary-600 gap-2">
                      <CalendarIcon className="w-4 h-4 text-secondary-400" />
                      {new Date(event.date).toLocaleDateString('pt-BR')}
                    </div>
                    <div className="flex items-center text-sm text-secondary-600 gap-2">
                      <Clock className="w-4 h-4 text-secondary-400" />
                      {event.time}
                    </div>
                    <div className="flex items-center text-sm text-secondary-600 gap-2">
                      <MapPin className="w-4 h-4 text-secondary-400" />
                      {event.location}
                    </div>
                  </div>
                </div>
                <div className="bg-secondary-50 px-5 py-3 border-t border-secondary-200 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-secondary-600 font-medium">
                    <Users className="w-4 h-4 text-secondary-400" />
                    {event.attendees} confirmados
                  </div>
                  <span className={clsx(
                    "text-xs font-medium",
                    event.status === 'Confirmado' ? "text-green-600" : "text-orange-600"
                  )}>
                    {event.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="bg-white rounded-xl border border-secondary-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-secondary-900">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <div className="flex items-center gap-2">
              <button onClick={prevMonth} className="p-2 border border-secondary-200 rounded-lg hover:bg-secondary-50 text-secondary-600">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={goToToday} className="px-4 py-2 border border-secondary-200 rounded-lg hover:bg-secondary-50 text-sm font-medium text-secondary-700">
                Hoje
              </button>
              <button onClick={nextMonth} className="p-2 border border-secondary-200 rounded-lg hover:bg-secondary-50 text-secondary-600">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-px bg-secondary-200 border border-secondary-200 rounded-lg overflow-hidden">
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
              <div key={day} className="bg-secondary-50 py-2 text-center text-xs font-medium text-secondary-500 uppercase tracking-wider">
                {day}
              </div>
            ))}
            {days.map((date, i) => {
              const dateString = date ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}` : null;
              const dayEvents = getEventsForDate(date);
              const isToday = date && date.toDateString() === new Date().toDateString();
              const isBlocked = dateString ? blockedPeriods.find(b => b.date === dateString) : null;
              
              return (
                <div key={i} className={clsx(
                  "min-h-[100px] p-2 transition-colors cursor-pointer relative",
                  date ? "bg-white hover:bg-secondary-50" : "bg-secondary-50/50",
                  isBlocked && "bg-red-50/50"
                )}>
                  {date && (
                    <>
                      <span className={clsx(
                        "text-sm font-medium w-6 h-6 flex items-center justify-center rounded-full mb-1",
                        isToday ? "bg-primary-600 text-white" : "text-secondary-700"
                      )}>
                        {date.getDate()}
                      </span>
                      {isBlocked && (
                        <div className="text-[10px] font-bold text-red-600 mb-1 bg-red-100 px-1 rounded truncate" title={isBlocked.reason}>
                          Bloqueado: {isBlocked.reason}
                        </div>
                      )}
                      <div className="space-y-1">
                        {dayEvents.map(event => (
                          <div 
                            key={event.id}
                            className={clsx(
                              "px-1.5 py-0.5 text-[10px] font-medium rounded truncate",
                              event.type === 'Culto' ? "bg-purple-100 text-purple-700" :
                              event.type === 'Jovens' ? "bg-blue-100 text-blue-700" :
                              event.type === 'Ação Social' ? "bg-green-100 text-green-700" :
                              "bg-secondary-100 text-secondary-700"
                            )}
                            title={event.title}
                          >
                            {event.time} - {event.title}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal Novo Evento */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-secondary-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-secondary-200">
              <h2 className="text-xl font-bold text-secondary-900">{editingEvent ? 'Editar Evento' : 'Novo Evento'}</h2>
              <button 
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingEvent(null);
                  setFormData({ title: '', date: '', time: '', location: 'Templo Principal', type: 'Culto', description: '' });
                }}
                className="text-secondary-400 hover:text-secondary-600 transition-colors"
              >
                <Plus className="w-6 h-6 rotate-45" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(100vh-200px)]">
              <form id="add-event-form" onSubmit={handleAddEvent} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-secondary-700">Título do Evento *</label>
                  <input required name="title" value={formData.title} onChange={handleInputChange} type="text" className="w-full px-4 py-2 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Ex: Culto de Jovens" />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-secondary-700">Data *</label>
                    <input required name="date" value={formData.date} onChange={handleInputChange} type="date" className="w-full px-4 py-2 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-secondary-700">Horário *</label>
                    <input required name="time" value={formData.time} onChange={handleInputChange} type="time" className="w-full px-4 py-2 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-secondary-700">Local</label>
                    <select name="location" value={formData.location} onChange={handleInputChange} className="w-full px-4 py-2 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                      <option>Templo Principal</option>
                      <option>Salão Anexo</option>
                      <option>Sala 01</option>
                      <option>Externo</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-secondary-700">Tipo de Evento</label>
                    <select name="type" value={formData.type} onChange={handleInputChange} className="w-full px-4 py-2 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                      <option>Culto</option>
                      <option>Reunião</option>
                      <option>Ensino</option>
                      <option>Ação Social</option>
                    </select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-secondary-700">Descrição</label>
                  <textarea name="description" value={formData.description} onChange={handleInputChange} rows={3} className="w-full px-4 py-2 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Detalhes adicionais sobre o evento..."></textarea>
                </div>

                <div className="flex items-center gap-2">
                  <input type="checkbox" id="recorrente" className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500" />
                  <label htmlFor="recorrente" className="text-sm text-secondary-700">Evento recorrente (ex: toda semana)</label>
                </div>
              </form>
            </div>
            <div className="flex items-center justify-end gap-3 p-6 border-t border-secondary-200 bg-secondary-50">
              <button 
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingEvent(null);
                  setFormData({ title: '', date: '', time: '', location: 'Templo Principal', type: 'Culto', description: '' });
                }}
                type="button"
                className="px-4 py-2 bg-white border border-secondary-200 rounded-lg text-sm font-medium text-secondary-700 hover:bg-secondary-50 transition-colors"
              >
                Cancelar
              </button>
              <button type="submit" form="add-event-form" className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
                {editingEvent ? 'Salvar Alterações' : 'Criar Evento'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Bloquear Data */}
      {isBlockModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-secondary-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-secondary-200">
              <h2 className="text-xl font-bold text-secondary-900">Bloquear Data</h2>
              <button 
                onClick={() => setIsBlockModalOpen(false)}
                className="text-secondary-400 hover:text-secondary-600 transition-colors"
              >
                <Plus className="w-6 h-6 rotate-45" />
              </button>
            </div>
            <div className="p-6">
              <form id="add-block-form" onSubmit={handleAddBlock} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-secondary-700">Data *</label>
                  <input required value={blockFormData.date} onChange={(e) => setBlockFormData({...blockFormData, date: e.target.value})} type="date" className="w-full px-4 py-2 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-secondary-700">Motivo do Bloqueio *</label>
                  <input required value={blockFormData.reason} onChange={(e) => setBlockFormData({...blockFormData, reason: e.target.value})} type="text" className="w-full px-4 py-2 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Ex: Manutenção do Templo" />
                </div>
              </form>
            </div>
            <div className="flex items-center justify-end gap-3 p-6 border-t border-secondary-200 bg-secondary-50">
              <button 
                onClick={() => setIsBlockModalOpen(false)}
                type="button"
                className="px-4 py-2 bg-white border border-secondary-200 rounded-lg text-sm font-medium text-secondary-700 hover:bg-secondary-50 transition-colors"
              >
                Cancelar
              </button>
              <button type="submit" form="add-block-form" className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
                Confirmar Bloqueio
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
