# 🎲 Jogo da Sorte

Desenvolvido como requisito avaliativo para a disciplina de Programação Frontend, componente da graduação em Ciência da Computação na CESAR School, este repositório contém um mini-jogo interativo desenvolvido em **React** com **Tailwind CSS**, inspirado em mecanismos clássicos de *guessing games*.  
Nele, o jogador deve tentar clicar na figura vencedora antes que o tempo acabe, com o jogo registrando vitórias, derrotas e timeouts até que seja reiniciado.

---

## 🚀 Visão Geral

O layout exibe **9 figuras** distribuídas em um **grid 3×3**.  
Ao clicar em **Jogar**, o sistema:

1. Sorteia uma figura vencedora
2. Inicia um cronômetro regressivo
3. Aguarda o clique do jogador

Possíveis resultados:

- 🟩 **Ganhou** – Acertou a figura vencedora
- 🟥 **Perdeu** – Errou a figura
- ⏱️ **Timeout** – O tempo acabou

O histórico de todas as rodadas é salvo automaticamente.

---

## 🧩 Funcionalidades

- Grid com 9 figuras (ícones do **lucide-react**)
-  Botão **Jogar** para iniciar uma rodada
-  Botão **Zerar Tudo** para limpar histórico e estados
-  Timer regressivo formatado em `MM:SS`
-  Exibição dinâmica de resultado
-  Histórico de vitórias, derrotas e timeouts
-  Feedback visual com cores dinâmicas
-  Interface moderna e responsiva com Tailwind

---

## 🛠️ Tecnologias Utilizadas

- **React**
- **Tailwind CSS**
- **lucide-react**

---

## 📦 Como Executar o Projeto

Clone o repositório e navegue até o diretório `/jogo-da-sorte-app`.

Nele, você deverá instalar as dependências:
```bash
    npm install
    # ou
    yarn
````

E posteriormente executar o servidor:

```bash
    npm run dev
    # ou
    yarn dev
```

Assim, o jogo estará acessível no endereço `http://localhost:5173`.

---

## 🧠 Mecânica do Jogo
### 🟩 Vitória
Clicou na figura sorteada:
> Figura fica verde

### 🟥 Derrota
Clicou na figura errada:
> Figura clicada → vermelha
> 
> Outras → amarelas

### ⏱️ Timeout
Tempo esgotado:
> Todas as figuras ficam vermelhas

---

## 📊 Requisitos Atendidos (Resumo)

| Função / Elemento    | Implementação         | Descrição                                 |
| -------------------- | --------------------- | ----------------------------------------- |
| Quadro com 9 figuras | `FIGURES` + `.map()`  | Renderiza os ícones em grid 3×3           |
| Botão *Jogar*        | `startGame()`         | Reinicia timer e escolhe figura vencedora |
| Botão *Zerar Tudo*   | `resetGame()`         | Limpa estados e histórico                 |
| Timer                | `timer` + `useEffect` | Decrementa a cada segundo                 |
| Resultado            | `resultText`          | Exibe o status da rodada                  |
| Histórico            | `history`             | Armazena “GANHOU”, “PERDEU” e “TIMEOUT”   |

---

## 🎨 Interface e Experiência
- Layout limpo e intuitivo
- Feedback visual imediato 
- Animações suaves (animate-pulse)
- Cores indicativas de resultado 
- Responsivo para vários tamanhos de tela
