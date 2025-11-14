import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import PaymentListPage from './pages/PaymentListPage';
import PaymentDetailsPage from './pages/PaymentDetailsPage';
import PaymentFormPage from './pages/PaymentFormPage';
import NotFoundPage from './pages/NotFoundPage';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<PaymentListPage />} />

                <Route path="/new" element={<PaymentFormPage />} />

                <Route path="/view/:id" element={<PaymentDetailsPage />} />

                <Route path="/edit/:id" element={<PaymentFormPage />} />

                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </Router>
    );
};

export default App;