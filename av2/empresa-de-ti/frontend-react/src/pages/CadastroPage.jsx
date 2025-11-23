import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClienteService } from '../services/api';
import {
    validarEmail,
    validarSenha,
    validarCPF,
    calcularIdade,
    validarTelefone
} from '../utils/validation.js';

import '../global.css';
import "../styles/Cadastro.css";

import HomeIcon from '../images/home-icon.png';
import LogoIcon from '../images/icon.png';

const INITIAL_FORM_STATE = {
    email: '',
    senha: '',
    confirmaSenha: '',
    nome: '',
    cpf: '',
    dataNascimento: '',
    telefone: '',
    estadoCivil: 'solteiro',
    escolaridade: '2o grau completo',
};

const CadastroPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState(INITIAL_FORM_STATE);
    const [mensagem, setMensagem] = useState({ text: '', type: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const aplicarMascaraCPF = (value) => {
        let cpf = value.replace(/\D/g, "");
        cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
        cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
        cpf = cpf.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
        return cpf;
    };

    const validateForm = useCallback(() => {
        const newErrors = {};
        let isValid = true;

        if (!formData.email || !validarEmail(formData.email)) {
            newErrors.email = 'E-mail inválido ou obrigatório.';
            isValid = false;
        }
        if (!formData.senha || !formData.confirmaSenha) {
            newErrors.senha = 'Senha e confirmação são obrigatórias.';
            isValid = false;
        } else if (formData.senha !== formData.confirmaSenha) {
            newErrors.confirmaSenha = 'Senhas não conferem.';
            isValid = false;
        } else if (!validarSenha(formData.senha)) {
            newErrors.senha = 'A senha não atende aos requisitos de composição.';
            isValid = false;
        }

        const palavrasNome = formData.nome.trim().split(/\s+/);
        if (!formData.nome) {
            newErrors.nome = 'O nome é obrigatório.';
            isValid = false;
        } else if (palavrasNome.length < 2 || palavrasNome[0].length < 2) {
            newErrors.nome = 'O nome deve ter pelo menos duas palavras e a primeira 2 caracteres.';
            isValid = false;
        } else if (/[^a-zA-Z\s]/.test(formData.nome)) {
            newErrors.nome = 'Nome não pode conter caracteres especiais.';
            isValid = false;
        }

        if (!formData.cpf || !validarCPF(formData.cpf)) {
            newErrors.cpf = 'CPF inválido ou obrigatório.';
            isValid = false;
        }

        if (!formData.dataNascimento) {
            newErrors.dataNascimento = 'Data de nascimento é obrigatória.';
            isValid = false;
        } else if (calcularIdade(formData.dataNascimento) < 18) {
            newErrors.dataNascimento = 'O cliente deve ser maior de 18 anos.';
            isValid = false;
        }

        if (!validarTelefone(formData.telefone)) {
            newErrors.telefone = 'Formato de telefone inválido.';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    }, [formData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensagem({ text: '', type: '' });

        if (!validateForm()) {
            setMensagem({ text: "Corrija os erros no formulário.", type: 'error' });
            return;
        }

        setIsLoading(true);

        try {
            const dadosCadastro = {
                ...formData,
                cpf: formData.cpf.replace(/[^\d]+/g, ''),
            };

            const response = await ClienteService.cadastrar(dadosCadastro);

            if (response.data.status === 'sucesso') {
                setMensagem({ text: "Cadastro realizado com sucesso!", type: 'success' });
                handleClear();
            } else {
                setMensagem({ text: response.data.message || 'Erro ao cadastrar cliente.', type: 'error' });
            }
        } catch (error) {
            const msg = error.response?.data?.message || 'Erro de conexão com o servidor.';
            setMensagem({ text: msg, type: 'error' });
            if (msg.includes('já cadastrado')) {
                setErrors(prev => ({ ...prev, email: msg }));
            }
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
        <div className="cadastro-page">
            <div className="cadastro-container">
                <a href="/" className="home-icon-link">
                    <img src={HomeIcon} alt="Página Inicial" className="home-icon" />
                </a>

                <div className="header-cadastro">
                    <img src={LogoIcon} alt="Logo da Sua Empresa de TI" className="logo-cadastro" />
                    <h2>Cadastro de clientes</h2>
                </div>

                <form id="cadastroForm" onSubmit={handleSubmit}>
                    {mensagem.text && (
                        <p className={`mensagem-${mensagem.type}`}>{mensagem.text}</p>
                    )}

                    <div className="input-group">
                        <label htmlFor="cadastroEmail">E-mail (Login)</label>
                        <input
                            type="email"
                            id="cadastroEmail"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            disabled={isLoading}
                        />
                        {errors.email && <p className="in-line-in-line-error">{errors.email}</p>}
                    </div>

                    <div className="input-group">
                        <label htmlFor="cadastroSenha">Senha</label>
                        <input
                            type="password"
                            id="cadastroSenha"
                            name="senha"
                            value={formData.senha}
                            onChange={handleInputChange}
                            disabled={isLoading}
                        />
                        {errors.senha && <p className="in-line-error">{errors.senha}</p>}
                    </div>

                    <div className="input-group">
                        <label htmlFor="confirmaSenha">Confirmação de Senha</label>
                        <input
                            type="password"
                            id="confirmaSenha"
                            name="confirmaSenha"
                            value={formData.confirmaSenha}
                            onChange={handleInputChange}
                            disabled={isLoading}
                        />
                        {errors.confirmaSenha && <p className="in-line-error">{errors.confirmaSenha}</p>}
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

                    <div className="input-group">
                        <label htmlFor="cadastroNome">Nome</label>
                        <input
                            type="text"
                            id="cadastroNome"
                            name="nome"
                            value={formData.nome}
                            onChange={handleInputChange}
                            disabled={isLoading}
                        />
                        {errors.nome && <p className="in-line-error">{errors.nome}</p>}
                    </div>

                    <div className="input-group">
                        <label htmlFor="cadastroCpf">CPF</label>
                        <input
                            type="text"
                            id="cadastroCpf"
                            name="cpf"
                            value={aplicarMascaraCPF(formData.cpf)}
                            onChange={handleInputChange}
                            maxLength="14"
                            disabled={isLoading}
                        />
                        {errors.cpf && <p className="in-line-error">{errors.cpf}</p>}
                    </div>

                    <div className="input-group">
                        <label htmlFor="dataNascimento">Data de Nascimento</label>
                        <input
                            type="date"
                            id="dataNascimento"
                            name="dataNascimento"
                            value={formData.dataNascimento}
                            onChange={handleInputChange}
                            disabled={isLoading}
                        />
                        {errors.dataNascimento && <p className="in-line-error">{errors.dataNascimento}</p>}
                    </div>

                    <div className="input-group">
                        <label htmlFor="telefone">Telefone Celular/Zap (opcional)</label>
                        <input
                            type="text"
                            id="telefone"
                            name="telefone"
                            value={formData.telefone}
                            onChange={handleInputChange}
                            placeholder="(XX) XXXXX-XXXX"
                            disabled={isLoading}
                        />
                        {errors.telefone && <p className="in-line-error">{errors.telefone}</p>}
                    </div>

                    <div className="radio-group">
                        <p><strong>Estado Civil:</strong></p>
                        {['solteiro', 'casado', 'divorciado', 'viuvo'].map(status => (
                            <label key={status}>
                                <input
                                    type="radio"
                                    name="estadoCivil"
                                    value={status}
                                    checked={formData.estadoCivil === status}
                                    onChange={handleInputChange}
                                    disabled={isLoading}
                                /> {status.charAt(0).toUpperCase() + status.slice(1)}(a)
                            </label>
                        ))}
                    </div>

                    <div className="input-group">
                        <label htmlFor="escolaridade">Escolaridade</label>
                        <select
                            id="escolaridade"
                            name="escolaridade"
                            value={formData.escolaridade}
                            onChange={handleInputChange}
                            disabled={isLoading}
                        >
                            <option value="1o grau incompleto">1º grau incompleto</option>
                            <option value="1o grau completo">1º grau completo</option>
                            <option value="2o grau completo">2º grau completo</option>
                            <option value="nivel superior">Nível superior</option>
                            <option value="pos-graduado">Pós-graduado</option>
                        </select>
                    </div>

                    <div className="botoes-cadastro">
                        <button type="submit" id="btn-incluir" disabled={isLoading}>
                            {isLoading ? 'Incluindo...' : 'Incluir'}
                        </button>
                        <button type="button" id="btn-limpar" onClick={handleClear} disabled={isLoading}>
                            Limpar
                        </button>
                        <button type="button" id="btn-voltar" onClick={handleGoBack} disabled={isLoading}>
                            Voltar
                        </button>
                    </div>
                </form>

                {errors.email && errors.email.includes('já cadastrado') && (
                    <div className="links-adicionais" id="esqueceuSenhaLink" style={{ marginTop: '1.5rem' }}>
                        <button onClick={() => navigate('/trocar-senha')} className="btn-secondary" disabled={isLoading}>
                            Esqueceu sua senha?
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CadastroPage;