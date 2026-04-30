import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { verifyOtp } from '../../schemas/auth.schema';
import { verify } from '../../api/auth.api';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import RegisterAnimation from '../animations/RegisterAnimation';


function VerifyOtp () {
    const nav = useNavigate();
    const location = useLocation();
    const { setUser } = useAuth();
    const fromPath = location.state?.from?.pathname + location.state?.from?.search || '/';

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

    return (
        <div className='w-full h-screen flex justify-center items-center p-20 bg-[url("/max-saeling-m8nRxnGFWVc-unsplash.jpg")] bg-cover'>
            <div className='w-250 h-150 flex '>
                <div className='w-[50%] h-full p-5 rounded-l-2xl bg-[url("/resul-mentes-DbwYNr8RPbg-unsplash.jpg")] bg-cover bg-center flex justify-center items-center flex-col shadow-4xl gap-10'>
                    <RegisterAnimation />
                    <h1 className='text-2xl font-bold text-white'>Welcome Back</h1>
                    <p className='font-bold text-white mb-10'>Log in to continue your journey and access your bookings, favorites, and personalized stays.</p>
                </div>
                <form onSubmit={ handleSubmit(onSubmit) } className='w-[50%] h-full flex justify-center items-center flex-col gap-5 shadow-4xl bg-white rounded-r-2xl'>
                    <h1 className='text-4xl font-bold'>Verify OTP</h1>
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

export default VerifyOtp;