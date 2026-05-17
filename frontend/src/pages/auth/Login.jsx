import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useLocation, NavLink } from 'react-router-dom';
import { loginUser } from '../../schemas/auth.schema';
import { login } from '../../api/auth.api';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import RegisterAnimation from '../animations/RegisterAnimation';
import { useState } from 'react';
import { Eye } from 'lucide-react';
import { EyeOff } from 'lucide-react';


function Login () {

    const nav = useNavigate();
    const location = useLocation();
    const { setUser } = useAuth();
    const [ show, setShow ] = useState(false);
    const fromLocation = location.state?.from || location;

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({ resolver: zodResolver(loginUser) });

    const fromPath = location.state?.from?.pathname + location.state?.from?.search || '/';

    const onSubmit = async (data) => {
        const { data: res, error } = await login(data);
        if (error)
        {
            toast.error(error);
            return;
        }
        setUser(res.user);
        toast.success(res.message);
        nav(fromPath, { replace: true });
    };

    return (
        <div className='w-full h-screen flex justify-center items-center sm:p-20 p-5 bg-[url("/max-saeling-m8nRxnGFWVc-unsplash.jpg")] bg-cover'>
            <div className='lg:w-250 lg:h-150 sm:h-100 sm:w-200 h-120 w-100 flex '>
                <div className='hidden  sm:w-1/2 h-full p-5 rounded-l-2xl bg-[url("/resul-mentes-DbwYNr8RPbg-unsplash.jpg")] bg-cover bg-center sm:not-last:flex justify-center items-center flex-col shadow-4xl lg:gap-10 sm:gap-2'>
                    <RegisterAnimation />
                    <h1 className='lg:text-2xl sm:text-lg text-sm font-bold text-white'>Welcome Back</h1>
                    <p className='lg:font-bold font-semibold text-white lg:mb-10 mb-5'>Log in to continue your journey and access your bookings, favorites, and personalized stays.</p>
                    <p className='lg:font-bold font-semibold text-white'>If you don't have An Account Please Register Below</p>
                    <NavLink to='/register' state={ { from: fromLocation } } className='bg-blue-600 text-white font-bold px-6 text-center rounded-full py-3'>Register</NavLink>
                </div>
                <form onSubmit={ handleSubmit(onSubmit) } className='sm:w-1/2 w-full h-full flex justify-center lg:px-10 sm:px-5 px-10 items-center flex-col lg:gap-5 gap-2 shadow-4xl bg-white sm:rounded-r-2xl sm:rounded-none rounded-2xl sm:py-0 py-10'>
                    <h1 className='lg:text-4xl sm:text-2xl text-lg font-bold'>Login</h1>
                    <input type="text" placeholder='Enter your registered email' { ...register('email') } className='px-5 py-3 border-2 rounded-full w-full' />
                    <p className='text-red-500 font-bold'>{ errors.email?.message }</p>
                    <div className='relative w-full'>
                        <input type={ show ? 'text' : 'password' } placeholder='Password' { ...register('password') } className='px-5 py-3 border-2 rounded-full w-full' />
                        <span onClick={ () => setShow(!show) } className='absolute right-6 top-4 cursor-pointer'>
                            { show ? <EyeOff size={ 20 } /> : <Eye size={ 20 } /> }
                        </span>
                    </div>
                    <p className='text-red-500 font-bold'>{ errors.password?.message }</p>
                    <button type='submit' className='bg-blue-500 w-full py-3 rounded-full text-white font-bold'>Login</button>
                    <div className='flex gap-2 mt-5'>
                        <p className='sm:flex hidden'>Don't Know Password </p>
                        <NavLink to='/forget' className='text-blue-500'>ForgetPassword</NavLink>
                    </div>
                    <div className='sm:hidden flex justify-center items-center flex-col '>
                        <p className='sm:hidden text-lg font-semibold'>Or</p>
                        <NavLink to='/register' state={ { from: fromLocation } } className='sm:hidden bg-blue-600 text-white font-bold px-6 text-center rounded-full py-3'>Register</NavLink>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;