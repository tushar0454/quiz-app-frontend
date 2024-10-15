import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { UserContextProvider, useUserContext } from "./context/useContext";
import Navbar from "./components/Navbar";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import AdminDashboard from "./pages/AdminDashboard";
import JoinRoom from "./pages/JoinRoom";
import ProtectedRoute from "./utils/ProtectedRoute";
import RoomPage from "./pages/RoomPage";

function App() {
  const { user } = useUserContext();

  return (
    <UserContextProvider>
      <div className="App">
        <Navbar />
        <Toaster position="bottom-right" toastOptions={{ duration: 2000 }} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/join-room"
            element={
              <ProtectedRoute>
                <JoinRoom />
              </ProtectedRoute>
            }
          />
          <Route path="/quiz/:quizId" element={<RoomPage />} />
        </Routes>
      </div>
    </UserContextProvider>
  );
}

export default App;
