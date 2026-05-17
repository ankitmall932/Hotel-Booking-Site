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
        <div className='w-full lg:h-90 sm:h-70 h-50  lg:px-10 sm:px-5 px-2  '>
            <Swiper
                modules={ [ Navigation, Pagination, Autoplay ] }
                /*                 spaceBetween={ 50 }
                                slidesPerView={ 3 } */
                /* navigation
                pagination={ { clickable: true } } */
                autoplay={ { delay: 3000 } }
                loop={ true }
                /* className="h-125" */ >

                <div className='h-full w-full  '>
                    { states.map((state) => (
                        <SwiperSlide>
                            <div onClick={ () => nav(`/customer/state/${ state.name }`) } className=" relative  rounded-lg overflow-hidden cursor-pointer">
                                <img src={ state.image } alt={ state.name } className="w-full lg:h-90 sm:h-70 h-50  object-cover" />
                                <h1 className=" text-white sm:text-xl text-sm absolute top-2 left-2  font-bold bg-black/30  px-2 py-1 rounded-lg">{ state.name }</h1>
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