import MenuDashboard from '../../component/menu-dashboard/MenuDashboard';
import GuestList from '../../component/guest-list/GuestList';

import './dashboard-home.css';

export default function DashboardHome() {
        const userRaw = localStorage.getItem('@Hotel:user');

        let nomeUsuario = "Utilizador";

        if (userRaw) {
        try {
            // Converte a string de volta para um objeto JavaScript
            const userObj = JSON.parse(userRaw);
            
            // Armazena o nome 
            nomeUsuario = userObj.nome || userObj.username || "Utilizador";
        } catch (error) {
            console.error("Erro ao ler dados do utilizador do localStorage", error);
        }
    }
    return (
        <div className="dashboard-container">

        {/* Cabeçalho de Boas-Vindas */}
        <header className="dashboard-header">
            <h1>Central de Comando</h1>
            <p>Olá {nomeUsuario}, O que deseja gerenciar hoje? </p>
        </header>
        < MenuDashboard />
        <div>
            < GuestList />
        </div>
        </div>
    );
}