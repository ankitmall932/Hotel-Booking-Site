import React from 'react';
import { resetPassword } from '../../api/auth.api';
import { useAuth } from '../../context/AuthContext';
import { resetSchema } from '../../schemas/auth.schema';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import RegisterAnimation from '../animations/RegisterAnimation';
import { useState } from 'react';
import { Eye } from 'lucide-react';
import { EyeOff } from 'lucide-react';


function ResetPass () {

    const nav = useNavigate();
    const { user } = useAuth();
    const [ show, setShow ] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({ resolver: zodResolver(resetSchema) });

    const onSubmit = async (data) => {
        const { data: res, error } = await resetPassword({
            email: user?.email,
            data: data.password
        });
        if (error)
        {
            toast.error(error);
            return;
        }
        localStorage.setItem('email', user?.email);
        localStorage.setItem('pass', data.password);
        toast.success(res.message || 'from submitted');
        nav('/reset');
    };

    return (
        <div className='w-full h-screen flex justify-center items-center p-20 bg-[url("/max-saeling-m8nRxnGFWVc-unsplash.jpg")] bg-cover'>
            <div className='w-250 h-150 flex '>
                <div className='w-[50%] h-full p-5 rounded-l-2xl bg-[url("/resul-mentes-DbwYNr8RPbg-unsplash.jpg")] bg-cover bg-center flex justify-center items-center flex-col shadow-4xl gap-10'>
                    <RegisterAnimation />
                    <h1 className='text-2xl font-bold text-white'>Welcome Back</h1>
                    <p className='font-bold text-white mb-10'>Log in to continue your journey and access your bookings, favorites, and personalized stays.</p>
                </div>
                <form onSubmit={ handleSubmit(onSubmit) } className='w-[50%] h-full flex justify-center items-center flex-col gap-5 shadow-4xl bg-white rounded-r-2xl'>
                    <h1 className='text-4xl font-bold'>Reset Password</h1>
                    <input type="text" value={ user?.email } disabled className='px-5 py-3 border-2 rounded-full w-100' />
                    <p className='text-red-500 font-bold'>{ errors.email?.message }</p>
                    <div className='relative'>
                        <input type={ show ? 'text' : 'password' } placeholder='Password' { ...register('password') } className='px-5 py-3 border-2 rounded-full w-100 ' />
                        <span onClick={ () => setShow(!show) } className='absolute right-6 top-4 cursor-pointer'>
                            { show ? <EyeOff size={ 20 } /> : <Eye size={ 20 } /> }
                        </span>
                    </div>
                    <p className='text-red-500 font-bold'>{ errors.password?.message }</p>
                    <input placeholder='Confirm Password' { ...register('confirmPassword') } className='px-5 py-3 border-2 rounded-full w-100' />
                    <p className='text-red-500 font-bold'>{ errors.confirmPassword?.message }</p>
                    <button type='submit' className='bg-blue-500 w-100 py-3 rounded-full text-white font-bold'>Submit</button>
                </form>
            </div>
        </div>
    );
};

export default ResetPass;