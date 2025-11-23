import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClienteService } from '../services/api.js';
import { validarEmail } from '../utils/validation.js';
import { setLoggedInUser } from '../hooks/useAuth.js';

import '../global.css';
import "../styles/Login.css";

import HomeIcon from '../images/home-icon.png';
import LogoIcon from "../images/icon.png";

const LoginPage = () => {
    const navigate = useNavigate();
    const [login, setLogin] = useState('');
    const [senha, setSenha] = useState('');
    const [mensagem, setMensagem] = useState({ text: '', type: '' });
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setMensagem({ text: '', type: '' });
        setIsLoading(true);

        if (!login.trim() || !validarEmail(login)) {
            setMensagem({ text: "Erro: O login deve ser um e-mail válido.", type: 'in-line-error' });
            setIsLoading(false);
            return;
        }

        if (!senha.trim()) {
            setMensagem({ text: "Erro: A senha deve ser preenchida.", type: 'in-line-error' });
            setIsLoading(false);
            return;
        }

        try {
            const response = await ClienteService.autenticar(login, senha);

            if (response.data.status === 'sucesso' && response.data.authenticated) {
                setLoggedInUser(login);
                setMensagem({ text: "Validação realizada com sucesso.", type: 'success' });

                setTimeout(() => {
                    navigate('/');
                }, 1000);
            } else {
                setMensagem({ text: "Erro: Login ou senha incorretos.", type: 'error' });
            }
        } catch (error) {
            setMensagem({ text: "Erro: Login ou senha incorretos.", type: 'error' });
            console.error('Erro na autenticação:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClear = () => {
        setLogin('');
        setSenha('');
        setMensagem({ text: '', type: '' });
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <a href="/" className="home-icon-link">
                    <img src={HomeIcon} alt="Página Inicial" className="home-icon" />
                </a>

                <div className="header-login">
                    <img src={LogoIcon} alt="Logo da Sua Empresa de TI" className="logo-login" />
                    <h2>Login de Clientes</h2>
                </div>
                <form id="loginForm" onSubmit={handleLogin}>
                    <div className="input-group">
                        <label htmlFor="loginEmail">E-mail (Login)</label>
                        <input
                            type="email"
                            id="loginEmail"
                            value={login}
                            onChange={(e) => setLogin(e.target.value)}
                            placeholder="seuemail@exemplo.com"
                            disabled={isLoading}
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="loginSenha">Senha</label>
                        <input
                            type="password"
                            id="loginSenha"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>
                    <div className="botoes-login">
                        <button type="submit" id="btn-login" disabled={isLoading}>
                            {isLoading ? 'Acessando...' : 'Realizar Login'}
                        </button>
                        <button type="button" id="btn-limpar" onClick={handleClear} disabled={isLoading}>
                            Limpar
                        </button>
                    </div>
                </form>

                {mensagem.text && (
                    <p className={`mensagem-${mensagem.type}`}>{mensagem.text}</p>
                )}

                <div className="links-adicionais">
                    <a href="/trocar-senha">Esqueci minha senha</a>
                    <br />
                    <a href="/cadastro">Não tem uma conta? Cadastre-se</a>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;