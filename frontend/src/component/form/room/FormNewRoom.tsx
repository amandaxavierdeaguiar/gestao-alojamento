import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import '../guest-form.css';

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

interface QuartoFormProps {
  quartoEdicao: QuartoDoBanco | null;
  onCancelEdit: () => void;
  onSuccess: () => void;
}

export default function FormNewRoom({ quartoEdicao, onCancelEdit, onSuccess }: QuartoFormProps) {
  const [formData, setFormData] = useState({
    numeroQuarto: '',
    tipo: '',
    preco: '',
    alojamentoId: '',
  });

  const [alojamentos, setAlojamentos] = useState<AlojamentoOpcao[]>([]);
  const [loadingAlojamentos, setLoadingAlojamentos] = useState(true);
  const [prevQuartoId, setPrevQuartoId] = useState<number | null>(null);

  const token = localStorage.getItem('@Hotel:token');
  const isEditing = !!quartoEdicao;

  // Carrega a lista de alojamentos para preencher o <select>
  useEffect(() => {
    fetch('http://127.0.0.1:8000/alojamentos', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error("Erro ao listar os alojamentos.");
        return res.json();
      })
      .then((data: AlojamentoOpcao[]) => {
        setAlojamentos(data);
        setLoadingAlojamentos(false);
      })
      .catch(err => {
        console.error(err);
        setLoadingAlojamentos(false);
      });
  }, [token]);

  // Sincronização em tempo de renderização (Modo Edição vs Criação)
  if (quartoEdicao && quartoEdicao.id !== prevQuartoId) {
    setPrevQuartoId(quartoEdicao.id);
    setFormData({
      numeroQuarto: quartoEdicao.numero_quarto,
      tipo: quartoEdicao.tipo,
      preco: quartoEdicao.preco.toString(),
      alojamentoId: quartoEdicao.alojamento_id.toString(),
    });
  } else if (!quartoEdicao && prevQuartoId !== null) {
    setPrevQuartoId(null);
    setFormData({
      numeroQuarto: '',
      tipo: '',
      preco: '',
      alojamentoId: '',
    });
  }

  const handleChange = (key: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Transforma os dados para o formato numérico correto exigido pelo Pydantic/FastAPI
    const payload = {
      numero_quarto: formData.numeroQuarto,
      tipo: formData.tipo,
      preco: parseFloat(formData.preco),
      alojamento_id: parseInt(formData.alojamentoId, 10),
    };

    try {
      if (isEditing && quartoEdicao) {
        // --- MODO DE ATUALIZAÇÃO (PUT) ---
        const res = await fetch(`http://127.0.0.1:8000/quartos/${quartoEdicao.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.detail || "Falha ao atualizar o quarto.");
        }

        alert(`Sucesso! Quarto #${quartoEdicao.id} atualizado.`);
        onSuccess();
      } else {
        // --- MODO DE CRIAÇÃO (POST) ---
        const res = await fetch('http://127.0.0.1:8000/quartos', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.detail || "Falha ao criar o quarto.");
        }

        const dadosCriados = await res.json() as QuartoDoBanco;
        alert(`Sucesso! Quarto nº ${dadosCriados.numero_quarto} adicionado.`);
        onSuccess();
      }
    } catch (err: unknown) {
      console.error(err);
      const msg = err instanceof Error ? err.message : "Erro desconhecido";
      alert(`Erro na integração: ${msg}`);
    }
  };

  return (
    <section className="guest-form-section" style={isEditing ? { border: '2px solid #20c997', backgroundColor: '#f4fbf9' } : {}}>
      <div className="form-header">
        <h2>{isEditing ? `Editar Quarto #${quartoEdicao?.id}` : 'Registar Novo Quarto'}</h2>
        <p>
          {isEditing 
            ? 'Atualize as especificações e o alojamento vinculado a este quarto.' 
            : 'Defina o número, tipologia, preço e associe o quarto a um alojamento ativo.'}
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="guest-form">
          
          {/* Menu Dropdown de Seleção de Alojamento */}
          <div className="form-group full-width">
            <label>Alojamento Relacionado</label>
            <select
              value={formData.alojamentoId}
              onChange={e => handleChange('alojamentoId', e.target.value)}
              required
              disabled={loadingAlojamentos}
            >
              <option value="">-- Selecione o Hotel / Complexo --</option>
              {alojamentos.map(aloj => (
                <option key={aloj.id} value={aloj.id}>
                  {aloj.nome_alojamento} (ID: #{aloj.id})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Número / Identificação do Quarto</label>
            <input
              type="text"
              value={formData.numeroQuarto}
              onChange={e => handleChange('numeroQuarto', e.target.value)}
              placeholder="Ex: Room 302, Suite Master"
              required
            />
          </div>

          <div className="form-group">
            <label>Tipo de Quarto</label>
            <input
              type="text"
              value={formData.tipo}
              onChange={e => handleChange('tipo', e.target.value)}
              placeholder="Ex: Casal Deluxe, Twin Single"
              required
            />
          </div>

          <div className="form-group full-width">
            <label>Preço por Noite (€)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.preco}
              onChange={e => handleChange('preco', e.target.value)}
              placeholder="Ex: 120.00"
              required
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <button 
            type="submit" 
            className="submit-btn" 
            style={{ flex: 1, backgroundColor: isEditing ? '#20c997' : '', color: isEditing ? '#fff' : '' }}
          >
            {isEditing ? 'Guardar Alterações do Quarto' : 'Gravar Quarto no Sistema'}
          </button>

          <button
            type="button"
            onClick={onCancelEdit}
            className="submit-btn"
            style={{ backgroundColor: '#6c757d', maxWidth: '200px' }}
          >
            Cancelar
          </button>
        </div>
      </form>
    </section>
  );
}