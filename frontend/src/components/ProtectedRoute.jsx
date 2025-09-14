// import React from 'react'
// import { useState,useEffect } from 'react'
// import axios from "axios"
// import { Navigate } from "react-router-dom";


// function ProtectedRoute({children}) {
//   const [authenticated,setAuthenticated] = useState(false)

//   const checkAuth = () => {
//     console.log("hii")
//     const fn = async() => {
//       try{
//         const url = "http://localhost:5000/auth/check";
//         const response = await axios.get(url,{withCredentials:true})
//         console.log(response)
//         setAuthenticated(true)
//       }catch{
//         setAuthenticated(false)
//       }
//     }
//     fn()
//     console.log(authenticated)
//   }
//   useEffect(checkAuth,[])
  
//   return authenticated ? children : <Navigate to='/login' />
// }

// export default ProtectedRoute

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const url = "http://localhost:5000/auth/check";
        const response = await axios.get(url, { withCredentials: true });
        console.log("Auth response:", response.data);

        setAuthenticated(true);
      } catch (err) {
        console.error("Auth check failed:", err);
        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return authenticated ? children : <Navigate to="/login" replace />;
}

export default ProtectedRoute;
