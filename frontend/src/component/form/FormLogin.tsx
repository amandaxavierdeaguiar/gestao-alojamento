import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo/logo-capitao-alojamento.png';
import './auth-form.css';
import * as Icon from 'react-bootstrap-icons';

interface LoginResponse {
  token: string;
  token_type: string;
  usuario: {
    id: number;
    nome: string;
    email: string;
    tipo: string;
  };
}

function FormLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setCarregando(false);

    try {
      const response = await fetch('http://127.0.0.1:8000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const dados = await response.json();

      if (!response.ok) {
        throw new Error(dados.detail || 'Falha ao efetuar o login.');
      }

      const dadosSucesso = dados as LoginResponse;

      if (dadosSucesso.usuario.tipo !== 'admin') {
        alert('Acesso negado. Apenas administradores podem aceder a este painel.');
        return;
      }

      // Salva as credenciais recebidas do FastAPI no navegador
      localStorage.setItem('@Hotel:token', dadosSucesso.token);
      localStorage.setItem('@Hotel:user', JSON.stringify(dadosSucesso.usuario));

      // Redireciona para o painel principal
      navigate('/dashboard');

    } catch (err: unknown) {
      console.error(err);
      const msg = err instanceof Error ? err.message : 'Erro na ligação com o servidor.';
      alert(msg);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <div className="logo-form">
          <img src={logo} alt="Logo Capitão Alojamento" className="logo-img-form" />
          <div className="company-name-form">
            <h1>Capitão Vili</h1>
            <h3>Alojamento Local</h3>
          </div>
        </div>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <div className="username-input">
              <Icon.Envelope className="username-icon" />
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                required 
                placeholder="E-mail de Acesso" 
              />
            </div>
          </div>
          
          <div className="form-group">
            <div className="password-input">
              <Icon.Lock className="password-icon" />
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Palavra-passe" 
                required 
              />
            </div>
          </div>

          <button type="submit" className="submit-login" disabled={carregando}>
            {carregando ? 'A autenticar...' : 'Entrar no Sistema'}
          </button>
        </form>

        <div className="account-create">
          <p>Não tem conta? <a href="/register">Crie aqui</a></p>
        </div>
      </div>
    </div>     
  );
}

export default FormLogin;