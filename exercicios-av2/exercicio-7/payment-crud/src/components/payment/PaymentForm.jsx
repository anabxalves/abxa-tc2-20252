import React, { useState, useEffect } from 'react';

const DEFAULT_FORM_DATA = { nome: '', valorMaximo: 0.0, tipo: 'ELETRONICO' };

const PaymentForm = ({ initialData, isEditMode, isReadOnly, onSubmit, onClear }) => {
    const [formData, setFormData] = useState(initialData || DEFAULT_FORM_DATA);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        setFormData(initialData || DEFAULT_FORM_DATA);
        setMessage({ type: '', text: '' });
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'valorMaximo' ? parseFloat(value) || 0 : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        if (!formData.nome || formData.nome.trim().length === 0) {
            setMessage({ type: 'error', text: "O nome é obrigatório." });
            return;
        }
        if (formData.valorMaximo <= 0) {
            setMessage({ type: 'error', text: "O valor máximo deve ser maior que zero." });
            return;
        }

        try {
            if (onSubmit) {
                await onSubmit(formData);
                setMessage({ type: 'success', text: `Registro ${isEditMode ? 'alterado' : 'incluído'} com sucesso!` });
                if (!isEditMode) {
                    setFormData(DEFAULT_FORM_DATA);
                }
            }
        } catch (error) {
            console.error("Erro no formulário:", error);
            setMessage({ type: 'error', text: "Ocorreu um erro. Tente novamente." });
        }
    };

    const handleClear = () => {
        setFormData(DEFAULT_FORM_DATA);
        setMessage({ type: '', text: '' });
        if (onClear) {
            onClear();
        }
    };

    const submitButtonText = isEditMode ? 'Alterar Pagamento' : 'Incluir Pagamento';

    return (
        <form onSubmit={handleSubmit}>
            {message.text && (
                <div className={`message-${message.type}`}>
                    {message.text}
                </div>
            )}

            <div>
                <label htmlFor="nome">Nome do Meio de Pagamento:</label>
                <input
                    id="nome"
                    name="nome"
                    type="text"
                    value={formData.nome}
                    onChange={handleChange}
                    readOnly={isReadOnly}
                    required
                />
            </div>

            <div>
                <label htmlFor="valorMaximo">Valor Máximo Permitido:</label>
                <input
                    id="valorMaximo"
                    name="valorMaximo"
                    type="number"
                    step="0.01"
                    value={formData.valorMaximo}
                    onChange={handleChange}
                    readOnly={isReadOnly}
                    required
                />
            </div>

            <div>
                <label htmlFor="tipo">Tipo:</label>
                <select
                    id="tipo"
                    name="tipo"
                    value={formData.tipo}
                    onChange={handleChange}
                    disabled={isReadOnly}
                    required
                >
                    <option value="ELETRONICO">Eletrônico</option>
                    <option value="FISICO">Físico</option>
                </select>
            </div>

            {!isReadOnly && (
                <div className="form-actions">
                    <button
                        type="button"
                        onClick={handleClear}
                        className="btn-secondary"
                    >
                        Limpar
                    </button>

                    <button
                        type="submit"
                    >
                        {submitButtonText}
                    </button>
                </div>
            )}
        </form>
    );
};

export default PaymentForm;