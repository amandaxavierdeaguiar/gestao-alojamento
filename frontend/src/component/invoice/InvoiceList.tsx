import { useEffect, useState } from 'react';
import * as Icon from 'react-bootstrap-icons';
import '../guest-list/guest-list.css'; // Reutiliza o padrão visual do seu painel

interface ReservaDoBanco {
  id: number;
  data_inicio: string;
  data_fim: string;
  preco_total: number;
  cama_extra?: number;
  status: string;
  cliente_id: number;
}

interface ClienteOpcao {
  id: number;
  nome: string;
  email: string;
}

export default function InvoiceList() {
  const [reservas, setReservas] = useState<ReservaDoBanco[]>([]);
  const [clientes, setClientes] = useState<ClienteOpcao[]>([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('@Hotel:token');

  useEffect(() => {
    let isMounted = true;

    async function carregarDadosFaturas() {
      try {
        const headers = { 'Authorization': `Bearer ${token}` };

        // Carrega as reservas e os clientes em paralelo
        const [resReservas, resClientes] = await Promise.all([
          fetch('http://127.0.0.1:8000/reservas', { headers }),
          fetch('http://127.0.0.1:8000/clientes', { headers })
        ]);

        if (!resReservas.ok || !resClientes.ok) {
          throw new Error("Erro ao obter dados de faturação do servidor.");
        }

        const dadosReservas = await resReservas.json() as ReservaDoBanco[];
        const dadosClientes = await resClientes.json() as ClienteOpcao[];

        if (isMounted) {
          setReservas(dadosReservas);
          setClientes(dadosClientes);
        }
      } catch (err) {
        console.error("Erro ao gerar relatório de faturas:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    carregarDadosFaturas();

    return () => {
      isMounted = false;
    };
  }, [token]);

  // Encontra o titular da fatura (Cliente)
  const obterNomeCliente = (clienteId: number) => {
    const cliente = clientes.find(c => c.id === clienteId);
    return cliente ? cliente.nome : `Cliente (ID #${clienteId})`;
  };

  // Calcula a receita total bruta somando o preco_total de todas as reservas
  const calcularTotalFaturado = () => {
    return reservas.reduce((acc, atual) => acc + (atual.preco_total || 0), 0);
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <p style={{ padding: '20px', textAlign: 'center' }}>A compilar faturas e somatórios ...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <section className="guest-list-section">
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          backgroundColor: '#1e293b', 
          color: '#fff', 
          padding: '20px', 
          borderRadius: '8px', 
          marginBottom: '25px',
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
        }}>
          <div>
            <span style={{ fontSize: '14px', color: '#94a3b8', display: 'block', marginBottom: '5px' }}>
              VOLUME TOTAL FATURADO (Quartos + Adicionais)
            </span>
            <h1 style={{ margin: 0, fontSize: '32px', fontWeight: '700', color: '#38bdf8' }}>
              {calcularTotalFaturado().toFixed(2)} €
            </h1>
          </div>
          <div style={{ backgroundColor: '#334155', padding: '15px', borderRadius: '50%' }}>
            <Icon.CashCoin size={35} color="#38bdf8" />
          </div>
        </div>

        <div className="section-header">
          <h2>Faturas / Extratos por Reserva</h2>
          <span className="live-indicator">
            ● {reservas.length} Transações Encontradas
          </span>
        </div>

        <div className="table-responsive">
          <table className="guest-table">
            <thead>
              <tr>
                <th>Nº Fatura</th>
                <th>Titular / Cliente</th>
                <th>Período</th>
                <th>Cama Extra</th>
                <th>Status</th>
                <th>Soma Total (Quartos)</th>
              </tr>
            </thead>
            <tbody>
              {reservas.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '20px' }}>
                    Nenhuma reserva ou movimentação financeira registada.
                  </td>
                </tr>
              ) : (
                reservas.map((reserva) => (
                  <tr key={reserva.id}>
                    <td style={{ fontWeight: 'bold', color: '#64748b' }}>
                      #FT-{reserva.id}{new Date(reserva.data_inicio).getFullYear()}
                    </td>
                    <td className="guest-name" style={{ fontWeight: '600' }}>
                      {obterNomeCliente(reserva.cliente_id)}
                    </td>
                    <td style={{ fontSize: '13px', color: '#475569' }}>
                      {reserva.data_inicio} à {reserva.data_fim}
                    </td>
                    <td style={{ color: reserva.cama_extra ? '#e11d48' : '#64748b' }}>
                      {reserva.cama_extra ? `+ ${reserva.cama_extra.toFixed(2)} €` : 'Não'}
                    </td>
                    <td>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '600',
                        backgroundColor: reserva.status === 'Confirmada' ? '#dcfce7' : '#fee2e2',
                        color: reserva.status === 'Confirmada' ? '#15803d' : '#b91c1c'
                      }}>
                        {reserva.status}
                      </span>
                    </td>
                    <td style={{ fontWeight: '700', color: '#0f172a', textAlign: 'right', paddingRight: '20px' }}>
                      {reserva.preco_total.toFixed(2)} €
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