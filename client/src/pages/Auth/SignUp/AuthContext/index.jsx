import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isSignedUp, setIsSignedUp] = useState(() => {
        return JSON.parse(localStorage.getItem('isSignedUp')) || false;
    });

    useEffect(() => {
        localStorage.setItem('isSignedUp', JSON.stringify(isSignedUp));
    }, [isSignedUp]);

    return (
        <AuthContext.Provider value={{ isSignedUp, setIsSignedUp }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);