import React from 'react';
import { useAuth } from '../../context/AuthContext';

function NameIcon () {
    const { user } = useAuth();
    const firstLetter = user?.name?.charAt(0).toUpperCase();
    return (
        <div className='size-10 rounded-full bg-black text-white flex  justify-center items-center'>
            { firstLetter }
        </div>
    );
}

export default NameIcon;