import { useLocation, useNavigate } from 'react-router-dom';
import FormClient from '../../component/form/FormClient';

import MenuDashboard from '../../component/menu-dashboard/MenuDashboard';

interface ClienteDoBanco {
  id: number;
  nome: string;
  email: string;
  telefone?: string;
  endereco?: string;
}

export default function DashboardClientAdd() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { clienteEdicao?: ClienteDoBanco } | null;
  const clienteEdicao = state?.clienteEdicao || null;

  return (
    <>
        <MenuDashboard />
      <FormClient
        clienteEdicao={clienteEdicao}
        onCancelEdit={() => navigate(-1)}
        onSuccess={() => navigate('/clients')}
      />
    </>
  );
}

