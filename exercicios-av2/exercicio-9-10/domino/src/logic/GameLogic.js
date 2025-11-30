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
        this.peca = new Peca(peca.esquerda, peca.direita);
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

        const ladoLivre = this.inicio.peca.esquerda;

        if (peca.direita === ladoLivre) {
        } else if (peca.esquerda === ladoLivre) {
            this.rotacionarPeca(peca);
        } else {
            return -1;
        }

        const novaCasa = new CasaTabuleiro(peca, isPlayer1);
        novaCasa.proximo = this.inicio;
        this.inicio.anterior = novaCasa;
        this.inicio = novaCasa;
        this.tamanho++;
        return 2;
    }

    incluirDoFim(peca, isPlayer1) {
        if (this.tamanho === 0) {
            const novaCasa = new CasaTabuleiro(peca, isPlayer1);
            this.inicio = novaCasa;
            this.fim = novaCasa;
            this.tamanho++;
            return 0;
        }

        const ladoLivre = this.fim.peca.direita;

        if (peca.esquerda === ladoLivre) {
        } else if (peca.direita === ladoLivre) {
            this.rotacionarPeca(peca);
        } else {
            return -1;
        }

        const novaCasa = new CasaTabuleiro(peca, isPlayer1);
        this.fim.proximo = novaCasa;
        novaCasa.anterior = this.fim;
        this.fim = novaCasa;
        this.tamanho++;
        return 1;
    }

    toArray() {
        const array = [];
        let atual = this.inicio;
        while (atual) {
            array.push(atual);
            atual = atual.proximo;
        }
        return array;
    }
}

class BurrinhoInteligente {
    constructor() {
        this.tabuleiro = new Tabuleiro();
        this.pecasDisponiveis = [];
        this.jogador1Pontos = 0;
        this.jogador2Pontos = 0;
        this.rodadaAtual = 1;
        this.maxRodadas = 10;
        this.turnoJogador1 = true;
        this.pecaAtual = null;
        this.log = [];
        this.jogoTerminado = false;
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

    resetarJogo(maxRodadas) {
        this.tabuleiro = new Tabuleiro();
        this.pecasDisponiveis = this.gerarPecasDominos();
        this.jogador1Pontos = 0;
        this.jogador2Pontos = 0;
        this.rodadaAtual = 1;
        this.maxRodadas = maxRodadas;
        this.turnoJogador1 = true;
        this.pecaAtual = null;
        this.log = [];
        this.jogoTerminado = false;
    }

    validarJogada(peca) {
        if (this.tabuleiro.tamanho === 0) {
            return true;
        }

        const ladoEsquerda = this.tabuleiro.inicio.peca.esquerda;
        const ladoDireita = this.tabuleiro.fim.peca.direita;

        return (peca.esquerda === ladoEsquerda || peca.direita === ladoEsquerda ||
            peca.esquerda === ladoDireita || peca.direita === ladoDireita);
    }

    puxarPeca() {
        if (this.pecasDisponiveis.length === 0 || this.jogoTerminado) return;
        this.pecaAtual = this.pecasDisponiveis.shift();
    }

    // CORRIGIDO: Método de passar a vez
    passarAVez() {
        if (this.pecaAtual && this.turnoJogador1) {
            this.adicionarLog(true, this.pecaAtual, 'Sem Encaixe', -1);
            this.deduzirPonto(true);
            this.pecasDisponiveis.push(this.pecaAtual);

            this.pecaAtual = null;
            this.proximaRodada();
        }
    }

    jogarPeca(direcao) {
        if (!this.pecaAtual || this.jogoTerminado) return;

        let pecaAJogar = new Peca(this.pecaAtual.esquerda, this.pecaAtual.direita);
        let resultado = -1;
        const isPlayer1 = this.turnoJogador1;

        if (direcao === 'inicio') {
            resultado = this.tabuleiro.incluirDoInicio(pecaAJogar, isPlayer1);
        } else {
            resultado = this.tabuleiro.incluirDoFim(pecaAJogar, isPlayer1);
        }

        if (resultado !== -1) {
            this.adicionarLog(isPlayer1, pecaAJogar, direcao, resultado);
            this.atualizarPlacar(resultado);
        } else {
            this.adicionarLog(isPlayer1, pecaAJogar, 'Sem Encaixe', -1);
            this.deduzirPonto(isPlayer1);
            this.pecasDisponiveis.push(pecaAJogar);
        }

        this.pecaAtual = null;
        this.proximaRodada();
    }

    simularJogada() {
        if (!this.pecaAtual || this.jogoTerminado) return;

        let pecaAJogar = new Peca(this.pecaAtual.esquerda, this.pecaAtual.direita);
        let resultado = -1;
        let direcao = 'Sem Encaixe';
        const isPlayer1 = this.turnoJogador1;

        // Tenta encaixar no Início
        let tempPecaInicio = new Peca(pecaAJogar.esquerda, pecaAJogar.direita);
        resultado = this.tabuleiro.incluirDoInicio(tempPecaInicio, isPlayer1);

        if (resultado !== -1) {
            direcao = 'Início';
            pecaAJogar = tempPecaInicio;
        } else {
            // Tenta encaixar no Fim
            let tempPecaFim = new Peca(pecaAJogar.esquerda, pecaAJogar.direita);
            resultado = this.tabuleiro.incluirDoFim(tempPecaFim, isPlayer1);
            if (resultado !== -1) {
                direcao = 'Fim';
                pecaAJogar = tempPecaFim;
            }
        }

        if (resultado !== -1) {
            this.adicionarLog(isPlayer1, pecaAJogar, direcao, resultado);
            this.atualizarPlacar(resultado);
        } else {
            this.adicionarLog(isPlayer1, pecaAJogar, 'Sem Encaixe', -1);
            this.deduzirPonto(isPlayer1);
            this.pecasDisponiveis.push(pecaAJogar);
        }

        this.pecaAtual = null;
        this.proximaRodada();
    }

    adicionarLog(isPlayer1, peca, direcao, pontos) {
        const jogador = isPlayer1 ? 'Jogador' : 'Simulador';
        const pecaStr = `${peca.esquerda} - ${peca.direita}`;
        this.log.push({
            rodada: this.rodadaAtual,
            jogador,
            peca: pecaStr,
            direcao,
            pontos,
        });
    }

    deduzirPonto(isPlayer1) {
        if (isPlayer1) {
            this.jogador1Pontos -= 1;
        } else {
            this.jogador2Pontos -= 1;
        }
    }

    atualizarPlacar(pontos) {
        const pontosGanhos = pontos === 0 || pontos === 1 || pontos === 2 ? 1 : pontos;
        if (this.turnoJogador1) {
            this.jogador1Pontos += pontosGanhos;
        } else {
            this.jogador2Pontos += pontosGanhos;
        }
    }

    proximaRodada() {
        if (this.jogoTerminado) return;

        if (this.rodadaAtual > this.maxRodadas || this.pecasDisponiveis.length === 0) {
            this.terminarJogo('normal');
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
    }

    terminarJogo(motivo) {
        this.jogoTerminado = true;
        let resultado = '';
        if (this.jogador1Pontos > this.jogador2Pontos) {
            resultado = 'Jogador Venceu!';
        } else if (this.jogador2Pontos > this.jogador1Pontos) {
            resultado = 'Simulador Venceu!';
        } else {
            resultado = 'Empate!';
        }

        return {
            motivo: motivo === 'fechado' ? 'O jogo fechou.' : 'Limite de rodadas atingido.',
            resultado
        };
    }

    getCurrentState() {
        return {
            tabuleiro: this.tabuleiro.toArray(),
            pecasDisponiveis: this.pecasDisponiveis,
            jogador1Pontos: this.jogador1Pontos,
            jogador2Pontos: this.jogador2Pontos,
            rodadaAtual: this.rodadaAtual,
            maxRodadas: this.maxRodadas,
            turnoJogador1: this.turnoJogador1,
            pecaAtual: this.pecaAtual,
            log: this.log,
            podeEncaixar: this.pecaAtual ? this.validarJogada(this.pecaAtual) : false,
            jogoTerminado: this.jogoTerminado
        };
    }
}

export { CabecaPeca, Peca, CasaTabuleiro, Tabuleiro, BurrinhoInteligente };