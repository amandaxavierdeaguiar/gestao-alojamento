import { useLocation, useNavigate } from 'react-router-dom';
import FormAccommodation from '../../component/form/accommodation/FormNewAccommodation'; 

import MenuDashboard from '../../component/menu-dashboard/MenuDashboard';

interface AlojamentoDoBanco {
  id: number;
  nome?: string;
  descricao?: string;
  endereco?: string;
  pais?: string;
}

export default function DashboardAccommodationAdd() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { alojamentoEdicao?: AlojamentoDoBanco } | null;
  const alojamentoEdicao = state?.alojamentoEdicao || null;

  return (
    <>
      <MenuDashboard />
      <FormAccommodation
        alojamentoEdicao={alojamentoEdicao}
        onCancelEdit={() => navigate(-1)}
        onSuccess={() => navigate('/accommodations')}
      />
    </>
  );
}