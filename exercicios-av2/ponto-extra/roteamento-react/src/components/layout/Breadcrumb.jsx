import React from 'react';

const Breadcrumb = ({ history, onNavigateBack }) => {
    return (
        <nav className="breadcrumb">
            <ol>
                <li className="breadcrumb-separator">Trilha:</li>
                {history.map((step, index) => {
                    const isLast = index === history.length - 1;

                    return (
                        <li key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {index > 0 && <span className="breadcrumb-separator">/</span>}

                            {isLast ? (
                                <span className="breadcrumb-current">
                  {step.title}
                </span>
                            ) : (
                                <button
                                    onClick={() => onNavigateBack(index)}
                                    className="breadcrumb-btn"
                                >
                                    {step.title}
                                </button>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
};

export default Breadcrumb;