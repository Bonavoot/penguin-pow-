import './App.css';
import io from 'socket.io-client';
import { useEffect, useRef, useState } from 'react';
import map from './assets/map.png';
import Player from "./Player"

//import youLose from './assets/youLose'
// import youWin from './assets/youWin'

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
  const [victoryOrWalrus, setVictoryOrWalrus] = useState(null)
  const [winner, setWinner] = useState("")
  const keysPressed = useRef({});

  useEffect(() => {
      const handleKeyDown = (e) => {
      keysPressed.current[e.code] = true;

      const { ArrowLeft, ArrowDown, ArrowRight, ArrowUp, Space } = keysPressed.current;

      if (ArrowUp && !inputs.ArrowUp) {
        setInputs({ ArrowUp: true, ArrowDown: false, ArrowLeft: ArrowLeft, ArrowRight: ArrowRight, Space: Space,});
      } else if (ArrowUp && inputs.ArrowUp) {
        setInputs({ ArrowUp: inputs.ArrowUp, ArrowDown: false, ArrowLeft: ArrowLeft, ArrowRight: ArrowRight, Space: Space, });
      } else if (ArrowLeft) {
        setInputs({ ArrowUp: false, ArrowDown: false, ArrowLeft: true, ArrowRight: false, Space: Space,});
      } else if (ArrowRight) {
        setInputs({ ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: true, Space: Space,});
      } else if (Space && !inputs.Space) {
        setInputs({ ArrowUp: ArrowUp, ArrowDown: false, ArrowLeft: ArrowLeft, ArrowRight: ArrowRight, Space: true,  })
      } else if (Space && inputs.Space) {
        setInputs(({ ArrowUp: ArrowUp, ArrowDown: false, ArrowLeft: ArrowLeft, ArrowRight: ArrowRight, Space: inputs.Space, }))
      } else if (ArrowDown && !inputs.ArrowDown) {
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
    if(!victoryOrWalrus && !winner){
      socket.emit('inputs', inputs);
    }
    
  }, [inputs, victoryOrWalrus, winner])


  useEffect(() => {
    if(!victoryOrWalrus && !winner){
      socket.on('players', (serverPlayers) => {
        setPlayers(serverPlayers);
      });
    }
   
    return () => {
      socket.off("players")
    }
  }, [players, victoryOrWalrus, winner])


  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected');
      });
  }, [])

  useEffect(() => {
      socket.on('timer', (time) => {
          if(time <= 0){
          setTimer(0)
        } else {
          setTimer(time)
      }
      });
      return () => {
        socket.off('timer')
      }
  }, [])  

  useEffect(() => {
    socket.on("victoryOrWalrus", (victoryOrWalrusBool) => {
      setVictoryOrWalrus(victoryOrWalrusBool)
    })
  }, [])

  useEffect(() => {
    socket.on("winner", (winner) => {
      setWinner(winner)
    })
  }, [])



    // console.log("--RESTARTED BUTTON-- " + players + " Gameover: " + gameOver + " winner: " + winner + " timer :" + timer)
    // console.log("LIVE-- players: " + players + " Gameover: " + gameOver + " winner: " + winner + " timer :" + timer)
  return (
    <div className="App">
      <img className='map' src={map} alt="map" />
      {timer < 100 ? <div className='timer'>{timer}</div> : <div className='timer'>99</div> }
      {winner ? <h2 className='winner'>K.O!</h2> : null}
      {victoryOrWalrus ? <h1 className='victory-or-walrus'><span className='victory'>VICTORY </span>OR<span className='walrus'> WALRUS</span></h1> : null} 
      {players.map((player, i) => {
      return <Player key={"player" + i} player={player} index={i}  />
      })}
      </div>
  );
}

export default App;

// <img src={victoryOrWalrus} alt="countdown" className='countdown' /> 
// <img className="ko" src={winner} alt="ko" /> 
// have the K.O run in a setTimeout, then change the img src
// to the Player _ wins!