import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '~/pages/Auth/SignUp/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { isSignedUp } = useAuth();

    if (!isSignedUp) {
        return <Navigate to="/sign-up" replace />;
    }

    return children;
};

export default ProtectedRoute;