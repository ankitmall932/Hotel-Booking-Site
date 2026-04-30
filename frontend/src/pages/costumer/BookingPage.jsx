import React, { useState, useEffect } from 'react';
import { createBooking, detailRoom } from '../../api/user.api';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { useNavigate } from 'react-router-dom';

function BookingPage () {
    const nav = useNavigate();
    const { id } = useParams();
    const [ currentListing, setCurrentListing ] = useState(null);
    const [ dates, setDates ] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection',
        }
    ]);
    const [ loading, setLoading ] = useState(false);
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 2);

    useEffect(() => {
        if (!currentListing && id)
        {
            const fetchListing = async () => {
                try
                {
                    const { data: res, error } = await detailRoom(id);
                    if (error)
                    {
                        toast.error(error);
                        return;
                    }
                    setCurrentListing(res.listing);
                } catch (err)
                {
                    toast.error(err.message || 'Failed to load listing');
                }
            };
            fetchListing();
        }
    }, [ currentListing, id ]);

    const nights = Math.max(1, Math.ceil((dates[ 0 ].endDate - dates[ 0 ].startDate) / (1000 * 60 * 60 * 24)));
    const handleBooking = async () => {
        try
        {
            setLoading(true);
            const { data: res, error } = await createBooking({
                listingId: id,
                checkInDate: dates[ 0 ].startDate,
                checkOutDate: dates[ 0 ].endDate,
            });
            if (error)
            {
                toast.error(error);
                setLoading(false);
                return;
            }
            toast.success(res.message);
            nav(`/users/past-trips`);
        } catch (err)
        {
            toast.error(err.message || 'Failed to create booking');
            setLoading(false);
        }
    };

    if (!currentListing)
    {
        return <div>Loading listing...</div>;
    }

    return (
        <div className='w-full h-full p-10 flex justify-center items-center flex-col'>
            <h1 className='text-2xl font-semibold mb-5'>Book { currentListing.name }</h1>
            <p>{ currentListing.price }/night</p>
            <DateRange
                onChange={ item => setDates([ item.selection ]) }
                minDate={ new Date() }
                maxDate={ maxDate }
                ranges={ dates }
                className='border-2 border-gray-300 rounded-lg p-2'
            />
            <div className='mt-5'>
                <p>{ nights } nights</p>
                <h1 className='text-xl font-semibold mb-2'>Total Price: { currentListing.price * nights }</h1>
                <button
                    onClick={ handleBooking }
                    disabled={ loading }
                    className='px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400'
                >
                    { loading ? 'Reserving...' : 'Reserve Now' }
                </button>
            </div>
        </div>
    );
}

export default BookingPage;