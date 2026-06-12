
import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo/logo-capitao-alojamento.png';
import './auth-form.css';
import * as Icon from 'react-bootstrap-icons';

function FormRegister() {
    const navigate = useNavigate();
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [tipo, setTipo] = useState('hospede'); // Valor padrão do banco
    const [carregando, setCarregando] = useState(false);

    const handleRegister = async (e: FormEvent) => {
        e.preventDefault();
        setCarregando(false);

        try {
        const payload = { nome, email, password, tipo };

        const response = await fetch('http://127.0.0.1:8000/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        const dados = await response.json();

        if (!response.ok) {
            throw new Error(dados.detail || 'Ocorreu um erro ao registar a conta.');
        }

        alert('Conta criada com sucesso! Pode efetuar o login.');
        navigate('/login');

        } catch (err: unknown) {
            console.error(err);
            const msg = err instanceof Error ? err.message : 'Erro ao ligar ao servidor.';
            alert(msg);
        } finally {
            setCarregando(false);
        }
    };
    return(
        <div className="register-container">
            <div className="register-form">
                <div className="logo-form">
                    <img src={logo} alt="Logo Capitão Alojamento" className="logo-img-form" />
                    <div className="company-name-form">
                        <h1>Capitão Vili</h1>
                        <h3>Alojamento Local</h3>
                    </div>
                </div>

                <p>Crie sua conta</p>
                <br />

                <form onSubmit={handleRegister}>
                    <div className="form-group">
                        <div className="name-input">
                            <Icon.Person className="name-icon" />
                            <input type="text" id="name" name="name" value={nome} required placeholder="Nome" onChange={e => setNome(e.target.value)} />
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="email-input">
                            <Icon.Envelope className="email-icon" />
                            <input type="email" id="email" name="email" value={email} required placeholder="Email" onChange={e => setEmail(e.target.value)}/>
                        </div>
                    </div>

                    <div className="form-group">
                        <div className="password-input">
                            <Icon.Lock className="password-icon" />
                            <input type="password" id="password" name="password" placeholder="Password" required value={password} onChange={e => setPassword(e.target.value)} />
                        </div>
                    </div>

                    <div className="form-group select">
                        <label>Nível de Acesso no Sistema</label>
                        <select value={tipo} onChange={e => setTipo(e.target.value)} required>
                            <option value="hospede">Visitante / Hóspede</option>
                            <option value="admin">Administrador (Acesso ao Painel)</option>
                        </select>
                    </div>

                    {/* <button type="submit" className="submit-login">Login</button> */}
                    <button type="submit" className="submit-login" disabled={carregando}>
                        {carregando ? 'A processar...' : 'Concluir Registo'}
                    </button>
                </form>

                <div className="account-create">
                    <p>Já tem conta? <a href="/login">Faça login</a></p>
                </div>
            </div>
        </div>
    );
}

export default FormRegister;