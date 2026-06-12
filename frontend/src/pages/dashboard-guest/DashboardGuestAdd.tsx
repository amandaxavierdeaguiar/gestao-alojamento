import { useLocation, useNavigate } from 'react-router-dom';
import FormGuest from '../../component/form/FormGuest'; 

import MenuDashboard from '../../component/menu-dashboard/MenuDashboard';

interface ReservaDoBanco {
  id: number;
  data_inicio: string;
  hora_checkin: string;
  data_fim: string;
  hora_checkout: string;
  status: string;
  cliente_id: number;
  cliente?: {
    nome: string;
    email: string;
    telefone?: string;
    endereco?: string;
  };
  quartos?: Array<{ id: number }>;
}

export default function DashboardGuestAdd() {
  const location = useLocation();
  const navigate = useNavigate();

  const state = location.state as { reservaEdicao?: ReservaDoBanco } | null;
  const reservaEdicao = state?.reservaEdicao || null;

  const handleSuccess = () => {
    navigate('/dashboard');
  };

  return (
    <>
    < MenuDashboard />
    <FormGuest 
      reservaEdicao={reservaEdicao} 
      onCancelEdit={() => navigate(-1)} 
      onSuccess={handleSuccess}         
    />
    </>
  );
}