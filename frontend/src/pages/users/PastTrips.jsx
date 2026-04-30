import React, { useState, useEffect } from 'react';
import { getUserBookings, createPaymentOrder, verifyPayment, deleteBooking, cancelBooking } from '../../api/user.api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function PastTrips () {
    const nav = useNavigate();
    const [ bookings, setBookings ] = useState([]);
    const [ loading, setLoading ] = useState(true);

    // Fetch user bookings on component mount
    useEffect(() => {
        const fetchBookings = async () => {
            setLoading(true);
            const { data: res, error } = await getUserBookings();
            setLoading(false);
            if (error)
            {
                toast.error('Failed to fetch bookings');
                return;
            }
            toast.success(res.message || 'Bookings fetched successfully');
            setBookings(res.bookings || []);
        };
        fetchBookings();
    }, []);

    // Helper function to format date
    const formatDate = (dateStr) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateStr).toLocaleDateString(undefined, options);
    };

    // Handle delete booking
    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this booking?'))
        {
            return;
        }
        const { data: res, error } = await deleteBooking(id);
        if (error)
        {
            toast.error('Failed to delete booking');
            return;
        }
        toast.success(res.message || 'Booking deleted successfully');
        window.location.reload();
    };

    // Handle payment for pending bookings
    const handlePayment = async (booking) => {
        const { data: res, error } = await createPaymentOrder(booking._id);
        if (error)
        {
            toast.error(error || 'Failed to create payment order');
            return;
        }
        if (!window.Razorpay)
        {
            toast.error('Razorpay is not loaded');
            return;
        }
        const options = {
            key: res.key,
            amount: res.order.amount,
            currency: res.order.currency,
            name: 'Hotel Booking',
            description: `Payment for booking ${ booking._id }`,
            order_id: res.order.id,
            handler: async (response) => {
                const { data: verifyRes, error: verifyError } = await verifyPayment(booking._id, response);
                if (verifyError)
                {
                    toast.error(verifyError || 'Payment verification failed');
                    return;
                }
                toast.success(verifyRes.message || 'Payment successful');
                window.location.reload();
            },
            theme: {
                color: '#F37254'
            }
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
    };

    // Handle cancel booking
    const handleCancel = async (id) => {
        if (!window.confirm('Are you sure you want to cancel this booking?'))
        {
            return;
        }
        const { data: res, error } = await cancelBooking(id);
        if (error)
        {
            toast.error(error || 'Failed to cancel booking');
            return;
        }
        toast.success(res.message || 'Booking cancelled successfully');
        window.location.reload();
    };

    return (
        loading ? (
            <div className='h-full w-full flex items-center justify-center'>
                <p className='text-xl font-semibold'>Loading...</p>
            </div>
        ) : (
            <div className='h-full w-full p-10'>
                <h1 className='text-4xl font-semibold mb-5'>My Bookings</h1>
                <div className='p-4'>
                    { bookings.length === 0 ? (
                        <p>No bookings found.</p>
                    ) : (
                        bookings.map((booking) => (
                            <div key={ booking._id } className='border-b border-gray-200 py-4 flex justify-between items-center'>
                                <div onClick={ () => nav(`/customer/room/${ booking.listing._id }`) } className='flex items-center gap-4 cursor-pointer'>
                                    <img src={ booking.listing.images[ 0 ].url } alt={ booking.listing.name } className='w-48 h-48 object-cover rounded' />
                                </div>
                                <div>
                                    { booking.status === 'Cancelled' ? (
                                        <p className='bg-gray-500 text-white px-4 py-2 rounded cursor-not-allowed'>Cancelled</p>
                                    ) : (

                                        booking.status === 'Pending' ? (
                                            <div className='flex gap-2 mb-2'>
                                                <p className='bg-yellow-500 text-white px-4 py-2 rounded cursor-not-allowed'>Pending</p>
                                                <button className='bg-blue-500 text-white px-4 py-2 rounded hover:cursor-pointer ' onClick={ () => handlePayment(booking) }>
                                                    Pay Now
                                                </button>
                                                <button className='bg-red-500 text-white px-4 py-2 rounded hover:cursor-pointer ' onClick={ () => handleDelete(booking._id) }>
                                                    Delete
                                                </button>
                                            </div>
                                        ) : (
                                            <div className='flex gap-2 mb-2'>
                                                <p className='bg-green-500 text-white px-4 py-2 rounded cursor-not-allowed'>Confirmed</p>
                                                <button className='bg-red-500 text-white px-4 py-2 rounded hover:cursor-pointer ' onClick={ () => handleCancel(booking._id) }>
                                                    Cancel
                                                </button>
                                            </div>
                                        )
                                    ) }
                                </div>
                                <div className='flex flex-col gap-2 w-50'>
                                    <h2 className='text-xl font-semibold'>{ booking.listing.name }</h2>
                                    <h2 className='text-lg '>Total Price : { booking.totalPrice.toFixed(2) }</h2>
                                    <h3>{ booking.listing.location.city }-{ booking.listing.location.state }</h3>
                                    <p className='text-gray-600'>{ formatDate(booking.checkInDate) } - { formatDate(booking.checkOutDate) }</p>
                                </div>
                            </div>
                        ))
                    ) }
                </div>
            </div>
        )
    );
}

export default PastTrips;