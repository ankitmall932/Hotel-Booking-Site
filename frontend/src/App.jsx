import React from 'react';
import Router from './routes/Router';
import { ToastContainer } from 'react-toastify';
function App () {
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