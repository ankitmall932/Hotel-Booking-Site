import api from "./axios";

export const registerUser = async (data) => {
    try
    {
        const res = await api.post('/auth/register', data);
        return { data: res.data, error: null };
    } catch (err)
    {
        return { data: null, error: err.response?.data?.message || 'user not created' };
    }
};

export const verify = async (data) => {
    try
    {
        const res = await api.post('/auth/verifyOtp', data);
        localStorage.setItem('accessToken', res.data.accessToken);
        return { data: res.data, error: null };
    } catch (err)
    {
        return { data: null, error: err.response?.data?.message || 'verification Failed' };
    }
};

export const login = async (data) => {
    try
    {
        const res = await api.post('/auth/login', data);
        localStorage.setItem('accessToken', res.data.accessToken);
        return { data: res.data, error: null };
    } catch (err)
    {
        return { data: null, error: err.response?.data?.message || 'Login failed' };
    }
};

export const resetPassword = async (data) => {
    try
    {
        const res = await api.post('/auth/resetPassword', data);
        return { data: res.data, error: null };
    } catch (err)
    {
        return { data: null, error: err.response?.data?.message || 'resetPassword Failed' };
    }
};

export const logout = async () => {
    try
    {
        const res = await api.post('/auth/logout');
        localStorage.removeItem('accessToken');
        return { data: res.data, error: null };
    } catch (err)
    {
        return { data: null, error: err.response?.data?.message || 'logout failed' };
    }
};

export const logoutAll = async () => {
    try
    {
        const res = await api.post('/auth/logoutAll');
        localStorage.removeItem('accessToken');
        return { data: res.data, error: null };
    } catch (err)
    {
        return { data: null, error: err.response?.data?.message || 'logout all devices failed' };
    }
};

export const refreshApi = async () => {
    try
    {
        const res = await api.post('/auth/refresh');
        return { data: res.data, error: null };
    } catch (err)
    {
        return { data: null, error: err.response?.data?.message || 'Refresh Failed' };
    }
};

export const switchUser = async (data) => {
    try
    {
        const res = await api.post('/auth/switchUser', data);
        return { data: res.data, error: null };
    } catch (err)
    {
        return { data: null, error: err.response?.data?.message || 'Switch Failed' };
    }
};