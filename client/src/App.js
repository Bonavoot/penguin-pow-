import './App.css';
import io from 'socket.io-client';
import { useEffect, useRef, useState } from 'react';
import pengu from './assets/pengu.png';

const socket = io('http://localhost:3001');

function App() {
  const [inputs, setInputs] = useState({
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
  });
  const [players, setPlayers] = useState([]);

  const keysPressed = useRef({});

  useEffect(() => {
    socket.on('connected', () => {
      console.log('Connected');
    });
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      keysPressed.current[e.code] = true;

      const { ArrowLeft, ArrowRight, ArrowUp } = keysPressed.current;

      if (ArrowUp && ArrowLeft) {
        setInputs({ ArrowUp: true, ArrowDown: false, ArrowLeft: true, ArrowRight: false });
      } else if (ArrowUp && ArrowRight) {
        setInputs({ ArrowUp: true, ArrowDown: false, ArrowLeft: false, ArrowRight: true });
      } else if (ArrowLeft) {
        setInputs({ ArrowUp: false, ArrowDown: false, ArrowLeft: true, ArrowRight: false });
      } else if (ArrowRight) {
        setInputs({ ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: true });
      } else if (ArrowUp) {
        setInputs({ ArrowUp: true, ArrowDown: false, ArrowLeft: false, ArrowRight: false });
      }
    };

    const handleKeyUp = (e) => {
      keysPressed.current[e.code] = false;

      const { ArrowLeft, ArrowRight, ArrowUp } = keysPressed.current;

      setInputs({
        ArrowUp: ArrowUp,
        ArrowDown: false,
        ArrowLeft: ArrowLeft,
        ArrowRight: ArrowRight,
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    socket.emit('inputs', inputs);
  }, [inputs]);

  useEffect(() => {
    socket.on('players', (serverPlayers) => {
      setPlayers(serverPlayers);
    });
  }, []);

  return (
    <div className="App">
      {players.map((player) => {
        return (
          <img
            key={player.id}
            style={{ position: 'absolute', left: player.x, bottom: player.y }}
            src={pengu}
            alt="pengu"
          />
        );
      })}
    </div>
  );
}

export default App;