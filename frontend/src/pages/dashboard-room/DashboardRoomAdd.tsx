import { useLocation, useNavigate } from 'react-router-dom';
import FormRoom from '../../component/form/room/FormNewRoom';
import MenuDashboard from '../../component/menu-dashboard/MenuDashboard';

interface QuartoDoBanco {
  id: number;
  numero_quarto: string;
  tipo: string;
  preco: number;
  alojamento_id: number;
}

// Definimos o formato esperado dentro do state da rota
interface LocationState {
  quartoEdicao?: QuartoDoBanco;
}

export default function DashboardRoomAdd() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;
  const quartoEdicao = state?.quartoEdicao || null;

  return (
    <>
      <MenuDashboard />
      <FormRoom
        quartoEdicao={quartoEdicao}
        onCancelEdit={() => navigate(-1)}
        onSuccess={() => navigate('/rooms')}
      />
    </>
  );
}