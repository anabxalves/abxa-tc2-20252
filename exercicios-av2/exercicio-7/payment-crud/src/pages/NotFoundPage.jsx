import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/common/Layout';

const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <Layout title="Erro 404 - Página Não Encontrada">
            <p style={{ fontSize: '1.2rem', margin: '30px 0' }}>
                A URL que você tentou acessar não existe.
            </p>
            <button onClick={() => navigate('/')}>
                Voltar para a Lista de Pagamentos
            </button>
        </Layout>
    );
};

export default NotFoundPage;