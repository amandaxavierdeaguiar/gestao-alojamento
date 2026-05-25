import MenuDashboard from '../../component/menu-dashboard/MenuDashboard';
import GuestList from '../../component/guest-list/GuestList';

import './dashboard-home.css';

export default function DashboardHome() {
    
    return (
        <div className="dashboard-container">

        {/* Cabeçalho de Boas-Vindas */}
        <header className="dashboard-header">
            <h1>Central de Comando</h1>
            <p>Bem-vindo ao Capitão Vili Alojamento Local. O que deseja gerenciar hoje?</p>
        </header>
        < MenuDashboard />
        < GuestList />
        </div>
    );
}