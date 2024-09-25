import React from "react";
import ws from "websocket";

const Home = () => {
  const ws = new WebSocket("ws://localhost:8000");

  ws.onopen = () => {
    console.log("Connected to the server");
    ws.send("Hello Server, This msg is from Client");
  };

  ws.onmessage = (message) => console.log(`Received : ${message.data}`);

  ws.onclose = () => console.log("WebSocket connection closed");
  return <div>Home</div>;
};

export default Home;
