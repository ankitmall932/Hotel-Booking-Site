import React, { useState, useEffect } from 'react';
import { createBooking, detailRoom, confirmCODBooking, createPaymentOrder, verifyPayment } from '../../api/user.api';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { useNavigate } from 'react-router-dom';
import PastTrips from '../users/PastTrips';

function BookingPage () {
    const nav = useNavigate();
    const { id } = useParams();
    const [ currentListing, setCurrentListing ] = useState(null);
    const [ currentBooking, setCurrentBooking ] = useState(null);
    const [ openShowPayment, setOpenShowPayment ] = useState(false);
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
        setCurrentBooking(res.booking);
        setLoading(false);
        setOpenShowPayment(true);
    };
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



    if (!currentListing)
    {
        return <div>Loading listing...</div>;
    }

    return (
        <div className='w-full h-full p-10 flex justify-center items-center flex-col'>
            { openShowPayment && (
                <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
                    <div className='bg-white p-5 rounded-lg text-center'>
                        <h2 className='text-xl font-semibold mb-2'>Choose The Payment Method</h2>
                        <button onClick={ async () => {
                            await handleConfirmCOD(currentBooking._id);
                        } } disabled={ loading } className='px-4 py-2 bg-green-500 text-white rounded mr-2 disabled:opacity-50'>
                            { loading ? 'Processing...' : 'Pay at Property' }
                        </button>
                        <button onClick={ async () => {
                            await handlePayment(currentBooking);
                            setOpenShowPayment(false);
                        } } disabled={ loading } className='px-4 py-2 bg-gray-500 text-white rounded disabled:opacity-50'>
                            { loading ? 'Processing...' : 'Pay Online' }
                        </button>
                    </div>
                </div>
            ) }
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