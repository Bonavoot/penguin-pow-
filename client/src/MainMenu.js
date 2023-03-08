import { useState } from "react";
import App from "./App";
import CreateRoom from "./CreateRoom";
import JoinRoom from "./JoinRoom";
import io from 'socket.io-client'

const socket = io('http://localhost:3001')

const MainMenu = () => {
const [currentPage, setCurrentPage] = useState("mainMenu");
const [roomCode, setRoomCode] = useState("");

  const handleCreateRoom = () => {
    setCurrentPage("createRoom");
  };

  const handleJoinRoom = () => {
    setCurrentPage("joinRoom");
  };

  const handleJoinRoomSubmit = (code) => {
    setRoomCode(code);
    socket.emit('joinRoom', roomCode)
    setCurrentPage("game");
  };

  const handleMainMenu = () => {
    setCurrentPage("mainMenu");
  };

  let currentPageComponent;
  switch (currentPage) {
    case "mainMenu":
      currentPageComponent = (
        <div>
          <h1>Welcome to My Game!</h1>
          <button onClick={handleCreateRoom}>Create Room</button>
          <button onClick={handleJoinRoom}>Join Room</button>
        </div>
      );
      break;
    case "createRoom":
      currentPageComponent = <CreateRoom onBack={handleMainMenu} />;
      break;
    case "joinRoom":
      currentPageComponent = <JoinRoom onSubmit={handleJoinRoomSubmit} onBack={handleMainMenu} />;
      break;
    case "game":
      currentPageComponent = <App roomCode={roomCode} />;
      break;
    default:
      currentPageComponent = (
        <div>
          <h1>Error: Unknown page "{currentPage}"</h1>
          <button onClick={handleMainMenu}>Back to Main Menu</button>
        </div>
      );
  }

  return (
    <div>
      {currentPageComponent}
    </div>
  );
}

export default MainMenu


    
      
