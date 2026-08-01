// src/components/ProtectedRoute.jsx

import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";


function ProtectedRoute({ children }) {


  const user = useSelector(
    (state) => state.user.user
  );


  if (!user) {

    return (
      <Navigate
        to="/auth"
        replace
        state={{
          message:"Please login first"
        }}
      />
    );

  }


  return children;

}


export default ProtectedRoute;