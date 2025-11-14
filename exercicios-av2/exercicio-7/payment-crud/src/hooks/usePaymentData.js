import { useState, useEffect, useCallback } from 'react';
import paymentApi from '../services/paymentApi';

const usePaymentData = (id = null) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            let response;
            if (id) {
                response = await paymentApi.findById(id);
            } else {
                response = await paymentApi.findAll();
            }
            setData(response.data);
        } catch (err) {
            console.error("Erro na busca de dados:", err);
            setError("Falha ao carregar dados. Verifique a conexão com a API.");
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { data, loading, error, refetch: fetchData };
};

export default usePaymentData;