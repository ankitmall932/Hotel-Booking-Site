import React, { useState, useEffect, useRef } from 'react';
import { detailListing, updateListing, countryData, deleteListing } from '../../api/owner.api';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { updateSchema } from '../../schemas/create.schema';


function DetailPage () {
    const nav = useNavigate();
    const [ detail, setDetail ] = useState(null);
    const [ isEditing, setIsEditing ] = useState(false);
    const [ loading, setLoading ] = useState(false);
    const [ country, setCountry ] = useState({});
    const [ images, setImages ] = useState([]);
    const inputRef = useRef();

    const { id } = useParams();

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        getValues,
        formState: { errors },
        reset
    } = useForm({ resolver: zodResolver(updateSchema) });

    // eslint-disable-next-line react-hooks/incompatible-library
    const selectedState = watch('state');

    // Fetch listing details
    useEffect(() => {
        const fetchDetail = async () => {
            const { data: res, error } = await detailListing(id);
            if (error)
            {
                toast.error(error);
                return;
            }
            toast.success(res.message);
            setDetail(res.listing);
        };
        fetchDetail();
    }, [ id ]);

    // Fetch country data
    useEffect(() => {
        const fetchCountryData = async () => {
            const { data, error } = await countryData();
            if (error)
            {
                toast.error(error);
                return;
            }
            setCountry(data);
        };
        fetchCountryData();
    }, []);

    // Populate form when entering edit mode
    useEffect(() => {
        if (isEditing && detail)
        {
            reset({
                name: detail.name,
                description: detail.description,
                price: detail.price,
                state: detail.location.state,
                city: detail.location.city,
                country: detail.location.country,
                amenities: detail.amenities?.join(', ') || ''
            });
            setImages([]);
        }
    }, [ isEditing, detail, reset ]);

    const handleImageClick = () => {
        inputRef.current.click();
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const preview = files.map((file) => ({
            file,
            url: URL.createObjectURL(file)
        }));
        setImages((prev) => [ ...prev, ...preview ]);
        setValue('images', e.target.files);
    };

    const handleImageRemove = (index) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
        const currentFiles = getValues('images');
        const newFiles = Array.from(currentFiles).filter((_, i) => i !== index);
        const dt = new DataTransfer();
        newFiles.forEach(file => dt.items.add(file));
        setValue('images', dt.files);
    };

    const onSubmit = async (data) => {
        try
        {
            setLoading(true);

            const formData = new FormData();
            // Only add images if they exist
            if (data.images && data.images.length > 0)
            {
                for (let i = 0; i < data.images.length; i++)
                {
                    formData.append('images', data.images[ i ]);
                }
            }

            formData.append('name', data.name);
            formData.append('description', data.description);
            formData.append('price', data.price);
            formData.append('city', data.city);
            formData.append('state', data.state);
            formData.append('country', data.country);
            // Pass listing coordinates for geocoding
            if (detail.coords)
            {
                formData.append('lat', detail.coords.lat);
                formData.append('lng', detail.coords.lon);
            }
            const amenitiesArray = data.amenities ? data.amenities.split(',').map(i => i.trim()).filter(Boolean) : [];
            formData.append('amenities', JSON.stringify(amenitiesArray));

            const { data: res, error } = await updateListing(id, formData);
            if (error)
            {
                toast.error(error);
                setLoading(false);
                return;
            }
            toast.success(res.message || 'Updated successfully');
            setIsEditing(false);
            // Refresh listing details
            const { data: refreshed, error: refreshError } = await detailListing(id);
            if (!refreshError)
            {
                setDetail(refreshed.listing);
            }
            setLoading(false);
        } catch (err)
        {
            console.log(err);
            toast.error('Update failed');
            setLoading(false);
        }
    };

    //delete Listing
    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this listing?'))
        {
            return;
        }
        const { data: res, error } = await deleteListing(id);
        if (error)
        {
            toast.error(error);
            return;
        }
        toast.success(res.message || 'Listing deleted successfully');
        nav('/host/dashboard');
    };

    if (isEditing)
    {
        return (
            <div className='w-full h-full p-10'>
                <form onSubmit={ handleSubmit(onSubmit) } className='max-w-4xl mx-auto'>
                    {/* Image Upload Section */ }
                    <div className='mb-6'>
                        <label className='block text-lg font-semibold mb-3'>Upload Images (Optional for Update)</label>
                        <button
                            type='button'
                            onClick={ handleImageClick }
                            className='mb-4 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600'
                        >
                            Add Images
                        </button>
                        <input
                            ref={ inputRef }
                            type='file'
                            multiple
                            onChange={ handleImageChange }
                            className='hidden'
                            accept='image/*'
                        />
                        {/* Image Preview */ }
                        { images.length > 0 && (
                            <div className='grid grid-cols-5 gap-3 mt-4'>
                                { images.map((img, idx) => (
                                    <div key={ idx } className='relative'>
                                        <img src={ img.url } alt='preview' className='w-full h-32 object-cover rounded' />
                                        <button
                                            type='button'
                                            onClick={ () => handleImageRemove(idx) }
                                            className='absolute top-1 right-1 bg-red-500 text-white px-2 py-1 rounded'
                                        >
                                            ×
                                        </button>
                                    </div>
                                )) }
                            </div>
                        ) }
                    </div>

                    {/* Name Field */ }
                    <div className='mb-4'>
                        <label className='block font-semibold mb-2'>Name</label>
                        <input
                            { ...register('name') }
                            type='text'
                            placeholder='Listing name'
                            className='w-full p-2 border rounded'
                        />
                        { errors.name && <p className='text-red-500'>{ errors.name.message }</p> }
                    </div>

                    {/* Description Field */ }
                    <div className='mb-4'>
                        <label className='block font-semibold mb-2'>Description</label>
                        <textarea
                            { ...register('description') }
                            placeholder='Listing description'
                            rows='4'
                            className='w-full p-2 border rounded'
                        />
                        { errors.description && <p className='text-red-500'>{ errors.description.message }</p> }
                    </div>

                    {/* Price Field */ }
                    <div className='mb-4'>
                        <label className='block font-semibold mb-2'>Price per Night</label>
                        <input
                            { ...register('price') }
                            type='number'
                            placeholder='Price'
                            className='w-full p-2 border rounded'
                        />
                        { errors.price && <p className='text-red-500'>{ errors.price.message }</p> }
                    </div>

                    {/* Country Field */ }
                    <div className='mb-4'>
                        <label className='block font-semibold mb-2'>Country</label>
                        <select { ...register('country') } className='w-full p-2 border rounded' disabled>
                            <option value='India'>India</option>
                        </select>
                    </div>

                    {/* State Field */ }
                    <div className='mb-4'>
                        <label className='block font-semibold mb-2'>State</label>
                        <select { ...register('state') } className='w-full p-2 border rounded'>
                            <option value=''>Select State</option>
                            { Object.keys(country).map((state) => (
                                <option key={ state } value={ state }>
                                    { state }
                                </option>
                            )) }
                        </select>
                        { errors.state && <p className='text-red-500'>{ errors.state.message }</p> }
                    </div>

                    {/* City Field */ }
                    <div className='mb-4'>
                        <label className='block font-semibold mb-2'>City</label>
                        <select { ...register('city') } className='w-full p-2 border rounded'>
                            <option value=''>Select City</option>
                            { selectedState && country[ selectedState ]?.map((city) => (
                                <option key={ city } value={ city }>
                                    { city }
                                </option>
                            )) }
                        </select>
                        { errors.city && <p className='text-red-500'>{ errors.city.message }</p> }
                    </div>

                    {/* Amenities Field */ }
                    <div className='mb-6'>
                        <label className='block font-semibold mb-2'>Amenities (comma separated)</label>
                        <textarea
                            { ...register('amenities') }
                            placeholder='e.g., WiFi, Pool, Kitchen'
                            rows='3'
                            className='w-full p-2 border rounded'
                        />
                    </div>

                    {/* Submit Buttons */ }
                    <div className='flex gap-4'>
                        <button
                            type='submit'
                            disabled={ loading }
                            className='px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-400'
                        >
                            { loading ? 'Updating...' : 'Update Listing' }
                        </button>
                        <button
                            type='button'
                            onClick={ () => {
                                setIsEditing(false);
                                setImages([]);
                            } }
                            className='px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600'
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div className='w-full h-full p-10 flex justify-center items-center flex-col'>
            { detail && (
                <>
                    <div className="grid grid-cols-4 grid-rows-2 gap-1 w-[80%] h-100">
                        { detail.images?.map((img, index) => (
                            <div
                                key={ img._id || index }
                                className={ index === 0 ? 'col-span-2 row-span-2' : '' }
                            >
                                <img
                                    onClick={ () => nav(`/image/${ img._id }`) }
                                    src={ img.url }
                                    className={ `w-full h-full object-cover cursor-pointer ${ index === 0 ? 'rounded-l-lg' : index === 2 ? 'rounded-tr-lg' : index === 4 ? 'rounded-br-lg' : ''
                                        }` }
                                />
                            </div>
                        )) }
                    </div>
                    <div className='flex w-[80%]  mt-10 gap-10  h-full'>
                        <div className="flex flex-col  w-[80%] gap-5">
                            <div className='flex gap-5'>
                                <div>
                                    <h1 className='text-2xl font-semibold'>{ detail.name }</h1>
                                    <h1 className='text-lg font-semibold'>{ detail.description }</h1>
                                    <h1>{ detail.price } per night</h1>
                                    <h1> State : { detail.location.state }</h1>
                                    <h1> City : { detail.location.city }</h1>
                                    <h1> Country : { detail.location.country }</h1>
                                </div>
                                <div>
                                    <h1 className='text-2xl font-semibold'>Facility Provided By Us</h1>
                                    <div>
                                        { detail.amenities?.map((data, idx) => (
                                            <ul key={ idx }>
                                                <li className='list-disc list-inside'>{ data }</li>
                                            </ul>
                                        )) }
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h1 className='py-5 border-t-2 border-b-2 w-full text-lg'> Hosted By : { detail.owner.name }</h1>
                            </div>
                        </div>
                        <div className='flex flex-col h-full w-[10%] justify-end items-end mt-15 ml-25 gap-5'>
                            <button
                                onClick={ () => setIsEditing(true) }
                                className='h-fit w-fit px-5 py-3 bg-red-500 rounded-2xl hover:scale-110 active:scale-90 duration-200'
                            >
                                Edit Listing
                            </button>
                            <button onClick={ () => handleDelete(id) } className='h-fit w-fit px-5 py-3 bg-red-500 rounded-2xl hover:scale-110 active:scale-90 duration-200'>Delete Listing</button>
                        </div>
                    </div>
                </>
            )
            }
        </div>
    );
}

export default DetailPage;

{/*                     
                    { detail.images && detail.images.length > 0 && (
                        <div>
                            { detail.images.map((img, index) => (
                                <img  key={ index } src={ img.url } alt={ `${ detail.name } image ${ index + 1 }` } />
                            )) }
                        </div>
                    ) }
                      */}