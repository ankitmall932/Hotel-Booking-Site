import React, { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { getListingsByState } from '../../api/user.api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import CreateWishlists from '../users/CreateWishlists';
function StateListing () {
    const nav = useNavigate();
    const { stateName } = useParams();
    const [ listings, setListings ] = useState([]);
    const [ loading, setLoading ] = useState(true);
    const [ searchTerm, setSearchTerm ] = useState('');
    const [ showFilter, setShowFilter ] = useState(false);
    const [ sortOrder, setSortOrder ] = useState('');
    const [ maxPrice, setMaxPrice ] = useState(20000);
    const [ appliedFilters, setAppliedFilters ] = useState({
        sort: '',
        maxPrice: 20000,
    });
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
    const filteredListings = useMemo(() => {
        let filtered = listings.filter(
            (listing) =>
                listing.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                listing.location.city.toLowerCase().includes(searchTerm.toLowerCase())
        );
        filtered = filtered.filter((listing) => listing.price <= appliedFilters.maxPrice);
        if (appliedFilters.sort === 'lowToHigh')
        {
            filtered.sort((a, b) => a.price - b.price);
        }
        if (appliedFilters.sort === 'highToLow')
        {
            filtered.sort((a, b) => b.price - a.price);
        }
        return filtered;
    }, [ listings, searchTerm, appliedFilters ]);
    const applyFilters = () => {
        setAppliedFilters({
            sort: sortOrder,
            maxPrice,
        });
        setShowFilter(false);
    };
    if (loading) return <div>Loading...</div>;
    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">
                Hotels in { stateName }
            </h1>
            <div className='flex mb-5 justify-between items-center relative'>
                <input
                    type="text"
                    placeholder="Search listings..."
                    value={ searchTerm }
                    onChange={ (e) => setSearchTerm(e.target.value) }
                    className="w-100 p-2 border border-gray-300 rounded "
                />
                <div className='relative'>
                    <button
                        onClick={ () => setShowFilter(!showFilter) }
                        className='py-2 px-4 bg-red-500 rounded text-white'
                    >
                        Filter
                    </button>
                    {
                        showFilter && (
                            <div className='absolute right-20 top-0 w-70 bg-white shadow-2xl border rounded-2xl p-5 flex flex-col gap-5 z-50'>
                                <div className='flex flex-col gap-2'>
                                    <label className='font-semibold'>
                                        Sort By Price
                                    </label>
                                    <select
                                        value={ sortOrder }
                                        onChange={ (e) => setSortOrder(e.target.value) }
                                        className='border p-2 rounded'
                                    >
                                        <option value="">
                                            Select
                                        </option>
                                        <option value="lowToHigh">
                                            Price Low To High
                                        </option>
                                        <option value="highToLow">
                                            Price High To Low
                                        </option>
                                    </select>
                                </div>
                                <div className='flex flex-col gap-2'>
                                    <label className='font-semibold'>
                                        Max Price : ₹{ maxPrice }
                                    </label>
                                    <input
                                        type="range"
                                        min="1000"
                                        max="20000"
                                        step="500"
                                        value={ maxPrice }
                                        onChange={ (e) =>
                                            setMaxPrice(Number(e.target.value))
                                        }
                                    />
                                </div>
                                <button
                                    onClick={ applyFilters }
                                    className='py-2 bg-black text-white rounded-xl'
                                >
                                    Apply Now
                                </button>
                            </div>
                        )
                    }
                </div>
            </div>
            {
                filteredListings.length === 0 ? (
                    <p>No listings found.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {
                            filteredListings.map((n) => (
                                <div
                                    key={ n._id }
                                    onClick={ () =>
                                        nav(`/customer/room/${ n._id }`)
                                    }
                                    className='h-full w-110 p-5 rounded-2xl cursor-pointer flex flex-col gap-5' >
                                    <div className='relative'>
                                        <CreateWishlists
                                            listing={ n }
                                        />
                                        <img
                                            src={ n.images[ 0 ].url }
                                            alt={ n.name }
                                            className='w-100 h-100 bg-cover rounded-2xl'
                                        />
                                    </div>
                                    <div className="flex flex-col justify-center">
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
                            ))
                        }
                    </div>
                )
            }
        </div>
    );
}

export default StateListing;