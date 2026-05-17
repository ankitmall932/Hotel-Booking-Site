import React from 'react';
import { Heart } from 'lucide-react';
import { useWishlistStore } from '../../store/wishlistStore';

function CreateWishlists ({ listing }) {
    const { toggleWishlist, isWishlisted } = useWishlistStore();
    const wishlisted = isWishlisted(listing._id);
    const handleWishlistToggle = (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlist(listing);
    };

    return (
        <button className='absolute top-3 right-3 z-10  sm:p-3 p-2 rounded-full bg-white shadow-lg' onClick={ handleWishlistToggle }>
            <Heart className={ `sm:w-5 sm:h-5 w-4 h-4 ${ wishlisted ? 'fill-red-500 text-red-500' : 'text-gray-500' }` } />
        </button>
    );
}

export default CreateWishlists;