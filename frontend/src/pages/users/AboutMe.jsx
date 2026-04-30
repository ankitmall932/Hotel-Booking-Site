import React, { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { NavLink } from 'react-router-dom';
import NameIcon from '../../components/functions/NameIcon';
import { getReviewsByUser, deleteReview } from '../../api/review.api';
import Rating from '@mui/material/Rating';

function AboutMe () {
    const { user } = useAuth();
    const [ reviews, setReviews ] = React.useState([]);


    // Fetch user reviews on component mount
    useEffect(() => {
        const fetchReviews = async () => {
            const { data: res, error } = await getReviewsByUser();
            if (error)
            {
                toast.error(error);
                return;
            }
            else
            {
                setReviews(res.review);
                toast.success(res.message || 'Reviews fetched successfully');
            }
        };
        fetchReviews();
    }, []);

    const handleDeleteReview = async (reviewId) => {
        if (!window.confirm('Are you sure you want to delete this review?'))
        {
            return;
        }
        const { data: res, error } = await deleteReview(reviewId);
        if (error)
        {
            toast.error(error);
            return;
        }
        toast.success(res.message || 'Review deleted successfully');
        window.location.reload();
    };


    return (
        <div className='w-full h-fit p-25 flex flex-col gap-10'>
            <h1 className='text-4xl font-semibold'>About Me</h1>
            <div className='h-fit w-full flex justify-center items-center gap-10   '>
                <div className='w-1/2 shadow-2xl flex flex-col justify-center items-center px-10 py-5 gap-3 rounded-2xl'>
                    <div className="p-10 text-4xl h-25 w-25 rounded-full bg-black flex justify-center items-center"><NameIcon /></div>
                    <h1 className='text-4xl font-semibold'>{ user?.name }</h1>
                    <h1 className='text-lg font-semibold'>{ user?.email }</h1>
                    <h1 className='text-lg font-semibold'>{ user?.currentRole }</h1>
                </div>
            </div>
            <div className='border-2 border-gray-200'></div>
            <h1 className='text-4xl font-semibold'>My Reviews</h1>
            <div className='flex flex-wrap gap-5'>
                { reviews.length === 0 ? (
                    <p>No reviews yet.</p>
                ) : (
                    reviews.map((review) => (
                        <div key={ review._id } className='border-2 p-2 flex flex-col gap-2 rounded border-gray-300 py-4 w-106'>
                            <NavLink to={ `/customer/room/${ review.listing?._id }` } className='text-xl font-semibold'>{ review.listing?.name }</NavLink>
                            <Rating value={ review.rating } readOnly />
                            <p>{ review.comment }</p>
                            <button onClick={ () => handleDeleteReview(review._id) } className='px-3 py-2 rounded bg-red-500 hover:bg-red-600 hover:scale-110 active:scale-90 cursor-pointer text-white w-fit'>Delete Review</button>
                        </div>
                    ))
                ) }
            </div>
        </div>

    );
}

export default AboutMe;