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
        <div className='h-full w-full p-15'>
            { images && (
                <img src={ images.url } alt="" />
            ) }
        </div>
    );
}

export default ImagePreview;