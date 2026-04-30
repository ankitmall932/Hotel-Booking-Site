import api from './axios';

export const createListing = async (data) => {
    try
    {
        const res = await api.post('/owner/create', data);
        return { data: res.data, error: null };
    }
    catch (err)
    {
        return { data: null, error: err.response?.data?.message || 'create listing failed' };
    }
};

export const countryData = async () => {
    try
    {
        const res = await api.get('/owner/country-data');
        return { data: res.data, error: null };
    } catch (err)
    {
        return {
            data: null, error: err.response?.data?.message || 'fetching data failed from backend'
        };
    }
};

export const userListings = async () => {
    try
    {
        const res = await api.get('/owner/user-listings');
        return { data: res.data, error: null };
    } catch (err)
    {
        return {
            data: null, error: err.response?.data?.message || 'no listing found'
        };
    }
};

export const detailListing = async (id) => {
    try
    {
        const res = await api.get(`/owner/listing/${ id }`);
        return { data: res.data, error: null };
    } catch (err)
    {
        return { data: null, error: err.response?.data?.message || 'listing failed' };
    }
};

export const imagePreview = async (id) => { //common in user\\customer also
    try
    {
        const res = await api.get(`/owner/image/${ id }`);
        return { data: res.data, error: null };
    } catch (err)
    {
        return { data: null, error: err.response?.data?.message || 'image not found ' };
    }
};

export const updateListing = async (id, data) => {
    try
    {
        const res = await api.put(`/owner/listing/update/${ id }`, data);
        return { data: res.data, error: null };
    } catch (err)
    {
        return { data: null, error: err.response?.data?.message || 'listing updation failed' };
    }
};

export const deleteListing = async (id) => {
    try
    {
        const res = await api.delete(`/owner/listing/delete/${ id }`);
        return { data: res.data, error: null };
    } catch (err)
    {
        return { data: null, error: err.response?.data?.message || 'delete failed' };
    }
};

export const getOwnerBookings = async () => {
    try
    {
        const res = await api.get('/owner/bookings');
        return { data: res.data, error: null };
    } catch (err)
    {
        return { data: null, error: err.response?.data?.message || 'fetching booking details failed' };
    }
};