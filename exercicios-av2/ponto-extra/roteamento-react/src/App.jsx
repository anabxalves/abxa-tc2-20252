import React, { useState } from 'react';
import './index.css';
import { PAGES_DATA } from './data/pagesData';
import Menu from './components/layout/Menu';
import Breadcrumb from './components/layout/Breadcrumb';
import ContentPage from './pages/ContentPage';
import FinalPage from './pages/FinalPage';

function App() {
    const [currentPageId, setCurrentPageId] = useState('page1');

    const [history, setHistory] = useState([
        { id: 'page1', title: 'Inteligência Artificial' }
    ]);

    const handleMenuNavigation = (pageId, pageTitle) => {
        if (currentPageId === pageId) return;

        const newStep = { id: pageId, title: pageTitle };

        setCurrentPageId(pageId);
        setHistory((prevHistory) => [...prevHistory, newStep]);
    };

    const handleNavigateToFinal = () => {
        if (currentPageId === 'final') return;

        const finalPageData = { id: 'final', title: 'Conclusão' };
        setCurrentPageId('final');
        setHistory((prev) => [...prev, finalPageData]);
    };

    const handleBreadcrumbClick = (index) => {
        const targetItem = history[index];

        const newHistory = history.slice(0, index + 1);

        setHistory(newHistory);
        setCurrentPageId(targetItem.id);
    };

    const renderCurrentPage = () => {
        if (currentPageId === 'final') {
            return <FinalPage />;
        }
        const pageData = PAGES_DATA[currentPageId];
        if (pageData) {
            return (
                <ContentPage
                    data={pageData}
                    onNavigateToFinal={handleNavigateToFinal}
                />
            );
        }
        return <div>Erro 404</div>;
    };

    return (
        <div className="app-container">
            <div className="background-blobs">
                <div className="blob one"></div>
                <div className="blob two"></div>
                <div className="blob three"></div>
            </div>

            <Menu activePageId={currentPageId} onNavigate={handleMenuNavigation} />

            <main className="main-content">
                <Breadcrumb
                    history={history}
                    onNavigateBack={handleBreadcrumbClick}
                />

                {renderCurrentPage()}
            </main>

            <footer className="app-footer">
                abxa © Programação Frontend
            </footer>
        </div>
    );
}

export default App;