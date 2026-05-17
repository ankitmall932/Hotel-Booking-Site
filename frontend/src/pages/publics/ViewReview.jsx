import React from 'react';
import { getReviewsForListing } from '../../api/review.api';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Rating from '@mui/material/Rating';

function ViewReview () {
    const { id } = useParams();
    const [ reviews, setReviews ] = React.useState([]);
    React.useEffect(() => {
        const fetchReviews = async () => {
            const { data: res, error } = await getReviewsForListing(id);
            if (error)
            {
                toast.error("Failed to fetch reviews");
            } else
            {
                setReviews(res.reviews);
            }
        };
        fetchReviews();
    }, [ id ]);

    const firstLetter = reviews[ 0 ]?.user?.name?.charAt(0).toUpperCase();

    return (
        <div className='w-full h-full sm:p-10 p-0 '>
            <div className='w-full h-full flex flex-col  sm:px-15 p-2 py-2 border border-gray-300 rounded-md'>
                <h2>Reviews for this Listing</h2>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2'>
                    { reviews.length === 0 ? (
                        <p>No reviews yet.</p>
                    ) : (
                        reviews.map((review) => (
                            <div key={ review._id } className='border-2 p-2 flex flex-col gap-3 rounded border-gray-300 py-4 w-full'>
                                <div className='flex items-center gap-2'><span className="bg-black text-white rounded-full w-8 h-8 flex items-center justify-center mr-2">{ firstLetter }</span> <h3>{ review.user.name }</h3></div>
                                <Rating value={ review.rating } readOnly />
                                <p>{ review.comment }</p>
                            </div>
                        ))
                    ) }
                </div>
            </div>
        </div>
    );
}

export default ViewReview;