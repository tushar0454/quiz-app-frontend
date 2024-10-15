import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { getSocket } from "../websocket";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quizParticipant, setquizParticipant] = useState({
    participants: [],
  });

  useEffect(() => {
    const token = localStorage.getItem("token"); // Get the token from local storage
    const headers = token ? { Authorization: `Bearer ${token}` } : {}; // Prepare headers

    axios
      .get("http://localhost:8000/profile", { headers, withCredentials: true })
      .then(({ data }) => {
        console.log("!!!!!!!!!!!!!!!!!!!!", data);
        setUser(data);
      })
      .catch((error) => {
        console.error("Failed to fetch profile:", error);
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });

    const ws = getSocket();
    setSocket(ws);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      handleSocketMessages(data);
    };

    ws.onclose = (event) => {
      console.log(event);
    };

    // return () => {
    //   if (ws.readyState === 1) {
    //     // When WebSocket connection closes, remove the user from participants
    //     axios
    //       .patch(
    //         `http://localhost:8000/room/:roomId/users/:userId`,
    //         {},
    //         { headers }
    //       )
    //       .then(({ data }) => {
    //         setquizParticipant((prev) => ({
    //           ...prev,
    //           participants: data.participants || [],
    //         }));
    //       })
    //       .catch((error) => {
    //         console.error("Failed to remove user from room:", error);
    //       });
    //   }
    //   ws.close();
    // };
  }, []);

  const handleSocketMessages = (data) => {
    switch (data.action) {
      case "PARTICIPANT_JOINED":
        console.log("Participant joined:", data.participant);
        setquizParticipant((prev) => ({
          ...prev,
          participants: data.participants || [],
        }));
        break;
      case "PARTICIPANT_LEFT":
        console.log("Participant left:", data.participant);
        setquizParticipant((prev) => ({
          ...prev,
          participants: data.participants || [],
        }));
        break;
      default:
        console.log("Unhandled WebSocket message", data);
    }
  };

  return (
    <UserContext.Provider
      value={{ user, setUser, quiz, setQuiz, socket, loading, quizParticipant }}
    >
      {children}
    </UserContext.Provider>
  );
}

export const useUserContext = () => useContext(UserContext);
