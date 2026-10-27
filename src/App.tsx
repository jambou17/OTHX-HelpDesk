/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AppLayout } from './components/layout/AppLayout';
import { DashboardPage } from './pages/DashboardPage';
import { TicketsPage } from './pages/TicketsPage';
import { NewTicketPage } from './pages/NewTicketPage';
import { TicketDetailsPage } from './pages/TicketDetailsPage';
import { DiagnosticsPage } from './pages/DiagnosticsPage';
import { KnowledgePage } from './pages/KnowledgePage';
import { InventoryPage } from './pages/InventoryPage';
import { SettingsPage } from './pages/SettingsPage';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="chamados" element={<TicketsPage />} />
            <Route path="chamados/novo" element={<NewTicketPage />} />
            <Route path="chamados/:id" element={<TicketDetailsPage />} />
            <Route path="diagnosticos" element={<DiagnosticsPage />} />
            <Route path="conhecimento" element={<KnowledgePage />} />
            <Route path="inventario" element={<InventoryPage />} />
            <Route path="configuracoes" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
