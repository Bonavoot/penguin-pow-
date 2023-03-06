const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const TICK_RATE = 45;

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

let players = [];
let inputsMap = {};
let time = 99;
let isSecondPlayerJoined = false;


let pool = [];
for (let i = 0; i < 100; i++) {
  pool.push({
    id: null,
    x: 0,
    y: 65,
    attackCooldown: 0,
    facingRight: 1,
    jumping: false,
    diving: false,
    taunt: false,
    attacking: false,
    hp: 100,
    wins: 0,
    side: null,
  });
  io.emit("players", players)
}

// this tick function is being run in a setInterval function to 
// allow smoother framerate transitions on different hardware capabilities
function tick(delta) {

  for (let i = 0; i < players.length; i++) {
    const player = players[i];
    const input = inputsMap[player.id];

    // Makes sure player 2 starts on far right side
     if(players.length === 2) {
        if(!isSecondPlayerJoined) {
          player.x = 870;
          player.facingRight = -1
          isSecondPlayerJoined = true;
        }
    }
    // this handles the jump input y axis, and the left/right movement input on the x axis 
    // if statements allow players to move left/right while jumping
    // velocity determines how far penguin will jump depending on current speed
    if (input.ArrowUp && !player.jumping) {
      if(player.y < 65){
        player.jumping = false
      }
      player.taunt = false;
      player.jumping = true;
      player.yVelocity = 25;
    }
    
    if (player.jumping && !player.diving) {
        if(player.y > 65){
            player.diving = false
          }
      player.yVelocity -= 1;
      player.y += player.yVelocity;
      if (player.y < 65) {
        player.y = 65;
        player.jumping = false;
      }
    }

    if (input.ArrowDown && !player.diving) {
        player.diving = true;
        if(player.y <= 65){
            player.taunt = true
        }
        player.jumping = false;
      }
      
      if (player.diving) {
        if (player.y <= 65) {
          player.y = 65;
          player.taunt = true;
        } else {
          player.y -= 30;
        }
        player.jumping = false;
      }

    if(input.Space && !player.attacking){
      player.attacking = true;
      player.attackCooldown = 10;
        
        for (let j = 0; j < players.length; j++) {
        const otherPlayer = players[j];
        
        // hit detection  
        const distanceX = Math.abs(player.x - otherPlayer.x);
        const distanceY = Math.abs(player.y - otherPlayer.y);
            // check if players are close enough to hit each other
            if (otherPlayer.id !== player.id && distanceX < 155 && distanceY < 225) {
              if (player.facingRight === 1 && otherPlayer.x > player.x || player.facingRight === -1 && otherPlayer.x < player.x) {
                // player is facing the other player, compensate for the change in direction
                    player.hp -= 20; // subtract 20% of health
                    console.log("hit");
                    if(player.facingRight === 1){
                        otherPlayer.x += 350; // knock back
                    } else {
                        otherPlayer.x -= 350
                    }
              }

              if(player.hp <= 0){
                otherPlayer.wins += 1
                // reset players
                player.hp = 100;
                otherPlayer.hp = 100;
                players[0].x = 870;
                players[0].facingRight = -1;
                players[1].x = 150;
                players[1].facingRight = 1;
                console.log(players)
                time = 99
              }  
              }
            }
          }  
          
          if(time <= 0) {
            if(players[0].hp > players[1].hp) {
              players[0].wins += 1
              players[0].hp = 100;
              players[0].x = 870;
              players[0].facingRight = -1;
              
              players[1].hp = 100;
              players[1].x = 150;
              players[1].facingRight = 1;

              time = 99 
            } else {
              players[1].wins += 1
              players[1].hp = 100;
              players[1].x = 150;
              players[1].facingRight = 1;

              players[0].x = 870;
              players[0].facingRight = -1;
              players[0].hp = 100;

              time = 99 
            }
          }

    if(player.attacking){
        if(player.y <= 65){
            player.diving = false;
            player.taunt = false;
          }
      player.attackCooldown -= 1
      if(player.attackCooldown < 0) {
        player.attackCooldown = 0;
        player.attacking = false;
      }
    }

    if (input.ArrowLeft) {
      if(player.y <= 65){
        player.diving = false;
        player.taunt = false;
      }
      
      player.x -= delta;
      player.facingRight = -1;
    } else if (input.ArrowRight) {
        if(player.y <= 65){
            player.diving = false;
            player.taunt = false;
          }
      player.x += delta;
      player.facingRight = 1;
    }
        // checks if player is outside of map boundry
        if (player.x < -70) {
          player.x = -70;
        } else if (player.x > 1070) {
          player.x = 1070;
        }
        if (player.y < 0) {
          player.y = 0;
        } else if (player.y > 1030) {
          player.y = 1030;
        }
    }
      io.emit("players", players);
    }

    let numPlayers = 0;
   
    setInterval(() => {
        time -= 1;
        if(time <= 0){
            time = 0;
            }
        io.emit("timer", time)
    }, 1000)

    
    io.on("connect", (socket) => {
    
    if (numPlayers < 2) {
    console.log("Socket connected:", socket.id);
    inputsMap[socket.id] = {
      ArrowUp: false,
      ArrowDown: false,
      ArrowLeft: false,
      ArrowRight: false,
      Space: false
    };

    socket.on("inputs", (data) => {
      inputsMap[socket.id] = data;
  });

    let player = pool.pop();
    if (!player) {
      player = {
        id: null,
        facingRight: 1,
        x: 0,
        y: 65,
        attackCooldown: 0,
        jumping: false,
        diving: false,
        taunt: false,
        attacking: false,
        hp: 100,
        wins: 0,
        side: null,
      };
    } else {
      player.id = socket.id;
      player.x = 150;
      player.y = 65;
      player.attackCooldown = 0,
      player.facingRight = 1;
      player.jumping = false;
      player.diving = false;
      player.taunt = false;
      player.attacking = false;
      player.hp = 100;
      player.wins = 0;
      player.side = null;
    }
    players.push(player);
    console.log(players)
    numPlayers++;

      socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
      players = players.filter((player) => player.id !== socket.id);
      pool.push(inputsMap[socket.id]);
      delete inputsMap[socket.id];
      numPlayers--;
    });
  } else {
    // if more than 2 players join - error
    socket.emit("error", "Maximum number of players already reached");
    socket.disconnect();
}
    });
  const gameLoop = setInterval(() => {
    tick(950 / TICK_RATE);
    }, 1000 / TICK_RATE);

    server.listen(3001, "0.0.0.0", () => {
    console.log("Server listening on port 3001");
    });


