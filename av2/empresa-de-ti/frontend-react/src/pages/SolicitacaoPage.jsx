import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {ClienteService, ServicoService, SolicitacaoService} from '../services/api.js';
import { getLoggedInUser } from '../hooks/useAuth.js';

import '../global.css';
import "../styles/Solicitacao.css";

import HomeIcon from '../images/home-icon.png';

const calcularDataPrevista = (dias) => {
    const hoje = new Date();
    hoje.setDate(hoje.getDate() + parseInt(dias));
    return hoje.toISOString().slice(0, 10);
};

const getContaPorEmail = (email) => {
    const contas = JSON.parse(localStorage.getItem('contas') || '[]');
    return contas.find(c => c.email === email);
};

const SolicitacaoPage = () => {
    const navigate = useNavigate();
    const loggedInUserEmail = getLoggedInUser();

    useEffect(() => {
        if (!loggedInUserEmail) {
            navigate('/login');
        }
    }, [loggedInUserEmail, navigate]);

    const [servicosDisponiveis, setServicosDisponiveis] = useState([]);
    const [solicitacoesUsuario, setSolicitacoesUsuario] = useState([]);
    const [usuarioData, setUsuarioData] = useState({ nome: 'Carregando...', email: '' });
    const [novaSolicitacaoForm, setNovaSolicitacaoForm] = useState({
        id_servico: '',
        servicoNome: '',
        preco: '',
        prazoDias: '',
        dataPrevista: '',
    });
    const [isLoading, setIsLoading] = useState(true);
    const [feedback, setFeedback] = useState({ text: '', type: '' });

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const userResponse = await ClienteService.getDados(loggedInUserEmail);

                if (userResponse.data.status === 'sucesso' && userResponse.data.data) {
                    const userFullData = userResponse.data.data;
                    setUsuarioData({ nome: userFullData.nome, email: userFullData.email });
                }

                const servicosResponse = await ServicoService.consultarTodos();
                if (servicosResponse.data.status === 'sucesso') {
                    setServicosDisponiveis(servicosResponse.data.data);
                }

                const solicitacoesResponse = await SolicitacaoService.consultarPorUsuario(loggedInUserEmail);
                if (solicitacoesResponse.data.status === 'sucesso') {
                    setSolicitacoesUsuario(solicitacoesResponse.data.data.map(req => ({
                        ...req,
                        id: req.id || Date.now() + Math.random(),
                    })));
                }
            } catch (error) {
                console.error("Erro ao carregar dados iniciais:", error);
                setFeedback({ text: 'Falha ao carregar dados. Verifique a conexão com o backend.', type: 'error' });
            } finally {
                setIsLoading(false);
            }
        };

        if (loggedInUserEmail) {
            fetchInitialData();
        }
    }, [navigate, loggedInUserEmail]);

    const handleServiceChange = (e) => {
        const servicoId = e.target.value;
        const servico = servicosDisponiveis.find(s => s.id === parseInt(servicoId));

        if (servico) {
            setNovaSolicitacaoForm({
                id_servico: servico.id,
                servicoNome: servico.nome,
                preco: `R$ ${servico.preco.toFixed(2).replace('.', ',')}`,
                prazoDias: servico.prazoDias,
                dataPrevista: calcularDataPrevista(servico.prazoDias),
            });
        } else {
            setNovaSolicitacaoForm(prev => ({ ...prev, id_servico: '', servicoNome: '', preco: '', prazoDias: '', dataPrevista: '' }));
        }
    };

    const handleIncluirSolicitacao = (e) => {
        e.preventDefault();
        setFeedback({ text: '', type: '' });

        if (!novaSolicitacaoForm.id_servico) {
            setFeedback({ text: 'Selecione um serviço para incluir.', type: 'error' });
            return;
        }

        const newRequest = {
            id: Date.now() + Math.random(), // ID local temporário
            email_cliente: loggedInUserEmail,
            id_servico: novaSolicitacaoForm.id_servico,
            dataPedido: new Date().toISOString().slice(0, 10),
            numeroSolicitacao: `#${Math.floor(Math.random() * 90000) + 10000}`,
            status: "EM ELABORAÇÃO",
            preco: novaSolicitacaoForm.preco,
            dataPrevista: novaSolicitacaoForm.dataPrevista,
            servicoNome: novaSolicitacaoForm.servicoNome
        };

        setSolicitacoesUsuario(prev => [...prev, newRequest].sort((a, b) => new Date(a.dataPedido) - new Date(b.dataPedido)));

        setNovaSolicitacaoForm(prev => ({ ...prev, id_servico: '', servicoNome: '', preco: '', prazoDias: '', dataPrevista: '' }));
        setFeedback({ text: 'Solicitação adicionada à lista de pendências. Clique em "Salvar" para confirmar.', type: 'success' });
    };

    const handleExcluirSolicitacao = (id) => {
        setSolicitacoesUsuario(prev => prev.filter(req => req.id !== id));
        setFeedback({ text: 'Solicitação removida da lista. Clique em "Salvar" para confirmar a exclusão.', type: 'info' });
    };

    const handleAtualizarSolicitacoes = async () => {
        setIsLoading(true);

        const solicitacoesParaBackend = solicitacoesUsuario.map(req => ({
            id_servico: req.id_servico,
            dataPedido: req.dataPedido,
            numeroSolicitacao: req.numeroSolicitacao,
            status: req.status,
            preco: parseFloat(req.preco.toString().replace('R$', '').replace('.', '').replace(',', '.')),
            dataPrevista: req.dataPrevista,
        }));

        try {
            const response = await SolicitacaoService.atualizarSolicitacoes(loggedInUserEmail, solicitacoesParaBackend);

            if (response.data.status === 'sucesso') {
                setFeedback({ text: 'Todas as solicitações foram salvas no sistema!', type: 'success' });
            } else {
                setFeedback({ text: response.data.message || 'Falha ao salvar as solicitações.', type: 'error' });
            }
        } catch (error) {
            setFeedback({ text: 'Erro de conexão ou ao salvar os dados.', type: 'error' });
            console.error('Erro ao salvar solicitações:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const TabelaSolicitacoes = () => (
        <table id="tabela-solicitacoes">
            <thead>
            <tr>
                <th>Data do Pedido</th>
                <th>Nº da Solicitação</th>
                <th>Serviço de TI</th>
                <th>Status</th>
                <th>Preço</th>
                <th>Data Prevista</th>
                <th>Ações</th>
            </tr>
            </thead>
            <tbody>
            {solicitacoesUsuario.length === 0 ? (
                <tr><td colSpan="7" style={{ textAlign: 'center', fontStyle: 'italic' }}>Nenhuma solicitação encontrada.</td></tr>
            ) : (
                solicitacoesUsuario.map(solicitacao => (
                    <tr key={solicitacao.id}>
                        <td>{solicitacao.dataPedido}</td>
                        <td>{solicitacao.numeroSolicitacao}</td>
                        <td>{solicitacao.servicoNome}</td>
                        <td>{solicitacao.status}</td>
                        <td>{solicitacao.preco}</td>
                        <td>{solicitacao.dataPrevista}</td>
                        <td className="botoes-tabela">
                            <button onClick={() => handleExcluirSolicitacao(solicitacao.id)} disabled={isLoading}>Excluir</button>
                        </td>
                    </tr>
                ))
            )}
            </tbody>
        </table>
    );

    if (isLoading && !usuarioData.email) {
        return <div style={{ textAlign: 'center', padding: '50px' }}>Carregando dados...</div>;
    }

    return (
        <div className="solicitacao-page">
            <div className="solicitacao-container">
                <a href="/" className="home-icon-link">
                    <img src={HomeIcon} alt="Página Inicial" className="home-icon" />
                </a>

                <div className="header-solicitacao">
                    <h2>Minhas Solicitações de Serviço</h2>
                </div>

                {feedback.text && (
                    <p className={`mensagem-${feedback.type}`}>{feedback.text}</p>
                )}

                <section className="section-cliente">
                    <h3>Dados do Cliente</h3>
                    <p><strong>Nome:</strong> <span id="nome-usuario">{usuarioData.nome}</span></p>
                    <p><strong>Login:</strong> <span id="login-usuario">{usuarioData.email}</span></p>
                    <button
                        onClick={handleAtualizarSolicitacoes}
                        disabled={isLoading}
                        style={{ marginTop: '15px', padding: '10px 20px', backgroundColor: '#003366', color: 'white' }}
                    >
                        {isLoading ? 'Salvando...' : 'Salvar Todas as Solicitações'}
                    </button>
                    <a href="/cadastro-servico" style={{ marginLeft: '20px', color: '#007bff' }}>
                        Cadastrar Novo Serviço
                    </a>
                </section>

                <section className="section-solicitacoes">
                    <h3>Histórico de Solicitações</h3>
                    <TabelaSolicitacoes />
                </section>

                <section className="section-nova-solicitacao">
                    <h3>Nova Solicitação</h3>
                    <form id="nova-solicitacao-form" className="nova-solicitacao-form" onSubmit={handleIncluirSolicitacao}>
                        <div className="input-group">
                            <label htmlFor="servico-ti">Serviço de TI</label>
                            <select
                                id="servico-ti"
                                name="servico-ti"
                                onChange={handleServiceChange}
                                value={novaSolicitacaoForm.id_servico}
                                disabled={isLoading}
                            >
                                <option value="">Selecione um serviço</option>
                                {servicosDisponiveis.map(s => (
                                    <option key={s.id} value={s.id}>
                                        {s.nome}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="info-group">
                            <div>
                                <label>Preço</label>
                                <span id="preco-servico">{novaSolicitacaoForm.preco}</span>
                            </div>
                            <div>
                                <label>Prazo de Atendimento</label>
                                <span id="prazo-atendimento">{novaSolicitacaoForm.prazoDias ? `${novaSolicitacaoForm.prazoDias} dias úteis` : ''}</span>
                            </div>
                        </div>

                        <div className="info-group">
                            <div>
                                <label>Data Prevista de Atendimento</label>
                                <span id="data-prevista">{novaSolicitacaoForm.dataPrevista}</span>
                            </div>
                            <div>
                                <label>Status</label>
                                <span id="status-solicitacao">EM ELABORAÇÃO</span>
                            </div>
                        </div>
                        <button type="submit" id="btn-incluir-solicitacao" disabled={isLoading || !novaSolicitacaoForm.id_servico}>
                            Incluir Solicitação na Lista de Pendências
                        </button>
                    </form>
                </section>
            </div>
        </div>
    );
};

export default SolicitacaoPage;