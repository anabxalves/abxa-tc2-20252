import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import paymentApi from '../services/paymentApi';
import Layout from '../components/common/Layout';
import PaymentForm from '../components/payment/PaymentForm';

const EMPTY_PAYMENT = { nome: '', valorMaximo: 0.0, tipo: 'ELETRONICO' };

const PaymentFormPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const isEditMode = !!id;
    const title = isEditMode ? 'Alterar Meio de Pagamento' : 'Incluir Novo Meio de Pagamento';

    const [paymentData, setPaymentData] = useState(EMPTY_PAYMENT);
    const [loading, setLoading] = useState(isEditMode);

    useEffect(() => {
        if (isEditMode) {
            const fetchPayment = async () => {
                try {
                    const response = await paymentApi.findById(id);
                    setPaymentData(response.data);
                } catch (error) {
                    console.error("Erro ao carregar dados para edição:", error);
                    alert("Registro para edição não encontrado.");
                    navigate('/');
                } finally {
                    setLoading(false);
                }
            };
            fetchPayment();
        }
    }, [id, isEditMode, navigate]);

    const handleSubmit = async (data) => {
        try {
            if (isEditMode) {
                await paymentApi.update(id, data);
                alert('Registro alterado com sucesso!');
            } else {
                await paymentApi.create(data);
                alert('Registro incluído com sucesso!');
            }
            navigate('/');
        } catch (error) {
            console.error("Erro na operação:", error);
            alert(`Erro ao ${isEditMode ? 'alterar' : 'incluir'} o registro.`);
        }
    };

    const handleClear = () => {
        setPaymentData(EMPTY_PAYMENT);
    };

    if (loading) {
        return <Layout title={title}>Carregando dados...</Layout>;
    }

    return (
        <Layout title={title}>
            <PaymentForm
                initialData={paymentData}
                isEditMode={isEditMode}
                isReadOnly={false}
                onSubmit={handleSubmit}
                onClear={handleClear}
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

export default PaymentFormPage;