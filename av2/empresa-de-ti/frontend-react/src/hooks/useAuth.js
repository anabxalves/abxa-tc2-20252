import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const getLoggedInUser = () => localStorage.getItem('loggedInUser');
export const setLoggedInUser = (email) => localStorage.setItem('loggedInUser', email);
export const logoutUser = () => localStorage.removeItem('loggedInUser');

export const useAuth = () => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(!!getLoggedInUser());
    const [userEmail, setUserEmail] = useState(getLoggedInUser());

    useEffect(() => {
        const email = getLoggedInUser();
        setIsLoggedIn(!!email);
        setUserEmail(email);
    }, []);

    const login = (email) => {
        setLoggedInUser(email);
        setIsLoggedIn(true);
        setUserEmail(email);
    };

    const logout = () => {
        logoutUser();
        setIsLoggedIn(false);
        setUserEmail(null);
        navigate('/');
    };

    return { isLoggedIn, userEmail, login, logout };
};