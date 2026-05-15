/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useEffect, useContext } from 'react';
import { refreshApi } from '../api/auth.api';
import { profile } from '../api/user.api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [ user, setUser ] = useState(() => {
        const token = localStorage.getItem('accessToken');
        return token ? { accessToken: token } : null;
    });
    const [ loading, setLoading ] = useState(true);
    useEffect(() => {
        const init = async () => {
            const token = localStorage.getItem('accessToken');
            if (!token)
            {
                setUser(null);
                setLoading(false);
                return;
            }
            try
            {
                const profileResponse = await profile();
                setUser(profileResponse.data);
            } catch
            {
                try
                {
                    const res = await refreshApi();
                    localStorage.setItem('accessToken', res.data.accessToken);
                    const profileResponse = await profile();
                    setUser(profileResponse.data);
                } catch
                {
                    localStorage.removeItem('accessToken');
                    setUser(null);
                }
            } finally
            {
                setLoading(false);
            }
        };
        init();
    }, []);
    return (
        <AuthContext.Provider value={ { user, setUser, loading } }>
            { children }
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);