import { useState } from 'react';
import FormGuest from '../../component/form/FormGuest';
import MenuDashboard from '../../component/menu-dashboard/MenuDashboard';
import './dashboard-guest.css';

interface GuestInfo {
  id: number;
  guestName: string;
  room: string;
  checkInDate: string;
  checkInTime: string;
  checkOutDate: string;
  checkOutTime: string;
  status: 'checked-in' | 'expected' | 'checked-out';
  guestsCount: number;
}


export default function DashboardGuestAdd() {
    const [guestsData, setGuestsData] = useState<GuestInfo[]>([]);

    const handleAddNewGuest = (novoHospede: GuestInfo) => {
        setGuestsData([novoHospede, ...guestsData]);
        
        alert(`Hóspede ${novoHospede.guestName} adicionado com sucesso!`);
    };

    return (
        <div className="dashboard-container">

        {/* Cabeçalho de Boas-Vindas */}
        <header className="dashboard-header">
            <h1>Central de Comando</h1>
            <p>Bem-vindo ao Capitão Vili Alojamento Local. O que deseja gerenciar hoje?</p>
        </header>
        < MenuDashboard />
        < FormGuest onAddGuest={handleAddNewGuest}/>
        </div>
    );
}