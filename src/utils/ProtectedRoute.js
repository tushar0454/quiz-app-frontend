import React from "react";
import { Navigate } from "react-router-dom";
import { useUserContext } from "../context/useContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useUserContext();

  if (!user) {
    // If user is not authenticated, redirect to login
    return <Navigate to="/login" />;
  }
  console.log(user);

  //   if (user.role == "admin") {
  //     return <Navigate to="/admin-dashboard" />;
  //   } else {
  //     return <Navigate to="/join-room" />;
  //   }

  //   if (role && user.role !== role) {
  //     // If user does not have the required role, redirect to home or appropriate page
  //     return ;
  //   }

  return children;
};

export default ProtectedRoute;
