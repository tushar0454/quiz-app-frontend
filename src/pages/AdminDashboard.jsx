import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../context/useContext";
import axios from "axios";

const AdminDashboard = () => {
  const { user } = useUserContext();
  const [roomName, setRoomName] = useState("");
  const [createdRoomId, setCreatedRoomId] = useState(null);
  const [quizTitle, setQuizTitle] = useState("");
  const [questions, setQuestions] = useState([
    { questionText: "", options: ["", "", "", ""], correctAnswer: "" },
  ]);
  const [rooms, setRooms] = useState([]); // State for storing all rooms
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch all rooms on component mount
    const fetchRooms = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:8000/room/quiz-rooms",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setRooms(response.data.rooms); // Adjust based on your response structure
      } catch (error) {
        console.error(
          "Failed to fetch rooms:",
          error.response?.data || error.message
        );
      }
    };

    fetchRooms();
  }, []);

  // Function to create a room
  const handleCreateRoom = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:8000/room",
        { name: roomName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      const roomId = response.data.room._id;
      setCreatedRoomId(roomId);
      setRooms((prevRooms) => [...prevRooms, response.data.room]); // Add new room to the list
      setRoomName(""); // Clear the input field
    } catch (error) {
      console.error(
        "Failed to create room:",
        error.response?.data || error.message
      );
    }
  };

  // Function to delete a room
  const handleDeleteRoom = async (roomId) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(`http://localhost:8000/room/${roomId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Remove the room from the state after deletion
      setRooms(rooms.filter((room) => room._id !== roomId));
    } catch (error) {
      console.error(
        "Failed to delete room:",
        error.response?.data || error.message
      );
    }
  };

  // Function to create a quiz inside the created room
  const handleCreateQuiz = async () => {
    if (!createdRoomId) {
      alert("Please create a room first.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `http://localhost:8000/room/${createdRoomId}/quiz`,
        {
          title: quizTitle,
          questions: questions,
          timeLimit: 300,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      const quizId = response.data.quiz._id;
      navigate(`/quiz/${quizId}`);
    } catch (error) {
      console.error(
        "Failed to create quiz:",
        error.response ? error.response.data : error.message
      );
    }
  };

  // Function to handle question changes
  const handleQuestionChange = (index, event) => {
    const newQuestions = [...questions];
    newQuestions[index].questionText = event.target.value;
    setQuestions(newQuestions);
  };

  // Function to handle option changes
  const handleOptionChange = (questionIndex, optionIndex, event) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options[optionIndex] = event.target.value;
    setQuestions(newQuestions);
  };

  // Function to handle correct answer change
  const handleCorrectAnswerChange = (index, event) => {
    const newQuestions = [...questions];
    newQuestions[index].correctAnswer = event.target.value;
    setQuestions(newQuestions);
  };

  // Function to add a new question
  const addQuestion = () => {
    setQuestions([
      ...questions,
      { questionText: "", options: ["", "", "", ""], correctAnswer: "" },
    ]);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      {/* Room Creation */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold">Create a Room</h2>
        <div className="flex items-center space-x-2 mt-2">
          <input
            type="text"
            placeholder="Room Name"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1"
          />
          <button
            onClick={handleCreateRoom}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Create Room
          </button>
        </div>
      </div>

      {/* Display Existing Rooms and Quizzes */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold">Existing Rooms</h2>
        {rooms.length === 0 ? (
          <p>No rooms available</p>
        ) : (
          rooms.map((room) => (
            <div
              key={room._id}
              className="border-b border-gray-200 py-4 flex justify-between items-center"
            >
              <div>
                <h3 className="text-lg font-medium">
                  Room: {room.name} (ID: {room._id})
                </h3>
                {room.quizzes.length > 0 ? (
                  <ul className="list-disc ml-5">
                    {room.quizzes.map((quiz) => (
                      <li key={quiz._id}>
                        Quiz: {quiz.title} (ID: {quiz._id})
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No quizzes in this room</p>
                )}
              </div>
              <button
                onClick={() => handleDeleteRoom(room._id)}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Delete Room
              </button>
            </div>
          ))
        )}
      </div>

      {/* Quiz Creation */}
      {createdRoomId && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold">Create a Quiz in Room</h2>
          <input
            type="text"
            placeholder="Quiz Title"
            value={quizTitle}
            onChange={(e) => setQuizTitle(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 mb-4"
          />
          {questions.map((question, index) => (
            <div key={index} className="mb-4">
              <input
                type="text"
                placeholder={`Question ${index + 1}`}
                value={question.questionText}
                onChange={(e) => handleQuestionChange(index, e)}
                className="border border-gray-300 rounded px-2 py-1 mb-2 w-full"
              />
              {question.options.map((option, optionIndex) => (
                <input
                  key={optionIndex}
                  type="text"
                  placeholder={`Option ${optionIndex + 1}`}
                  value={option}
                  onChange={(e) => handleOptionChange(index, optionIndex, e)}
                  className="border border-gray-300 rounded px-2 py-1 mb-2 w-full"
                />
              ))}
              <input
                type="text"
                placeholder="Correct Answer"
                value={question.correctAnswer}
                onChange={(e) => handleCorrectAnswerChange(index, e)}
                className="border border-gray-300 rounded px-2 py-1 mb-2 w-full"
              />
            </div>
          ))}
          <button
            onClick={addQuestion}
            className="bg-green-500 text-white px-4 py-2 rounded mb-4"
          >
            Add Question
          </button>
          <button
            onClick={handleCreateQuiz}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Create Quiz
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
