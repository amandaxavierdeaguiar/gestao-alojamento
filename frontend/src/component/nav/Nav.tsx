import { useState } from 'react';
import './nav.css';
import logo from '../../assets/logo/logo-capitao-alojamento.png';
import * as Icon from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

interface NavProps {
  isRetracted: boolean;
  setIsRetracted: React.Dispatch<React.SetStateAction<boolean>>;
}

function Nav({ isRetracted, setIsRetracted }: NavProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Limpa o Token e o Utilizador do navegador
    localStorage.removeItem('@Hotel:token');
    localStorage.removeItem('@Hotel:user');

    // Redireciona para o ecrã de login
    navigate('/login', { replace: true });
  };

  const handleToggle = () => {
    setIsRetracted(!isRetracted); // Avisa o componente Pai para mudar o Grid
  };

  const menuItems = [
    { text: 'Dashboard', icon: <Icon.HouseFill className="nav-icon" />, link: '/'},
    { text: 'Clientes', icon: <Icon.PeopleFill className="nav-icon" />, link: '/clients' },
    { text: 'Reservas', icon: <Icon.CalendarDayFill className="nav-icon" /> , link: '/'},
    { text: 'Alojamentos', icon: <Icon.BuildingFill className="nav-icon" /> , link: '/accommodations'},
    { text: 'Quartos', icon: <Icon.LampFill className="nav-icon" /> , link: '/rooms'},
    { text: 'Faturas', icon: <Icon.CashCoin className="nav-icon" /> , link: '/invoice'},
  ];

  return (
    <nav className={`main-menu ${isRetracted ? 'collapsed' : ''}`}>
      <div className="logo-container">
        <img src={logo} alt="Logo Capitão Alojamento" className="logo-img" />
        <div className="company-name">
          <h1>Capitão Vili</h1>
          <h3>Alojamento Local</h3>
        </div>
        
        {/* BOTÃO FLUTUANTE DE TRÁS PARA FRENTE (< e >) */}
        <button className="toggle-menu-btn" onClick={handleToggle} aria-label="Toggle Menu">
          {isRetracted ? '>' : '<'}
        </button>
      </div>

      <ul>
        {menuItems.map((item, index) => (
          <Link to={item.link} style={{ textDecoration: 'none' }}>
          <li
            key={index}
            className={`nav-item ${activeIndex === index ? 'active' : ''}`}
            onClick={() => setActiveIndex(index)}
          >
            <b></b>
            <b></b>
            <div className="nav-content">
              {item.icon}
              <span className="nav-text">{item.text}</span>
            </div>
          </li>
            </Link>
        ))}
      </ul>

      <div className="logout-container-footer">
      <button className="logout-action-wrapper" title="Sair do Sistema" onClick={handleLogout}>
        <b></b>
        <b></b>
        <div className="nav-content">
          <Icon.BoxArrowRight className="nav-icon logout-icon" />
          <span className="nav-text">Sair do Sistema</span>
        </div>
      </button>
    </div>
    </nav>
  );
}

export default Nav;