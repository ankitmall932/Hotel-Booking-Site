import React from 'react';
import { toast } from 'react-toastify';
import { Heart } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';

function CreateWishlists ({ listingId }) {
    const { isWishlisted, toggleWishlist, loading } = useWishlist();

    const handleCreateWishlist = async (event) => {
        event.stopPropagation();
        if (loading) return;
        const currentlyWishlisted = isWishlisted(listingId);
        const { error, message } = await toggleWishlist(listingId, currentlyWishlisted);
        if (error)
        {
            toast.error(error);
        } else
        {
            toast.success(message);
        }
    };

    return (
        <div className='absolute top-3 right-3 '>
            <button
                type='button'
                onClick={ handleCreateWishlist }
                disabled={ loading }
                className='w-11 h-11 rounded-full bg-white shadow-lg flex items-center justify-center border border-gray-200'
            >
                <Heart
                    color={ isWishlisted(listingId) ? '#bd1414' : 'black' }
                    fill={ isWishlisted(listingId) ? '#bd1414' : 'none' }
                    size={ 20 }
                />
            </button>
        </div>
    );
}

export default CreateWishlists;