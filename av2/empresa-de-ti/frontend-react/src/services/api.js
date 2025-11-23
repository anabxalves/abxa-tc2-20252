import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const ClienteService = {
    autenticar: (login, senha) => api.post('/clientes/autenticar', { login, senha }),

    trocaSenha: (login, senhaAtual, novaSenha) => api.put('/clientes/troca-senha', { login, senhaAtual, novaSenha }),

    cadastrar: (dadosCliente) => api.post('/clientes/cadastro', dadosCliente),

    getDados: (email) => api.get(`/clientes/${email}`),
};

export const ServicoService = {
    consultarTodos: () => api.get('/servicos'),

    cadastrar: (dadosServico) => api.post('/servicos/cadastro', dadosServico),
};

export const SolicitacaoService = {
    consultarPorUsuario: (login) => api.get(`/solicitacoes/${login}`),

    atualizarSolicitacoes: (login, solicitacoes) => api.put(`/solicitacoes/${login}`, { solicitacoes }),
};

export default api;