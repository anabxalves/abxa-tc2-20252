import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ServicoService } from '../services/api';

import '../global.css';
import "../styles/Cadastro.css";

import HomeIcon from '../images/home-icon.png';
import LogoImage from '../images/logo.png';

const INITIAL_FORM_STATE = {
    nome: '',
    preco: '',
    prazoDias: '',
};

const CadastroServicoPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState(INITIAL_FORM_STATE);
    const [mensagem, setMensagem] = useState({ text: '', type: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        const newErrors = {};
        let isValid = true;

        if (!formData.nome.trim()) {
            newErrors.nome = 'O nome do serviço é obrigatório.';
            isValid = false;
        }

        const precoNum = parseFloat(formData.preco);
        if (!formData.preco || isNaN(precoNum) || precoNum <= 0) {
            newErrors.preco = 'O preço deve ser um valor numérico positivo.';
            isValid = false;
        }

        const prazoNum = parseInt(formData.prazoDias);
        if (!formData.prazoDias || isNaN(prazoNum) || prazoNum <= 0) {
            newErrors.prazoDias = 'O prazo deve ser um número inteiro positivo.';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensagem({ text: '', type: '' });

        if (!validateForm()) {
            setMensagem({ text: "Corrija os erros no formulário antes de enviar.", type: 'error' });
            return;
        }

        setIsLoading(true);

        try {
            const dadosServico = {
                nome: formData.nome,
                preco: parseFloat(formData.preco),
                prazoDias: parseInt(formData.prazoDias),
            };

            const response = await ServicoService.cadastrar(dadosServico);

            if (response.data.status === 'sucesso') {
                setMensagem({ text: "Serviço de TI cadastrado com sucesso!", type: 'success' });
                handleClear();
            } else {
                setMensagem({ text: response.data.message || 'Erro ao cadastrar serviço.', type: 'error' });
            }
        } catch (error) {
            const msg = error.response?.data?.message || 'Erro de conexão com o servidor. Verifique o backend.';
            setMensagem({ text: msg, type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleClear = () => {
        setFormData(INITIAL_FORM_STATE);
        setErrors({});
        setMensagem({ text: '', type: '' });
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    return (
        <div className="cadastro-servico-page">
            <a href="/" className="home-icon-link">
                <img src={HomeIcon} alt="Página Inicial" className="home-icon" />
            </a>
            <div className="cadastro-container">
                <div className="header-cadastro">
                    <img src={LogoImage} alt="Logo da Sua Empresa de TI" className="logo-cadastro" />
                    <h2>Cadastro de Serviço de TI</h2>
                </div>

                <form id="cadastroServicoForm" onSubmit={handleSubmit}>
                    {mensagem.text && (
                        <p className={`mensagem-${mensagem.type}`}>{mensagem.text}</p>
                    )}

                    <div className="input-group">
                        <label htmlFor="nome">Nome do Serviço</label>
                        <input
                            type="text"
                            id="nome"
                            name="nome"
                            value={formData.nome}
                            onChange={handleInputChange}
                            disabled={isLoading}
                        />
                        {errors.nome && <p className="error-text">{errors.nome}</p>}
                    </div>

                    <div className="input-group">
                        <label htmlFor="preco">Preço (R$)</label>
                        <input
                            type="number"
                            step="0.01"
                            id="preco"
                            name="preco"
                            value={formData.preco}
                            onChange={handleInputChange}
                            disabled={isLoading}
                        />
                        {errors.preco && <p className="error-text">{errors.preco}</p>}
                    </div>

                    <div className="input-group">
                        <label htmlFor="prazoDias">Prazo de Atendimento (em dias)</label>
                        <input
                            type="number"
                            min="1"
                            id="prazoDias"
                            name="prazoDias"
                            value={formData.prazoDias}
                            onChange={handleInputChange}
                            disabled={isLoading}
                        />
                        {errors.prazoDias && <p className="error-text">{errors.prazoDias}</p>}
                    </div>

                    <div className="botoes-cadastro">
                        <button type="submit" id="btn-incluir" disabled={isLoading}>
                            {isLoading ? 'Cadastrando...' : 'Cadastrar Serviço'}
                        </button>
                        <button type="button" id="btn-limpar" onClick={handleClear} disabled={isLoading}>
                            Limpar
                        </button>
                        <button type="button" id="btn-voltar" onClick={handleGoBack} disabled={isLoading}>
                            Voltar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CadastroServicoPage;