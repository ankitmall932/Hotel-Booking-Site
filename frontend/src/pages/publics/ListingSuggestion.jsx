import React, { useEffect, useState } from 'react';
import { getListingsByState } from '../../api/user.api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
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
                <div >
                    { listings.length > 0 && (
                        <h1 className="text-3xl font-bold mb-4">Recently Viewed</h1>
                    ) }
                    <div className="flex flex-no-wrap gap-5 overflow-hidden shadow-2xl p-2">
                        { listings.map((n) => (
                            <div
                                key={ n._id }
                                onClick={ () =>
                                    nav(`/customer/room/${ n._id }`)
                                }
                                className='h-100 w-60 p-5 rounded-2xl cursor-pointer flex flex-col gap-5 ' >
                                <div className='relative'>
                                    <img
                                        src={ n.images[ 0 ].url }
                                        alt={ n.name }
                                        className='w-100 h-50 bg-cover rounded-2xl'
                                    />
                                </div>
                                <div className="flex flex-col justify-center gap-2">
                                    <h1 className='text-2xl font-semibold'>
                                        { n.name }
                                    </h1>
                                    <h1>
                                        ₹{ n.price } / per night
                                    </h1>
                                    <h3>
                                        { n.location.state }
                                    </h3>
                                    <h3>
                                        { n.location.city }
                                    </h3>
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