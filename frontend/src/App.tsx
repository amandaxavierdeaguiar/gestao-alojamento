import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';

import MasterLayout from './layout/LayoutDashboard';
import Dashboard from './pages/dashboard-home/DashboardHome';

import DashboardGuestAdd from './pages/dashboard-guest/DashboardGuestAdd';
import DashboardAccommodationAdd from './pages/dashboard-accommodation/DashboardAccommodationAdd';
import DashboardAccommodationList from './pages/dashboard-accommodation/DashboardAccommodationList';
import DashboardClientList from './pages/dashboard-client/DashboardClientList';
import DashboardClientAdd from './pages/dashboard-client/DashboardClientAdd';
import DashboardRoomAdd from './pages/dashboard-room/DashboardRoomAdd';
import DashboardRoomList from './pages/dashboard-room/DashboardRoomList';
import InvoiceList from './component/invoice/InvoiceList';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Componente Middleware interno para Proteção de Rotas
function RotasProtegidas() {
  const token = localStorage.getItem('@Hotel:token');
  const userRaw = localStorage.getItem('@Hotel:user');
  
  if (!token || !userRaw) {
    return <Navigate to="/login" replace />;
  }

  const usuario = JSON.parse(userRaw);

  // Se não for admin, bloqueia o acesso ao painel
  if (usuario.tipo !== 'admin') {
    alert("Acesso restrito apenas para administradores.");
    localStorage.clear();
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas Públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rotas Privadas (Envelopadas pelo Middleware de Admin) */}
        <Route element={<RotasProtegidas />}>
          <Route path="/" element={<MasterLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="add-guest" element={<DashboardGuestAdd />} />    
            <Route path="add-accommodation" element={<DashboardAccommodationAdd />} /> 
            <Route path="accommodations" element={<DashboardAccommodationList />} /> 
            <Route path="add-clients" element={<DashboardClientAdd />} /> 
            <Route path="clients" element={<DashboardClientList />} /> 
            <Route path="add-room" element={<DashboardRoomAdd />} />
            <Route path="rooms" element={<DashboardRoomList />} />
            <Route path="invoice" element={<InvoiceList />} />

          </Route>
        </Route>

        {/* Rota de Fallback para links inexistentes */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
