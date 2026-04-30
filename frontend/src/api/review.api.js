import api from './axios';

export const createReview = async (listingId, data) => {
    try
    {
        const res = await api.post(`/review/${ listingId }`, data);
        return { data: res.data, error: null };
    } catch (err)
    {
        return { data: null, error: err.response?.data?.message || 'Review creation failed' };
    }
};

export const getReviewsForListing = async (listingId) => {
    try
    {
        const res = await api.get(`/review/${ listingId }`);
        return { data: res.data, error: null };
    } catch (err)
    {
        return { data: null, error: err.response?.data?.message || 'Failed to fetch reviews for listing' };
    }
};

export const getReviewsByUser = async () => {
    try
    {
        const res = await api.get(`/review/user-reviews`);
        return { data: res.data, error: null };
    } catch (err)
    {
        return { data: null, error: err.response?.data?.message || 'Failed to fetch reviews by user' };
    }
};

export const deleteReview = async (reviewId) => {
    try
    {
        const res = await api.delete(`/review/${ reviewId }`);
        return { data: res.data, error: null };
    } catch (err)
    {
        return { data: null, error: err.response?.data?.message || 'Failed to delete review' };
    }
};
