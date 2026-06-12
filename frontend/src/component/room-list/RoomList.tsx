import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Icon from 'react-bootstrap-icons';
import '../guest-list/guest-list.css';

interface QuartoDoBanco {
  id: number;
  numero_quarto: string;
  tipo: string;
  preco: number;
  alojamento_id: number;
}

interface AlojamentoOpcao {
  id: number;
  nome_alojamento: string;
}

export default function RoomList() {
  const navigate = useNavigate();

  const [quartos, setQuartos] = useState<QuartoDoBanco[]>([]);
  const [alojamentos, setAlojamentos] = useState<AlojamentoOpcao[]>([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('@Hotel:token');

  useEffect(() => {
    // Declarámos a função interna e isolada para limpar o fluxo de execução do Linter
    let isMounted = true;

    async function efetuarCarga() {
      try {
        const headers = { 'Authorization': `Bearer ${token}` };

        const [resQuartos, resAlojamentos] = await Promise.all([
          fetch('http://127.0.0.1:8000/quartos', { headers }),
          fetch('http://127.0.0.1:8000/alojamentos', { headers })
        ]);

        if (!resQuartos.ok || !resAlojamentos.ok) {
          throw new Error("Erro ao carregar dados do servidor.");
        }

        const dadosQuartos = await resQuartos.json() as QuartoDoBanco[];
        const dadosAlojamentos = await resAlojamentos.json() as AlojamentoOpcao[];

        // Só atualiza o estado se o componente ainda estiver montado no ecrã
        if (isMounted) {
          setQuartos(dadosQuartos);
          setAlojamentos(dadosAlojamentos);
        }
      } catch (err) {
        console.error("Erro na listagem de quartos:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    efetuarCarga();

    // Função de limpeza (cleanup) para evitar memory leaks e cascading renders
    return () => {
      isMounted = false;
    };
  }, [token]); // Monitoriza o token com segurança

  const obterNomeAlojamento = (alojamentoId: number) => {
    const alojamento = alojamentos.find(a => a.id === alojamentoId);
    return alojamento ? alojamento.nome_alojamento : `Alojamento (ID #${alojamentoId})`;
  };

  const deletarQuarto = (id: number) => {
    if (window.confirm("Tem a certeza que deseja remover este quarto do sistema?")) {
      fetch(`http://127.0.0.1:8000/quartos/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then((res) => {
        if (res.ok) {
          alert("Quarto removido com sucesso!");
          setQuartos(prev => prev.filter(q => q.id !== id));
        } else {
          alert("Erro ao tentar eliminar o quarto.");
        }
      })
      .catch((err) => console.error("Erro ao deletar:", err));
    }
  };

  const iniciarEdicao = (quarto: QuartoDoBanco) => {
    navigate('/add-room', { state: { quartoEdicao: quarto } });
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <p style={{ padding: '20px', textAlign: 'center' }}>A carregar a listagem de quartos...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <section className="guest-list-section">
        <div className="section-header">
          <h2>Gestão de Quartos</h2>
          <span className="live-indicator">● Quartos Sincronizados</span>
        </div>

        <div className="table-responsive">
          <table className="guest-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nº Quarto</th>
                <th>Alojamento / Hotel</th>
                <th>Tipo de Quarto</th>
                <th>Preço por Noite</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {quartos.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '20px' }}>
                    Nenhum quarto cadastrado no sistema.
                  </td>
                </tr>
              ) : (
                quartos.map((quarto) => (
                  <tr key={quarto.id}>
                    <td style={{ fontWeight: 'bold', color: '#888' }}>#{quarto.id}</td>
                    <td className="guest-name" style={{ fontWeight: '600' }}>
                      {quarto.numero_quarto}
                    </td>
                    <td style={{ color: '#495057', fontWeight: '500' }}>
                      {obterNomeAlojamento(quarto.alojamento_id)}
                    </td>
                    <td>{quarto.tipo}</td>
                    <td style={{ fontWeight: 'bold', color: '#2b2b2b' }}>
                      {quarto.preco.toFixed(2)} €
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                          className="edit-button" 
                          onClick={() => iniciarEdicao(quarto)} 
                          title="Editar Quarto"
                        >
                          <Icon.PencilFill />
                        </button>
                        <button 
                          className="delete-button" 
                          onClick={() => deletarQuarto(quarto.id)} 
                          title="Remover Quarto"
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