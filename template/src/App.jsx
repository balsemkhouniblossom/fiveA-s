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
import CreateAmbulance from "./admin/createAmbulance";
import "./App.css";
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Signin from "./login/login";
import Pation from "./patient/patient";
import Register from "./login/register";
import Dashboard from "./admin/dashboard";
import ForgetPassword from "./login/forgetpass";
import UpdateProfile from "./login/updateProfile";
import Doctor from "./medecin/medecin";
import Nurse from "./nurse/nurse";
import ProtectedRoutes from "./login/protectedRouter";

import ResetPass from "./login/resetpass";
import Ambulance from "./admin/ambulance";
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
      <Route element={<ProtectedRoutes allowedRoles={["ADMIN"]} />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        <Route element={<ProtectedRoutes allowedRoles={["PATIENT"]} />}>
          <Route path="/patient" element={<Pation />} />
        </Route>

        <Route element={<ProtectedRoutes allowedRoles={["DOCTOR"]} />}>
          <Route path="/doctor" element={<Doctor/>} />
        </Route>

        <Route element={<ProtectedRoutes allowedRoles={["NURSE"]} />}>
          <Route path="/nurse" element={<Nurse />} />
        </Route>

        <Route path="*" element={<h1>404 - Page non trouvée</h1>} />
      <Route path="/forgot-password" element={<ForgetPassword/>}></Route>
      <Route path="/updateProfile/:id" element={<UpdateProfile />} />


     <Route path="/register" element={<Register></Register>}></Route>
     <Route path="/reset-password/:id/:token" element={<ResetPass></ResetPass>}></Route>
     </Routes>
     </RecoveryContext.Provider>
    </>
     
      
      
      
     

    
  );
};

export default App;
