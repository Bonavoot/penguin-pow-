import './App.css';
import io from 'socket.io-client';
import { useEffect, useRef, useState } from 'react';
import standing from './assets/Standing.GIF';
import map from './assets/map.png';

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

      if (ArrowUp && !inputs.ArrowUp) {
        setInputs({ ArrowUp: true, ArrowDown: false, ArrowLeft: ArrowLeft, ArrowRight: ArrowRight, });
      } else if (ArrowUp && inputs.ArrowUp) {
        setInputs({ ArrowUp: inputs.ArrowUp, ArrowDown: false, ArrowLeft: ArrowLeft, ArrowRight: ArrowRight, });
      } else if (ArrowLeft) {
        setInputs({ ArrowUp: false, ArrowDown: false, ArrowLeft: true, ArrowRight: false, });
      } else if (ArrowRight) {
        setInputs({ ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: true,  });
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
  }, [inputs]);

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
      <img className='map' src={map} alt="map" />
      {players.map((player, i) => {
        return (
          i > 0 ?
          <img
            key={player.id}
            style={{ position: 'absolute', left: player.x + 800, bottom: player.y,  transition: `left .3s ease-out, bottom 1s ease-out`, width: "255px", transform: `scaleX(${player.facingRight})`}}
            src={standing}
            alt="standing"
          /> : <img
          key={player.id}
          style={{ position: 'absolute', left: player.x, bottom: player.y, width: "255px", transform: `scaleX(${player.facingRight})`, transition: `left 1s ease-out, bottom 1s ease-out`}}
          src={standing}
          alt="standing"
        />
        );
      })}
    </div>
  );
}

export default App;