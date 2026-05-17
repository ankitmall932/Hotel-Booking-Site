import React from 'react';
import { useNavigate } from 'react-router-dom';

function Destination () {
    const nav = useNavigate();
    const states = [
        {
            name: 'Uttar Pradesh',
            image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0e/b5/28/7c/chhota-imambara.jpg?w=500&h=500&s=1'
        },
        {
            name: 'Bihar',
            image: 'https://images.nativeplanet.com/img/2013/09/25-shershahsuritomb.jpg'
        },
        {
            name: 'Maharashtra',
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTCWuGgM7dW6Tj3eschhqdg3J3DC39WqRAiKA&s'
        },
        {
            name: 'Delhi',
            image: 'https://res.cloudinary.com/purnesh/image/upload/w_540,f_auto,q_auto:eco,c_limit/red-fort1582282865927.jpg'
        },
        {
            name: 'Kerala',
            image: 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcRpjTLFjmRfyfLIUGlGS45pbqW_FRVfSbZgGVhgghFUa5g6MhU8'
        },
        {
            name: 'Jammu and Kashmir',
            image: 'https://cliffhangersindia.com/wp-content/uploads/2024/04/shankaracharya-temple.jpg.webp'
        },
        {
            name: 'Goa',
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSk2L43qnYG89HS8X101Ajq1LQAKxh2WfVrYct5cmVRld0QbghGqBnu4vA&s'
        },
        {
            name: 'Meghalaya',
            image: 'https://assets.indiaonline.in/cg/shillong/City-Guide/ukianf.jpg'
        },
        {
            name: 'Nagaland',
            image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/08/18/de/d6/kohima-war-cemetery.jpg?w=500&h=500&s=1'
        },
        {
            name: 'Sikkim',
            image: 'https://www.indianholiday.com/wordpress/wp-content/uploads/2022/11/Pemayangtse-Monastery.png'
        }
    ];
    return (
        <div className='h-full w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4  lg:gap-6 gap-4 lg:p-4 p-1'>
            { states.map((state) => (
                <div onClick={ () => nav(`/customer/state/${ state.name }`) } className=" h-40 sm:h-60  lg:h-80 relative   rounded-lg overflow-hidden cursor-pointer">
                    <img src={ state.image } alt={ state.name } className="w-full h-full object-cover" />
                    <h1 className=" text-white sm:text-xl text-sm font-bold bg-black/30 rounded-2xl  px-2 py-1  absolute top-1 left-1">{ state.name }</h1>
                </div>
            ))
            }
        </div >
    );
}

export default Destination;