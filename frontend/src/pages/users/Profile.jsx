import React from 'react';
import { NavLink } from 'react-router-dom';
import NameIcon from '../../components/functions/NameIcon';
import { Luggage } from 'lucide-react';
import { Bolt } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

function Profile () {
    const { user } = useAuth();
    const isActive = ({ isActive }) => {
        return isActive ? 'bg-gray-100 rounded-2xl' : 'hover:bg-gray-100 hover:rounded-2xl';
    };
    return (
        <div className='hidden h-screen w-full xl:px-10 lg:px-5 pl-2 py-25 md:flex flex-col  border-r-2 border-gray-200 '>
            <h1 className='xl:text-4xl text-2xl font-semibold mb-5'>Profile</h1>

            <div className='lg:p-4 md:p-2 flex flex-col gap-2'>
                <NavLink to='/users/profile' className={ isActive }><h1 className='text-lg font-semibold p-4 flex  items-center gap-3'> <NameIcon /> About me</h1></NavLink>
                { user?.currentRole === 'customer' && (
                    <NavLink to='/users/past-trips' className={ isActive }> <h1 className='text-lg font-semibold p-4 flex  items-center gap-3'><Luggage size={ 35 } />Bookings</h1></NavLink>
                ) }
                <NavLink to='/users/account-settings' className={ isActive }> <h1 className='text-lg font-semibold p-4 flex  items-center gap-3'> <Bolt size={ 35 } /> Account Settings</h1></NavLink>
            </div>
        </div>
    );
}

export default Profile;