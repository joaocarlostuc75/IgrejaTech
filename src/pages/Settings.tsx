import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Shield, 
  Database, 
  Bell, 
  Users, 
  Globe, 
  Save,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import clsx from 'clsx';

export function Settings() {
  const [activeTab, setActiveTab] = useState<'geral' | 'acesso' | 'lgpd' | 'backup'>('geral');
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [isClearingLogs, setIsClearingLogs] = useState(false);
  const [lastBackup, setLastBackup] = useState('Hoje, 03:00 AM');

  const handleBackup = () => {
    setIsBackingUp(true);
    setTimeout(() => {
      setIsBackingUp(false);
      setLastBackup('Agora mesmo');
      alert('Backup realizado com sucesso!');
    }, 2000);
  };

  const handleRestore = () => {
    const confirmRestore = confirm('Atenção: Restaurar um backup substituirá todos os dados atuais. Deseja continuar?');
    if (confirmRestore) {
      setIsRestoring(true);
      setTimeout(() => {
        setIsRestoring(false);
        alert('Backup restaurado com sucesso!');
      }, 2500);
    }
  };

  const handleClearLogs = () => {
    const confirmClear = confirm('Tem certeza que deseja limpar os logs antigos? Esta ação não pode ser desfeita.');
    if (confirmClear) {
      setIsClearingLogs(true);
      setTimeout(() => {
        setIsClearingLogs(false);
        alert('Logs antigos limpos com sucesso!');
      }, 1000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Configurações</h1>
          <p className="text-sm text-secondary-500">Gerencie as preferências do sistema e segurança.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
            <Save className="w-4 h-4" />
            Salvar Alterações
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Tabs */}
        <div className="w-full lg:w-64 shrink-0">
          <nav className="space-y-1">
            {[
              { id: 'geral', name: 'Geral', icon: SettingsIcon },
              { id: 'acesso', name: 'Controle de Acesso', icon: Users },
              { id: 'lgpd', name: 'Privacidade (LGPD)', icon: Shield },
              { id: 'backup', name: 'Backup & Dados', icon: Database },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={clsx(
                  "w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors text-left",
                  activeTab === tab.id
                    ? "bg-primary-50 text-primary-700"
                    : "text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900"
                )}
              >
                <tab.icon className={clsx("w-5 h-5", activeTab === tab.id ? "text-primary-600" : "text-secondary-400")} />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white rounded-xl border border-secondary-200 shadow-sm overflow-hidden">
          {activeTab === 'geral' && (
            <div className="p-6 space-y-8">
              <div>
                <h2 className="text-lg font-bold text-secondary-900 mb-4">Informações da Igreja</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-secondary-700">Nome da Igreja</label>
                    <input type="text" className="w-full px-4 py-2 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" defaultValue="Igreja Batista Central" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-secondary-700">CNPJ</label>
                    <input type="text" className="w-full px-4 py-2 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" defaultValue="00.000.000/0001-00" />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <label className="text-sm font-medium text-secondary-700">Endereço Principal</label>
                    <input type="text" className="w-full px-4 py-2 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" defaultValue="Rua das Flores, 123 - Centro" />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-secondary-200">
                <h2 className="text-lg font-bold text-secondary-900 mb-4">Preferências do Sistema</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-secondary-900">Fuso Horário</p>
                      <p className="text-xs text-secondary-500">Define o horário padrão para eventos e relatórios.</p>
                    </div>
                    <select className="px-4 py-2 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                      <option>Brasília (GMT-3)</option>
                      <option>Manaus (GMT-4)</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-secondary-900">Moeda Padrão</p>
                      <p className="text-xs text-secondary-500">Moeda utilizada no módulo financeiro.</p>
                    </div>
                    <select className="px-4 py-2 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                      <option>Real (BRL)</option>
                      <option>Dólar (USD)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'acesso' && (
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-secondary-900">Controle de Acesso (RLS)</h2>
                <button className="px-4 py-2 bg-secondary-100 text-secondary-700 rounded-lg text-sm font-medium hover:bg-secondary-200 transition-colors">
                  Novo Perfil
                </button>
              </div>
              
              <div className="space-y-4">
                {[
                  { role: 'Administrador', desc: 'Acesso total a todos os módulos e configurações.', users: 3 },
                  { role: 'Pastor', desc: 'Acesso a membros, relatórios e EBD. Sem acesso financeiro detalhado.', users: 2 },
                  { role: 'Tesoureiro', desc: 'Acesso exclusivo ao módulo financeiro e relatórios de arrecadação.', users: 1 },
                  { role: 'Líder de Ministério', desc: 'Acesso a eventos, EBD e membros do seu ministério.', users: 8 },
                ].map((role, i) => (
                  <div key={i} className="flex items-start justify-between p-4 border border-secondary-200 rounded-lg hover:border-primary-300 transition-colors">
                    <div>
                      <h3 className="text-sm font-bold text-secondary-900">{role.role}</h3>
                      <p className="text-sm text-secondary-500 mt-1">{role.desc}</p>
                      <p className="text-xs text-secondary-400 mt-2 flex items-center gap-1">
                        <Users className="w-3 h-3" /> {role.users} usuários com este perfil
                      </p>
                    </div>
                    <button className="text-sm font-medium text-primary-600 hover:text-primary-700">Editar Permissões</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'lgpd' && (
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-secondary-900">Conformidade LGPD</h2>
                  <p className="text-sm text-secondary-500">Configurações de privacidade e proteção de dados.</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-secondary-50 rounded-lg border border-secondary-200">
                  <div className="mt-1">
                    <input type="checkbox" className="w-4 h-4 rounded border-secondary-300 text-primary-600 focus:ring-primary-500" defaultChecked />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-secondary-900">Termo de Consentimento Obrigatório</h3>
                    <p className="text-sm text-secondary-600 mt-1">Exigir aceite do termo de privacidade no cadastro de novos membros.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-secondary-50 rounded-lg border border-secondary-200">
                  <div className="mt-1">
                    <input type="checkbox" className="w-4 h-4 rounded border-secondary-300 text-primary-600 focus:ring-primary-500" defaultChecked />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-secondary-900">Anonimização Automática</h3>
                    <p className="text-sm text-secondary-600 mt-1">Anonimizar dados de membros inativos após 5 anos, mantendo apenas dados estatísticos.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-secondary-50 rounded-lg border border-secondary-200">
                  <div className="mt-1">
                    <input type="checkbox" className="w-4 h-4 rounded border-secondary-300 text-primary-600 focus:ring-primary-500" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-secondary-900">Registro de Auditoria (Logs)</h3>
                    <p className="text-sm text-secondary-600 mt-1">Manter histórico detalhado de quem acessou ou modificou dados sensíveis (aumenta uso de armazenamento).</p>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-secondary-200">
                <button className="px-4 py-2 bg-white border border-secondary-200 rounded-lg text-sm font-medium text-secondary-700 hover:bg-secondary-50 transition-colors">
                  Gerar Relatório de Impacto à Proteção de Dados (RIPD)
                </button>
              </div>
            </div>
          )}

          {activeTab === 'backup' && (
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-secondary-900">Backup e Armazenamento</h2>
                  <p className="text-sm text-secondary-500">Gerencie cópias de segurança e uso de disco.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                <div className="p-4 border border-secondary-200 rounded-lg">
                  <h3 className="text-sm font-medium text-secondary-500 mb-1">Último Backup</h3>
                  <p className="text-lg font-bold text-secondary-900 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    {lastBackup}
                  </p>
                  <p className="text-xs text-secondary-400 mt-2">Tamanho: 450 MB</p>
                </div>
                <div className="p-4 border border-secondary-200 rounded-lg">
                  <h3 className="text-sm font-medium text-secondary-500 mb-1">Armazenamento Utilizado</h3>
                  <p className="text-lg font-bold text-secondary-900">2.4 GB / 10 GB</p>
                  <div className="w-full h-2 bg-secondary-100 rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '24%' }}></div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-bold text-secondary-900">Ações de Banco de Dados</h3>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={handleBackup}
                    disabled={isBackingUp || isRestoring || isClearingLogs}
                    className="flex-1 px-4 py-3 bg-white border border-secondary-200 rounded-lg text-sm font-medium text-secondary-700 hover:bg-secondary-50 transition-colors text-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isBackingUp ? 'Realizando Backup...' : 'Fazer Backup Agora'}
                  </button>
                  <button 
                    onClick={handleRestore}
                    disabled={isBackingUp || isRestoring || isClearingLogs}
                    className="flex-1 px-4 py-3 bg-white border border-secondary-200 rounded-lg text-sm font-medium text-secondary-700 hover:bg-secondary-50 transition-colors text-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isRestoring ? 'Restaurando...' : 'Restaurar Backup'}
                  </button>
                  <button 
                    onClick={handleClearLogs}
                    disabled={isBackingUp || isRestoring || isClearingLogs}
                    className="flex-1 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm font-medium text-red-700 hover:bg-red-100 transition-colors text-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isClearingLogs ? 'Limpando...' : 'Limpar Logs Antigos'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
