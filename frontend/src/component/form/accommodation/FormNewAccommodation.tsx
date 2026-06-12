import { useState } from 'react';
import type { FormEvent } from 'react';
import '../guest-form.css';

interface AlojamentoDoBanco {
  id: number;
  nome_alojamento?: string;
  descricao?: string;
  endereco?: string;
  pais?: string;
}

interface AlojamentoFormProps {
  alojamentoEdicao: AlojamentoDoBanco | null;
  onCancelEdit: () => void;
  onSuccess: () => void;
}

export default function FormNewAccommodation({ alojamentoEdicao, onCancelEdit, onSuccess }: AlojamentoFormProps) {
  const [formData, setFormData] = useState({
    accommodationName: '',
    accommodationDescricao: '',
    accommodationEndereco: '',
    accommodationPais: '',
  });

  // ESTADO DE CONTROLO DE RENDERIZAÇÃO (Sincronização sem useEffect)
  const [prevAccommodationId, setPrevAccommodationId] = useState<number | null>(null);

  const token = localStorage.getItem('@Hotel:token');
  const isEditing = !!alojamentoEdicao;

  // Sincronização em tempo de renderização (Evita renders em cascata e agrada ao linter)
  if (alojamentoEdicao && alojamentoEdicao.id !== prevAccommodationId) {
    setPrevAccommodationId(alojamentoEdicao.id);
    setFormData({
      accommodationName: alojamentoEdicao.nome_alojamento || '',
      accommodationDescricao: alojamentoEdicao.descricao || '',
      accommodationEndereco: alojamentoEdicao.endereco || '',
      accommodationPais: alojamentoEdicao.pais || '',
    });
  } else if (!alojamentoEdicao && prevAccommodationId !== null) {
    setPrevAccommodationId(null);
    setFormData({
      accommodationName: '',
      accommodationDescricao: '',
      accommodationEndereco: '',
      accommodationPais: '',
    });
  }

  const handleChange = (key: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const payload = {
      nome_alojamento: formData.accommodationName,
      descricao: formData.accommodationDescricao,
      endereco: formData.accommodationEndereco,
      pais: formData.accommodationPais
    };

    try {
      if (isEditing && alojamentoEdicao) {
        // --- MODO DE ATUALIZAÇÃO (PUT) ---
        const res = await fetch(`http://127.0.0.1:8000/alojamentos/${alojamentoEdicao.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
          },
          body: JSON.stringify(payload)
        });

        if (!res.ok) throw new Error("Falha ao atualizar o alojamento no servidor.");

        alert(`Sucesso! Alojamento #${alojamentoEdicao.id} atualizado.`);
        onSuccess();
      } else {
        // --- MODO DE CRIAÇÃO (POST) ---
        const res = await fetch('http://127.0.0.1:8000/alojamentos', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });

        if (!res.ok) throw new Error("Falha ao registar o novo alojamento.");
        const dadosCriados = await res.json() as { id: number, nome_alojamento: string };

        alert(`Sucesso! Alojamento "${dadosCriados.nome_alojamento}" criado com o ID nº ${dadosCriados.id}.`);
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
        <h2>{isEditing ? `Editar Alojamento #${alojamentoEdicao?.id}` : 'Registar Novo Alojamento'}</h2>
        <p>{isEditing ? 'Modifique os detalhes estruturais do alojamento.' : 'Insira as informações básicas para expandir a sua rede de hotéis/quartos.'}</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="guest-form">
          <div className="form-group full-width">
            <label>Nome do Alojamento</label>
            <input
              type="text"
              value={formData.accommodationName}
              onChange={e => handleChange('accommodationName', e.target.value)}
              placeholder="Ex: Hotel Alfa Premium"
              required
            />
          </div>

          <div className="form-group full-width">
            <label>Descrição</label>
            <input
              type="text"
              value={formData.accommodationDescricao}
              onChange={e => handleChange('accommodationDescricao', e.target.value)}
              placeholder="Ex: Localizado no centro histórico com vista panorâmica."
              required
            />
          </div>

          <div className="form-group">
            <label>Endereço / Localização</label>
            <input
              type="text"
              value={formData.accommodationEndereco}
              onChange={e => handleChange('accommodationEndereco', e.target.value)}
              placeholder="Ex: Avenida dos Aliados, nº 45"
              required
            />
          </div>

          <div className="form-group">
            <label>País</label>
            <input
              type="text"
              value={formData.accommodationPais}
              onChange={e => handleChange('accommodationPais', e.target.value)}
              placeholder="Ex: Portugal"
              required
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <button type="submit" className="submit-btn" style={{ flex: 1 }}>
            {isEditing ? 'Atualizar na Base de Dados' : 'Salvar no Sistema'}
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