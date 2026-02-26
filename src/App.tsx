/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Members } from './pages/Members';
import { Financial } from './pages/Financial';
import { Events } from './pages/Events';
import { SocialAction } from './pages/SocialAction';
import { EBD } from './pages/EBD';
import { Congregations } from './pages/Congregations';
import { Patrimonio } from './pages/Patrimonio';
import { Grupos } from './pages/Grupos';
import { Escalas } from './pages/Escalas';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';
import { Login } from './pages/Login';
import { RecoverPassword } from './pages/RecoverPassword';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/recuperar-senha" element={<RecoverPassword />} />
        
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="membros" element={<Members />} />
          <Route path="grupos" element={<Grupos />} />
          <Route path="financeiro" element={<Financial />} />
          <Route path="eventos" element={<Events />} />
          <Route path="escalas" element={<Escalas />} />
          <Route path="acao-social" element={<SocialAction />} />
          <Route path="ebd" element={<EBD />} />
          <Route path="congregacoes" element={<Congregations />} />
          <Route path="patrimonio" element={<Patrimonio />} />
          <Route path="relatorios" element={<Reports />} />
          <Route path="configuracoes" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
}
