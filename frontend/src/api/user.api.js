import api from "./axios";

export const profile = async () => {
    try
    {
        const res = await api.get('/user/profile');
        return { data: res.data, error: null };
    } catch (err)
    {
        return { data: null, error: err.response?.data?.message || err.message || 'profile fetching failed' };
    }
};

export const getListingsByState = async (state) => {
    try
    {
        const res = await api.get(`/user/listings/state/${ state }`);
        return { data: res.data, error: null };
    } catch (err)
    {
        return { data: null, error: err.response?.data?.message || err.message || 'listings fetching failed' };
    }
};

export const detailRoom = async (id) => {
    try
    {
        const res = await api.get(`/user/listing/${ id }`);
        return { data: res.data, error: null };
    } catch (err)
    {
        return { data: null, error: err.response?.data?.message || 'listing failed' };
    }
};

export const createBooking = async (bookingData) => {
    try
    {
        const res = await api.post('/user/bookings', bookingData);
        return { data: res.data, error: null };
    } catch (err)
    {
        return { data: null, error: err.response?.data?.message || 'booking failed' };
    }
};

export const getBookingById = async (id) => {
    try
    {
        const res = await api.get(`/user/bookings/${ id }`);
        return { data: res.data, error: null };
    } catch (err)
    {
        return { data: null, error: err.response?.data?.message || 'fetching booking failed' };
    }
};//checking for room availability

export const getUserBookings = async () => {
    try
    {
        const res = await api.get('/user/bookings');
        return { data: res.data, error: null };
    } catch (err)
    {
        return { data: null, error: err.response?.data?.message || 'fetching bookings failed' };
    }
};

export const deleteBooking = async (id) => {
    try
    {
        const res = await api.delete(`/user/bookings/${ id }`);
        return { data: res.data, error: null };
    } catch (err)
    {
        return { data: null, error: err.response?.data?.message || 'deleting booking failed' };
    }
};

export const createPaymentOrder = async (bookingId) => {
    try
    {
        const res = await api.post(`/user/bookings/${ bookingId }/create-order`);
        return { data: res.data, error: null };
    } catch (err)
    {
        return { data: null, error: err.response?.data?.message || 'creating payment order failed' };
    }
};

export const verifyPayment = async (bookingId, response) => {
    try
    {
        const res = await api.post(`/user/bookings/${ bookingId }/verify`, response);
        return { data: res.data, error: null };
    } catch (err)
    {
        return { data: null, error: err.response?.data?.message || 'verifying payment failed' };
    }
};

export const cancelBooking = async (id) => {
    try
    {
        const res = await api.put(`/user/bookings/${ id }/cancel`);
        return { data: res.data, error: null };
    }
    catch (err)
    {
        return { data: null, error: err.response?.data?.message || 'cancelling booking failed' };
    }
};