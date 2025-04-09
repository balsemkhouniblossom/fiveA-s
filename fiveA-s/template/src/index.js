import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import App from './App';
import * as serviceWorker from './serviceWorker';
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import "@fortawesome/fontawesome-free/css/all.min.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
const clientId = "300857414061-8ff3ed18qghlb7r1bcqom4a52ki58ch0.apps.googleusercontent.com";
ReactDOM.render(
   
  <React.StrictMode>
    <GoogleOAuthProvider clientId={clientId}>

    <BrowserRouter> 
    <App />
    </BrowserRouter>
    </GoogleOAuthProvider>,
 
  </React.StrictMode>
  
  ,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
