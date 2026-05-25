import { useState } from 'react';
import './nav.css';
import logo from '../../assets/logo/logo-capitao-alojamento.png';
import * as Icon from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';

interface NavProps {
  isRetracted: boolean;
  setIsRetracted: React.Dispatch<React.SetStateAction<boolean>>;
}

function Nav({ isRetracted, setIsRetracted }: NavProps) {
  
  const [activeIndex, setActiveIndex] = useState(0);

  const handleToggle = () => {
    setIsRetracted(!isRetracted); // Avisa o componente Pai para mudar o Grid
  };

  const menuItems = [
    { text: 'Dashboard', icon: <Icon.HouseFill className="nav-icon" />, link: '/'},
    { text: 'Clientes', icon: <Icon.PeopleFill className="nav-icon" />, link: '/add-guest' },
    { text: 'Reservas', icon: <Icon.CalendarDayFill className="nav-icon" /> , link: '/'},
    { text: 'Quartos', icon: <Icon.LampFill className="nav-icon" /> , link: '/'},
    { text: 'Faturas', icon: <Icon.CashCoin className="nav-icon" /> , link: '/'},
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

      {/* <button className="logout-btn" title="Sair do Sistema">
        <Icon.BoxArrowRight className='logout'/>
      </button> */}
      <div className="logout-container-footer">
      <button className="logout-action-wrapper" title="Sair do Sistema">
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