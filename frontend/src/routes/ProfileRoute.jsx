import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import Profile from '../pages/users/Profile';

function ProfileRoute () {
    return (
        <div >
            <Navbar />
            <div className='flex pt-16'>
                <div className="w-[25%]">
                    <Profile />
                </div>
                <div className="w-[75%]">
                    <Outlet />
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default ProfileRoute;