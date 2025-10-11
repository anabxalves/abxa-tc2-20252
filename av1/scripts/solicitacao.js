let solicitacoes = JSON.parse(localStorage.getItem('solicitacoes')) || [];

function getSolicitacoesUsuario(emailUsuario) {
    return solicitacoes.filter(solicitacao => solicitacao.email === emailUsuario)
        .sort((a, b) => new Date(a.dataPedido) - new Date(b.dataPedido));
}

function adicionarSolicitacao(novaSolicitacao) {
    solicitacoes.push(novaSolicitacao);
    localStorage.setItem('solicitacoes', JSON.stringify(solicitacoes));
}

function excluirSolicitacaoPorId(idSolicitacao) {
    solicitacoes = solicitacoes.filter(solicitacao => solicitacao.id !== idSolicitacao);
    localStorage.setItem('solicitacoes', JSON.stringify(solicitacoes));
}

const loggedInUserEmail = localStorage.getItem('loggedInUser');
if (!loggedInUserEmail) {
    window.location.href = '../login.html';
}

const usuarioLogado = getContaPorEmail(loggedInUserEmail);

const servicos = {
    manutencao: { nome: "Manutenção de Computadores", preco: "R$ 150,00", prazo: "3" },
    suporte: { nome: "Suporte Remoto", preco: "R$ 80,00", prazo: "1" },
    seguranca: { nome: "Segurança da Informação", preco: "R$ 300,00", prazo: "5" }
};

const servicoSelect = document.getElementById('servico-ti');
const precoLabel = document.getElementById('preco-servico');
const prazoLabel = document.getElementById('prazo-atendimento');
const dataPrevistaLabel = document.getElementById('data-prevista');
const tabelaBody = document.querySelector("#tabela-solicitacoes tbody");
const form = document.getElementById('nova-solicitacao-form');

document.getElementById('nome-usuario').textContent = usuarioLogado.nome;
document.getElementById('login-usuario').textContent = usuarioLogado.email;

function renderizarSolicitacoes() {
    tabelaBody.innerHTML = '';
    const solicitacoesUsuario = getSolicitacoesUsuario(loggedInUserEmail);

    solicitacoesUsuario.forEach(solicitacao => {
        const novaLinha = document.createElement('tr');
        novaLinha.setAttribute('data-id', solicitacao.id);

        novaLinha.innerHTML = `
            <td>${solicitacao.dataPedido}</td>
            <td>${solicitacao.numero}</td>
            <td>${solicitacao.servicoNome}</td>
            <td>${solicitacao.status}</td>
            <td>${solicitacao.preco}</td>
            <td>${solicitacao.dataPrevista}</td>
            <td class="botoes-tabela"><button onclick="excluirSolicitacao(this)">Excluir</button></td>
        `;
        tabelaBody.appendChild(novaLinha);
    });
}

servicoSelect.addEventListener('change', function() {
    const servicoSelecionado = servicos[this.value];
    if (servicoSelecionado) {
        precoLabel.textContent = servicoSelecionado.preco;
        prazoLabel.textContent = `${servicoSelecionado.prazo} dias úteis`;
        dataPrevistaLabel.textContent = calcularDataPrevista(servicoSelecionado.prazo);
    } else {
        precoLabel.textContent = "";
        prazoLabel.textContent = "";
        dataPrevistaLabel.textContent = "";
    }
});

form.addEventListener('submit', function(event) {
    event.preventDefault();
    const servicoKey = servicoSelect.value;
    if (!servicoKey) {
        alert("Por favor, selecione um serviço.");
        return;
    }

    const servicoInfo = servicos[servicoKey];

    const novaSolicitacao = {
        id: Date.now(),
        email: loggedInUserEmail,
        dataPedido: new Date().toISOString().slice(0, 10),
        numero: `#${Math.floor(Math.random() * 100000)}`,
        servicoNome: servicoInfo.nome,
        status: "EM ELABORAÇÃO",
        preco: servicoInfo.preco,
        dataPrevista: dataPrevistaLabel.textContent
    };

    adicionarSolicitacao(novaSolicitacao);
    renderizarSolicitacoes();

    form.reset();
    precoLabel.textContent = "";
    prazoLabel.textContent = "";
    dataPrevistaLabel.textContent = "";
});

function excluirSolicitacao(botao) {
    const linha = botao.parentNode.parentNode;
    const idSolicitacao = parseInt(linha.getAttribute('data-id'));
    excluirSolicitacaoPorId(idSolicitacao);
    renderizarSolicitacoes();
}

function calcularDataPrevista(dias) {
    const hoje = new Date();
    hoje.setDate(hoje.getDate() + parseInt(dias));
    return hoje.toISOString().slice(0, 10);
}

document.addEventListener('DOMContentLoaded', renderizarSolicitacoes);