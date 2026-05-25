import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import MasterLayout from './layout/LayoutDashboard';
import Dashboard from './pages/dashboard-home/DashboardHome';

import DashboardGuestAdd from './pages/dashboard-guest/DashboardGuestAdd';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota Pai: O Layout Master abraça as páginas internas */}
        <Route path="/" element={<MasterLayout />}>
          
          {/* Rota Padrão: Se o usuário acessar "/", ele é redirecionado para "/dashboard" */}
          <Route index element={<Navigate to="/dashboard" replace />} />
          
          {/* Rota Filha: O Dashboard será injetado dentro do <Outlet /> do Layout */}
          <Route path="dashboard" element={<Dashboard />} />
          
          <Route path="add-guest" element={<DashboardGuestAdd />} />          
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
