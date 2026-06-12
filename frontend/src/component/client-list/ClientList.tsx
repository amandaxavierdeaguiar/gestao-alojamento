import '../guest-list/guest-list.css';
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

export default function ClientList() {
  const navigate = useNavigate();

  const [clients, setClients] = useState<ClienteDoBanco[]>([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('@Hotel:token');

  const carregarClientes = () => {
    fetch('http://127.0.0.1:8000/clientes', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao ler dados dos clientes.");
        return res.json();
      })
      .then((data: ClienteDoBanco[]) => {
        setClients(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erro ao carregar clientes:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    carregarClientes();
  }, []);

  const deleteCliente = (id: number) => {
    if (window.confirm("Tem a certeza que deseja remover este cliente? Esta ação pode afetar reservas associadas.")) {
      fetch(`http://127.0.0.1:8000/clientes/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then((res) => {
        if (res.ok) {
          alert("Cliente removido com sucesso!");
          setClients(prev => prev.filter(c => c.id !== id));
        } else {
          alert("Erro ao tentar eliminar o cliente ou falta de permissões.");
        }
      })
      .catch((err) => console.error("Erro ao deletar:", err));
    }
  };

  const iniciarEdicao = (cliente: ClienteDoBanco) => {
    navigate('/add-clients', { state: { clienteEdicao: cliente } });
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <p style={{ padding: '20px', textAlign: 'center' }}>A carregar base de dados de clientes...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <section className="guest-list-section">
        <div className="section-header">
          <h2>Gestão de Clientes</h2>
          <span className="live-indicator">● Registos Ativos</span>
        </div>

        <div className="table-responsive">
          <table className="guest-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome Completo</th>
                <th>E-mail</th>
                <th>Telefone</th>
                <th>Localização</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {clients.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '20px' }}>
                    Nenhum cliente registado no sistema MySQL.
                  </td>
                </tr>
              ) : (
                clients.map((cliente) => (
                  <tr key={cliente.id}>
                    <td style={{ fontWeight: 'bold', color: '#888' }}>#{cliente.id}</td>
                    <td className="guest-name" style={{ color: '#2c3e50', fontWeight: '600' }}>
                      {cliente.nome}
                    </td>
                    <td>{cliente.email}</td>
                    <td className="time-cell">📞 {cliente.telefone || 'N/A'}</td>
                    <td style={{ fontSize: '0.9em' }}>{cliente.endereco || 'Não informado'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                          className="edit-button" 
                          onClick={() => iniciarEdicao(cliente)} 
                          title="Editar Ficha do Cliente"
                        >
                          <Icon.PencilFill />
                        </button>
                        <button 
                          className="delete-button" 
                          onClick={() => deleteCliente(cliente.id)} 
                          title="Remover Cliente"
                        >
                          <Icon.Trash3Fill />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
