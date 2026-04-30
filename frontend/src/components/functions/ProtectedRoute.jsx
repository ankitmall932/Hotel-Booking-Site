import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
function ProtectedRoute ({ children }) {
    const { user, loading } = useAuth();
    if (loading)
    {
        return (
            <div className="flex-col h-screen  gap-4 w-full flex items-center justify-center">
                <div
                    className="w-20 h-20 border-4 border-transparent text-blue-400 text-4xl animate-spin flex items-center justify-center border-t-blue-400 rounded-full"
                >
                    <div
                        className="w-16 h-16 border-4 border-transparent text-red-400 text-2xl animate-spin flex items-center justify-center border-t-red-400 rounded-full"
                    ></div>
                </div>
            </div>
        );
    }
    return user ? children : <Navigate to='/' replace />;
}

export default ProtectedRoute;