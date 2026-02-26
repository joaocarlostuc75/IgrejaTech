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
  ClipboardList,
  Church,
  HelpCircle,
  Building2
} from 'lucide-react';
import clsx from 'clsx';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Membros', href: '/membros', icon: Users },
  { name: 'Financeiro', href: '/financeiro', icon: Wallet },
  { name: 'Eventos', href: '/eventos', icon: Calendar },
  { name: 'Ação Social', href: '/acao-social', icon: HeartHandshake },
  { name: 'EBD', href: '/ebd', icon: BookOpen },
  { name: 'Congregações', href: '/congregacoes', icon: Building2 },
  { name: 'Patrimônio', href: '/patrimonio', icon: Box },
  { name: 'Grupos', href: '/grupos', icon: Network },
  { name: 'Escalas', href: '/escalas', icon: ClipboardList },
  { name: 'Relatórios', href: '/relatorios', icon: BarChart3 },
];

const systemNavigation = [
  { name: 'Configurações', href: '/configuracoes', icon: Settings },
  { name: 'Ajuda', href: '/ajuda', icon: HelpCircle },
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
        "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-secondary-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0 flex flex-col",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-20 flex items-center px-6 border-b border-secondary-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center text-white shadow-sm">
              <Church className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-secondary-900 leading-tight">Gestão Igreja</h1>
              <p className="text-xs text-secondary-500">Painel Admin</p>
            </div>
          </div>
          <button 
            className="ml-auto lg:hidden text-secondary-500 hover:text-secondary-700"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-8">
          <nav className="space-y-1">
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

          <div>
            <h3 className="px-3 text-xs font-semibold text-secondary-400 uppercase tracking-wider mb-2">Sistema</h3>
            <nav className="space-y-1">
              {systemNavigation.map((item) => {
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
          </div>
        </div>

        <div className="p-4 border-t border-secondary-100 shrink-0">
          <div className="flex items-center gap-3 px-2">
            <img 
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop" 
              alt="User" 
              className="w-10 h-10 rounded-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-secondary-900 truncate">Pastor João</p>
              <p className="text-xs text-secondary-500 truncate">Administrador</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white border-b border-secondary-100 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-10 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden text-secondary-500 hover:text-secondary-700"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            {/* The page title is usually rendered by the page component itself in this design, 
                but we can leave a placeholder or let pages handle their own headers. 
                For now, we'll keep it clean as per the design. */}
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
