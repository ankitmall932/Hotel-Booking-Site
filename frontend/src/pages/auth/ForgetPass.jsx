import React from 'react';
import { resetPassword } from '../../api/auth.api';
import { forgetSchema } from '../../schemas/auth.schema';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import RegisterAnimation from '../animations/RegisterAnimation';
import { useState } from 'react';
import { Eye } from 'lucide-react';
import { EyeOff } from 'lucide-react';


function ForgetPassword () {
    const [ show, setShow ] = useState(false);

    const nav = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({ resolver: zodResolver(forgetSchema) });

    const onSubmit = async (data) => {
        const { data: res, error } = await resetPassword(data);
        if (error)
        {
            toast.error(error);
            return;
        }
        localStorage.setItem('email', data.email);
        localStorage.setItem('pass', data.password);
        toast.success(res.message || 'from submitted');
        nav('/reset');
    };

    return (
        <div className='w-full h-screen flex justify-center items-center sm:p-20 p-5 bg-[url("/max-saeling-m8nRxnGFWVc-unsplash.jpg")] bg-cover'>
            <div className='lg:w-250 lg:h-150 sm:h-100 sm:w-200 h-100 w-100 flex '>
                <div className='hidden  sm:w-1/2  h-full p-5 rounded-l-2xl bg-[url("/resul-mentes-DbwYNr8RPbg-unsplash.jpg")] bg-cover bg-center sm:flex justify-center items-center flex-col shadow-4xl gap-10'>
                    <RegisterAnimation />
                    <h1 className='lg:text-2xl sm:text-lg text-sm font-bold text-white'>Welcome Back</h1>
                    <p className='lg:font-bold font-semibold text-white mb-10'>Log in to continue your journey and access your bookings, favorites, and personalized stays.</p>
                </div>
                <form onSubmit={ handleSubmit(onSubmit) } className='sm:w-1/2 w-full h-full flex justify-center lg:px-10 sm:px-5 px-10 items-center flex-col lg:gap-5 gap-2 shadow-4xl bg-white sm:rounded-r-2xl sm:rounded-none rounded-2xl sm:py-0 py-10'>
                    <h1 className='lg:text-4xl sm:text-2xl text-lg font-bold'>Forget Password</h1>
                    <input type="text" placeholder='Email' { ...register('email') } className='px-5 py-3 border-2 rounded-full w-full' />
                    <p className='text-red-500 font-bold'>{ errors.email?.message }</p>
                    <div className='relative w-full'>
                        <input type={ show ? 'text' : 'password' } placeholder='Password' { ...register('password') } className='px-5 py-3 border-2 rounded-full w-full' />
                        <span onClick={ () => setShow(!show) } className='absolute right-6 top-4 cursor-pointer'>
                            { show ? <EyeOff size={ 20 } /> : <Eye size={ 20 } /> }
                        </span>
                    </div>
                    <p className='text-red-500 font-bold'>{ errors.password?.message }</p>
                    <input type='password' placeholder='Confirm Password' { ...register('confirmPassword') } className='px-5 py-3 border-2 rounded-full w-full' />
                    <p className='text-red-500 font-bold'>{ errors.confirmPassword?.message }</p>
                    <button type='submit' className='bg-blue-500 w-full py-3 rounded-full text-white font-bold'>Submit</button>
                </form>
            </div>
        </div>
    );
};

export default ForgetPassword;