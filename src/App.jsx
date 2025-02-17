import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './Home'
import Signup from './Signup'
import Login from './Login'
import ForgotPassword from './ForgotPassword'
import Dashboard from './Dashboard'
import 'bootstrap/dist/css/bootstrap.min.css'

function App() {
  //const login = window.localStorage.getItem("isLogedIn");

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/register" element={<Signup />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/dashboard" element={<Dashboard />}></Route>
        <Route path="/forgot-password" element={<ForgotPassword />}></Route>
      </Routes>
    </BrowserRouter> 
  )
}

export default App
