import React, { useState, useEffect } from 'react';
import { userListings } from '../../api/owner.api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';


function Dashboard () {

    const nav = useNavigate();

    const [ listings, setListings ] = useState([]);
    useEffect(() => {
        const data = async () => {
            const { data: res, error } = await userListings();
            if (error)
            {
                toast.error(error);
                return;
            }
            setListings(res.listings || []);
            toast.success(res.message);
        };
        data();
    }, []);

    return (
        <div className='h-full w-full  flex flex-wrap  gap-5 p-20'>
            { listings.map((n) => (
                <div key={ n._id } onClick={ () => nav(`/host/listing/${ n._id }`) } className='h-full w-110 p-5 rounded-2xl cursor-pointer flex flex-wrap gap-5'>
                    <img src={ n.images[ 0 ].url } alt={ n.name } className='w-100 h-100 bg-cover rounded-2xl' />
                    <div className="flex flex-col justify-center  gap-2">
                        <h1 className='text-2xl font-semibold'>{ n.name }</h1>
                        <h1>{ n.price }/per night</h1>
                        <h3>{ n.location.state }</h3>
                        <h3>{ n.location.city }</h3>
                    </div>
                </div>
            )) }
        </div>
    );
}

export default Dashboard;
