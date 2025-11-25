import React from 'react';
import { PAGES_DATA } from '../../data/pagesData';

const Menu = ({ activePageId, onNavigate }) => {
    return (
        <header className="app-header">
            <div className="logo">Ponto Extra</div>
            <nav>
                <ul className="nav-list">
                    {Object.values(PAGES_DATA).map((page) => (
                        <li key={page.id}>
                            <button
                                onClick={() => onNavigate(page.id, page.title)}
                                className={`nav-btn ${activePageId === page.id ? 'active' : ''}`}
                            >
                                {page.title}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
        </header>
    );
};

export default Menu;