import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import { getWishlist, toggleWishlist } from '../api/user.api';

const workspace = (set, get) => ({
    wishlist: [],

    fetchWishlist: async () => {
        const { data, error } = await getWishlist();
        if (error)
        {
            console.error('Failed to fetch wishlist:', error);
            return;
        }
        set({ wishlist: data.wishlist });
    },

    toggleWishlist: async (listing) => {
        const wishlist = get().wishlist;
        const exists = wishlist.some((item) => item.listing._id === listing._id);
        if (exists)
        {
            set({ wishlist: wishlist.filter((item) => item.listing._id !== listing._id) });
        } else
        {
            set({ wishlist: [ ...wishlist, { listing } ] });
        }
        const { error } = await toggleWishlist(listing._id);
        if (error)
        {
            get().fetchWishlist();
        }
    },

    isWishlisted: (listingId) => {
        return get().wishlist.some((item) => item.listing._id === listingId);
    },
    clearWishlist: () => set({ wishlist: [] }),
});

export const useWishlistStore = create(devtools(persist(workspace, {
    name: 'wishlist-storage',
})));