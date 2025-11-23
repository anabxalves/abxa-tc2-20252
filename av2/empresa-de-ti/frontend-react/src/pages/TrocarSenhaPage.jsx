import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClienteService } from '../services/api.js';
import { validarEmail, validarSenha } from '../utils/validation.js';

import '../global.css';
import "../styles/TrocarSenha.css";

import HomeIcon from '../images/home-icon.png';
import LogoImage from '../images/logo.png';

const TrocarSenhaPage = () => {
    const navigate = useNavigate();
    const [login, setLogin] = useState('');
    const [senhaAtual, setSenhaAtual] = useState('');
    const [novaSenha, setNovaSenha] = useState('');
    const [confirmaSenha, setConfirmaSenha] = useState('');
    const [mensagem, setMensagem] = useState({ text: '', type: '' });
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensagem({ text: '', type: '' });
        setIsLoading(true);

        if (!login.trim() || !validarEmail(login)) {
            setMensagem({ text: "Erro: O login deve ser um e-mail válido.", type: 'error' });
            setIsLoading(false); return;
        }
        if (!senhaAtual.trim()) {
            setMensagem({ text: "Erro: A senha atual deve ser preenchida.", type: 'error' });
            setIsLoading(false); return;
        }
        if (!novaSenha.trim() || !confirmaSenha.trim()) {
            setMensagem({ text: "Erro: A nova senha e a confirmação devem ser preenchidas.", type: 'error' });
            setIsLoading(false); return;
        }
        if (novaSenha !== confirmaSenha) {
            setMensagem({ text: "Erro: A nova senha e a confirmação não correspondem.", type: 'error' });
            setIsLoading(false); return;
        }
        if (!validarSenha(novaSenha)) {
            setMensagem({ text: "Erro: A nova senha não atende aos requisitos de composição.", type: 'error' });
            setIsLoading(false); return;
        }

        try {
            const response = await ClienteService.trocaSenha(login, senhaAtual, novaSenha);

            if (response.data.status === 'sucesso') {
                setMensagem({ text: "Validação realizada com sucesso. Senha alterada!", type: 'success' });
                setTimeout(() => {
                    navigate('/login');
                }, 1000);
            } else {
                setMensagem({ text: response.data.message || 'Erro ao alterar a senha.', type: 'error' });
            }
        } catch (error) {
            const msg = error.response?.data?.message || 'Erro de conexão ou credenciais inválidas.';
            setMensagem({ text: msg, type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleClear = () => {
        setLogin('');
        setSenhaAtual('');
        setNovaSenha('');
        setConfirmaSenha('');
        setMensagem({ text: '', type: '' });
    };

    return (
        <div className="troca-senha-page">
            <a href="/" className="home-icon-link">
                <img src={HomeIcon} alt="Página Inicial" className="home-icon" />
            </a>
            <div className="troca-senha-container">
                <div className="header-troca-senha">
                    <img src={LogoImage} alt="Logo da Sua Empresa de TI" className="logo-troca-senha" />
                    <h2>Troca de senha de Clientes</h2>
                </div>
                <form id="trocaSenhaForm" onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="trocaSenhaLogin">E-mail (Login)</label>
                        <input
                            disabled={isLoading}
                            id="trocaSenhaLogin"
                            onChange={(e) => setLogin(e.target.value)}
                            placeholder="seuemail@exemplo.com"
                            type="email"
                            value={login}
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="senhaAtual">Senha Atual</label>
                        <input
                            disabled={isLoading}
                            id="senhaAtual"
                            onChange={(e) => setSenhaAtual(e.target.value)}
                            type="password"
                            value={senhaAtual}
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="novaSenha">Mensagem</label>
                        <input
                            disabled={isLoading}
                            id="novaSenha"
                            onChange={(e) => setNovaSenha(e.target.value)}
                            type="password"
                            value={novaSenha}
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="confirmaSenha">Confirmação de Nova Senha</label>
                        <input
                            disabled={isLoading}
                            id="confirmaSenha"
                            onChange={(e) => setConfirmaSenha(e.target.value)}
                            type="password"
                            value={confirmaSenha}
                        />
                    </div>

                    <div className="instrucoes-senha">
                        <p>A senha deve ter pelo menos 6 caracteres e conter:</p>
                        <ul>
                            <li>Um caractere numérico (0-9).</li>
                            <li>Uma letra maiúscula.</li>
                            <li>Um dos caracteres especiais permitidos: `! ? / \ | - _ + . = @ # $ % & *`</li>
                        </ul>
                        <p>
                            Os seguintes caracteres <strong>não</strong> são permitidos:
                            &#96; ̈ { } [ ] ́  &#96; ~ ^ : ; &lt; &gt; , “ ‘ &#96;
                        </p>
                    </div>

                    <div className="botoes-troca-senha">
                        <button disabled={isLoading} id="btn-troca-senha" type="submit">
                            {isLoading ? 'Processando...' : 'Trocar Senha'}
                        </button>
                        <button disabled={isLoading} id="btn-limpar" onClick={handleClear} type="button">
                            Limpar
                        </button>
                    </div>
                </form>

                {mensagem.text && (
                    <p className={`mensagem-${mensagem.type}`}>{mensagem.text}</p>
                )}
            </div>
        </div>
    );
};

export default TrocarSenhaPage;