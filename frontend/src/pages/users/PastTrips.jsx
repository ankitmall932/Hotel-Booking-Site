import React, { useState, useEffect } from 'react';
import { getUserBookings, deleteBooking, cancelBooking, confirmCODBooking, createPaymentOrder, verifyPayment } from '../../api/user.api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function PastTrips () {
    const nav = useNavigate();
    const [ bookings, setBookings ] = useState([]);
    const [ loading, setLoading ] = useState(true);
    const [ openShowPayment, setOpenShowPayment ] = useState(false);
    const [ selectedBooking, setSelectedBooking ] = useState(null);

    const handleConfirmCOD = async (bookingId) => {
        setLoading(true);
        const { data: res, error } = await confirmCODBooking(bookingId);
        setLoading(false);
        if (error)
        {
            toast.error(error || 'Failed to confirm COD booking');
            return;
        }
        toast.success(res.message || 'COD booking confirmed');
        setOpenShowPayment(false);
        setSelectedBooking(null);
        nav('/users/past-trips');
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
                nav('/users/past-trips');
            },
            theme: {
                color: '#F37254'
            }
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
    };


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

    if (loading)
    {
        return (
            <div className='h-full w-full flex items-center justify-center'>
                <p className='text-xl font-semibold'>Loading...</p>
            </div>
        );
    }

    return (
        <div className='h-full w-full xl:p-10 lg:p-4 md:p-2 p-1'>
            { openShowPayment && selectedBooking && (
                <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
                    <div className='bg-white p-5 rounded-lg text-center'>
                        <h2 className='text-xl font-semibold mb-2'>Choose The Payment Method</h2>
                        <button onClick={ async () => {
                            await handleConfirmCOD(selectedBooking._id);
                        } } disabled={ loading } className='px-4 py-2 bg-green-500 text-white rounded mr-2 disabled:opacity-50'>
                            { loading ? 'Processing...' : 'Pay at Property' }
                        </button>
                        <button onClick={ async () => {
                            await handlePayment(selectedBooking);
                            setOpenShowPayment(false);
                        } } disabled={ loading } className='px-4 py-2 bg-gray-500 text-white rounded disabled:opacity-50'>
                            { loading ? 'Processing...' : 'Pay Online' }
                        </button>
                    </div>
                </div>
            ) }
            <h1 className='xl:text-4xl md:text-2xl text-lg  font-semibold mb-5'>My Bookings</h1>
            <div className='xl:p-4 md:p-2 p-1'>
                { bookings.length === 0 ? (
                    <p>No bookings found.</p>
                ) : (
                    bookings.map((booking) => (
                        <div key={ booking._id } className='border-b border-gray-200 py-4 flex xl:gap-20 md:gap-15 gap-5 flex-wrap justify-start items-center'>
                            <div onClick={ () => nav(`/customer/room/${ booking.listing._id }`) } className='flex items-center  cursor-pointer'>
                                <img src={ booking.listing.images[ 0 ].url } alt={ booking.listing.name } className='w-48 h-48 object-cover rounded' />
                            </div>
                            <div className='flex flex-col gap-2 w-50'>
                                <h2 className='text-xl font-semibold'>{ booking.listing.name }</h2>
                                <h2 className='text-lg '>Total Price : { booking.totalPrice.toFixed(2) }</h2>
                                <h3>{ booking.listing.location.city }-{ booking.listing.location.state }</h3>
                                <p className='text-gray-600'>{ formatDate(booking.checkInDate) } - { formatDate(booking.checkOutDate) }</p>
                            </div>
                            <div className='flex flex-col gap-2 w-50'>                                { booking.status === 'Cancelled' ? (
                                <p className='bg-gray-500 text-white px-4 py-2 rounded cursor-not-allowed'>Cancelled</p>
                            ) : booking.status === 'Completed' ? (
                                <p className='bg-blue-600 text-white px-4 py-2 rounded cursor-not-allowed'>Completed</p>
                            ) : (
                                booking.status === 'Pending' ? (
                                    <div className='flex gap-2 mb-2'>
                                        <button onClick={ () => { setSelectedBooking(booking); setOpenShowPayment(true); } } className='bg-yellow-500 text-white px-4 py-2 rounded active:opacity-75'>Pending</button>
                                        <button className='bg-red-500 text-white px-4 py-2 rounded hover:cursor-pointer ' onClick={ () => handleDelete(booking._id) }>
                                            Delete
                                        </button>
                                    </div>
                                ) : (
                                    <div className='flex gap-2 mb-2'>
                                        { booking.paymentMethod === 'Pay_on_Property' ? (
                                            <p className='bg-yellow-500 text-white px-4 py-2 rounded cursor-not-allowed'>Pay at Property</p>
                                        ) : (
                                            <p className='bg-yellow-500 text-white px-4 py-2 rounded cursor-not-allowed'>Online</p>
                                        ) }
                                        <p className='bg-green-500 text-white px-4 py-2 rounded cursor-not-allowed'>Confirmed</p>
                                        <button className='bg-red-500 text-white px-4 py-2 rounded hover:cursor-pointer ' onClick={ () => handleCancel(booking._id) }>
                                            Cancel
                                        </button>
                                    </div>
                                )
                            ) }
                            </div>
                        </div>
                    ))
                ) }
            </div>
        </div>
    );
}

export default PastTrips;