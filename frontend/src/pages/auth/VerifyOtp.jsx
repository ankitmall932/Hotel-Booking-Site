import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { verifyOtp } from '../../schemas/auth.schema';
import { verify, resendOtp } from '../../api/auth.api';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import RegisterAnimation from '../animations/RegisterAnimation';


function VerifyOtp () {
    const nav = useNavigate();
    const location = useLocation();
    const { setUser } = useAuth();
    const fromPath = location.state?.from?.pathname + location.state?.from?.search || '/';
    const [ timer, setTimer ] = useState(30);
    const [ canResend, setCanResend ] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({ resolver: zodResolver(verifyOtp) });

    const email = localStorage.getItem('email');
    if (!email)
    {
        nav('/');
        return null;
    }

    const onSubmit = async (data) => {
        const { data: res, error } = await verify({
            email,
            otp: data.otp
        });
        if (error)
        {
            toast.warning(error);
            return;
        }
        setUser(res.user);
        toast.success(res.message || 'User Register Successfully');
        localStorage.removeItem('email');
        nav(fromPath, { replace: true });
    };

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        let interval;
        if (timer === 0)
        {
            setCanResend(true);
            return;
        }
        interval = setInterval(() => {
            setTimer((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [ timer ]);

    const handleResend = async () => {
        const { data: res, error } = await resendOtp({ email });
        if (error)
        {
            toast.warning(error);
            return;
        }
        toast.success(res.message || 'OTP resent successfully');
        setTimer(30);
        setCanResend(false);
    };

    return (
        <div className='w-full h-screen flex justify-center items-center sm:p-20 p-5 bg-[url("/max-saeling-m8nRxnGFWVc-unsplash.jpg")] bg-cover'>
            <div className='lg:w-250 lg:h-150 sm:h-100 sm:w-200 h-100 w-100 flex  '>
                <div className=' hidden sm:w-1/2 h-full p-5 rounded-l-2xl bg-[url("/resul-mentes-DbwYNr8RPbg-unsplash.jpg")] bg-cover bg-center sm:flex justify-center items-center flex-col shadow-4xl lg:gap-10 sm:gap-5'>
                    <RegisterAnimation />
                    <h1 className='lg:text-2xl text-lg font-bold text-white'>Welcome Back</h1>
                    <p className='lg:font-bold font-semibold text-white mb-10'>Log in to continue your journey and access your bookings, favorites, and personalized stays.</p>
                </div>
                <form onSubmit={ handleSubmit(onSubmit) } className='sm:w-1/2 w-full h-full flex justify-center items-center flex-col lg:gap-5 sm:gap-3 gap-2 shadow-4xl bg-white sm:rounded-r-2xl sm:rounded-none rounded-2xl lg:px-10 sm:px-5 px-10'>
                    <h1 className='lg:text-4xl sm:text-2xl text-lg font-bold'>Verify OTP</h1>
                    <input value={ email } disabled className='px-5 py-3 border-2 rounded-full w-full' />
                    <p className='text-red-500 font-bold'>{ errors.email?.message }</p>
                    <input placeholder='OTP' type='text' { ...register('otp') } className='px-5 py-3 border-2 rounded-full w-full' />
                    <p className='text-red-500 font-bold'>{ errors.otp?.message }</p>
                    <p className='text-sm text-gray-500'>Didn't receive the OTP? <button type='button' disabled={ !canResend } onClick={ handleResend } className='text-blue-500 font-bold ml-2'>{ canResend ? 'Resend OTP' : `Resend in ${ timer }s` }</button></p>
                    <button type='submit' className='bg-blue-500 w-full py-3 rounded-full text-white font-bold'>Submit</button>
                </form>
            </div>
        </div>
    );
}

export default VerifyOtp;