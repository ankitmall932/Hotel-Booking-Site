import React from 'react';
import HomePageAnimation from '../animations/HomePageAnimation';
import Destination from './Destination';
import FeatureDestination from './FeatureDestination';
import ListingSuggestion from './ListingSuggestion';
function Home () {
    return (
        <>
            <div className='sm:h-full h-fit sm:w-full w-fit bg-[url("/mohamed-masaau-nfF5-G6cFwY-unsplash.jpg")] bg-cover sm:pt-10 p-2 flex flex-col justify-center items-center sm:gap-20 gap-5'>
                <div className="w-fit h-fit flex flex-col justify-center items-center sm:mb-20 mb-2">
                    <HomePageAnimation />
                    <div className="sm:w-150 w-full sm:mt-20 mt-0">
                        <h1 className='sm:text-3xl text-base sm:font-bold font-semibold text-white sm:mb-5 mb-1'>Discover Places That Feel Like Home — Anywhere in the World</h1>
                        <h2 className='sm:text-xl text-base sm:font-bold font-semibold text-white sm:mb-5 mb-1'>From cozy stays to luxury escapes, explore handpicked properties designed for comfort, convenience, and unforgettable experiences. Book with confidence and travel without limits.</h2>
                    </div>
                </div>
            </div>
            <ListingSuggestion />
            <Destination />
            <h1 className="sm:text-3xl text-lg font-bold text-center m-4">Featured Destinations</h1>
            <FeatureDestination />
        </>
    );
}

export default Home;