import { Link } from 'react-router-dom';
import * as Icon from 'react-bootstrap-icons';
import './menu-dashboard.css'; 

export default function Dashboard() {
  
  const centralItems = [
    {
      title: 'Clientes',
      description: 'Gerenciar hóspedes e cadastros',
      icon: <Icon.PeopleFill />,
      path: '/clientes',
      color: '#4f46e5',
    //   count: '124'     
    },
    {
      title: 'Reservas',
      description: 'Check-ins, check-outs e calendário',
      icon: <Icon.CalendarDayFill />,
      path: '/reservas',
      color: '#06b6d4', 
    //   count: '12 Hoje'
    },
    {
      title: 'Quartos',
      description: 'Status de ocupação e limpeza',
      icon: <Icon.LampFill />,
      path: '/quartos',
      color: '#10b981', 
    //   count: '85% Ocupado'
    },
    {
      title: 'Faturas',
      description: 'Fluxo de caixa e faturamento',
      icon: <Icon.CashCoin />,
      path: '/faturas',
      color: '#f59e0b',
    //   count: '€ 3.420,00'
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
              <p>{item.description}</p>
              {/* <span className="card-badge" style={{ color: item.color }}>
                {item.count}
              </span> */}
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