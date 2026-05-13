import React, { useEffect } from 'react';
import Router from './routes/Router';
import { ToastContainer } from 'react-toastify';
import { useWishlistStore } from './store/wishlistStore';
function App () {
  const fetchWishlist = useWishlistStore((state) => state.fetchWishlist);
  useEffect(() => {
    fetchWishlist();
  }, [ fetchWishlist ]);
  return (
    <div>
      <ToastContainer
        position='top-center'
        autoClose={ 1000 } />
      <Router />
    </div>
  );
}

export default App;