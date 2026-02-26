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
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
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
    setIsModalOpen(false);
    setFormData({ title: '', date: '', time: '', location: 'Templo Principal', type: 'Culto', description: '' });
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
                    <button 
                      onClick={() => handleDeleteEvent(event.id)}
                      className="text-red-400 hover:text-red-600 transition-colors"
                      title="Excluir evento"
                    >
                      <AlertTriangle className="w-5 h-5" />
                    </button>
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
              const dayEvents = getEventsForDate(date);
              const isToday = date && date.toDateString() === new Date().toDateString();
              
              return (
                <div key={i} className={clsx(
                  "min-h-[100px] p-2 transition-colors cursor-pointer",
                  date ? "bg-white hover:bg-secondary-50" : "bg-secondary-50/50"
                )}>
                  {date && (
                    <>
                      <span className={clsx(
                        "text-sm font-medium w-6 h-6 flex items-center justify-center rounded-full mb-1",
                        isToday ? "bg-primary-600 text-white" : "text-secondary-700"
                      )}>
                        {date.getDate()}
                      </span>
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
              <h2 className="text-xl font-bold text-secondary-900">Novo Evento</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
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
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-white border border-secondary-200 rounded-lg text-sm font-medium text-secondary-700 hover:bg-secondary-50 transition-colors"
              >
                Cancelar
              </button>
              <button type="submit" form="add-event-form" className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
                Criar Evento
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
