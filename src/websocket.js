let socket = null;
let reconnectTimer = null;

const WEBSOCKET_URL = "ws://localhost:8000";

function connectWebSocket() {
  if (
    socket &&
    (socket.readyState === WebSocket.OPEN ||
      socket.readyState === WebSocket.CONNECTING)
  ) {
    return;
  }

  socket = new WebSocket(WEBSOCKET_URL);

  socket.onopen = () => {
    console.log("Connected to WebSocket");
    clearTimeout(reconnectTimer);
  };

  socket.onclose = () => {
    console.log("WebSocket connection closed. Reconnecting...");
    reconnectTimer = setTimeout(connectWebSocket, 5000);
  };

  socket.onerror = (error) => {
    console.error("WebSocket error:", error);
  };

  return socket;
}

export function getSocket() {
  if (!socket) {
    connectWebSocket();
  }
  return socket;
}

export function closeSocket() {
  if (socket) {
    socket.close();
    socket = null;
  }
}
