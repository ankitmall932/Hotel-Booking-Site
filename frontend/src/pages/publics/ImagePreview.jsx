import React, { useState, useEffect } from 'react';
import { imagePreview } from '../../api/owner.api';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
function ImagePreview () {
    const { id } = useParams();
    const [ images, setImages ] = useState(null);
    useEffect(() => {
        const data = async () => {
            const { data: res, error } = await imagePreview(id);
            if (error)
            {
                toast.error(error);
                return;
            }
            toast.success(res.message);
            setImages(res.image);
        };
        data();
    }, [ id ]);
    return (
        <div className='h-full w-full sm:p-15 p-2'>
            { images && (
                <img src={ images.url } alt="" className='object-cover lg:h-150 sm:h-100 h-80 rounded-2xl w-full' />
            ) }
        </div>
    );
}

export default ImagePreview;