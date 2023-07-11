import { useState } from "react";
import App from "./App";
import CreateRoom from "./CreateRoom";
import JoinRoom from "./JoinRoom";
import io from "socket.io-client";
import map from "./assets/map.gif";

const socket = io("http://localhost:3001");

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
    socket.emit("joinRoom", roomCode);
    setCurrentPage("game");
  };

  const handleMainMenu = () => {
    setCurrentPage("mainMenu");
  };

  let currentPageComponent;
  switch (currentPage) {
    case "mainMenu":
      currentPageComponent = (
        <div className="menu">
          <button onClick={handleCreateRoom}>CREATE GAME</button>
          <button onClick={handleJoinRoom}>JOIN GAME</button>
          <button>SHOP</button>
          <button>SETTINGS</button>
        </div>
      );
      break;
    case "createRoom":
      currentPageComponent = <CreateRoom onBack={handleMainMenu} />;
      break;
    case "joinRoom":
      currentPageComponent = (
        <JoinRoom onSubmit={handleJoinRoomSubmit} onBack={handleMainMenu} />
      );
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
    <div className="main-menu">
      <h1 className="logo">PENGUIN POW!</h1>
      <img className="menu-map" src={map} alt="map" />
      <div className="menu-options">{currentPageComponent}</div>
    </div>
  );
};

export default MainMenu;
