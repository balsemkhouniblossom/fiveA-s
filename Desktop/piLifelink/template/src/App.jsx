import React, { useState, useEffect } from "react";

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
import ShowProfile from "./login/showProfile";
import Doctor from "./medecin/medecin";
import Nurse from "./nurse/nurse";
import { ListeSpecialites } from "./patient/specialite";
import { Medecins } from "./patient/medecins";
import ProtectedRoutes from "./login/protectedRouter";
import DoctorCalendar from "./medecin/doctorCalendar";
import { Homepage } from "./patient/homepage";
import ResetPass from "./login/resetpass";
import FactoryAuth from "./login/2FactorAuth";
import Appointment from "./admin/appointment";
import OperationCalendarMedecin from "./medecin/Operation";
import Rdv from "./patient/rdv"; 
import OperationCalendarPatient from "./patient/Operation";
import MesRdv from "./patient/MesRdv";
import PatientCalendar from "./patient/patientCalendar";
import Complaint from "./patient/Complaint"; // Import Complaint component
import MesRdvMedecin from "./medecin/MesRdvMedecin";
import Chatbot from "./patient/chatbot";
import Patients from "./medecin/Patients";
import ImageUpload from "./medecin/image";
import Files from "./medecin/Files";
import Historique from "./patient/historique";
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
      
        <Route path="/medecins/:specialite" element={<Medecins />} />
        <Route path="/rdv/:idMedecin" element={<Rdv />} />
        
        <Route path="/chatbot" element={<Chatbot />} />


      <Route path="/" element={<Signin></Signin>}></Route>
      <Route element={<ProtectedRoutes allowedRoles={["ADMIN"]} />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        <Route element={<ProtectedRoutes allowedRoles={["PATIENT"]} />}>
          <Route path="/patient" element={<Pation />} />
          <Route path="/patientCalendar/:patientId" element={<PatientCalendar />} />
          <Route path="/options/:userId" element={<MesRdv />} />
          <Route path="/home" element={<Homepage />} />
          <Route path="/specialite" element={<ListeSpecialites />} />
          <Route path="/complaints/:userId" element={<Complaint />} />
          <Route path="/:userId/historique" element={<Historique />} />
          <Route path="/complaints/:userId" element={<Complaint />} />

        </Route>

        <Route element={<ProtectedRoutes allowedRoles={["DOCTOR"]} />}>
          <Route path="/doctor" element={<Doctor/>} />
          <Route path="/doctorCalendar/:doctorId" element={<DoctorCalendar />} />
          <Route path="/operation/:doctorId" element={<OperationCalendarMedecin />} />
          <Route path="/medecin/:doctorId/rdv" element={<MesRdvMedecin />} />
          <Route path="/listPatients/:userId" element={<Patients />} /> {/* Route dynamique pour les patients */}
          <Route path="/user/:userId/images/:patientId" element={<ImageUpload />} /> {/* Nouvelle route */}
          <Route path="/user/:userId/pdf/:patientId" element={<Files />} /> {/* Nouvelle route */}


        </Route>

        <Route element={<ProtectedRoutes allowedRoles={["NURSE"]} />}>
          <Route path="/nurse" element={<Nurse />} />
          <Route path="/appointment" element={<Appointment />} />
        </Route>

        <Route path="*" element={<h1>404 - Page non trouvée</h1>} />
      <Route path="/forgot-password" element={<ForgetPassword/>}></Route>
      <Route path="/updateProfile/:id" element={<UpdateProfile />} />
      <Route path="/showProfile/:id" element={<ShowProfile />} />
      <Route path="/codeAuth" element={<FactoryAuth></FactoryAuth>}></Route>

      <Route 
              path="/operationDoctor/:doctorId" 
              element={<OperationCalendarMedecin />} 
            />
     <Route 
              path="/operationPatient/:patientId" 
              element={<OperationCalendarPatient />} 
            />
     <Route path="/homepage" element={<Homepage></Homepage>}></Route>
      <Route path="/spec" element={<ListeSpecialites></ListeSpecialites>}></Route>
     <Route path="/register" element={<Register></Register>}></Route>
     <Route path="/reset-password/:id/:token" element={<ResetPass></ResetPass>}></Route>
     </Routes>
     </RecoveryContext.Provider>
    </>
     
      
      
      
     

    
  );
};

export default App;
