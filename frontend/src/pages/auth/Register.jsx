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
        <div className='w-full h-screen flex justify-center items-center p-20 bg-[url("/max-saeling-m8nRxnGFWVc-unsplash.jpg")] bg-cover'>
            <div className='w-250 h-150 flex '>
                <div className='w-[50%] h-full p-5 rounded-l-2xl bg-[url("/resul-mentes-DbwYNr8RPbg-unsplash.jpg")] bg-cover bg-center flex justify-center items-center flex-col shadow-4xl gap-10'>
                    <RegisterAnimation />
                    <h1 className='text-2xl font-bold text-white'>Join Us Today</h1>
                    <p className='font-bold text-white mb-10'>Create your account in seconds and step into a world of comfort, convenience, and curated experiences.</p>
                    <p className='font-bold'>If you have An Account Please Login Below</p>
                    <NavLink to='/login' state={ { from: fromLocation } } className='bg-blue-600 text-white font-bold px-6 text-center rounded-full py-3'>Login</NavLink>
                </div>
                <form onSubmit={ handleSubmit(onSubmit) } className='w-[50%] h-full flex justify-center items-center flex-col gap-5 shadow-4xl bg-white rounded-r-2xl'>
                    <h1 className='text-4xl font-bold'>Register User</h1>
                    <input placeholder='Name' { ...register('name') } className='px-5 py-3 border-2 rounded-full w-100' />
                    <p className='text-red-500 font-bold'>{ errors.name?.message }</p>
                    <input placeholder='Email' { ...register('email') } className='px-5 py-3 border-2 rounded-full w-100' />
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
        </div >
    );
}

export default Register;