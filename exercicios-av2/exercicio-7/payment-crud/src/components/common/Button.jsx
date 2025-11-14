import React from 'react';

const Button = ({ children, onClick, type = 'button', variant = 'primary', style = {} }) => {
    const baseStyle = {
        ...style
    };

    return (
        <button
            type={type}
            onClick={onClick}
            style={baseStyle}
        >
            {children}
        </button>
    );
};

export default Button;