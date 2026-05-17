import React from 'react';
import { NavLink } from 'react-router-dom';
import { MapPinned } from 'lucide-react';
import { Mail } from 'lucide-react';
import { Phone } from 'lucide-react';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import XIcon from '@mui/icons-material/X';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

function Footer () {
    return (
        <div className='flex flex-col'>
            <div className='w-full px-5 lg:px-10 bg-gray-200 border-t-2 border-gray-200  sm:flex sm:flex-row justify-evenly flex-col mt-10 py-10 '>
                <div className='flex flex-col gap-5 text-start sm:mb-0 mb-8'>
                    <h1 className='text-xl font-semibold mb-2 sm:mb-5'>Contact US</h1>
                    <div className='flex flex-row gap-3 items-center justify-start'>
                        <span> <MapPinned /></span>
                        <span>Gorakhpur,Uttar Pradesh Zip Code- 273001</span>
                    </div>
                    <div className='flex flex-row gap-3 items-center justify-start'>
                        <span>   <Mail /></span>
                        <span>ankitmall932@gmail.com</span>
                    </div>
                    <div className='flex flex-row gap-3 items-center justify-start'>
                        <span>  <Phone /></span>
                        <span>9305617987</span>
                    </div>
                </div>
                <div></div>
                <div className='flex flex-col gap-5 sm:mb-0 mb-8'>
                    <h1 className='text-xl font-semibold mb-2 sm:mb-5'>Services</h1>
                    <NavLink className='hover:text-blue-500' to='#'>Host Your Home</NavLink>
                    <NavLink className='hover:text-blue-500' to='#'>Share Your Experience</NavLink>
                    <NavLink className='hover:text-blue-500' to='#'>Host Your Services</NavLink>
                    <NavLink className='hover:text-blue-500' to='#'>Find a co-host</NavLink>
                    <NavLink className='hover:text-blue-500' to='#'>Join a Free Hosting</NavLink>
                    <NavLink className='hover:text-blue-500' to='#'>Refer a Host</NavLink>
                </div>
                <div className='flex flex-col gap-5 sm:mb-0 mb-8'>
                    <h1 className='text-xl font-semibold mb-2 sm:mb-5'>Support</h1>
                    <NavLink className='hover:text-blue-500' to='#'>Help Center</NavLink>
                    <NavLink className='hover:text-blue-500' to='#'>Air Cover</NavLink>
                    <NavLink className='hover:text-blue-500' to='#'>Get help with safety issue</NavLink>
                    <NavLink className='hover:text-blue-500' to='#'>Anti-discrimination</NavLink>
                    <NavLink className='hover:text-blue-500' to='#'>Cancellation options</NavLink>
                    <NavLink className='hover:text-blue-500' to='#'>Disability Support</NavLink>
                </div>
            </div>
            <div className='border-t-2 border-gray-200 flex justify-between px-6 py-3 '>
                <p>&copy; All Right Reserve to Siddhi Hotels</p>
                <div className='flex gap-4'>
                    <a href='https://www.instagram.com/ankit_mall_932' target='_blank' rel='noopener noreferrer'>
                        <InstagramIcon />
                    </a>
                    <a href='https://www.facebook.com/ankitmall.932' target='_blank' rel='noopener noreferrer'>
                        <FacebookIcon />
                    </a>
                    <a href="https://wa.me/919936738441" target="_blank">
                        <WhatsAppIcon />
                    </a>
                </div>
            </div>
        </div>
    );
}

export default Footer;