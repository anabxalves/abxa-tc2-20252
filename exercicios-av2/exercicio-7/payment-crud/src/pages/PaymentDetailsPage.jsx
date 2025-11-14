import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import paymentApi from '../services/paymentApi';
import Layout from '../components/common/Layout';
import PaymentForm from '../components/payment/PaymentForm';

const PaymentDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [payment, setPayment] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPayment = async () => {
            try {
                const response = await paymentApi.findById(id);
                setPayment(response.data);
            } catch (error) {
                console.error("Erro ao buscar registro:", error);
                alert("Registro não encontrado ou erro de comunicação.");
                navigate('/');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchPayment();
        }
    }, [id, navigate]);

    if (loading) {
        return <Layout title="Consultar Meio de Pagamento">Carregando detalhes...</Layout>;
    }

    if (!payment) {
        return <Layout title="Consultar Meio de Pagamento">Registro não encontrado.</Layout>;
    }

    return (
        <Layout title="Consultar Meio de Pagamento">
            <PaymentForm
                initialData={payment}
                isEditMode={false}
                isReadOnly={true}
            />

            <button
                onClick={() => navigate('/')}
                className="btn-centered"
            >
                Voltar para a Lista
            </button>
        </Layout>
    );
};

export default PaymentDetailsPage;