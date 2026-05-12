import React from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useWishlist } from '../../context/WishlistContext';

function ShowWishlists () {
    const nav = useNavigate();
    const { wishlist, loading, toggleWishlist } = useWishlist();

    const handleDelete = async (listingId) => {
        const { error, message } = await toggleWishlist(listingId, true);
        if (error)
        {
            toast.error(error);
            return;
        }
        toast.success(message);
    };

    if (loading)
    {
        return <div>Loading...</div>;
    }

    return (
        <div className='p-6'>
            <h2 className='text-2xl font-bold mb-4'>My Wishlist</h2>
            { wishlist.length === 0 ? (
                <p>You have no items in your wishlist.</p>
            ) : (
                <ul className='flex flex-wrap gap-5'>
                    { wishlist.map((item) => (
                        <li key={ item._id } className='p-4 border w-130 rounded-lg flex justify-between items-center'>
                            <div onClick={ () => nav(`/customer/room/${ item.listing._id }`) } className='cursor-pointer'>
                                <img src={ item.listing?.images[ 0 ].url || '/default-image.jpg' } alt={ item.listing?.name || 'Unknown Listing' } className='w-25 h-25 object-cover rounded' />
                                <h3 className='text-lg font-semibold'>{ item.listing?.name || 'Unknown Listing' }</h3>
                                <p className='text-sm text-gray-600'>{ item.listing?.location?.city || 'Unknown Location' }</p>
                            </div>
                            <button
                                onClick={ () => handleDelete(item.listing._id) }
                                className='px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600'
                            >
                                Remove
                            </button>
                        </li>
                    )) }
                </ul>
            ) }
        </div>
    );
}

export default ShowWishlists;