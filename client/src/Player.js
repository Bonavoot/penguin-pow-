import standing from './assets/Standing.GIF';
import jumpin from './assets/jump.gif'
import attack from './assets/attack.gif'
import diving from './assets/diving.gif'

const Player = ({index, player }) => {

    const renderAnimationImg = (player) => {
        const attackImgWidth = 290; // width of attacking image
        const standingImgWidth = 175; // width of standing image
        const attackImgHeight = 252;
        const standingImgHeight = 188;
        const widthDiff = (attackImgWidth - standingImgWidth - 100) / 2;
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
              style={{ position: 'absolute', 
              left: player.x, 
              bottom: player.y, 
              width: "175px", 
              transform: `scaleX(${player.facingRight})`, 
              transition: `left .45s ease-out`}}
              src={jumpin}
              alt="jumping"
            />
          } else if (player.taunt) {
           return <img
            className='players'
            key={player.id}
            style={{ position: 'absolute', 
            left: player.x, 
            bottom: player.y, 
            width: "200px", 
            transform: `scaleX(${player.facingRight})`, 
            transition: `left .45s ease-out`}}
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

        
        
    return(<>
      {renderAnimationImg(player)}
      <div className={'hp-container' + index}>
      <div className='wins' style={{position: "absolute", top: "-20px", left: index === 0 ? "220px" : "190px"}}  >WINS - {player.wins}</div>
      <h2 id={"player-name-hp" + index} 
        style={{position: "absolute", 
        top: "-50px", 
        left: index === 0 ? "7px" : "370px"}}>
      {"Player " + (index + 1)}
      </h2>
      <div className={"hp" + index} style={{width: player.hp + '%'}}></div> 
      </div>
      </>
    )
}

export default Player

    