import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useNavigate } from 'react-router-dom';
function FeatureDestination () {
    const nav = useNavigate();
    const states = [
        {
            name: 'Goa',
            image: '/goa.jpg'
        },
        {
            name: 'Kerala',
            image: '/kerala.jpg'
        },
        {
            name: 'Jammu and Kashmir',
            image: '/j&k.jpg'
        },
        {
            name: 'Sikkim',
            image: '/sikkim.jpg'
        }
    ];
    return (
        <div className='w-full h-125 px-10  '>
            <Swiper
                modules={ [ Navigation, Pagination, Autoplay ] }
                /*                 spaceBetween={ 50 }
                                slidesPerView={ 3 } */
                navigation
                pagination={ { clickable: true } }
                autoplay={ { delay: 3000 } }
                loop={ true }
                /* className="h-125" */ >

                <div className='h-full w-full  '>
                    { states.map((state) => (
                        <SwiperSlide>
                            <div onClick={ () => nav(`/customer/state/${ state.name }`) } className="  rounded-lg overflow-hidden cursor-pointer">
                                <img src={ state.image } alt={ state.name } className="w-full h-115 object-cover" />
                                <h1 className=" text-white text-xl  font-bold bg-black bg-opacity-50 px-2 py-1 rounded-b-lg">{ state.name }</h1>
                            </div>
                        </SwiperSlide>
                    ))
                    }
                </div >
            </Swiper>
        </div>
    );
}

export default FeatureDestination;