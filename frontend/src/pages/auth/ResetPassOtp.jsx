import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { resetPassword } from '../../api/auth.api';
import { verifyOtp } from '../../schemas/auth.schema';
import RegisterAnimation from '../animations/RegisterAnimation';



function ResetPassOtp () {

    const nav = useNavigate();

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
    const pass = localStorage.getItem('pass');

    const onSubmit = async (data) => {
        const { data: res, error } = await resetPassword({
            email,
            otp: data.otp,
            password: pass
        });
        if (error)
        {
            toast.warning(error);
            return;
        }
        nav('/rooms');
        toast.success(res.message || 'Password Change Successfully');
        localStorage.removeItem('email');
        localStorage.removeItem('pass');
    };

    return (
        <div className='w-full h-screen flex justify-center items-center sm:p-20 p-5 bg-[url("/max-saeling-m8nRxnGFWVc-unsplash.jpg")] bg-cover'>
            <div className='lg:w-250 lg:h-150 sm:h-100 sm:w-200 h-100 w-100 flex '>
                <div className='hidden sm:w-1/2 h-full p-5 rounded-l-2xl bg-[url("/resul-mentes-DbwYNr8RPbg-unsplash.jpg")] bg-cover bg-center sm:flex justify-center items-center flex-col shadow-4xl lg:gap-10 sm:gap-5'>
                    <RegisterAnimation />
                    <h1 className='lg:text-2xl text-lg font-bold text-white'>Welcome Back</h1>
                    <p className='lg:font-bold font-semibold text-white mb-10'>Log in to continue your journey and access your bookings, favorites, and personalized stays.</p>
                </div>
                <form onSubmit={ handleSubmit(onSubmit) } className='sm:w-1/2 w-full h-full flex justify-center items-center flex-col lg:gap-5 sm:gap-3 gap-2 shadow-4xl bg-white sm:rounded-r-2xl sm:rounded-none rounded-2xl lg:px-10 sm:px-5 px-10'>
                    <h1 className='lg:text-4xl sm:text-2xl text-lg font-bold'>OTP To Change Password</h1>
                    <input value={ email } disabled className='px-5 py-3 border-2 rounded-full w-full' />
                    <p className='text-red-500 font-bold'>{ errors.email?.message }</p>
                    <input placeholder='OTP' type='text' { ...register('otp') } className='px-5 py-3 border-2 rounded-full w-full' />
                    <p className='text-red-500 font-bold'>{ errors.otp?.message }</p>
                    <button type='submit' className='bg-blue-500 w-full py-3 rounded-full text-white font-bold'>Submit</button>
                </form>
            </div>
        </div>
    );
}

export default ResetPassOtp;