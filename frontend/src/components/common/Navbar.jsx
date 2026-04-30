import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { CircleUserRound } from 'lucide-react';
import NameIcon from '../functions/NameIcon';
import { useAuth } from '../../context/AuthContext';
import { switchUser } from '../../api/auth.api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function Navbar () {
    const { user, setUser, loading } = useAuth();
    const nav = useNavigate();
    const location = useLocation();

    const switchUsers = async (role) => {
        const { error } = await switchUser({ role });
        if (error)
        {
            toast.error(error);
            return;
        }
        setUser((prev) => ({
            ...prev,
            currentRole: role
        }));
        if (role === 'owner')
        {
            nav('/host/dashboard');
            toast.success('Now you are a host');
        } else
        {
            nav('/');
            toast.success('Now you are a customer');
        }
    };

    const isActive = ({ isActive }) => {
        return isActive ? 'text-blue-500 font-semibold' : 'hover:text-blue-500 font-semibold';
    };
    if (loading) return null;

    return (
        <div>
            { !user ? (
                <div className='px-10 bg-gray-100 shadow-2xl fixed top-0 left-0 right-0 z-50 flex justify-between items-center h-16'>
                    <div>
                        <NavLink to='/' className='text-4xl font-bold'>
                            <img src="/Luxurious Siddhi Hotels logo design.png" alt="logo" className='h-18 w-40' />
                        </NavLink>
                    </div>
                    <div className=' gap-10 rounded-4xl flex justify-between items-center'>
                        <NavLink to='/login' state={ { from: location } }>Switch to hosting</NavLink>
                        {/*                         <div>
                            <NavLink to='about' className={ isActive }>About</NavLink>
                        </div>
                        <div>
                            <NavLink to='/contact' className={ isActive }>Contact</NavLink>
                        </div> */}
                        <div className='px-3 py-2 bg-red-500 hover:bg-red-600 rounded font-semibold hover:scale-110 active:scale-90' >
                            <NavLink to='login' state={ { from: location } }>Login</NavLink>
                        </div>
                        <div className='px-3 py-2 bg-red-500 hover:bg-red-600 rounded font-semibold hover:scale-110 active:scale-90'>
                            <NavLink to='register' state={ { from: location } }>Register</NavLink>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    { user.currentRole === 'customer' ? (
                        <div className='px-10 bg-gray-100 shadow-2xl fixed top-0 left-0 right-0 z-50 flex justify-between items-center h-16'>
                            <div>
                                <NavLink to='/' className='text-4xl font-bold'>
                                    <img src="/Luxurious Siddhi Hotels logo design.png" alt="logo" className='h-18 w-40' />
                                </NavLink>
                            </div>
                            <div className=' gap-10 rounded-4xl flex justify-between items-center'>
                                <button onClick={ () => switchUsers('owner') }>Switch to hosting</button>
                                {/*                         <div>
                            <NavLink to='about' className={ isActive }>About</NavLink>
                        </div>
                        <div>
                            <NavLink to='/contact' className={ isActive }>Contact</NavLink>
                        </div> */}
                                <div className=' text-white  hover:scale-110 active:scale-90' >
                                    <NavLink to='/users/profile' className=' h-12 w-12 rounded-full bg-black flex justify-center items-center '><NameIcon /></NavLink>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className='px-10 bg-gray-100 shadow-2xl fixed top-0 left-0 right-0 z-50 flex justify-between items-center h-16'>
                            <div>
                                <NavLink to='/host/dashboard' className='text-4xl font-bold'>
                                    <img src="/Luxurious Siddhi Hotels logo design.png" alt="logo" className='h-18 w-40' />
                                </NavLink>
                            </div>
                            <div className=' gap-10 rounded-4xl flex justify-between items-center'>
                                <button onClick={ () => switchUsers('customer') }>Switch  to customer</button>
                                <div>
                                    <NavLink to='/host/dashboard' className={ isActive }>Dashboard</NavLink>
                                </div>
                                <div>
                                    <NavLink to='/host/booking' className={ isActive }>Booking</NavLink>
                                </div>
                                <div>
                                    <NavLink to='/host/createListings' className={ isActive }>Create New</NavLink>
                                </div>
                                <div className=' text-white  hover:scale-110 active:scale-90' >
                                    <NavLink to='/users/profile' className=' h-12 w-12 rounded-full bg-black flex justify-center items-center '><NameIcon /></NavLink>
                                </div>
                            </div>
                        </div>
                    ) }
                </>
            )
            }
        </div>
    );
}


export default Navbar;