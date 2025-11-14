import React from 'react';
import PaymentListItem from './PaymentListItem';

const PaymentList = ({ payments, onDelete }) => {
    return (
        <table>
            <thead>
            <tr>
                <th>Nome</th>
                <th>Valor Máximo</th>
                <th>Tipo</th>
                <th>Ações</th>
            </tr>
            </thead>
            <tbody>
            {payments.map(payment => (
                <PaymentListItem
                    key={payment.id}
                    payment={payment}
                    onDelete={onDelete}
                />
            ))}
            </tbody>
        </table>
    );
};

export default PaymentList;