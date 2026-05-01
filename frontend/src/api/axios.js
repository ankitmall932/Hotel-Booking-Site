import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    withCredentials: true
});

//attach token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token)
    {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${ token }`;
    }
    return config;
});

//auto refresh token
api.interceptors.response.use(
    (res) => res,
    async (err) => {
        const original = err.config;
        if (err.response?.status === 401 && !original._retry && !original.url.includes('/auth/refresh'))
        {
            original._retry = true;
            try
            {
                const res = await api.post('/auth/refresh');
                localStorage.setItem('accessToken', res.data.accessToken);
                original.headers.Authorization = `Bearer ${ res.data.accessToken }`;
                return api(original);
            } catch (error)
            {
                localStorage.removeItem('accessToken');
                return Promise.reject(error);
            }
        }
        return Promise.reject(err);
    }
);

export default api;