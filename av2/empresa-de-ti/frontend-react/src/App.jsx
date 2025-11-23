import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import CadastroPage from './pages/CadastroPage';
import TrocarSenhaPage from './pages/TrocarSenhaPage';
import SolicitacaoPage from './pages/SolicitacaoPage';
import CadastroServicoPage from './pages/CadastroServicoPage';
import './global.css';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />

                <Route path="/login" element={<LoginPage />} />
                <Route path="/cadastro" element={<CadastroPage />} />
                <Route path="/trocar-senha" element={<TrocarSenhaPage />} />

                <Route path="/solicitacao" element={<SolicitacaoPage />} />
                <Route path="/cadastro-servico" element={
                    <CadastroServicoPage />
                } />

                <Route path="*" element={
                    <div style={{ padding: '50px', textAlign: 'center' }}>
                        <h1>404 | Página Não Encontrada</h1>
                        <p>A rota que você tentou acessar não existe.</p>
                        <a href="/" style={{ color: '#007bff' }}>Voltar para a Home</a>
                    </div>
                } />
            </Routes>
        </Router>
    );
}

export default App;