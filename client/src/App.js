import './App.css';
import io from 'socket.io-client';
import { useEffect, useRef, useState } from 'react';
import standing from './assets/Standing.GIF';
import jumping from './assets/jump.gif'
import map from './assets/map.png';
import attack from './assets/attack.gif'
import diving from './assets/diving.gif'

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
  const [timer, setTimer] = useState(99)
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
      const { ArrowLeft, ArrowDown, ArrowRight, ArrowUp, Space } = keysPressed.current;

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
      } else if (ArrowDown && !ArrowDown.ArrowDown) {
        setInputs({ ArrowUp: false, ArrowDown: true, ArrowLeft: ArrowLeft, ArrowRight: ArrowRight, Space: Space,  })
      } else if (ArrowDown && inputs.ArrowDown) {
        setInputs(({ ArrowUp: false, ArrowDown: inputs.ArrowDown, ArrowLeft: ArrowLeft, ArrowRight: ArrowRight, Space: Space, }))
      }
    };


    const handleKeyUp = (e) => {
      keysPressed.current[e.code] = false;

      const { ArrowLeft, ArrowRight, ArrowDown, ArrowUp, Space } = keysPressed.current;

      setInputs({
        ArrowUp: ArrowUp,
        ArrowDown: ArrowDown,
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

  useEffect(() => {
    socket.on('timer', (time) => {
      if(time <= 0){
        setTimer(0)
      } else {
        setTimer(time)
      }
    });
  }, []);


  return (
    <div className="App">
      <img className='map' src={map} alt="map" />
      <div className='timer'>{timer}</div>
      {players.map((player, i) => {
        return (
          <>
          {renderAnimationImg(player)}
          <div className={'hp-container' + i}>
          <h2 id={"player-name-hp" + i} style={{position: "absolute", top: "-50px", left: i === 0 ? "10px" : "170px"}}>{"Player " + (i + 1)}</h2>
          <div className={"hp" + i} style={{width: player.hp + '%'}}>
          </div> 
          </div>
          </>
        );
      })}
    </div>
  );
}

export default App;




const renderAnimationImg = (player) => {
const attackImgWidth = 290; // width of attacking image
const standingImgWidth = 175; // width of standing image
const attackImgHeight = 252;
const standingImgHeight = 188;

const widthDiff = (attackImgWidth - standingImgWidth -100) / 2;
const heightDiff = (attackImgHeight - standingImgHeight - 30) / 2;
  if (player.attacking) {
     return <img className='players'
      key={player.id}
      style={{ position: 'absolute',
      left: player.x - widthDiff, // offset position to center attacking image
      bottom: player.y - heightDiff,
      width: `${attackImgWidth}px`,
      height: `${attackImgHeight}px`, 
      transform: `scaleX(${player.facingRight})`, 
      transition: `left .45s ease-out`}}
      src={attack}
      alt="attack"
    />
  } else if (player.jumping) {
    return  <img
    className='players'
      key={player.id}
      style={{ position: 'absolute', left: player.x, bottom: player.y, width: "175px", transform: `scaleX(${player.facingRight})`, transition: `left .45s ease-out`}}
      src={jumping}
      alt="jumping"
    />
  } else if (player.diving) {
   return <img
    className='players'
    key={player.id}
    style={{ position: 'absolute', left: player.x, bottom: player.y, width: "175px", transform: `scaleX(${player.facingRight})`, transition: `left .45s ease-out`}}
    src={diving}
    alt="diving"
  />
  } else {
   return <img
    className='players'
    key={player.id}
    style={{ position: 'absolute', 
    left: player.x, 
    bottom: player.y,
    width: `${standingImgWidth}px`,
    height: `${standingImgHeight}px`, 
    transform: `scaleX(${player.facingRight})`, 
    transition: `left .45s ease-out`}}
    src={standing}
    alt="standing"
  />
  }
}