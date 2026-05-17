import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import Profile from '../pages/users/Profile';

function ProfileRoute () {
    return (
        <div >
            <Navbar />
            <div className='flex md:flex-row flex-col pt-16'>
                <div className="md:w-[25%] w-full">
                    <Profile />
                </div>
                <div className="md:w-[75%] w-full">
                    <Outlet />
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default ProfileRoute;