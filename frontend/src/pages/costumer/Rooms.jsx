import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { detailRoom } from '../../api/user.api';
import { toast } from 'react-toastify';
import { useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import BookingPage from './BookingPage';
import CreateReview from './CreateReview';
import ViewReview from '../publics/ViewReview';


function Rooms () {
    const { id } = useParams();
    const [ detail, setDetail ] = useState(null);
    const nav = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        const fetchDetail = async () => {
            const { data: res, error } = await detailRoom(id);
            if (error)
            {
                toast.error(error);
                return;
            }
            toast.success(res.message);
            setDetail(res.listing);
        };
        fetchDetail();
    }, [ id ]);

    return (
        <div>
            <div className='w-full h-full p-10 flex justify-center items-center flex-col'>
                { detail && (
                    <>
                        <div className="grid grid-cols-4 grid-rows-2 gap-1 w-[80%] h-100">
                            { detail.images?.map((img, index) => (
                                <div
                                    key={ img._id || index }
                                    className={ index === 0 ? 'col-span-2 row-span-2' : '' }
                                >
                                    <img
                                        onClick={ () => nav(`/image/${ img._id }`) }
                                        src={ img.url }
                                        className={ `w-full h-full object-cover cursor-pointer ${ index === 0 ? 'rounded-l-lg' : index === 2 ? 'rounded-tr-lg' : index === 4 ? 'rounded-br-lg' : ''
                                            }` }
                                    />
                                </div>
                            )) }
                        </div>
                        <div className='flex w-[80%]  mt-10 gap-10  h-full'>
                            <div className="flex flex-col  w-[80%] gap-5">
                                <div className='flex gap-5'>
                                    <div>
                                        <h1 className='text-2xl font-semibold'>{ detail.name }</h1>
                                        <h1 className='text-lg font-semibold'>{ detail.description }</h1>
                                        <h1>{ detail.price } per night</h1>
                                        <h1> State : { detail.location.state }</h1>
                                        <h1> City : { detail.location.city }</h1>
                                        <h1> Country : { detail.location.country }</h1>
                                    </div>
                                    <div>
                                        <h1 className='text-2xl font-semibold'>Facility Provided By Us</h1>
                                        <div>
                                            { detail.amenities?.map((data, idx) => (
                                                <ul key={ idx }>
                                                    <li className='list-disc list-inside'>{ data }</li>
                                                </ul>
                                            )) }
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h1 className='py-5 border-t-2 border-b-2 w-full text-lg'> Hosted By : { detail.owner.name }</h1>
                                </div>
                            </div>
                            <div className="flex justify-center items-center">
                                { !user ? (
                                    <NavLink to='/login' className='px-4 py-3 rounded hover:scale-110 active:scale-95 cursor-pointer bg-green-500 justify-center items-center'>Book Now</NavLink>
                                ) : (
                                    <NavLink to={ `/customer/booking/${ detail._id }` } className='px-4 py-3 rounded hover:scale-110 active:scale-95 cursor-pointer bg-green-500 justify-center items-center'>Book Now</NavLink>
                                ) }
                            </div>
                        </div>
                    </>
                )
                }
                { detail?.coords && (
                    <div className='w-[80%] mt-10'>
                        <Map listings={ detail } userLocation={ detail.coords } showUserLocation={ false } />
                    </div>
                ) }
            </div>
            <CreateReview />
            <ViewReview />
        </div >
    );
}

export default Rooms;    