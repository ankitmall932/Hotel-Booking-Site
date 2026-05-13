import React from 'react';
import { Trash2 } from 'lucide-react';
import { useWishlistStore } from '../../store/wishlistStore';
import { useNavigate } from 'react-router-dom';

function ShowWishlists () {
    const nav = useNavigate();
    const { toggleWishlist, wishlist } = useWishlistStore();
    return (
        <div className='p-5'>
            <h2 className='text-2xl font-bold mb-4 text-center'>My Wishlists</h2>
            { wishlist.length === 0 ? (
                <p>Your wishlist is empty.</p>
            ) : (
                <ul className='flex flex-wrap gap-10'>
                    { wishlist.map((item) => (
                        <li key={ item._id } className='flex px-5 py-2 w-130 border-2 rounded justify-between items-center'>
                            <img src={ item.listing.images[ 0 ].url } alt={ item.listing.name } className='w-20 h-20 rounded cursor-pointer' onClick={ () => nav(`/customer/room/${ item.listing._id }`) } />
                            <div>
                                <h3>{ item.listing.name }</h3>
                                <p>₹{ item.listing.price.toFixed(2) }/night</p>
                            </div>
                            <button className='bg-red-500 text-white size-15 flex items-center justify-center rounded-full cursor-pointer hover:bg-red-800' onClick={ () => toggleWishlist(item.listing) }>
                                <Trash2 />
                            </button>
                        </li>
                    )) }
                </ul>
            ) }
        </div>
    );
}

export default ShowWishlists;