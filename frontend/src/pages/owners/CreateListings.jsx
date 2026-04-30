import React, { useEffect, useState, useRef } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { createSchema } from '../../schemas/create.schema';
import { useNavigate } from 'react-router-dom';
import { createListing } from '../../api/owner.api';
import { toast } from 'react-toastify';
import { countryData } from '../../api/owner.api';
import { CloudUpload } from 'lucide-react';

function CreateListings () {

    //this is for page loading while creating listings
    const [ loading, setLoading ] = useState(false);
    //after this go to the from submit part

    //this is the upload image part
    const inputRef = useRef();
    const [ images, setImages ] = useState([]);
    const handleClick = () => {
        inputRef.current.click();
    };
    const handleChange = (e) => {
        const files = Array.from(e.target.files);
        const preview = files.map((file) => ({
            file,
            url: URL.createObjectURL(file)
        }));
        setImages((prev) => [ ...prev, ...preview ]);
        setValue('images', e.target.files); // Update the form value
    };
    const handleRemove = (index) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
        // Also need to update the form value by removing the file
        const currentFiles = getValues('images');
        const newFiles = Array.from(currentFiles).filter((_, i) => i !== index);
        const dt = new DataTransfer();
        newFiles.forEach(file => dt.items.add(file));
        setValue('images', dt.files);
    };

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        getValues,
        formState: { errors }
    } = useForm({ resolver: zodResolver(createSchema) });

    //this is the getting data of the state and cities
    const nav = useNavigate();
    const [ country, setCountry ] = useState({});
    const selectedState = watch('state');
    useEffect(() => {
        const value = async () => {
            const { data, error } = await countryData();
            if (error)
            {
                toast.error(error);
                return;
            }
            setCountry(data);
        };
        value();
    }, []);

    //this part is for form submission

    const onSubmit = async (data) => {
        try
        {
            setLoading(true);

            const formData = new FormData();
            const files = data.images || [];
            for (let i = 0; i < files.length; i++)
            {
                formData.append('images', files[ i ]);
            }
            formData.append('name', data.name);
            formData.append('description', data.description);
            formData.append('price', data.price);
            formData.append('city', data.city);
            formData.append('state', data.state);
            formData.append('country', data.country);
            const amenitiesArray = data.amenities ? data.amenities.split(',').map(i => i.trim()).filter(Boolean) : [];
            formData.append('amenities', JSON.stringify(amenitiesArray));
            const { data: res, error } = await createListing(formData);
            if (error)
            {
                toast.error(error);
                return;
            }
            toast.success(res.message || 'created successfully');
            nav('/host/dashboard');
        } catch (err)
        {
            console.log(err);
        } finally
        {
            setLoading(false);
        }

    };

    return (
        <div className='h-full p-10 w-full bg-gray-10'>
            <div className='flex gap-8 flex-wrap justify-center'>
                {/* Form Section */ }
                <div className='flex-1 min-w-80'>
                    <form onSubmit={ handleSubmit(onSubmit) } className='flex flex-col gap-5 bg-white p-10 rounded-2xl shadow-2xl' >
                        { loading && (
                            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                                <div
                                    className="bg-white p-6 rounded-xl flex flex-col items-center gap-4 w-72" >
                                    <div
                                        className="w-10 h-10 border-4 border-gray-300 border-t-black rounded-full animate-spin">
                                    </div>
                                    <p className='font-medium'>Uploading....</p>
                                </div>
                            </div>
                        ) }
                        <input type="text" placeholder='Enter your Hotel Name'{ ...register('name') } className='p-2 border-2 rounded-lg' />
                        <p>{ errors.name?.message }</p>
                        <input type="text" placeholder='Description' { ...register('description') } className='p-2 border-2 rounded-lg' />
                        <p>{ errors.description?.message }</p>
                        <input type="text" placeholder='Enter the price ' { ...register('price') } className='p-2 border-2 rounded-lg' />
                        <p>{ errors.price?.message }</p>
                        <input type="text" placeholder='Enter the amenities' { ...register('amenities') } className='p-2 border-2 rounded-lg' />
                        <p>{ errors.amenities?.message } </p>
                        <div>
                            <input type="file" multiple { ...register('images') } ref={ inputRef } onChange={ handleChange } className='hidden' />
                            <div onClick={ handleClick } className='border-2 border-dashed p-6 flex justify-center items-center cursor-pointer rounded-lg' ><CloudUpload size={ 64 } />Upload Image</div>
                            <div className="flex gap-4 mt-4 flex-wrap">
                                { images.map((img, i) => (
                                    <div key={ i } className='relative' >
                                        <img src={ img.url } alt=' ' className='w-24 h-24 object-cover rounded' />
                                        <button onClick={ () => handleRemove(i) } className='absolute top-1 right-1 bg-black text-white rounded-full w-6 h-6 text-xs flex items-center justify-center ' > X </button>
                                    </div>
                                )) }
                            </div>
                        </div>
                        <p>{ errors.images?.message }</p>
                        <select { ...register('state') } className='p-2 border-2 rounded-lg'>
                            <option value="">Select State</option>
                            { Object.keys(country).map((state) => (
                                <option key={ state } value={ state }>{ state }</option>
                            )) }
                        </select>
                        <p>{ errors.state?.message }</p>
                        <select { ...register('city') } className='p-2 border-2 rounded-lg'>
                            <option value="">Select City</option>
                            { country[ selectedState ]?.map((city) => (
                                <option key={ city } value={ city }>{ city }</option>
                            )) }
                        </select>
                        <p>{ errors.city?.message }</p>
                        <input type='text' value='India' readOnly { ...register('country') } className='p-2 border-2 rounded-lg' />
                        <button type='submit' className='p-3 rounded bg-green-500 text-white  hover:scale-110 active:scale-90 cursor-pointer duration-200' >Create</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default CreateListings;