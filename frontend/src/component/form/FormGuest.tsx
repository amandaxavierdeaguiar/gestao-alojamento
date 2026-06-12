import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import './guest-form.css';

interface QuartoDaAPI {
  id: number;
  numero_quarto: string;
  tipo: string;
  preco: number;
  alojamento_id: number;
}

interface AlojamentoDoBanco {
  id: number;
  nome?: string;
  quartos?: Array<{
    id: number;
    numero_quarto?: string;
    tipo?: string;
    preco?: number;
  }>;
}

interface ReservaParaEdicao {
  id: number;
  data_inicio: string;
  hora_checkin: string;
  data_fim: string;
  hora_checkout: string;
  status: string;
  cliente_id: number;
  cliente?: {
    nome: string;
    email: string;
    telefone?: string;
    endereco?: string;
  };
  quartos?: Array<{ id: number }>;
}

interface GuestFormProps {
  reservaEdicao: ReservaParaEdicao | null;
  onCancelEdit: () => void;
  onSuccess: () => void;
}

export default function GuestForm({ reservaEdicao, onCancelEdit, onSuccess }: GuestFormProps) {
  const [availableRooms, setAvailableRooms] = useState<QuartoDaAPI[]>([]);
  const [loadingRooms, setLoadingRooms] = useState(true);

  // ESTADO DO FORMULÁRIO
  const [formData, setFormData] = useState({
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    guestAddress: '',
    selectedRoomId: '' as number | string,
    checkInDate: '',
    checkInTime: '',
    checkOutDate: '',
    checkOutTime: '',
    status: 'expected',
    guestsCount: 1
  });

  // ESTADO DE CONTROLO DE RENDERIZAÇÃO (Guarda o ID da última reserva que foi sincronizada)
  const [prevReservaId, setPrevReservaId] = useState<number | null>(null);

  const token = localStorage.getItem('@Hotel:token');
  const isEditing = !!reservaEdicao;

  // APENAS SINCRONIZAÇÃO EM TEMPO DE RENDERIZAÇÃO (Evita o erro de render em cascata)
  if (reservaEdicao && reservaEdicao.id !== prevReservaId) {
    setPrevReservaId(reservaEdicao.id);
    setFormData({
      guestName: reservaEdicao.cliente?.nome || '',
      guestEmail: reservaEdicao.cliente?.email || '',
      guestPhone: reservaEdicao.cliente?.telefone || '',
      guestAddress: reservaEdicao.cliente?.endereco || '',
      selectedRoomId: reservaEdicao.quartos?.[0]?.id || '',
      checkInDate: reservaEdicao.data_inicio || '',
      checkInTime: reservaEdicao.hora_checkin || '',
      checkOutDate: reservaEdicao.data_fim || '',
      checkOutTime: reservaEdicao.hora_checkout || '',
      status: reservaEdicao.status || 'expected',
      guestsCount: 1
    });
  } else if (!reservaEdicao && prevReservaId !== null) {
    setPrevReservaId(null);
    setFormData({
      guestName: '',
      guestEmail: '',
      guestPhone: '',
      guestAddress: '',
      selectedRoomId: availableRooms[0]?.id || '',
      checkInDate: '',
      checkInTime: '',
      checkOutDate: '',
      checkOutTime: '',
      status: 'expected',
      guestsCount: 1
    });
  }

  useEffect(() => {
    fetch('http://127.0.0.1:8000/alojamentos')
      .then(res => res.json())
      .then((data: AlojamentoDoBanco[]) => { 
        const quartosExtraidos: QuartoDaAPI[] = [];
        data.forEach((alojamento) => {
          if (alojamento.quartos) {
            alojamento.quartos.forEach((q) => {
              quartosExtraidos.push({
                id: q.id,
                numero_quarto: q.numero_quarto || String(q.id),
                tipo: q.tipo || 'Standard',
                preco: q.preco || 0,
                alojamento_id: alojamento.id
              });
            });
          }
        });

        setAvailableRooms(quartosExtraidos);
        
        // Se for um novo registo, inicializa com o primeiro quarto da lista
        if (quartosExtraidos.length > 0 && !reservaEdicao) {
          setFormData(prev => ({ ...prev, selectedRoomId: quartosExtraidos[0].id }));
        }
        setLoadingRooms(false);
      })
      .catch(err => {
        console.error("Erro ao buscar quartos:", err);
        setLoadingRooms(false);
      });
  }, []); // Dependência vazia para não rodar desnecessariamente

  const handleChange = (key: keyof typeof formData, value: string | number) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.selectedRoomId) {
      alert("Por favor, selecione um quarto disponível.");
      return;
    }

    try {
      if (isEditing && reservaEdicao) {
        // --- MODO DE ATUALIZAÇÃO (PUT) ---
        const clientePayload = {
          nome: formData.guestName,
          email: formData.guestEmail,
          telefone: formData.guestPhone,
          endereco: formData.guestAddress
        };

        const clienteRes = await fetch(`http://127.0.0.1:8000/clientes/${reservaEdicao.cliente_id}`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(clientePayload)
        });
        if (!clienteRes.ok) throw new Error("Falha ao atualizar dados do cliente.");

        const reservaPayload = {
          data_inicio: formData.checkInDate,
          hora_checkin: formData.checkInTime,
          data_fim: formData.checkOutDate,
          hora_checkout: formData.checkOutTime,
          cama_extra: 0.0,
          status: formData.status,
          cliente_id: reservaEdicao.cliente_id, 
          quarto_ids: [Number(formData.selectedRoomId)] 
        };

        const reservaRes = await fetch(`http://127.0.0.1:8000/reservas/${reservaEdicao.id}`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(reservaPayload)
        });

        if (!reservaRes.ok) throw new Error("Falha ao atualizar a reserva na base de dados.");

        alert(`Sucesso! Reserva nº ${reservaEdicao.id} atualizada.`);
        onSuccess();

      } else {
        // --- MODO DE CRIAÇÃO (POST) ---
        const clientePayload = {
          nome: formData.guestName,
          email: formData.guestEmail,
          telefone: formData.guestPhone,
          endereco: formData.guestAddress
        };

        const clienteResponse = await fetch('http://127.0.0.1:8000/clientes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(clientePayload)
        });

        if (!clienteResponse.ok) throw new Error("Falha ao registrar o cliente no banco.");
        const clienteDados = await clienteResponse.json() as { id: number }; 
        
        const reservaPayload = {
          data_inicio: formData.checkInDate,
          hora_checkin: formData.checkInTime,
          data_fim: formData.checkOutDate,
          hora_checkout: formData.checkOutTime,
          cama_extra: 0.0,
          status: formData.status,
          cliente_id: clienteDados.id, 
          quarto_ids: [Number(formData.selectedRoomId)] 
        };

        const reservaResponse = await fetch('http://127.0.0.1:8000/reservas', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(reservaPayload)
        });

        if (!reservaResponse.ok) throw new Error("Falha ao criar a reserva.");
        const dadosFinais = await reservaResponse.json() as { id: number };

        alert(`Sucesso! Reserva nº ${dadosFinais.id} criada para ${formData.guestName}.`);
        onSuccess();
      }

    } catch (err: unknown) {
      console.error(err);
      const msg = err instanceof Error ? err.message : "Erro desconhecido";
      alert(`Erro na integração: ${msg}`);
    }
  };

  return (
    <section className="guest-form-section" style={isEditing ? { border: '2px solid #0d6efd', backgroundColor: '#fafcff' } : {}}>
      <div className="form-header">
        <h2>{isEditing ? `Editar Reserva Real #${reservaEdicao?.id}` : 'Registar Novo Hóspede'}</h2>
        <p>{isEditing ? 'Altere apenas os dados necessários e salve as modificações.' : 'Insira os dados do cliente e selecione o quarto.'}</p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="guest-form">
        
          {/* DADOS DO CLIENTE */}
          <div className="form-group full-width">
            <label>Nome do Hóspede</label>
            <input 
              type="text" 
              value={formData.guestName} 
              onChange={e => handleChange('guestName', e.target.value)} 
              placeholder="Ex: Maria Alice" 
              required 
            />
          </div>

          <div className="form-group">
            <label>E-mail</label>
            <input 
              type="email" 
              value={formData.guestEmail} 
              onChange={e => handleChange('guestEmail', e.target.value)} 
              placeholder="maria@email.com" 
              required 
            />
          </div>

          <div className="form-group">
            <label>Telefone</label>
            <input 
              type="text" 
              value={formData.guestPhone} 
              onChange={e => handleChange('guestPhone', e.target.value)} 
              placeholder="912345678" 
              required 
            />
          </div>

          <div className="form-group">
            <label>Morada / Endereço</label>
            <input 
              type="text" 
              value={formData.guestAddress} 
              onChange={e => handleChange('guestAddress', e.target.value)} 
              placeholder="Avenida Central, nº 10" 
              required 
            />
          </div>

          {/* DADOS DO QUARTO E DATAS */}
          <div className="form-group alojamento">
            <label>Alojamento / Quarto</label>
            <select 
              value={formData.selectedRoomId} 
              onChange={e => handleChange('selectedRoomId', Number(e.target.value))} 
              required 
              disabled={loadingRooms}
            >
              {loadingRooms ? (
                <option>A carregar quartos...</option>
              ) : availableRooms.length === 0 ? (
                <option>Nenhum quarto no MySQL</option>
              ) : (
                availableRooms.map((quarto) => (
                  <option key={quarto.id} value={quarto.id}>
                    Quarto {quarto.numero_quarto} - {quarto.tipo} ({quarto.preco}€)
                  </option>
                ))
              )}
            </select>
          </div>

          <div className="form-group number">
            <label>Nº de Hóspedes</label>
            <input 
              type="number" 
              min="1" 
              value={formData.guestsCount} 
              onChange={e => handleChange('guestsCount', Number(e.target.value))} 
              required 
            />
          </div>
        </div>

        <div className="date-form">
          <div className="form-group small">
            <label>Data Check-in</label>
            <input 
              type="date" 
              value={formData.checkInDate} 
              onChange={e => handleChange('checkInDate', e.target.value)} 
              required 
            />
          </div>

          <div className="form-group small">
            <label>Hora Check-in</label>
            <input 
              type="time" 
              value={formData.checkInTime} 
              onChange={e => handleChange('checkInTime', e.target.value)} 
              required 
            />
          </div>

          <div className="form-group">
            <label>Data Check-out</label>
            <input 
              type="date" 
              value={formData.checkOutDate} 
              onChange={e => handleChange('checkOutDate', e.target.value)} 
              required 
            />
          </div>

          <div className="form-group">
            <label>Hora Check-out</label>
            <input 
              type="time" 
              value={formData.checkOutTime} 
              onChange={e => handleChange('checkOutTime', e.target.value)} 
              required 
            />
          </div>
        </div>

        <div className="form-group full-width status">
          <label>Estado da Reserva</label>
          <select value={formData.status} onChange={e => handleChange('status', e.target.value)}>
            <option value="expected">Pendente (Expected)</option>
            <option value="checked-in">In-House (Checked-in)</option>
            <option value="checked-out">Check-out</option>
          </select>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="submit" className="submit-btn" disabled={loadingRooms} style={{ flex: 1 }}>
            {loadingRooms ? 'A sincronizar...' : isEditing ? 'Atualizar na Base de Dados' : 'Salvar no Sistema'}
          </button>

          {isEditing && (
            <button 
              type="button" 
              onClick={onCancelEdit} 
              className="submit-btn" 
              style={{ backgroundColor: '#6c757d', maxWidth: '200px' }}
            >
              Cancelar Edição
            </button>
          )}
        </div>
      </form>
    </section>
  );
}