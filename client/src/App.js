import './App.css';
import io from 'socket.io-client';
import { useEffect, useRef, useState } from 'react';
import standing from './assets/Standing.GIF';
import jumping from './assets/jump.gif'
import map from './assets/map.png';
import attack from './assets/attack.gif'

const socket = io('http://localhost:3001');

function App() {
  const [inputs, setInputs] = useState({
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
    Space: false,
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
      console.log(e.code)
      const { ArrowLeft, ArrowRight, ArrowUp, Space } = keysPressed.current;

      if (ArrowUp && !inputs.ArrowUp) {
        setInputs({ ArrowUp: true, ArrowDown: false, ArrowLeft: ArrowLeft, ArrowRight: ArrowRight, Space: Space,});
      } else if (ArrowUp && inputs.ArrowUp) {
        setInputs({ ArrowUp: inputs.ArrowUp, ArrowDown: false, ArrowLeft: ArrowLeft, ArrowRight: ArrowRight, Space: Space, });
      } else if (ArrowLeft) {
        console.log(inputs.ArrowLeft)
        setInputs({ ArrowUp: false, ArrowDown: false, ArrowLeft: true, ArrowRight: false, Space: Space,});
      } else if (ArrowRight) {
        setInputs({ ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: true, Space: Space,});
      } else if (Space && !inputs.Space) {
        setInputs({ ArrowUp: ArrowUp, ArrowDown: false, ArrowLeft: ArrowLeft, ArrowRight: ArrowRight, Space: true,  })
      } else if (Space && inputs.Space) {
        setInputs(({ ArrowUp: ArrowUp, ArrowDown: false, ArrowLeft: ArrowLeft, ArrowRight: ArrowRight, Space: inputs.Space, }))
      }
    };


    const handleKeyUp = (e) => {
      keysPressed.current[e.code] = false;

      const { ArrowLeft, ArrowRight, ArrowUp, Space } = keysPressed.current;

      setInputs({
        ArrowUp: ArrowUp,
        ArrowDown: false,
        ArrowLeft: ArrowLeft,
        ArrowRight: ArrowRight,
        Space: Space,
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
          <>
          {player.attacking ? <img
          className='players'
            key={player.id}
            style={{ position: 'absolute', left: player.x, bottom: player.y, width: "285px", transform: `scaleX(${player.facingRight})`, transition: `left .45s ease-out`}}
            src={attack}
            alt="standing"
          />  :
          <img
          className='players'
            key={player.id}
            style={{ position: 'absolute', left: player.x, bottom: player.y, width: "175px", transform: `scaleX(${player.facingRight})`, transition: `left .45s ease-out`}}
            src={player.jumping ? jumping : standing }
            alt="standing"
          /> }
          
          <div className={"hp" + i}>{player.hp}</div> 
          </>
        );
      })}
    </div>
  );
}

export default App;


