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
        <div className='w-full h-screen flex justify-center items-center p-20 bg-[url("/max-saeling-m8nRxnGFWVc-unsplash.jpg")] bg-cover'>
            <div className='w-250 h-150 flex '>
                <div className='w-[50%] h-full p-5 rounded-l-2xl bg-[url("/resul-mentes-DbwYNr8RPbg-unsplash.jpg")] bg-cover bg-center flex justify-center items-center flex-col shadow-4xl gap-10'>
                    <RegisterAnimation />
                    <h1 className='text-2xl font-bold text-white'>Welcome Back</h1>
                    <p className='font-bold text-white mb-10'>Log in to continue your journey and access your bookings, favorites, and personalized stays.</p>
                    <p className='font-bold'>If you don't have An Account Please Register Below</p>
                    <NavLink to='/register' state={ { from: fromLocation } } className='bg-blue-600 text-white font-bold px-6 text-center rounded-full py-3'>Register</NavLink>
                </div>
                <form onSubmit={ handleSubmit(onSubmit) } className='w-[50%] h-full flex justify-center items-center flex-col gap-5 shadow-4xl bg-white rounded-r-2xl'>
                    <h1 className='text-4xl font-bold'>Login</h1>
                    <input type="text" placeholder='Enter your registered email' { ...register('email') } className='px-5 py-3 border-2 rounded-full w-100' />
                    <p className='text-red-500 font-bold'>{ errors.email?.message }</p>
                    <div className='relative'>
                        <input type={ show ? 'text' : 'password' } placeholder='Password' { ...register('password') } className='px-5 py-3 border-2 rounded-full w-100 ' />
                        <span onClick={ () => setShow(!show) } className='absolute right-6 top-4 cursor-pointer'>
                            { show ? <EyeOff size={ 20 } /> : <Eye size={ 20 } /> }
                        </span>
                    </div>
                    <p className='text-red-500 font-bold'>{ errors.password?.message }</p>
                    <button type='submit' className='bg-blue-500 w-100 py-3 rounded-full text-white font-bold'>Login</button>
                    <div className='flex gap-2 mt-5'>
                        <p>Don't Know Password </p>
                        <NavLink to='/forget' className='text-blue-500'>ForgetPassword</NavLink>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;