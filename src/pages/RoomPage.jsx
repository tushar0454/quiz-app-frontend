import React from "react";
import { useParams } from "react-router-dom";
import ParticipantsList from "./ParticipantsList";
import { useUserContext } from "../context/useContext";

const RoomPage = () => {
  const { roomId } = useParams();
  const { socket, quizParticipant } = useUserContext();

  return (
    <div>
      <h1>Room: {roomId}</h1>
      <ParticipantsList
        socket={socket}
        participants={quizParticipant.participants}
      />
    </div>
  );
};

export default RoomPage;
