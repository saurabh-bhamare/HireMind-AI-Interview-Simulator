import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";

import ProtectedRoute from "./components/ProtectedRoute";
import Step3Report from "./components/Step3Report";

import { setUser } from "./redux/userSlice";


// ================= PAGES =================
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import InterviewSetUpPage from "./pages/InterviewSetUpPage";
import InterviewPage from "./pages/InterviewPage";
import InterviewAnalyze from "./pages/InterviewAnalyze";
import ResumeUploadPage from "./pages/ResumeUploadPage";
import Pricing from "./pages/Pricing";
import PaymentSuccess from "./pages/PaymentSuccess";
import History from "./pages/History";
import Dashboard from "./pages/Dashboard";
import EditProfile from "./pages/EditProfile";


const ServerUrl = "http://localhost:8000";


function App() {

  const dispatch = useDispatch();


  // ===========================
  // GET LOGGED USER
  // ===========================
  useEffect(() => {


    const getUser = async () => {

      try {

        const token = localStorage.getItem("token");


        if (!token) {
          return;
        }


        const res = await axios.get(
          `${ServerUrl}/api/user/profile`,
          {
            headers:{
              Authorization:`Bearer ${token}`
            }
          }
        );


        dispatch(
          setUser({
            user: res.data.user,
            token
          })
        );


      } catch(error) {


        console.log(
          "User fetch error:",
          error.response?.data || error.message
        );


        localStorage.removeItem("token");

      }

    };


    getUser();


  }, [dispatch]);



  return (

    <Routes>


      {/* HOME */}
      <Route
        path="/"
        element={<Home />}
      />



      {/* AUTH */}
      <Route
        path="/auth"
        element={<Auth />}
      />



      {/* RESUME UPLOAD */}
      <Route
 path="/upload"
 element={
   <ProtectedRoute>
      <ResumeUploadPage />
   </ProtectedRoute>
 }
/>



      {/* RESUME ANALYSIS */}
<Route
  path="/resume-analysis"
  element={
    
      <InterviewAnalyze />
   
  }
/>


{/* INTERVIEW SETUP */}
<Route
  path="/interview/setup"
  element={
    <ProtectedRoute>
      <InterviewSetUpPage />
    </ProtectedRoute>
  }
/>


{/* LIVE INTERVIEW */}
<Route
  path="/interview/:id"
  element={
    <ProtectedRoute>
      <InterviewPage />
    </ProtectedRoute>
  }
/>


{/* INTERVIEW REPORT */}
<Route
  path="/interview/report/:id"
  element={
    <ProtectedRoute>
      <Step3Report />
    </ProtectedRoute>
  }
/>

      <Route 
        path="/pricing" 
        element={<Pricing />} 
      />


      <Route
       path="/payment-success"
       element={<PaymentSuccess />}
      />


      <Route 
  path="/history" 
  element={<History />} 
/>

<Route
 path="/dashboard"
 element={<Dashboard/>}
/>

<Route
path="/profile/edit"
element={<EditProfile/>}
/>

     

    </Routes>

  );

}


export default App;