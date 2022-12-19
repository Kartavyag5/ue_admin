import Home from '../components/navigation/Home';
import '../styles/globals.css'
import '../styles/reduction.scss';
import React from 'react';


function MyApp({ Component, pageProps }) {

  return (
    <div className="pageWrapper">

      <Home Component={Component} {...pageProps}/> 

    </div>
  )
}

export default MyApp
