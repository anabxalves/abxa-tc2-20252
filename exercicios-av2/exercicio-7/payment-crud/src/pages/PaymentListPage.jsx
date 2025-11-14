import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import paymentApi from '../services/paymentApi';
import PaymentList from '../components/payment/PaymentList';
import Layout from '../components/common/Layout';

const PaymentListPage = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchPayments = async () => {
        try {
            const response = await paymentApi.findAll();
            setPayments(response.data);
        } catch (error) {
            console.error("Erro ao carregar meios de pagamento:", error);
            alert("Não foi possível carregar os dados. Verifique o backend.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPayments();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Tem certeza que deseja excluir este registro?')) {
            try {
                await paymentApi.remove(id);
                setPayments(payments.filter(p => p.id !== id));
                alert('Meio de pagamento excluído com sucesso!');
            } catch (error) {
                console.error("Erro ao excluir:", error);
                alert('Erro ao excluir o meio de pagamento. Tente novamente.');
            }
        }
    };

    if (loading) {
        return <Layout title="Consulta de Meios de Pagamento">Carregando dados...</Layout>;
    }

    return (
        <Layout title="Consulta de Meios de Pagamento">
            <button
                onClick={() => navigate('/new')}
                className="btn-add-new"
                style={{ marginBottom: '25px' }}
            >
                + Incluir Novo Meio de Pagamento
            </button>

            {payments.length === 0 ? (
                <p className="text-placeholder">
                    Nenhum meio de pagamento cadastrado.
                </p>
            ) : (
                <PaymentList
                    payments={payments}
                    onDelete={handleDelete}
                />
            )}
        </Layout>
    );
};

export default PaymentListPage;