import React, { useState, useEffect } from "react";
import { Navigation } from "./patient/navigation";
import { Header } from "./patient/header";
import { Features } from "./patient/features";
import { About } from "./patient/about";
import { Services } from "./patient/services";
import { Gallery } from "./patient/gallery";
import { Testimonials } from "./patient/testimonials";
import { Team } from "./patient/Team";
import { Contact } from "./patient/contact";
import JsonData from "./data/data.json";
import SmoothScroll from "smooth-scroll";
import { createContext } from "react";

import "./App.css";
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Signin from "./login/login";
import Pation from "./patient";
import Register from "./login/register";
import Dashboard from "./admin/dashboard";
import ForgetPassword from "./login/forgetpass";
import Doctor from "./medecin/medecin";
import Nurse from "./nurse/nurse";
import ResetPass from "./login/resetpass";
export const scroll = new SmoothScroll('a[href*="#"]', {
  speed: 1000,
  speedAsDuration: true,
});

export const RecoveryContext = createContext();


const App = () => {
  const [landingPageData, setLandingPageData] = useState({});
  useEffect(() => {
    setLandingPageData(JsonData);
  }, []);

  const [email, setEmail] = useState();
  const [otp, setOTP] = useState();

  return (
   
      <>
      <RecoveryContext.Provider
      value={{  otp, setOTP, setEmail, email }}
    >
      <Routes>
        <Route path="/" element={<Signin></Signin>}></Route>
        <Route path="/patient" element={<Pation></Pation>}></Route>
        <Route path="/doctor" element={<Doctor/>}></Route>
        <Route path="/nurse" element={<Nurse/>}></Route>
        <Route path="/register" element={<Register></Register>}></Route>
        <Route path="/dashboard" element={<Dashboard></Dashboard>}></Route>
        <Route path="/login" element={<Signin/>}></Route>
        <Route path="/forgot-password" element={<ForgetPassword/>}></Route>
        <Route path="/reset-password/:id/:token" element={<ResetPass></ResetPass>}></Route>
      </Routes>
      </RecoveryContext.Provider>
      </>
     
      
      
      
     

    
  );
};

export default App;
