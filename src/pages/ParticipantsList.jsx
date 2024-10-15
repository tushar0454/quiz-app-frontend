import React, { useEffect, useState } from "react";
import { useUserContext } from "../context/useContext";
import { useLocation } from "react-router-dom";
import toast from "react-hot-toast";

const ParticipantsList = ({ socket, participants: initialParticipants }) => {
  const [participants, setParticipants] = useState([]);
  const { user, quizParticipant } = useUserContext();
  const location = useLocation();

  useEffect(() => {
    // Initialize participants from location state or props
    console.log(quizParticipant);
    const uniqueParticipants = new Set(initialParticipants);
    console.log("Location", location);
    if (location.state && location.state.participants) {
      location.state.participants.forEach((participant) =>
        uniqueParticipants.add(participant)
      );
    }
    setParticipants(Array.from(uniqueParticipants));
  }, [initialParticipants, location.state]);

  useEffect(() => {
    // Listen for participant updates from the server
    const handleSocketMessage = (message) => {
      const parsedMessage = JSON.parse(message.data);
      if (parsedMessage.action === "PARTICIPANT_JOINED") {
        setParticipants((prevParticipants) => {
          const updatedParticipants = new Set([
            ...prevParticipants,
            parsedMessage.participant,
          ]);
          return Array.from(updatedParticipants); // Ensures uniqueness
        });

        if (parsedMessage.participant !== user.name) {
          toast.success(`${parsedMessage.participant} has joined the room!`);
        }
      }
    };

    socket.addEventListener("message", handleSocketMessage);

    // Clean up the socket listener on unmount
    return () => {
      socket.removeEventListener("message", handleSocketMessage);
    };
  }, [socket, user.name]);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Participants</h2>
      <ul className="space-y-2">
        {quizParticipant.participants.map((participant, index) => (
          <li key={index} className="flex items-center">
            <span className="text-lg">
              {participant} {participant === user.name ? "(You)" : ""}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ParticipantsList;
