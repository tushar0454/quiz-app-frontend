import React from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../context/useContext";
import axios from "axios";

const Home = () => {
  const { user } = useUserContext();
  const navigate = useNavigate();

  // Function to handle creating a room instead of a quiz
  const handleCreateRoom = async () => {
    if (user) {
      try {
        const response = await axios.post("http://localhost:8000/room", {
          name: `${user.name}'s Room`, // Optionally, set room name dynamically
        });
        navigate(`/room/${response.data._id}`); // Navigate to the room page
      } catch (error) {
        console.error("Error creating room:", error);
        // Optionally show user-friendly error message
      }
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Quiz Maker</h1>
      <p className="text-lg text-gray-600 mb-4">
        Create interactive rooms to host your quizzes.
      </p>

      <h2 className="text-2xl font-semibold text-gray-700 mb-2">
        Host a room for exciting quizzes
      </h2>
      <p className="text-md text-gray-500 mb-6 text-center">
        Engage your audience by hosting quizzes in real-time rooms!
      </p>

      <div className="flex space-x-4 mb-4">
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
          onClick={() => navigate("/register")}
        >
          Register
        </button>
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
          onClick={() => navigate("/login")}
        >
          Login
        </button>
      </div>

      <div>
        <button
          className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition"
          onClick={handleCreateRoom}
        >
          Create Room
        </button>
      </div>
    </div>
  );
};

export default Home;
