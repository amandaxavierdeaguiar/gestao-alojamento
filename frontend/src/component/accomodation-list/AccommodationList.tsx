import '../guest-list/guest-list.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import * as Icon from 'react-bootstrap-icons';

interface AlojamentoDoBanco {
  id: number;
  nome_alojamento: string; 
  descricao?: string;
  endereco?: string;
  pais?: string;
}

export default function AccommodationList() {
  const navigate = useNavigate();

  const [accommodations, setAccommodations] = useState<AlojamentoDoBanco[]>([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('@Hotel:token');

  const carregarAlojamentos = () => {
    fetch('http://127.0.0.1:8000/alojamentos', {    
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao ler dados do servidor.");
        return res.json();
      })
      .then((data: AlojamentoDoBanco[]) => {
        setAccommodations(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erro ao carregar alojamentos:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    carregarAlojamentos();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-container">
        <p style={{ padding: '20px', textAlign: 'center' }}>A carregar a listagem dos alojamentos ...</p>
      </div>
    );
  }

  const deleteAlojamento = (id: number) => {
    if (window.confirm("Tem a certeza que deseja apagar este alojamento?")) {
      fetch(`http://127.0.0.1:8000/alojamentos/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}` 
        }
      })
      .then((res) => {
        if (res.ok) {
          alert("Alojamento eliminado com sucesso!");
          setAccommodations(prev => prev.filter(item => item.id !== id));
        } else {
          alert("Erro ao tentar eliminar o alojamento ou falta de permissões.");
        }
      })
      .catch((err) => console.error("Erro ao deletar:", err));
    }
  };

  const iniciarEdicaoCompleta = (alojamento: AlojamentoDoBanco) => {
    // Redireciona para a rota do formulário de alojamento passando o estado
    navigate('/add-accommodation', { state: { alojamentoEdicao: alojamento } });
  };

  return (
    <div className="dashboard-container">
      <section className="guest-list-section">
        <div className="section-header">
          <h2>Controlo de Alojamentos</h2>
          <span className="live-indicator">● Base de Dados Ativa</span>
        </div>

        <div className="table-responsive">
          <table className="guest-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome do Alojamento</th>
                <th>Descrição</th>
                <th>Endereço</th>
                <th>País</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {accommodations.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '20px' }}>
                    Nenhum alojamento encontrado no sistema.
                  </td>
                </tr>
              ) : (
                accommodations.map((alojamento) => {
                  return (
                    <tr key={alojamento.id}>
                      <td style={{ fontWeight: 'bold', color: '#888' }}>#{alojamento.id}</td>
                      <td className="guest-name" style={{ fontWeight: '600' }}>
                        {alojamento.nome_alojamento}
                      </td>
                      <td style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {alojamento.descricao || "Sem descrição"}
                      </td>
                      <td>{alojamento.endereco || "N/A"}</td>
                      <td>{alojamento.pais || "N/A"}</td>
                      <td>
                        <button className="edit-button" onClick={() => iniciarEdicaoCompleta(alojamento)} title="Editar Alojamento" style={{ marginRight: '8px' }}>
                          <span className="edit-icon">
                            <Icon.PencilFill />
                          </span>
                        </button>
                        <button className="delete-button" onClick={() => deleteAlojamento(alojamento.id)} title="Apagar Alojamento">
                          <span className="delete-icon">
                            <Icon.Trash3Fill />
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