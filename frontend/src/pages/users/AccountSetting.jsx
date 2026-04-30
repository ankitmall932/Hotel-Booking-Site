import React from 'react';
import { logout, logoutAll } from '../../api/auth.api';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, NavLink } from 'react-router-dom';

function AccountSetting () {
    const { setUser } = useAuth();
    const nav = useNavigate();
    const handleLogout = async () => {
        const { data: res, error } = await logout();
        if (error)
        {
            toast.error(error);
            return;
        }
        setUser(null);
        toast.success(res.message || 'User logged out successfully');
        nav('/');
    };
    const handleLogoutAll = async () => {
        const { data: res, error } = await logoutAll();
        if (error)
        {
            toast.error(error);
            return;
        }
        setUser(null);
        toast.success(res.message || 'User logged out successfully');
        nav('/');
    };

    return (
        <div className='h-screen w-full p-25'>
            <div className='1/2 flex justify-center items-center gap-5'>
                <button className='px-4 py-3 rounded-2xl bg-red-500 hover:bg-red-600 hover:scale-110 active:scale-90 cursor-pointer text-white' onClick={ handleLogout }>Logout</button>
                <button onClick={ handleLogoutAll } className='px-4 py-3 rounded-2xl bg-red-500 hover:bg-red-600 hover:scale-110 active:scale-90 cursor-pointer text-white'>LogoutAll</button>
                <NavLink to='/resetPass' className='px-4 py-3 rounded-2xl bg-blue-500 hover:bg-blue-600 hover:scale-110 active:scale-90 cursor-pointer text-white'>Reset Password</NavLink>
            </div>
        </div>
    );
}

export default AccountSetting;