import React, { useEffect, useState } from 'react';
import { getListingsByState } from '../../api/user.api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import CreateWishlists from '../users/CreateWishlists';
function ListingSuggestion () {
    const nav = useNavigate();
    const [ listings, setListings ] = useState([]);
    const [ loading, setLoading ] = useState(true);
    const stateName = localStorage.getItem('stateName');
    useEffect(() => {
        const fetchListings = async () => {
            const { data, error } = await getListingsByState(stateName);
            if (error)
            {
                toast.error(error);
                return;
            }
            localStorage.setItem('stateName', stateName);
            setListings(data.listings);
            setLoading(false);
        };
        fetchListings();
    }, [ stateName ]);
    return (
        <div className="p-4">
            { loading ? (
                <div>Loading...</div>
            ) : (
                <div  >
                    { listings.length > 0 && (
                        <h1 className="sm:text-3xl text-lg  sm:font-bold font-semibold mb-4">Recently Viewed</h1>
                    ) }
                    <div className="flex flex-nowrap shadow-2xl gap-4 overflow-x-auto no-scrollbar p-2">
                        { listings.map((n) => (
                            <div
                                key={ n._id }
                                onClick={ () =>
                                    nav(`/customer/room/${ n._id }`)
                                }
                                className='h-fit w-fit  rounded-2xl  cursor-pointer flex flex-col gap-2 shrink-0' >
                                <div className='relative '>
                                    <CreateWishlists listing={ n } />
                                    <img
                                        src={ n.images[ 0 ].url }
                                        alt={ n.name }
                                        className='sm:w-40 sm:h-40 w-30 h-30 bg-cover rounded-2xl'
                                    />
                                </div>
                                <div className="flex flex-col justify-center gap-2">
                                    <h1 className='sm:text-xl text-sm font-semibold'>
                                        { n.name }
                                    </h1>
                                    <h1 className='sm:text-lg text-sm font-semibold text-gray-500'>
                                        ₹{ n.price } / per night
                                    </h1>
                                </div>
                            </div>
                        )) }
                    </div>
                </div>
            ) }
        </div>
    );
}

export default ListingSuggestion;