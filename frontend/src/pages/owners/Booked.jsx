import React, { useState, useEffect } from 'react';
import { getOwnerBookings } from '../../api/owner.api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function Booked () {
    const nav = useNavigate();
    const [ bookings, setBookings ] = useState([]);

    useEffect(() => {
        const fetchBookings = async () => {
            const { data: res, error } = await getOwnerBookings();
            if (error)
            {
                toast.error(error);
            }
            setBookings(res.bookings);
            toast.success(res.message);

        };
        fetchBookings();
    }, []);

    const formatDate = (dateStr) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateStr).toLocaleDateString(undefined, options);
    };

    const totalEarnings = bookings.reduce((total, booking) => {
        if (booking.status === 'Confirmed')
        {
            return total + booking.totalPrice;
        }
        else if (booking.status === 'Cancelled')
        {
            return total + booking.totalPrice * 0.2; // Assuming 20% cancellation fee
        }
        return total;
    }, 0).toFixed(2);

    return (
        <div className='h-full w-full p-25'>
            <h1 className='text-4xl font-semibold mb-5'>User Bookings</h1>
            <div className='p-4'>
                { bookings.map((booking) => (
                    <div key={ booking._id } className='border-b border-gray-200 py-4 flex justify-between items-center'>
                        <div onClick={ () => nav(`/host/listing/${ booking.listing._id }`) } className='flex items-center gap-4 cursor-pointer'>
                            <img src={ booking.listing.images[ 0 ].url } alt={ booking.listing.name } className='w-48 h-48 object-cover rounded' />
                        </div>
                        <div>
                            { booking.status === 'Pending' && <p className='bg-yellow-500 text-white px-4 py-2 rounded cursor-not-allowed'>Pending</p> }
                            { booking.status === 'Confirmed' && <p className='bg-green-500 text-white px-4 py-2 rounded cursor-not-allowed'>Confirmed</p> }
                            { booking.status === 'Cancelled' && <p className='bg-red-500 text-white px-4 py-2 rounded cursor-not-allowed'>Cancelled</p> }
                        </div>
                        <div className='flex flex-col gap-2 w-80'>
                            <h2 className='text-xl font-semibold'>{ booking.listing.name }</h2>
                            <h2 className='text-lg '>Total Price : { booking.totalPrice.toFixed(2) }</h2>
                            <h3>Booked by: { booking.user.name }</h3>
                            <h3>{ booking.user.email }</h3>
                            <p className='text-gray-600'>{ formatDate(booking.checkInDate) } - { formatDate(booking.checkOutDate) }</p>
                        </div>
                    </div>
                )) }
            </div>
            <div className='p-4 mt-5 flex justify-end'>
                <h1>Total Earnings: { totalEarnings }</h1>
            </div>
        </div>
    );
}

export default Booked;