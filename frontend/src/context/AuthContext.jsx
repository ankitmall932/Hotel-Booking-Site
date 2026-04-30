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
            try
            {
                const res = await refreshApi();
                if (res?.data?.accessToken)
                {
                    const profileResponse = await profile();
                    setUser(profileResponse.data);
                } else
                {
                    setUser(null);
                }
            } catch
            {
                console.log('error');
                setUser(null);
            }
            finally
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