const CabecaPeca = {
    BRANCO: "BRANCO",
    PIO: "PIO",
    DUQUE: "DUQUE",
    TERNO: "TERNO",
    QUADRA: "QUADRA",
    QUINA: "QUINA",
    SENA: "SENA"
};

class Peca {
    constructor(esquerda, direita) {
        this.esquerda = esquerda;
        this.direita = direita;
    }
}

class CasaTabuleiro {
    constructor(peca) {
        this.peca = peca;
        this.proximo = null;
        this.anterior = null;
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

    incluirDoInicio(peca) {
        const novaCasa = new CasaTabuleiro(peca);

        if (this.tamanho === 0) {
            this.inicio = novaCasa;
            this.fim = novaCasa;
            this.tamanho++;
            return 0;
        }

        if (this.tamanho === 1) {
            if (this.inicio.peca.esquerda === peca.esquerda || this.inicio.peca.esquerda === peca.direita ||
                this.inicio.peca.direita === peca.esquerda || this.inicio.peca.direita === peca.direita) {

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
                const novaCasa = new CasaTabuleiro(peca);
                novaCasa.proximo = this.inicio;
                this.inicio.anterior = novaCasa;
                this.inicio = novaCasa;
                this.tamanho++;
                return 2;
            } else if (this.inicio.peca.esquerda === peca.direita) {
                const novaCasa = new CasaTabuleiro(peca);
                novaCasa.proximo = this.inicio;
                this.inicio.anterior = novaCasa;
                this.inicio = novaCasa;
                this.tamanho++;
                return 2;
            }

            if (this.fim.peca.direita === peca.esquerda) {
                const novaCasa = new CasaTabuleiro(peca);
                this.fim.proximo = novaCasa;
                novaCasa.anterior = this.fim;
                this.fim = novaCasa;
                this.tamanho++;
                return 1;
            } else if (this.fim.peca.direita === peca.direita) {
                this.rotacionarPeca(peca);
                const novaCasa = new CasaTabuleiro(peca);
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

                    const novaCasa = new CasaTabuleiro(peca);
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

    incluirDoFim(peca) {
        const novaCasa = new CasaTabuleiro(peca);

        if (this.tamanho === 0) {
            this.inicio = novaCasa;
            this.fim = novaCasa;
            this.tamanho++;
            return 0;
        }

        if (this.tamanho === 1) {
            if (this.inicio.peca.esquerda === peca.esquerda || this.inicio.peca.esquerda === peca.direita ||
                this.inicio.peca.direita === peca.esquerda || this.inicio.peca.direita === peca.direita) {

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
                const novaCasa = new CasaTabuleiro(peca);
                novaCasa.proximo = this.inicio;
                this.inicio.anterior = novaCasa;
                this.inicio = novaCasa;
                this.tamanho++;
                return 2;
            } else if (this.inicio.peca.esquerda === peca.direita) {
                const novaCasa = new CasaTabuleiro(peca);
                novaCasa.proximo = this.inicio;
                this.inicio.anterior = novaCasa;
                this.inicio = novaCasa;
                this.tamanho++;
                return 2;
            }

            if (this.fim.peca.direita === peca.esquerda) {
                const novaCasa = new CasaTabuleiro(peca);
                this.fim.proximo = novaCasa;
                novaCasa.anterior = this.fim;
                this.fim = novaCasa;
                this.tamanho++;
                return 1;
            } else if (this.fim.peca.direita === peca.direita) {
                this.rotacionarPeca(peca);
                const novaCasa = new CasaTabuleiro(peca);
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

                    const novaCasa = new CasaTabuleiro(peca);
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
        this.pecasDisponiveis = this.gerarPecasDominos();
        this.modoSimulacao = true;
        this.ui = {
            tabuleiro: document.getElementById('tabuleiro'),
            btnJogar: document.getElementById('btn-jogar'),
            btnReiniciar: document.getElementById('btn-reiniciar'),
            status: document.getElementById('status'),
            retornoContainer: document.getElementById('retorno-container'),
            modoSimulacaoRadio: document.getElementById('modo-simulacao'),
            modoJogadorRadio: document.getElementById('modo-jogador'),
            escolhaJogadorDiv: document.getElementById('escolha-jogador'),
            btnInicio: document.getElementById('btn-inicio'),
            btnFim: document.getElementById('btn-fim')
        };

        this.ui.btnJogar.addEventListener('click', () => this.jogar());
        this.ui.btnReiniciar.addEventListener('click', () => this.reiniciarJogo());
        this.ui.btnInicio.addEventListener('click', () => this.realizarJogada('inicio'));
        this.ui.btnFim.addEventListener('click', () => this.realizarJogada('fim'));
        this.ui.modoSimulacaoRadio.addEventListener('change', () => this.setModoJogo('simulacao'));
        this.ui.modoJogadorRadio.addEventListener('change', () => this.setModoJogo('jogador'));
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

    setModoJogo(modo) {
        this.modoSimulacao = (modo === 'simulacao');
        this.ui.escolhaJogadorDiv.style.display = 'none';
        this.resetarJogo();
    }

    resetarJogo() {
        this.tabuleiro = new Tabuleiro();
        this.pecasDisponiveis = this.gerarPecasDominos();
        this.ui.tabuleiro.innerHTML = '';
        this.ui.status.innerHTML = 'Jogo reiniciado.';
        this.ui.btnJogar.textContent = 'Jogar';
        this.ui.btnJogar.disabled = false;
        this.ui.btnInicio.disabled = false;
        this.ui.btnFim.disabled = false;
        this.pecasNaoJogaveis = 0;
    }

    jogar() {
        console.log(this.pecasNaoJogaveis);

        if (this.pecasDisponiveis.length === 0) {
            this.ui.status.innerHTML = 'O conjunto de peças está vazio. O jogo terminou.';
            this.ui.btnReiniciar.style.display = 'block';
            this.ui.btnJogar.disabled = true;
            return;
        }

        const pecaSorteada = this.pecasDisponiveis.shift();
        this.pecaAtual = pecaSorteada;
        this.ui.status.innerHTML = `Peça sorteada: ${this.pecaAtual.esquerda} - ${this.pecaAtual.direita}.<br />`;

        if (!this.validarJogada(this.pecaAtual)) {
            this.processarResultado(-1, this.pecaAtual);
            this.ui.btnJogar.disabled = false;
            this.embaralharPecas(this.pecasDisponiveis);
            this.pecasNaoJogaveis++;

            if (this.pecasNaoJogaveis >= this.pecasDisponiveis.length) {
                this.ui.status.innerHTML = `<strong>Nenhuma peça no conjunto pode ser encaixada. O jogo terminou.</strong>`;
                this.ui.btnJogar.disabled = true;
                this.ui.btnReiniciar.style.display = 'block';
                return;
            }

            this.ui.btnJogar.disabled = false;
            return;
        }

        this.pecasNaoJogaveis = 0;

        if (this.modoSimulacao) {
            this.simularJogada();
        } else {
            this.ui.escolhaJogadorDiv.style.display = 'flex';
            this.ui.btnJogar.disabled = true;
        }
    }

    validarJogada(peca) {
        if (this.tabuleiro.tamanho === 0) {
            return true;
        }

        const inicioEncaixa = (this.tabuleiro.inicio.peca.esquerda === peca.esquerda || this.tabuleiro.inicio.peca.esquerda === peca.direita);
        const fimEncaixa = (this.tabuleiro.fim.peca.direita === peca.esquerda || this.tabuleiro.fim.peca.direita === peca.direita);

        return inicioEncaixa || fimEncaixa;
    }

    realizarJogada(escolha) {
        let resultado = -1;
        if (escolha === 'inicio') {
            resultado = this.tabuleiro.incluirDoInicio(this.pecaAtual);
        } else {
            resultado = this.tabuleiro.incluirDoFim(this.pecaAtual);
        }
        this.processarResultado(resultado, this.pecaAtual);
        this.ui.escolhaJogadorDiv.style.display = 'none';
        this.ui.btnJogar.disabled = false;
    }

    simularJogada() {
        const tentarInicio = Math.random() < 0.5;
        let resultado;
        if (tentarInicio) {
            resultado = this.tabuleiro.incluirDoInicio(this.pecaAtual);
            this.ui.status.innerHTML += ` O computador tentou encaixar na esquerda.`;
        } else {
            resultado = this.tabuleiro.incluirDoFim(this.pecaAtual);
            this.ui.status.innerHTML += ` O computador tentou encaixar na direita.`;
        }
        this.processarResultado(resultado, this.pecaAtual);
    }

    reiniciarJogo() {
        this.tabuleiro = new Tabuleiro();
        this.pecasDisponiveis = this.gerarPecasDominos();
        this.ui.tabuleiro.innerHTML = '';
        this.ui.status.innerHTML = 'Jogo reiniciado. Clique em "Jogar" para começar.';
        this.ui.btnJogar.disabled = false;
        this.ui.btnReiniciar.style.display = 'none';
    }

    cabecaParaNumero(cabeca) {
        switch(cabeca) {
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

    atualizarTabuleiroUI() {
        this.ui.tabuleiro.innerHTML = '';
        let atual = this.tabuleiro.inicio;
        while (atual) {
            const pecaDiv = document.createElement('div');
            pecaDiv.className = 'peca';

            const metadeEsquerda = document.createElement('div');
            metadeEsquerda.className = `metade metade-${this.cabecaParaNumero(atual.peca.esquerda)}`;

            const divisor = document.createElement('div');
            divisor.className = `divisor-peca`;

            const metadeDireita = document.createElement('div');
            metadeDireita.className = `metade metade-${this.cabecaParaNumero(atual.peca.direita)}`;

            this.adicionarPontos(metadeEsquerda, this.cabecaParaNumero(atual.peca.esquerda));
            this.adicionarPontos(metadeDireita, this.cabecaParaNumero(atual.peca.direita));

            pecaDiv.appendChild(metadeEsquerda);
            pecaDiv.appendChild(divisor);
            pecaDiv.appendChild(metadeDireita);
            this.ui.tabuleiro.appendChild(pecaDiv);

            atual = atual.proximo;
        }
    }

    adicionarPontos(elemento, numero) {
        for (let i = 0; i < numero; i++) {
            const ponto = document.createElement('div');
            ponto.className = 'ponto';
            elemento.appendChild(ponto);
        }
    }

    processarResultado(resultado, peca) {
        this.ui.retornoContainer.innerHTML = '';

        const containerPlacar = document.createElement('div');
        containerPlacar.className = 'containerPlacar';

        const textoPlacar = document.createElement('div');
        textoPlacar.className = 'placar';
        textoPlacar.innerHTML = 'RETORNO';

        const numeroPlacar = document.createElement('div');
        numeroPlacar.className = 'numero-placar';
        numeroPlacar.innerHTML = `${resultado}`;

        containerPlacar.appendChild(textoPlacar);
        containerPlacar.appendChild(numeroPlacar);
        this.ui.retornoContainer.appendChild(containerPlacar);

        if (resultado !== -1) {
            this.ui.status.innerHTML += ` <strong>Peça encaixada com sucesso!</strong>`;
            this.atualizarTabuleiroUI();
        } else {
            this.pecasDisponiveis.push(peca);
            this.ui.status.innerHTML += ` <strong>Peça não encaixou e foi devolvida ao conjunto.</strong>`;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new BurrinhoInteligente();
});