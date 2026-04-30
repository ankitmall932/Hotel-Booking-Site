import React from 'react';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import { useParams } from 'react-router-dom';
import { createReview } from '../../api/review.api';
import { toast } from 'react-toastify';
function CreateReview () {
    const [ value, setValue ] = React.useState(1);
    const [ comment, setComment ] = React.useState('');
    const { id } = useParams();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!comment)
        {
            alert('Please enter a comment');
            return;
        }
        const { data: res, error } = await createReview(id, { rating: value, comment });
        if (error)
        {
            toast.error(error);
            return;
        }
        toast.success(res.message);
        setValue(1);
        setComment('');
        window.location.reload();
    };
    return (
        <div className='w-full h-full p-10  gap-5 border-t-2 border-gray-300 mt-10'>
            <form onSubmit={ handleSubmit } className='w-full h-full flex flex-col gap-5 px-15 py-2 border border-gray-300 rounded-md'>
                <Typography variant="h6" gutterBottom>Give us your rating</Typography>
                <Rating
                    value={ value }
                    onChange={ (event, newValue) => {
                        setValue(newValue);
                    } }
                />
                <textarea
                    placeholder="Write your review here..."
                    className='border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                    value={ comment }
                    onChange={ (e) => setComment(e.target.value) }
                ></textarea>
                <button
                    type="submit"
                    className='bg-blue-500 text-white px-4 py-2 rounded w-50 hover:bg-blue-600 transition-colors'
                >
                    Submit Review
                </button>
            </form>
        </div>
    );
}

export default CreateReview;