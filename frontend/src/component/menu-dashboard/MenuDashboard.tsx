import { Link } from 'react-router-dom';
import * as Icon from 'react-bootstrap-icons';
import './menu-dashboard.css'; 

export default function Dashboard() {
  
  const centralItems = [
    {
      title: 'Criar novo User',
      icon: <Icon.PeopleFill />,
      path: '/register',
      color: '#4f46e5',
    },
    {
      title: 'Criar nova Reserva',
      icon: <Icon.CalendarDayFill />,
      path: '/add-guest',
      color: '#06b6d4', 
    },
    {
      title: 'Criar novo Alojamento',
      icon: <Icon.BuildingFill />,
      path: '/add-accommodation',
      color: '#10b981', 
    },
    {
      title: 'Criar novo Quarto',
      icon: <Icon.LampFill />,
      path: '/add-room',
      color: '#f59e0b',
    }
  ];

  return (
    <>
    <div className="menu-dashboard-container">
      <div className="central-grid">
        {centralItems.map((item, index) => (
          <Link to={item.path} key={index} className="central-card">
            <div className="card-icon-wrapper" style={{ backgroundColor: item.color }}>
              {item.icon}
            </div>
            <div className="card-info">
              <h2>{item.title}</h2>
            </div>
            <div className="card-arrow">
              <Icon.ArrowRightShort />
            </div>
          </Link>
        ))}
      </div>
    </div>
    </>
  );
}