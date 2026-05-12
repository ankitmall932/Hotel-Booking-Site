/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { createWishlist, deleteWishlistItem, getWishlist } from '../api/user.api';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
    const [ wishlist, setWishlist ] = useState([]);
    const [ loading, setLoading ] = useState(true);
    const [ error, setError ] = useState(null);

    const refreshWishlist = async () => {
        setLoading(true);
        const { data, error } = await getWishlist();
        if (error)
        {
            setError(error);
            setWishlist([]);
        } else
        {
            setError(null);
            setWishlist(data.wishlist || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        refreshWishlist();
    }, []);

    const wishlistIds = useMemo(
        () => new Set(wishlist.map((item) => item.listing?._id || item.listing)),
        [ wishlist ]
    );

    const isWishlisted = (listingId) => wishlistIds.has(listingId);

    const toggleWishlist = async (listingId, currentlyWishlisted) => {
        if (!listingId)
        {
            return { error: 'Listing ID is required' };
        }
        if (currentlyWishlisted)
        {
            const { data, error } = await deleteWishlistItem(listingId);
            if (error)
            {
                return { error };
            }
            setWishlist((prev) => prev.filter((item) => (item.listing?._id || item.listing) !== listingId));
            return { message: data?.message || 'Removed from wishlist' };
        }
        const { data, error } = await createWishlist(listingId);
        if (error)
        {
            return { error };
        }
        await refreshWishlist();
        return { message: data?.message || 'Added to wishlist' };
    };

    return (
        <WishlistContext.Provider
            value={ {
                wishlist,
                loading,
                error,
                isWishlisted,
                toggleWishlist
            } }
        >
            { children }
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => useContext(WishlistContext);
