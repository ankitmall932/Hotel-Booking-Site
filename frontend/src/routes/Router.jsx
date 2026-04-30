import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import PageRouting from './PageRouting';
import Home from '../pages/publics/Home';
import Rooms from '../pages/costumer/Rooms';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import VerifyOtp from '../pages/auth/VerifyOtp';
import ResetPass from '../pages/auth/ResetPass';
import PageNotFound from '../components/common/PageNotFound';
import AboutMe from '../pages/users/AboutMe';
import ResetPassOtp from '../pages/auth/ResetPassOtp';
import ForgetPass from '../pages/auth/ForgetPass';
import AuthPage from './AuthPage';
import ProfileRoute from './ProfileRoute';
import ProtectedRoute from '../components/functions/ProtectedRoute';
import PastTrips from '../pages/users/PastTrips';
import AccountSetting from '../pages/users/AccountSetting';
import OwnerRoute from './OwnerRoute';
import Dashboard from '../pages/owners/Dashboard';
import Booked from '../pages/owners/Booked';
import CreateListings from '../pages/owners/CreateListings';
import OwnerProtected from '../components/functions/OwnerProtected';
import DetailPage from '../pages/owners/DetailPage';
import ImagePreview from '../pages/publics/ImagePreview';
import CustomerRoute from './CustomerRoute';
import StateListing from '../pages/publics/StateListing';
import BookingPage from '../pages/costumer/BookingPage';

function Router () {
    const router = createBrowserRouter([
        {
            element: <PageRouting />,
            children: [
                {
                    path: '/',
                    element: <Home />
                },
                {
                    path: '*',
                    element: <PageNotFound />
                },
                {
                    path: '/customer/state/:stateName',
                    element: <StateListing />
                },
                {
                    path: '/customer/room/:id',
                    element: <Rooms />
                },
                {
                    path: '/image/:id',
                    element: <ImagePreview />
                }
            ]
        },
        {
            element: <AuthPage />,
            children: [
                {
                    path: '/login',
                    element: <Login />
                },
                {
                    path: '/resetPass',
                    element: <ProtectedRoute><ResetPass /></ProtectedRoute>
                },
                {
                    path: '/register',
                    element: <Register />
                },
                {
                    path: '/verifyOtp',
                    element: <VerifyOtp />
                },
                {
                    path: '/reset',
                    element: <ResetPassOtp />
                },
                {
                    path: '/forget',
                    element: <ForgetPass />
                }
            ]
        },
        {
            element: <ProtectedRoute><ProfileRoute /></ProtectedRoute>,
            children: [
                {
                    path: '/users/profile',
                    element: <AboutMe />
                },
                {
                    path: '/users/past-trips',
                    element: <PastTrips />
                },
                {
                    path: '/users/account-settings',
                    element: <AccountSetting />
                }
            ]
        },
        {
            element:
                <ProtectedRoute>
                    <OwnerProtected>
                        <OwnerRoute />
                    </OwnerProtected>
                </ProtectedRoute>,
            children: [
                {
                    path: '/host/dashboard',
                    element: <Dashboard />
                },
                {
                    path: '/host/booking',
                    element: <Booked />
                },
                {
                    path: '/host/createListings',
                    element: <CreateListings />
                },
                {
                    path: '/host/createListing',
                    element: <CreateListings />
                },
                {
                    path: '/host/listing/:id',
                    element: <DetailPage />
                }
            ]
        },
        {
            element:
                <ProtectedRoute>
                    <CustomerRoute />
                </ProtectedRoute>,
            children: [
                {
                    path: '/customer/booking/:id',
                    element: <BookingPage />
                }
            ]
        }
    ]);
    return (
        <div>
            <RouterProvider router={ router } />
        </div>
    );
}

export default Router;