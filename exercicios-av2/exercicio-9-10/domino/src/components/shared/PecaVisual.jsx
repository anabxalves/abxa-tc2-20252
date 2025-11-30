import React from 'react';
import { CabecaPeca } from '../../logic/GameLogic';

const cabecaParaNumero = (cabeca) => {
    return Object.values(CabecaPeca).indexOf(cabeca);
};

const PecaVisual = ({ peca, size = 'peca', playerClass = '' }) => {
    const isPecaPuxada = size === 'peca';
    if (!peca) return (
        <div
            className={isPecaPuxada ? "peca" : "peca-pequena"}
            style={{border: '1px dashed #ccc', backgroundColor: '#f9f9f9'}}
        >
            {isPecaPuxada ? <p style={{color: '#666', margin: 0, fontSize: '0.8rem'}}>Puxar Peça</p> : null}
        </div>
    );

    const renderPontos = (valor) => {
        const pontos = [];
        for (let i = 0; i < valor; i++) {
            pontos.push(<div key={i} className="ponto"></div>);
        }
        return pontos;
    };

    const tamanhoClasse = isPecaPuxada ? 'peca' : 'peca-pequena';

    return (
        <div className={`${tamanhoClasse} ${playerClass}`}>
            <div className={`metade metade-${cabecaParaNumero(peca.esquerda)}`}>
                {renderPontos(cabecaParaNumero(peca.esquerda))}
            </div>
            {isPecaPuxada && <div className="divisor-peca"></div>}
            <div className={`metade metade-${cabecaParaNumero(peca.direita)}`}>
                {renderPontos(cabecaParaNumero(peca.direita))}
            </div>
        </div>
    );
};

export default PecaVisual;