import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { CircleUserRound } from 'lucide-react';
import NameIcon from '../functions/NameIcon';
import { useAuth } from '../../context/AuthContext';
import { switchUser } from '../../api/auth.api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

function Navbar () {
    const { user, setUser, loading } = useAuth();
    const nav = useNavigate();
    const location = useLocation();
    const [ isOpen, setIsOpen ] = useState(false);

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
                <>
                    <div className=' hidden px-10 bg-gray-100 shadow-2xl fixed top-0 left-0 right-0 z-50 sm:flex justify-between items-center h-16'>
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
                    <div className=' sm:hidden px-5 bg-gray-100 shadow-2xl fixed top-0 left-0 right-0 z-50 flex justify-between items-center h-12'>
                        <div>
                            <NavLink to='/' className='text-4xl font-bold'>
                                <img src="/Luxurious Siddhi Hotels logo design.png" alt="logo" className='h-15 w-30' />
                            </NavLink>
                        </div>
                        <div>
                            <button onClick={ () => setIsOpen(true) }>
                                <Menu strokeWidth={ 2.25 } />
                            </button>
                            <div onClick={ () => setIsOpen(false) } className={ `fixed inset-0 bg-black/40 transition-opacity duration-300 ${ isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none' }` }>
                                <div className={ `fixed top-0 right-0 h-fit  w-full bg-white z-50 shadow-xl  transform transition-transform duration-300  ${ isOpen ? 'translate-x-0' : 'translate-x-full' }` }>
                                    <div className='flex item-center justify-end p-4 border-b'>
                                        <button onClick={ () => setIsOpen(false) }>
                                            <X strokeWidth={ 2.5 } />
                                        </button>
                                    </div>
                                    <div className='flex flex-col p-4 gap-5'>
                                        <div onClick={ () => setIsOpen(false) } className='px-3 py-2 text-center bg-red-500 hover:bg-red-600 rounded font-semibold hover:scale-110 active:scale-90' >
                                            <NavLink to='login' state={ { from: location } }>Login</NavLink>
                                        </div>
                                        <div onClick={ () => setIsOpen(false) } className='px-3 py-2 text-center bg-red-500 hover:bg-red-600 rounded font-semibold hover:scale-110 active:scale-90'>
                                            <NavLink to='register' state={ { from: location } }>Register</NavLink>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    { user.currentRole === 'customer' ? (
                        <>
                            <div className=' hidden sm:flex px-10 bg-gray-100 shadow-2xl fixed top-0 left-0 right-0 z-50  justify-between items-center h-16'>
                                <div>
                                    <NavLink to='/' className='text-4xl font-bold'>
                                        <img src="/Luxurious Siddhi Hotels logo design.png" alt="logo" className='h-18 w-40' />
                                    </NavLink>
                                </div>
                                <div className=' gap-10 rounded-4xl flex justify-between items-center'>
                                    <button onClick={ () => switchUsers('owner') }>Switch to hosting</button>
                                    <div>
                                        <NavLink to='/wishlists' className={ isActive }>Wishlists</NavLink>
                                    </div>
                                    {/*
                        <div>
                            <NavLink to='/contact' className={ isActive }>Contact</NavLink>
                        </div> */}
                                    <div className=' text-white  hover:scale-110 active:scale-90' >
                                        <NavLink to='/users/profile' className=' h-12 w-12 rounded-full bg-black flex justify-center items-center '><NameIcon /></NavLink>
                                    </div>
                                </div>
                            </div>
                            <div className=' sm:hidden px-5 bg-gray-100 shadow-2xl fixed top-0 left-0 right-0 z-50 flex justify-between items-center h-12'>
                                <div>
                                    <NavLink to='/' className='text-4xl font-bold'>
                                        <img src="/Luxurious Siddhi Hotels logo design.png" alt="logo" className='h-15 w-30' />
                                    </NavLink>
                                </div>
                                <div>
                                    <button onClick={ () => setIsOpen(true) }>
                                        <Menu strokeWidth={ 2.25 } />
                                    </button>
                                    <div onClick={ () => setIsOpen(false) } className={ `fixed inset-0 bg-black/40 transition-opacity duration-300 ${ isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none' }` }>
                                        <div className={ `fixed top-0 right-0 h-fit  w-full bg-white z-50 shadow-xl transform transition-transform duration-300  ${ isOpen ? 'translate-x-0' : 'translate-x-full' }` }>
                                            <div className='flex item-center justify-end p-4 border-b'>
                                                <button onClick={ () => setIsOpen(false) }>
                                                    <X strokeWidth={ 2.5 } />
                                                </button>
                                            </div>
                                            <div className='flex flex-col p-4 gap-5'>
                                                <div className=' text-white  hover:scale-110 active:scale-90' >
                                                    <NavLink to='/users/profile' className=' h-12 w-12 rounded-full bg-black flex justify-center items-center '><NameIcon /></NavLink>
                                                </div>
                                                <div>
                                                    <NavLink to='/wishlists' className={ isActive }>Wishlists</NavLink>
                                                </div>
                                                <div>
                                                    <button onClick={ () => switchUsers('owner') }>Switch to hosting</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className='hidden sm:flex px-10 bg-gray-100 shadow-2xl fixed top-0 left-0 right-0 z-50  justify-between items-center h-16'>
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
                            <div className=' sm:hidden px-5 bg-gray-100 shadow-2xl fixed top-0 left-0 right-0 z-50 flex justify-between items-center h-12'>
                                <div>
                                    <NavLink to='/' className='text-4xl font-bold'>
                                        <img src="/Luxurious Siddhi Hotels logo design.png" alt="logo" className='h-15 w-30' />
                                    </NavLink>
                                </div>
                                <div>
                                    <button onClick={ () => setIsOpen(true) }>
                                        <Menu strokeWidth={ 2.25 } />
                                    </button>
                                    <div onClick={ () => setIsOpen(false) } className={ `fixed inset-0 bg-black/40 transition-opacity duration-300 ${ isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none' }` }>
                                        <div className={ `fixed top-0 right-0 h-fit  w-full bg-white z-50 shadow-xl transform transition-transform duration-300  ${ isOpen ? 'translate-x-0' : 'translate-x-full' }` }>
                                            <div className='flex item-center justify-end p-4 border-b'>
                                                <button onClick={ () => setIsOpen(false) }>
                                                    <X strokeWidth={ 2.5 } />
                                                </button>
                                            </div>
                                            <div className='flex flex-col p-4 gap-5'>
                                                <div className=' text-white  hover:scale-110 active:scale-90' >
                                                    <NavLink to='/users/profile' className=' h-12 w-12 rounded-full bg-black flex justify-center items-center '><NameIcon /></NavLink>
                                                </div>
                                                <div>
                                                    <NavLink to='/host/dashboard' className={ isActive }>Dashboard</NavLink>
                                                </div>
                                                <div>
                                                    <NavLink to='/host/booking' className={ isActive }>Booking</NavLink>
                                                </div>
                                                <div>
                                                    <NavLink to='/host/createListings' className={ isActive }>Create New</NavLink>
                                                </div>
                                                <div>
                                                    <button onClick={ () => switchUsers('customer') }>Switch  to customer</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) }
                </>
            )
            }
        </div>
    );
}


export default Navbar;