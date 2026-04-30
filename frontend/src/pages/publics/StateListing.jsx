import React, { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { getListingsByState } from '../../api/user.api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function StateListing () {
    const nav = useNavigate();
    const { stateName } = useParams();
    const [ listings, setListings ] = useState([]);
    const [ loading, setLoading ] = useState(true);
    const [ searchTerm, setSearchTerm ] = useState('');

    useEffect(() => {
        const fetchListings = async () => {
            const { data, error } = await getListingsByState(stateName);
            if (error)
            {
                toast.error(error);
            }
            toast.success(data.message || 'Load successfully');
            setListings(data.listings);
            setLoading(false);
        };
        fetchListings();
    }, [ stateName ]);

    const filteredListings = useMemo(() => {
        return listings.filter(listing =>
            listing.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            /* listing.description.toLowerCase().includes(searchTerm.toLowerCase()) || */
            listing.location.city.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [ searchTerm, listings ]);

    if (loading) return <div>Loading...</div>;
    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Hotels  in { stateName }</h1>
            <input
                type="text"
                placeholder="Search listings..."
                value={ searchTerm }
                onChange={ (e) => setSearchTerm(e.target.value) }
                className="w-full p-2 border border-gray-300 rounded mb-4"
            />
            { filteredListings.length === 0 ? (
                <p>No listings found.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    { filteredListings.map((n) => (
                        <div key={ n._id } onClick={ () => nav(`/customer/room/${ n._id }`) } className='h-full w-110 p-5 rounded-2xl cursor-pointer flex flex-wrap gap-5'>
                            <img src={ n.images[ 0 ].url } alt={ n.name } className='w-100 h-100 bg-cover rounded-2xl' />
                            <div className="flex flex-col justify-center  gap-2">
                                <h1 className='text-2xl font-semibold'>{ n.name }</h1>
                                <h1>{ n.price }/per night</h1>
                                <h3>{ n.location.state }</h3>
                                <h3>{ n.location.city }</h3>
                            </div>
                        </div>
                    )) }
                </div>
            ) }
        </div>
    );
}

export default StateListing;