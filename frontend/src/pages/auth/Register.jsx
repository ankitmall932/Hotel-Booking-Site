import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '../../schemas/auth.schema';
import { useNavigate, useLocation, NavLink } from 'react-router-dom';
import { registerUser } from '../../api/auth.api';
import { toast } from 'react-toastify';
import RegisterAnimation from '../animations/RegisterAnimation';
import { useState } from 'react';
import { Eye } from 'lucide-react';
import { EyeOff } from 'lucide-react';



function Register () {
    const nav = useNavigate();
    const location = useLocation();
    const [ show, setShow ] = useState(false);

    const fromLocation = location.state?.from || location;
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({ resolver: zodResolver(registerSchema) });

    const onSubmit = async (data) => {
        const { data: res, error } = await registerUser(data);
        if (error)
        {
            toast.warning(error);
            return;
        }
        localStorage.setItem('email', data.email);
        nav('/verifyOtp', { state: { from: fromLocation } });
        toast.success(res.message || 'Otp sent successfully');
    };

    return (
        <div className='w-full h-screen flex justify-center items-center sm:p-20 p-5 bg-[url("/max-saeling-m8nRxnGFWVc-unsplash.jpg")] bg-cover'>
            <div className='lg:w-250 lg:h-150 sm:h-100 sm:w-200 h-130 w-100 flex  '>
                <div className=' hidden sm:w-1/2 h-full p-5 rounded-l-2xl bg-[url("/resul-mentes-DbwYNr8RPbg-unsplash.jpg")] bg-cover bg-center sm:flex justify-center items-center flex-col shadow-4xl lg:gap-10 gap-5'>
                    <RegisterAnimation />
                    <h1 className='lg:text-2xl sm:text-lg font-bold text-white'>Join Us Today</h1>
                    <p className='lg:font-bold font-semibold text-white lg:mb-10 mb-5'>Create your account in seconds and step into a world of comfort, convenience, and curated experiences.</p>
                    <p className='font-bold'>If you have An Account Please Login Below</p>
                    <NavLink to='/login' state={ { from: fromLocation } } className='bg-blue-600 text-white font-bold px-6 text-center rounded-full py-3'>Login</NavLink>
                </div>
                <form onSubmit={ handleSubmit(onSubmit) } className='sm:w-1/2 w-full h-full flex justify-center items-center flex-col lg:gap-5 gap-2 shadow-4xl bg-white sm:rounded-r-2xl sm:rounded-none rounded-2xl sm:py-0 py-5 lg:px-10 sm:px-5 px-10'>
                    <h1 className='lg:text-4xl sm:text-2xl text-lg font-bold'>Register User</h1>
                    <input placeholder='Name' { ...register('name') } className='px-5 py-3 border-2 rounded-full w-full' />
                    <p className='text-red-500 font-bold'>{ errors.name?.message }</p>
                    <input placeholder='Email' { ...register('email') } className='px-5 py-3 border-2 rounded-full w-full' />
                    <p className='text-red-500 font-bold'>{ errors.email?.message }</p>
                    <div className='relative w-full'>
                        <input type={ show ? 'text' : 'password' } placeholder='Password' { ...register('password') } className='px-5 py-3 border-2 rounded-full w-full ' />
                        <span onClick={ () => setShow(!show) } className='absolute right-6 top-4 cursor-pointer'>
                            { show ? <EyeOff size={ 20 } /> : <Eye size={ 20 } /> }
                        </span>
                    </div>
                    <p className='text-red-500 font-bold'>{ errors.password?.message }</p>
                    <input placeholder='Confirm Password' { ...register('confirmPassword') } className='px-5 py-3 border-2 rounded-full w-full' />
                    <p className='text-red-500 font-bold'>{ errors.confirmPassword?.message }</p>
                    <button type='submit' className='bg-blue-500 w-full py-3 rounded-full text-white font-bold'>Submit</button>
                    <div className='sm:hidden flex justify-center items-center flex-col gap-2'>
                        <p className='sm:hidden flex justify-center items-center flex-col '>Already Have An Account </p>
                        <NavLink to='/login' state={ { from: fromLocation } } className='bg-blue-600 text-white font-bold px-6 text-center rounded-full py-3'>Login</NavLink>
                    </div>
                </form>
            </div>
        </div >
    );
}

export default Register;