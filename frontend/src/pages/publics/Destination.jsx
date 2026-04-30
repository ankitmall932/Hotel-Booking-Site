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
            image: 'https://www.shutterstock.com/image-photo/historic-white-st-anthonys-church-260nw-2603151233.jpg'
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
        <div className='h-full w-full flex flex-wrap justify-start pl-15 items-start '>
            { states.map((state) => (
                <div onClick={ () => nav(`/customer/state/${ state.name }`) } className=" h-80 w-80 m-4 rounded-lg overflow-hidden cursor-pointer">
                    <img src={ state.image } alt={ state.name } className="w-full h-70 object-cover" />
                    <h1 className=" text-white text-xl font-bold bg-black bg-opacity-50 px-2 py-1 rounded-b-lg">{ state.name }</h1>
                </div>
            ))
            }
        </div >
    );
}

export default Destination;