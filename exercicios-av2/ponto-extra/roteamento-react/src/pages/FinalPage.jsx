import React from 'react';

const FinalPage = () => {
    return (
        <div className="final-page-container">
            <div className="glass-card-large">
                <div className="icon-circle">🚀</div>

                <h1 className="page-title" style={{textAlign: 'center'}}>Jornada Tech Concluída</h1>
                <p className="page-description" style={{textAlign: 'center'}}>
                    Você percorreu os quatro pilares fundamentais da transformação digital.
                    A trilha de conhecimento foi registrada com sucesso.
                </p>

                <div className="stats-grid">
                    <div className="stat-box">
                        <span className="stat-label">Certificação</span>
                        <span className="stat-value">Full Stack Concepts</span>
                    </div>
                    <div className="stat-box">
                        <span className="stat-label">Arquitetura</span>
                        <span className="stat-value">React SPA & History</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FinalPage;