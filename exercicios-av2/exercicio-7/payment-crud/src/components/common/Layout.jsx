import React from 'react';

const Layout = ({ children, title }) => {
    return (
        <div className="app-container">
            <header className="app-header">
                <h1>{title || 'CRUD de Meios de Pagamento'}</h1>
                <hr />
            </header>
            <main className="app-content">
                {children}
            </main>
        </div>
    );
};

export default Layout;