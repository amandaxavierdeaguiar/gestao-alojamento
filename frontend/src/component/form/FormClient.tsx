import { useState } from 'react';
import type { FormEvent } from 'react';
import '../form/guest-form.css';

interface ClienteDoBanco {
  id: number;
  nome: string;
  email: string;
  telefone?: string;
  endereco?: string;
}

interface ClienteFormProps {
  clienteEdicao: ClienteDoBanco | null;
  onCancelEdit: () => void;
  onSuccess: () => void;
}

export default function FormClient({ clienteEdicao, onCancelEdit, onSuccess }: ClienteFormProps) {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    endereco: '',
  });

  // ESTADO DE CONTROLO DE RENDERIZAÇÃO (Evita loops infinitos e renders em cascata)
  const [prevClienteId, setPrevClienteId] = useState<number | null>(null);

  const token = localStorage.getItem('@Hotel:token');
  const isEditing = !!clienteEdicao;

  // Sincronização em tempo de renderização (Modo Edição vs Criação)
  if (clienteEdicao && clienteEdicao.id !== prevClienteId) {
    setPrevClienteId(clienteEdicao.id);
    setFormData({
      nome: clienteEdicao.nome || '',
      email: clienteEdicao.email || '',
      telefone: clienteEdicao.telefone || '',
      endereco: clienteEdicao.endereco || '',
    });
  } else if (!clienteEdicao && prevClienteId !== null) {
    setPrevClienteId(null);
    setFormData({
      nome: '',
      email: '',
      telefone: '',
      endereco: '',
    });
  }

  const handleChange = (key: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const payload = {
      nome: formData.nome,
      email: formData.email,
      telefone: formData.telefone || null,
      endereco: formData.endereco || null,
    };

    try {
      if (isEditing && clienteEdicao) {
        // --- MODO DE ATUALIZAÇÃO (PUT) ---
        const res = await fetch(`http://127.0.0.1:8000/clientes/${clienteEdicao.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.detail || "Falha ao atualizar o cliente.");
        }

        alert(`Sucesso! Cliente #${clienteEdicao.id} atualizado com sucesso.`);
        onSuccess();
      } else {
        // --- MODO DE CRIAÇÃO (POST) ---
        const res = await fetch('http://127.0.0.1:8000/clientes', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.detail || "Falha ao registar o cliente.");
        }

        const dadosCriados = await res.json() as ClienteDoBanco;
        alert(`Sucesso! Hóspede "${dadosCriados.nome}" registado com o ID nº ${dadosCriados.id}.`);
        onSuccess();
      }
    } catch (err: unknown) {
      console.error(err);
      const msg = err instanceof Error ? err.message : "Erro desconhecido";
      alert(`Erro na integração: ${msg}`);
    }
  };

  return (
    <section className="guest-form-section" style={isEditing ? { border: '2px solid #ffc107', backgroundColor: '#fffdf5' } : {}}>
      <div className="form-header">
        <h2>{isEditing ? `Editar Cliente #${clienteEdicao?.id}` : 'Registar Novo Hóspede'}</h2>
        <p>
          {isEditing 
            ? 'Modifique os dados cadastrais do cliente selecionado.' 
            : 'Insira os dados cadastrais do novo cliente para o sistema MySQL.'}
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="guest-form">
          <div className="form-group full-width">
            <label>Nome Completo</label>
            <input
              type="text"
              value={formData.nome}
              onChange={e => handleChange('nome', e.target.value)}
              placeholder="Ex: João Silva Santos"
              required
            />
          </div>

          <div className="form-group">
            <label>E-mail</label>
            <input
              type="email"
              value={formData.email}
              onChange={e => handleChange('email', e.target.value)}
              placeholder="Ex: joao@email.com"
              required
            />
          </div>

          <div className="form-group">
            <label>Telefone / Telemóvel</label>
            <input
              type="text"
              value={formData.telefone}
              onChange={e => handleChange('telefone', e.target.value)}
              placeholder="Ex: +351 912 345 678"
            />
          </div>

          <div className="form-group full-width">
            <label>Endereço / Localidade</label>
            <input
              type="text"
              value={formData.endereco}
              onChange={e => handleChange('endereco', e.target.value)}
              placeholder="Ex: Rua das Flores, nº 12, Porto"
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <button 
            type="submit" 
            className="submit-btn" 
            style={{ flex: 1, backgroundColor: isEditing ? '#ffc107' : '', color: isEditing ? '#000' : '' }}
          >
            {isEditing ? 'Atualizar Dados do Cliente' : 'Salvar Hóspede no Sistema'}
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