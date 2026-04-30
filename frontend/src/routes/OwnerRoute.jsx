import React from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { Outlet } from 'react-router-dom';

function OwnerRoute () {
    return (
        <div>
            <Navbar />
            <div className="pt-16">
                <Outlet />
            </div>
            <Footer />
        </div>
    );
}

export default OwnerRoute;