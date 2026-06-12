import './guest-list.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import * as Icon from 'react-bootstrap-icons';

interface ClienteDoBanco {
  id: number;
  nome: string;
  email: string;
  telefone?: string;
  endereco?: string;
}

interface QuartoDoBanco {
  id: number;
  numero_quarto: string;
  tipo: string;
  preco: number;
}

interface ReservaDoBanco {
  id: number;
  data_inicio: string;
  hora_checkin: string;
  data_fim: string;
  hora_checkout: string;
  preco_total: number;
  status: string;
  cliente_id: number | null; // Atualizado para aceitar null vindo do backend
  cliente?: ClienteDoBanco;
  quartos?: QuartoDoBanco[];
}

export default function GuestList() {
  const navigate = useNavigate();

  const [reservas, setReservas] = useState<ReservaDoBanco[]>([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('@Hotel:token');

  const carregarReservas = () => {
    fetch('http://127.0.0.1:8000/reservas')
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao ler dados do servidor.");
        return res.json();
      })
      .then((data: ReservaDoBanco[]) => {
        setReservas(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erro ao carregar reservas:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    carregarReservas();
  }, []);

  const getStatusDetails = (status: string) => {
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

  if (loading) {
    return (
      <div className="dashboard-container">
        <p style={{ padding: '20px', textAlign: 'center' }}>A carregar a listagem de hóspedes...</p>
      </div>
    );
  }

  const delete_reserva = (id: number) => {
    if (window.confirm("Tem a certeza que deseja apagar esta reserva?")) {
      fetch(`http://127.0.0.1:8000/reservas/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}` 
        }
      })
      .then((res) => {
        if (res.ok) {
          alert("Reserva eliminada com sucesso!");
          setReservas(prev => prev.filter(reserva => reserva.id !== id));
        } else {
          alert("Erro ao tentar eliminar a reserva ou falta de permissões.");
        }
      })
      .catch((err) => console.error("Erro ao deletar:", err));
    }
  };

  const iniciarEdicaoCompleta = (reserva: ReservaDoBanco) => {
    navigate('/add-guest', { state: { reservaEdicao: reserva } });
  };

  return (
    <div className="dashboard-container">
      <section className="guest-list-section">
        <div className="section-header">
          <h2>Controlo de Reservas Real</h2>
          <span className="live-indicator">● Base de Dados Ativa</span>
        </div>

        <div className="table-responsive">
          <table className="guest-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Hóspede</th>
                <th>Alojamento / Quarto</th>
                <th>Data Check-in</th>
                <th>Hora</th>
                <th>Data Check-out</th>
                <th>Hora</th>
                <th>Preço Total</th>
                <th>Estado</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {reservas.length === 0 ? (
                <tr>
                  <td colSpan={10} style={{ textAlign: 'center', padding: '20px' }}>
                    Nenhuma reserva encontrada no sistema MySQL.
                  </td>
                </tr>
              ) : (
                reservas.map((reserva) => {
                  const statusDetails = getStatusDetails(reserva.status);
                  
                  // MELHORIA AQUI: Tratamento caso o cliente ou o ID sejam nulos
                  const nomeHospede = reserva.cliente?.nome || 
                    (reserva.cliente_id ? `Cliente ID: ${reserva.cliente_id}` : "Sem cliente associado");
                  
                  const quartosAtribuidos = reserva.quartos && reserva.quartos.length > 0 
                    ? reserva.quartos.map(q => `Quarto ${q.numero_quarto}`).join(', ') 
                    : "Sem quarto atribuído";

                  // Tratamento do Preço Total para garantir que é um número válido antes do toFixed
                  const precoExibido = typeof reserva.preco_total === 'number'
                    ? reserva.preco_total.toFixed(2)
                    : Number(reserva.preco_total || 0).toFixed(2);

                  return (
                    <tr key={reserva.id}>
                      <td style={{ fontWeight: 'bold', color: '#888' }}>#{reserva.id}</td>
                      <td className="guest-name">{nomeHospede}</td>
                      <td className="guest-room">{quartosAtribuidos}</td>
                      
                      <td className="date-cell">{reserva.data_inicio}</td>
                      <td className="time-cell">⏱️ {reserva.hora_checkin}</td>
                      
                      <td className="date-cell">{reserva.data_fim}</td>
                      <td className="time-cell">⏱️ {reserva.hora_checkout}</td>
                      
                      <td style={{ fontWeight: '600' }}>{precoExibido}€</td>
                      
                      <td>
                        <span className={`status-badge ${statusDetails.className}`}>
                          {statusDetails.text}
                        </span>
                      </td>

                      <td>
                        <button className="delete-button" onClick={() => delete_reserva(reserva.id)} title="Apagar Reserva">
                          <span className="delete-icon">
                            <Icon.Trash3Fill />
                          </span>
                        </button>
                        <button className="edit-button" onClick={() => iniciarEdicaoCompleta(reserva)} title="Editar Reserva">
                          <span className="edit-icon">
                            <Icon.PencilFill />
                          </span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}