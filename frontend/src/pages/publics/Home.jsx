import React from 'react';
import HomePageAnimation from '../animations/HomePageAnimation';
import Destination from './Destination';
import FeatureDestination from './FeatureDestination';
function Home () {
    return (
        <>
            <div className='h-full w-full bg-[url("/mohamed-masaau-nfF5-G6cFwY-unsplash.jpg")] bg-cover pt-10 flex flex-col justify-center items-center gap-20'>
                <div className="w-fit h-fit flex flex-col justify-center items-center mb-20">
                    <HomePageAnimation />
                    <div className="w-150 mt-20">
                        <h1 className='text-3xl font-bold text-white mb-5'>Discover Places That Feel Like Home — Anywhere in the World</h1>
                        <h2 className='text-2xl font-bold text-white mb-5'>From cozy stays to luxury escapes, explore handpicked properties designed for comfort, convenience, and unforgettable experiences. Book with confidence and travel without limits.</h2>
                    </div>
                </div>
            </div>
            <Destination />
            <h1 className="text-3xl font-bold text-center m-4">Featured Destinations</h1>
            <FeatureDestination />
        </>
    );
}

export default Home;