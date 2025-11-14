import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';

const PaymentListItem = ({ payment, onDelete }) => {
    const navigate = useNavigate();

    const { id, nome, valorMaximo, tipo } = payment;

    return (
        <tr style={{ borderBottom: '1px solid #eee' }}>
            <td style={{ padding: '10px' }}>{nome}</td>
            <td style={{ padding: '10px' }}>R$ {valorMaximo.toFixed(2).replace('.', ',')}</td>
            <td style={{ padding: '10px' }}>{tipo === 'ELETRONICO' ? 'Eletrônico' : 'Físico'}</td>
            <td style={{ padding: '10px' }}>
                <button
                    title="Consultar"
                    onClick={() => navigate(`/view/${id}`)}
                >
                    <FaEye />
                </button>

                <button
                    title="Alterar"
                    onClick={() => navigate(`/edit/${id}`)}
                >
                    <FaEdit />
                </button>

                <button
                    title="Excluir"
                    onClick={() => onDelete(id)}
                >
                    <FaTrash />
                </button>
            </td>
        </tr>
    );
};

export default PaymentListItem;