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
        <button className='absolute top-3 right-3 z-10  p-3 rounded-full bg-white shadow-lg' onClick={ handleWishlistToggle }>
            <Heart className={ `w-5 h-5 ${ wishlisted ? 'fill-red-500 text-red-500' : 'text-gray-500' }` } />
        </button>
    );
}

export default CreateWishlists;