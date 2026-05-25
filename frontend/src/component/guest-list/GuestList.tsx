import './guest-list.css';
import { useEffect, useState } from 'react';

type GuestInfo = {
  id: number;
  guestName: string;
  room: string;
  checkInDate: string;
  checkInTime: string;
  checkOutDate: string;
  checkOutTime: string;
  status: string | null;
  guestsCount: number;
};

export default function GuestList() {
  const [guestsData, setGuestsData] = useState<GuestInfo[]>([]);

  
  useEffect(() => {
    // Busca o arquivo diretamente da pasta public
    fetch('/dados.json')
      .then(res => res.json())
      .then(data => {
        setGuestsData(data); // 3. Guarda os dados recebidos no estado
      })
      .catch(err => console.error("Erro ao carregar dados.json:", err));
  }, []);

  const getStatusDetails = (status: GuestInfo['status']) => {
    switch (status) {
      case 'checked-in':
        return { text: 'In-House', className: 'status-in' };
      case 'expected':
        return { text: 'Pendente', className: 'status-pending' };
      case 'checked-out':
        return { text: 'Check-out', className: 'status-out' };
      default:
        return { text: status, className: '' };
    }
  };


  return (
    <div className="dashboard-container">
      <section className="guest-list-section">
        <div className="section-header">
          <h2>Hóspedes do Dia</h2>
          <span className="live-indicator">● Em Tempo Real</span>
        </div>

        <div className="table-responsive">
          <table className="guest-table">
            <thead>
              <tr>
                <th>Hóspede</th>
                <th>Alojamento / Quarto</th>
                <th>Data Check-in</th>
                <th>Hora</th>
                <th>Data Check-out</th>
                <th>Hora</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {guestsData.map((guest) => {
                const statusDetails = getStatusDetails(guest.status);
                
                return (
                  <tr key={guest.id}>
                    <td className="guest-name">
                      {guest.guestName}
                      <span className="guest-count-sub">({guest.guestsCount}p)</span>
                    </td>
                    <td className="guest-room">{guest.room}</td>
                    
                    <td className="date-cell">{guest.checkInDate}</td>
                    <td className="time-cell">⏱️ {guest.checkInTime}</td>
                    
                    <td className="date-cell">{guest.checkOutDate}</td>
                    <td className="time-cell">⏱️ {guest.checkOutTime}</td>
                    
                    <td>
                      <span className={`status-badge ${statusDetails.className}`}>
                        {statusDetails.text}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}