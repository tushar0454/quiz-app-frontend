import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../context/useContext";
import axios from "axios";
import toast from "react-hot-toast";

const JoinRoom = () => {
  const [roomId, setRoomId] = useState("");
  const [rooms, setRooms] = useState([]);
  const { user, socket } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/room/quiz-rooms"
        );
        setRooms(response.data.rooms);
      } catch (error) {
        console.error(
          "Failed to fetch rooms:",
          error.response?.data || error.message
        );
      }
    };

    fetchRooms();
  }, []);

  const handleJoinRoom = async () => {
    if (user && roomId) {
      try {
        const response = await axios.post(
          `http://localhost:8000/room/${roomId}/join`,
          { participant: user.name }
        );
        const { room, participants } = response.data;

        if (room && room.quizzes.length > 0) {
          const quizId = room.quizzes[0]._id;

          // Ensure socket is ready before sending a message
          if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(
              JSON.stringify({
                action: "JOIN_QUIZ",
                payload: { quizId, participant: user.name },
              })
            );
            toast.success("You have successfully joined the room!");
            navigate(`/quiz/${quizId}`, { state: { participants } });
          } else {
            alert("WebSocket connection is not ready. Please try again.");
          }
        } else {
          toast.warn("No quizzes available in this room.");
        }
      } catch (error) {
        console.error("Error joining room:", error);
        toast("Error joining room. Please try again.");
      }
    } else if (!user) {
      navigate("/login");
    } else {
      alert("Please enter a Room ID.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Join a Room</h1>
      <p className="text-lg text-gray-600 mb-6">
        Enter the Room ID below to join an ongoing quiz.
      </p>
      <input
        type="text"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        placeholder="Enter Room ID"
        className="border border-gray-300 rounded p-2 mb-4 w-full max-w-xs"
      />
      <button
        onClick={handleJoinRoom}
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
      >
        Join Room
      </button>

      {/* Display Existing Rooms and Quizzes */}
      <div className="mt-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Available Rooms
        </h2>
        {rooms.length === 0 ? (
          <p className="text-gray-500">No rooms available</p>
        ) : (
          rooms.map((room) => (
            <div
              key={room._id}
              className="mb-6 p-4 border border-gray-300 rounded"
            >
              <h3 className="text-xl font-bold">
                Room: {room.name} (ID: {room._id})
              </h3>
              {room.quizzes.length > 0 ? (
                <ul className="list-disc list-inside mt-2">
                  {room.quizzes.map((quiz) => (
                    <li key={quiz._id}>
                      Quiz: {quiz.title} (ID: {quiz._id})
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No quizzes in this room</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default JoinRoom;
