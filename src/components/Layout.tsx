import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Wallet, 
  Calendar, 
  HeartHandshake, 
  BookOpen, 
  BarChart3, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Bell,
  Search,
  Network,
  Box,
  ClipboardList
} from 'lucide-react';
import clsx from 'clsx';

const navigation = [
  { name: 'Dashboard Geral', href: '/', icon: LayoutDashboard },
  { name: 'Membros', href: '/membros', icon: Users },
  { name: 'Grupos Pequenos', href: '/grupos', icon: Network },
  { name: 'Financeiro', href: '/financeiro', icon: Wallet },
  { name: 'Eventos', href: '/eventos', icon: Calendar },
  { name: 'Escalas', href: '/escalas', icon: ClipboardList },
  { name: 'Ação Social', href: '/acao-social', icon: HeartHandshake },
  { name: 'EBD', href: '/ebd', icon: BookOpen },
  { name: 'Patrimônio', href: '/patrimonio', icon: Box },
  { name: 'Relatórios', href: '/relatorios', icon: BarChart3 },
  { name: 'Configurações', href: '/configuracoes', icon: Settings },
];

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-secondary-50 flex">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-secondary-900/80 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={clsx(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-secondary-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-16 flex items-center px-6 border-b border-secondary-200">
          <div className="flex items-center gap-2 text-primary-600 font-bold text-xl">
            <HeartHandshake className="w-6 h-6" />
            <span>Gestão Igreja</span>
          </div>
          <button 
            className="ml-auto lg:hidden text-secondary-500 hover:text-secondary-700"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col h-[calc(100vh-4rem)] justify-between">
          <nav className="p-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href || 
                (item.href !== '/' && location.pathname.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={clsx(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    isActive 
                      ? "bg-primary-50 text-primary-700" 
                      : "text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900"
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className={clsx("w-5 h-5", isActive ? "text-primary-600" : "text-secondary-400")} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-secondary-200">
            <div className="flex items-center gap-3 px-3 py-2 mb-4">
              <img 
                src="https://picsum.photos/seed/user/40/40" 
                alt="User" 
                className="w-10 h-10 rounded-full bg-secondary-200"
                referrerPolicy="no-referrer"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-secondary-900 truncate">João Silva</p>
                <p className="text-xs text-secondary-500 truncate">Admin</p>
              </div>
            </div>
            <Link
              to="/login"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Sair
            </Link>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-secondary-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-10">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden text-secondary-500 hover:text-secondary-700"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="hidden sm:flex items-center relative">
              <Search className="w-4 h-4 text-secondary-400 absolute left-3" />
              <input 
                type="text" 
                placeholder="Buscar..." 
                className="pl-9 pr-4 py-2 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent w-64"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-secondary-400 hover:text-secondary-600 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
          </div>
        </header>

        {/* Main scrollable area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
