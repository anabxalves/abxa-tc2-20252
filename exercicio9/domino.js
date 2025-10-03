const CabecaPeca = {
    BRANCO: "BRANCO", PIO: "PIO", DUQUE: "DUQUE", TERNO: "TERNO",
    QUADRA: "QUADRA", QUINA: "QUINA", SENA: "SENA"
};

class Peca {
    constructor(esquerda, direita) {
        this.esquerda = esquerda;
        this.direita = direita;
    }
}

class CasaTabuleiro {
    constructor(peca, isPlayer1) {
        this.peca = peca;
        this.proximo = null;
        this.anterior = null;
        this.isPlayer1 = isPlayer1;
    }
}

class Tabuleiro {
    constructor() {
        this.inicio = null;
        this.fim = null;
        this.tamanho = 0;
    }

    rotacionarPeca(peca) {
        const temp = peca.esquerda;
        peca.esquerda = peca.direita;
        peca.direita = temp;
    }

    incluirDoInicio(peca, isPlayer1) {
        if (this.tamanho === 0) {
            const novaCasa = new CasaTabuleiro(peca, isPlayer1);
            this.inicio = novaCasa;
            this.fim = novaCasa;
            this.tamanho++;
            return 0;
        }

        if (this.tamanho === 1) {
            if (this.inicio.peca.esquerda === peca.esquerda || this.inicio.peca.esquerda === peca.direita ||
                this.inicio.peca.direita === peca.esquerda || this.inicio.peca.direita === peca.direita) {
                const novaCasa = new CasaTabuleiro(peca, isPlayer1);
                this.inicio.proximo = novaCasa;
                novaCasa.anterior = this.inicio;
                this.fim = novaCasa;
                this.tamanho++;
                return 1;
            }
        }

        if (this.tamanho > 1) {
            if (this.inicio.peca.esquerda === peca.esquerda) {
                this.rotacionarPeca(peca);
                const novaCasa = new CasaTabuleiro(peca, isPlayer1);
                novaCasa.proximo = this.inicio;
                this.inicio.anterior = novaCasa;
                this.inicio = novaCasa;
                this.tamanho++;
                return 2;
            } else if (this.inicio.peca.esquerda === peca.direita) {
                const novaCasa = new CasaTabuleiro(peca, isPlayer1);
                novaCasa.proximo = this.inicio;
                this.inicio.anterior = novaCasa;
                this.inicio = novaCasa;
                this.tamanho++;
                return 2;
            }

            if (this.fim.peca.direita === peca.esquerda) {
                const novaCasa = new CasaTabuleiro(peca, isPlayer1);
                this.fim.proximo = novaCasa;
                novaCasa.anterior = this.fim;
                this.fim = novaCasa;
                this.tamanho++;
                return 1;
            } else if (this.fim.peca.direita === peca.direita) {
                this.rotacionarPeca(peca);
                const novaCasa = new CasaTabuleiro(peca, isPlayer1);
                this.fim.proximo = novaCasa;
                novaCasa.anterior = this.fim;
                this.fim = novaCasa;
                this.tamanho++;
                return 1;
            }

            let atual = this.inicio;
            let casasAndadas = 0;
            while (atual.proximo) {
                if ((atual.peca.direita === peca.esquerda && atual.proximo.peca.esquerda === peca.direita) ||
                    (atual.peca.direita === peca.direita && atual.proximo.peca.esquerda === peca.esquerda)) {
                    if (atual.peca.direita === peca.direita) {
                        this.rotacionarPeca(peca);
                    }
                    const novaCasa = new CasaTabuleiro(peca, isPlayer1);
                    novaCasa.proximo = atual.proximo;
                    atual.proximo.anterior = novaCasa;
                    atual.proximo = novaCasa;
                    novaCasa.anterior = atual;
                    this.tamanho++;
                    return this.tamanho - casasAndadas - 1;
                }
                atual = atual.proximo;
                casasAndadas++;
            }
        }
        return -1;
    }

    incluirDoFim(peca, isPlayer1) {
        if (this.tamanho === 0) {
            const novaCasa = new CasaTabuleiro(peca, isPlayer1);
            this.inicio = novaCasa;
            this.fim = novaCasa;
            this.tamanho++;
            return 0;
        }

        if (this.tamanho === 1) {
            if (this.inicio.peca.esquerda === peca.esquerda || this.inicio.peca.esquerda === peca.direita ||
                this.inicio.peca.direita === peca.esquerda || this.inicio.peca.direita === peca.direita) {
                const novaCasa = new CasaTabuleiro(peca, isPlayer1);
                novaCasa.proximo = this.inicio;
                this.inicio.anterior = novaCasa;
                this.inicio = novaCasa;
                this.fim = this.inicio;
                this.tamanho++;
                return 1;
            }
        }

        if (this.tamanho > 1) {
            if (this.inicio.peca.esquerda === peca.esquerda) {
                this.rotacionarPeca(peca);
                const novaCasa = new CasaTabuleiro(peca, isPlayer1);
                novaCasa.proximo = this.inicio;
                this.inicio.anterior = novaCasa;
                this.inicio = novaCasa;
                this.tamanho++;
                return 2;
            } else if (this.inicio.peca.esquerda === peca.direita) {
                const novaCasa = new CasaTabuleiro(peca, isPlayer1);
                novaCasa.proximo = this.inicio;
                this.inicio.anterior = novaCasa;
                this.inicio = novaCasa;
                this.tamanho++;
                return 2;
            }

            if (this.fim.peca.direita === peca.esquerda) {
                const novaCasa = new CasaTabuleiro(peca, isPlayer1);
                this.fim.proximo = novaCasa;
                novaCasa.anterior = this.fim;
                this.fim = novaCasa;
                this.tamanho++;
                return 1;
            } else if (this.fim.peca.direita === peca.direita) {
                this.rotacionarPeca(peca);
                const novaCasa = new CasaTabuleiro(peca, isPlayer1);
                this.fim.proximo = novaCasa;
                novaCasa.anterior = this.fim;
                this.fim = novaCasa;
                this.tamanho++;
                return 1;
            }

            let atual = this.fim;
            let casasAndadas = 0;
            while (atual.anterior) {
                if ((atual.anterior.peca.direita === peca.esquerda && atual.peca.esquerda === peca.direita) ||
                    (atual.anterior.peca.direita === peca.direita && atual.peca.esquerda === peca.esquerda)) {
                    if (atual.anterior.peca.direita === peca.direita) {
                        this.rotacionarPeca(peca);
                    }
                    const novaCasa = new CasaTabuleiro(peca, isPlayer1);
                    novaCasa.proximo = atual;
                    atual.anterior.proximo = novaCasa;
                    novaCasa.anterior = atual.anterior;
                    atual.anterior = novaCasa;
                    this.tamanho++;
                    return this.tamanho - casasAndadas - 1;
                }
                atual = atual.anterior;
                casasAndadas++;
            }
        }
        return -1;
    }
}

class BurrinhoInteligente {
    constructor() {
        this.tabuleiro = new Tabuleiro();
        this.pecasDisponiveis = [];
        this.jogador1Pontos = 0;
        this.jogador2Pontos = 0;
        this.rodadaAtual = 1;
        this.maxRodadas = 20;
        this.turnoJogador1 = true;
        this.pecaAtual = null;

        this.ui = {
            telaInicial: document.getElementById('tela-inicial'),
            telaJogo: document.getElementById('tela-jogo'),
            maxRodadasInput: document.getElementById('max-rodadas'),
            btnIniciar: document.getElementById('btn-iniciar'),
            tabuleiro: document.getElementById('tabuleiro'),
            pecasRestantesContainer: document.getElementById('pecas-restantes-container'),
            pecaDaVezContainer: document.getElementById('peca-da-vez-container'),
            podeEncaixarSpan: document.getElementById('pode-encaixar'),
            direcaoInicioRadio: document.getElementById('direcao-i'),
            direcaoFimRadio: document.getElementById('direcao-f'),
            btnPuxar: document.getElementById('btn-puxar'),
            btnJogar: document.getElementById('btn-jogar'),
            btnNovoJogo: document.getElementById('btn-novo-jogo'),
            placarJogador1: document.getElementById('placar-jogador1'),
            placarJogador2: document.getElementById('placar-jogador2'),
            logTableBody: document.getElementById('log-table-body'),
            btnPassar: document.createElement('button')
        };

        this.ui.btnPassar.id = 'btn-passar';
        this.ui.btnPassar.textContent = 'Passar a vez (-1 ponto)';
        this.ui.btnPassar.style.display = 'none';

        this.ui.btnIniciar.addEventListener('click', () => this.iniciarJogo());
        this.ui.btnPuxar.addEventListener('click', () => this.puxarPeca());
        this.ui.btnJogar.addEventListener('click', () => this.jogarPeca());
        this.ui.btnNovoJogo.addEventListener('click', () => this.voltarParaTelaInicial());
        this.ui.btnPassar.addEventListener('click', () => this.passarAVez());

        this.ui.btnJogar.parentElement.appendChild(this.ui.btnPassar);
    }

    iniciarJogo() {
        this.maxRodadas = parseInt(this.ui.maxRodadasInput.value) || 20;
        this.resetarJogo();
        this.ui.telaInicial.classList.remove('tela-ativa');
        this.ui.telaInicial.classList.add('tela-inativa');
        this.ui.telaJogo.classList.remove('tela-inativa');
        this.ui.telaJogo.classList.add('tela-ativa');
        this.proximaRodada();
    }

    voltarParaTelaInicial() {
        this.resetarJogo();
        this.ui.telaJogo.classList.remove('tela-ativa');
        this.ui.telaJogo.classList.add('tela-inativa');
        this.ui.telaInicial.classList.remove('tela-inativa');
        this.ui.telaInicial.classList.add('tela-ativa');
    }

    resetarJogo() {
        this.tabuleiro = new Tabuleiro();
        this.pecasDisponiveis = this.gerarPecasDominos();
        this.jogador1Pontos = 0;
        this.jogador2Pontos = 0;
        this.rodadaAtual = 1;
        this.turnoJogador1 = true;
        this.pecaAtual = null;

        this.ui.tabuleiro.innerHTML = '';
        this.ui.pecasRestantesContainer.innerHTML = '';
        this.ui.pecaDaVezContainer.innerHTML = '';
        this.ui.podeEncaixarSpan.textContent = '';
        this.ui.logTableBody.innerHTML = '';
        this.ui.placarJogador1.querySelector('.placar-pontos').textContent = '0';
        this.ui.placarJogador2.querySelector('.placar-pontos').textContent = '0';
        this.ui.btnPuxar.disabled = false;
        this.ui.btnJogar.disabled = true;
        this.ui.btnPassar.style.display = 'none';
        this.ui.btnNovoJogo.style.display = 'none';
        this.ui.btnPuxar.style.display = 'inline';
        this.ui.btnJogar.style.display = 'inline';

        this.ui.placarJogador1.classList.remove('vencedor', 'perdedor');
        this.ui.placarJogador2.classList.remove('vencedor', 'perdedor');

        this.atualizarPecasRestantesUI();
        this.atualizarTurnoUI();
    }

    gerarPecasDominos() {
        const pecas = [];
        const cabecas = Object.values(CabecaPeca);
        for (let i = 0; i < cabecas.length; i++) {
            for (let j = i; j < cabecas.length; j++) {
                pecas.push(new Peca(cabecas[i], cabecas[j]));
            }
        }
        this.embaralharPecas(pecas);
        return pecas;
    }

    embaralharPecas(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    cabecaParaNumero(cabeca) {
        switch (cabeca) {
            case 'BRANCO': return 0;
            case 'PIO': return 1;
            case 'DUQUE': return 2;
            case 'TERNO': return 3;
            case 'QUADRA': return 4;
            case 'QUINA': return 5;
            case 'SENA': return 6;
            default: return 0;
        }
    }

    atualizarPecasRestantesUI() {
        this.ui.pecasRestantesContainer.innerHTML = '';
        this.pecasDisponiveis.forEach(peca => {
            const pecaDiv = document.createElement('div');
            pecaDiv.className = 'peca-pequena';
            const metadeEsquerda = document.createElement('div');
            metadeEsquerda.className = `metade metade-${this.cabecaParaNumero(peca.esquerda)}`;
            const metadeDireita = document.createElement('div');
            metadeDireita.className = `metade metade-${this.cabecaParaNumero(peca.direita)}`;
            const divisor = document.createElement('div');
            divisor.className = 'divisor-peca';
            this.adicionarPontos(metadeEsquerda, this.cabecaParaNumero(peca.esquerda), 'peca-pequena');
            this.adicionarPontos(metadeDireita, this.cabecaParaNumero(peca.direita), 'peca-pequena');
            pecaDiv.appendChild(metadeEsquerda);
            pecaDiv.appendChild(divisor);
            pecaDiv.appendChild(metadeDireita);
            this.ui.pecasRestantesContainer.appendChild(pecaDiv);
        });
    }

    adicionarPontos(elemento, numero, tamanho) {
        for (let i = 0; i < numero; i++) {
            const ponto = document.createElement('div');
            ponto.className = 'ponto';
            if (tamanho === 'peca-pequena') {
                ponto.style.width = '3px';
                ponto.style.height = '3px';
            }
            elemento.appendChild(ponto);
        }
    }

    atualizarTurnoUI() {
        this.ui.placarJogador1.classList.toggle('jogador-1-turno', this.turnoJogador1);
        this.ui.placarJogador2.classList.toggle('jogador-2-turno', !this.turnoJogador1);

        if (this.turnoJogador1) {
            this.ui.btnPuxar.disabled = false;
            this.ui.btnJogar.disabled = true;
            this.ui.btnPassar.style.display = 'none';
        } else {
            this.ui.btnPuxar.disabled = true;
            this.ui.btnJogar.disabled = true;
            this.ui.btnPassar.style.display = 'none';
        }
    }

    puxarPeca() {
        if (this.pecasDisponiveis.length === 0) {
            this.terminarJogo();
            return;
        }

        const pecaSorteada = this.pecasDisponiveis.shift();
        this.pecaAtual = pecaSorteada;
        this.ui.pecaDaVezContainer.innerHTML = '';
        const pecaDiv = document.createElement('div');
        pecaDiv.className = 'peca';
        const metadeEsquerda = document.createElement('div');
        metadeEsquerda.className = `metade metade-${this.cabecaParaNumero(this.pecaAtual.esquerda)}`;
        const metadeDireita = document.createElement('div');
        metadeDireita.className = `metade metade-${this.cabecaParaNumero(this.pecaAtual.direita)}`;
        const divisor = document.createElement('div');
        divisor.className = 'divisor-peca';
        this.adicionarPontos(metadeEsquerda, this.cabecaParaNumero(this.pecaAtual.esquerda), 'peca');
        this.adicionarPontos(metadeDireita, this.cabecaParaNumero(this.pecaAtual.direita), 'peca');
        pecaDiv.appendChild(metadeEsquerda);
        pecaDiv.appendChild(divisor);
        pecaDiv.appendChild(metadeDireita);
        this.ui.pecaDaVezContainer.appendChild(pecaDiv);
        this.ui.pecasRestantesContainer.innerHTML = '';
        this.atualizarPecasRestantesUI();

        const podeEncaixar = this.validarJogada(this.pecaAtual);
        this.ui.podeEncaixarSpan.textContent = podeEncaixar ? 'Sim' : 'Não';

        this.ui.btnPuxar.disabled = true;

        if (this.turnoJogador1) {
            if (podeEncaixar) {
                this.ui.btnJogar.disabled = false;
            } else {
                this.ui.btnPassar.style.display = 'inline';
            }
        }
    }

    passarAVez() {
        if (this.turnoJogador1 && this.pecaAtual) {
            this.adicionarLog(true, this.pecaAtual, 'Sem Encaixe', -1);
            this.deduzirPonto();
            this.pecasDisponiveis.push(this.pecaAtual);

            this.pecaAtual = null;
            this.ui.pecaDaVezContainer.innerHTML = '';
            this.ui.podeEncaixarSpan.textContent = '';
            this.proximaRodada();
        }
    }

    jogarPeca() {
        const direcao = this.ui.direcaoInicioRadio.checked ? 'inicio' : 'fim';
        let resultado = -1;

        if (direcao === 'inicio') {
            resultado = this.tabuleiro.incluirDoInicio(this.pecaAtual);
        } else {
            resultado = this.tabuleiro.incluirDoFim(this.pecaAtual);
        }

        if (resultado !== -1) {
            this.adicionarLog(this.turnoJogador1, this.pecaAtual, direcao, resultado);
            this.atualizarPlacar(resultado);
            this.atualizarTabuleiroUI();
        } else {
            this.adicionarLog(this.turnoJogador1, this.pecaAtual, direcao, -1);
            this.deduzirPonto();
            this.pecasDisponiveis.push(this.pecaAtual);
        }

        this.pecaAtual = null;
        this.ui.pecaDaVezContainer.innerHTML = '';
        this.ui.podeEncaixarSpan.textContent = '';
        this.proximaRodada();
    }

    simularJogada() {
        let resultado = -1;
        let direcao = 'sem encaixe';

        resultado = this.tabuleiro.incluirDoInicio(this.pecaAtual, !this.turnoJogador1);
        if (resultado !== -1) {
            direcao = 'inicio';
        } else {
            resultado = this.tabuleiro.incluirDoFim(this.pecaAtual, !this.turnoJogador1);
            if (resultado !== -1) {
                direcao = 'fim';
            }
        }

        if (resultado !== -1) {
            this.adicionarLog(this.turnoJogador1, this.pecaAtual, direcao, resultado);
            this.atualizarPlacar(resultado);
            this.atualizarTabuleiroUI();
        } else {
            this.adicionarLog(this.turnoJogador1, this.pecaAtual, 'sem encaixe', -1);
            this.deduzirPonto();
            this.pecasDisponiveis.push(this.pecaAtual);
        }

        this.pecaAtual = null;
        this.ui.pecaDaVezContainer.innerHTML = '';
        this.ui.podeEncaixarSpan.textContent = '';
        setTimeout(() => this.proximaRodada(), 1000);
    }

    deduzirPonto() {
        if (this.turnoJogador1) {
            this.jogador1Pontos -= 1;
            this.ui.placarJogador1.querySelector('.placar-pontos').textContent = this.jogador1Pontos;
        } else {
            this.jogador2Pontos -= 1;
            this.ui.placarJogador2.querySelector('.placar-pontos').textContent = this.jogador2Pontos;
        }
    }

    validarJogada(peca) {
        if (this.tabuleiro.tamanho === 0) {
            return true;
        }

        const inicioEncaixa = (this.tabuleiro.inicio.peca.esquerda === peca.esquerda || this.tabuleiro.inicio.peca.esquerda === peca.direita);
        const fimEncaixa = (this.tabuleiro.fim.peca.direita === peca.esquerda || this.tabuleiro.fim.peca.direita === peca.direita);

        let atual = this.tabuleiro.inicio;
        while(atual && atual.proximo) {
            if ((atual.peca.direita === peca.esquerda && atual.proximo.peca.esquerda === peca.direita) ||
                (atual.peca.direita === peca.direita && atual.proximo.peca.esquerda === peca.esquerda)) {
                return true;
            }
            atual = atual.proximo;
        }

        return inicioEncaixa || fimEncaixa;
    }

    atualizarPlacar(pontos) {
        const pontosGanhos = pontos === 0 || pontos === 1 || pontos === 2 ? 1 : pontos;
        if (this.turnoJogador1) {
            this.jogador1Pontos += pontosGanhos;
            this.ui.placarJogador1.querySelector('.placar-pontos').textContent = this.jogador1Pontos;
        } else {
            this.jogador2Pontos += pontosGanhos;
            this.ui.placarJogador2.querySelector('.placar-pontos').textContent = this.jogador2Pontos;
        }
    }

    adicionarLog(isPlayer1, peca, direcao, pontos) {
        const jogador = isPlayer1 ? 'Jogador' : 'Simulador';
        const direcaoStr = direcao === 'inicio' ? 'Início' : direcao === 'fim' ? 'Fim' : 'Sem Encaixe';
        const pecaStr = `${peca.esquerda} - ${peca.direita}`;
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${this.rodadaAtual}</td>
            <td>${jogador}</td>
            <td>${pecaStr}</td>
            <td>${direcaoStr}</td>
            <td>${pontos}</td>
        `;
        this.ui.logTableBody.appendChild(newRow);
    }

    proximaRodada() {
        if (this.rodadaAtual > this.maxRodadas) {
            this.terminarJogo();
            return;
        }

        if (this.pecasDisponiveis.length === 0) {
            this.terminarJogo();
            return;
        }

        let jogoFechado = true;
        for (const peca of this.pecasDisponiveis) {
            if (this.validarJogada(peca)) {
                jogoFechado = false;
                break;
            }
        }
        if (jogoFechado) {
            this.terminarJogo('fechado');
            return;
        }

        if (!this.turnoJogador1) {
            this.rodadaAtual++;
        }

        this.turnoJogador1 = !this.turnoJogador1;

        this.ui.pecaDaVezContainer.innerHTML = '';
        this.ui.podeEncaixarSpan.textContent = '';

        this.atualizarTurnoUI();

        if (!this.turnoJogador1) {
            this.puxarPeca();
            this.simularJogada();
        }
    }

    terminarJogo(motivo = 'normal') {
        let mensagem = '';
        if (motivo === 'fechado') {
            mensagem = 'O jogo fechou. ';
        }

        if (this.jogador1Pontos > this.jogador2Pontos) {
            mensagem += 'Jogador Venceu!';
            this.ui.placarJogador1.classList.add('vencedor');
            this.ui.placarJogador2.classList.add('perdedor');
        } else if (this.jogador2Pontos > this.jogador1Pontos) {
            mensagem += 'Simulador Venceu!';
            this.ui.placarJogador2.classList.add('vencedor');
            this.ui.placarJogador1.classList.add('perdedor');
        } else {
            mensagem += 'O jogo terminou em empate!';
        }

        alert(`Fim de Jogo! ${mensagem}`);
        this.ui.btnPuxar.style.display = 'none';
        this.ui.btnJogar.style.display = 'none';
        this.ui.btnPassar.style.display = 'none';
        this.ui.btnNovoJogo.style.display = 'inline';
    }

    atualizarTabuleiroUI() {
        this.ui.tabuleiro.innerHTML = '';
        let atual = this.tabuleiro.inicio;
        while (atual) {
            const pecaDiv = document.createElement('div');
            pecaDiv.className = 'peca';
            pecaDiv.classList.add(atual.isPlayer1 ? 'jogador-1-peca' : 'jogador-2-peca');

            const metadeEsquerda = document.createElement('div');
            metadeEsquerda.className = `metade metade-${this.cabecaParaNumero(atual.peca.esquerda)}`;
            const metadeDireita = document.createElement('div');
            metadeDireita.className = `metade metade-${this.cabecaParaNumero(atual.peca.direita)}`;
            const divisor = document.createElement('div');
            divisor.className = 'divisor-peca';
            this.adicionarPontos(metadeEsquerda, this.cabecaParaNumero(atual.peca.esquerda), 'peca');
            this.adicionarPontos(metadeDireita, this.cabecaParaNumero(atual.peca.direita), 'peca');
            pecaDiv.appendChild(metadeEsquerda);
            pecaDiv.appendChild(divisor);
            pecaDiv.appendChild(metadeDireita);
            this.ui.tabuleiro.appendChild(pecaDiv);

            atual = atual.proximo;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new BurrinhoInteligente();
});