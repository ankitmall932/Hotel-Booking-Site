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
        <div className='w-full h-screen flex justify-center items-center p-20 bg-[url("/max-saeling-m8nRxnGFWVc-unsplash.jpg")] bg-cover'>
            <div className='w-250 h-150 flex '>
                <div className='w-[50%] h-full p-5 rounded-l-2xl bg-[url("/resul-mentes-DbwYNr8RPbg-unsplash.jpg")] bg-cover bg-center flex justify-center items-center flex-col shadow-4xl gap-10'>
                    <RegisterAnimation />
                    <h1 className='text-2xl font-bold text-white'>Welcome Back</h1>
                    <p className='font-bold text-white mb-10'>Log in to continue your journey and access your bookings, favorites, and personalized stays.</p>
                </div>
                <form onSubmit={ handleSubmit(onSubmit) } className='w-[50%] h-full flex justify-center items-center flex-col gap-5 shadow-4xl bg-white rounded-r-2xl'>
                    <h1 className='text-4xl font-bold'>OTP To Change Password</h1>
                    <input value={ email } disabled className='px-5 py-3 border-2 rounded-full w-100' />
                    <p className='text-red-500 font-bold'>{ errors.email?.message }</p>
                    <input placeholder='OTP' type='text' { ...register('otp') } className='px-5 py-3 border-2 rounded-full w-100' />
                    <p className='text-red-500 font-bold'>{ errors.otp?.message }</p>
                    <button type='submit' className='bg-blue-500 w-100 py-3 rounded-full text-white font-bold'>Submit</button>
                </form>
            </div>
        </div>
    );
}

export default ResetPassOtp;