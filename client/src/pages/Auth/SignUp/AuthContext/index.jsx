import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isSignedUp, setIsSignedUp] = useState(false);

    return (
        <AuthContext.Provider value={{ isSignedUp, setIsSignedUp }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);