const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");


const TICK_RATE = 45;

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// the values the frontend uses to set each player and use the backend info to change the state of their inputs
const inputs = {};
const pool = [];
for (let i = 0; i < 1000; i++) {
  pool.push({
    id: null,
    x: 0,
    y: 0,
    attackCooldown: 0,
    facingRight: 1,
    jumping: false,
    attacking: false,
    attackStartTime: null,
    hp: 3,
  });
}

let players = [];
let isSecondPlayerJoined = false;


// this tick function is being run in a setInterval function to allow smoother framerate transitions on different hardware capabilities
function tick(delta) {
  for (let i = 0; i < players.length; i++) {
    const player = players[i];
    const input = inputs[player.id];
    
    // Makes sure player 2 starts on far right side
     if(players.length === 2) {
        if(!isSecondPlayerJoined) {
          player.x = 1000;
          player.facingRight = -1
          isSecondPlayerJoined = true;
        }
    }

    // this handles the jump input y axis, and the left/right movement input on the x axis 
    // if statements allow players to move left/right while jumping
    // velocity determines how far penguin will jump depending on current speed
    if (input.ArrowUp && !player.jumping) {
      player.jumping = true;
      player.yVelocity = 25;
    }

    if (player.jumping) {
      player.yVelocity -= 1;
      player.y += player.yVelocity;
      if (player.y < 0) {
        player.y = 0;
        player.jumping = false;
      }
    }

    const ATTACK_DURATION = 1000;

    if(input.Space && !player.attacking){
      player.attacking = true
      player.attackCooldown = 20;
      player.attackStartTime = Date.now();
        
         // handle attack hit detection
         for (let j = 0; j < players.length; j++) {
            const otherPlayer = players[j];
          
            // calculate distance between players in both x and y axes
            const distanceX = Math.abs(player.x - otherPlayer.x);
            const distanceY = Math.abs(player.y - otherPlayer.y);
            
            // check if players are close enough to hit each other
            if (otherPlayer.id !== player.id && distanceX < 180 && distanceY < 180) {
              if (player.facingRight === 1 && otherPlayer.x > player.x || player.facingRight === -1 && otherPlayer.x < player.x) {
                // player is facing the other player
                if (player.attackStartTime + player.attackCooldown > Date.now()) {
                    console.log("hit");
                    otherPlayer.hp -= 1; // subtract 1 hit point
                    if (otherPlayer.hp <= 0) {
                      console.log("dead");
                    }
                  }
              }
            }
          }
          
    }

    if(player.attacking){
      //handle collisions here ???
      player.attackCooldown -= 1
      if(player.attackCooldown < 0) {
        player.attackCooldown = 0;
        player.attacking = false;
      }
    }

    if (input.ArrowLeft) {
      player.x -= delta;
      player.facingRight = -1;
    } else if (input.ArrowRight) {
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

io.on("connection", (socket) => {
  if (numPlayers < 2) {
    console.log("Socket connected:", socket.id);
    inputs[socket.id] = {
      ArrowUp: false,
      ArrowDown: false,
      ArrowLeft: false,
      ArrowRight: false,
      Space: false
    };

    let player = pool.pop();
    if (!player) {
      player = {
        id: socket.id,
        facingRight: 1,
        x: 0,
        y: 0,
        attackCooldown: 0,
        jumping: false,
        attacking: false,
        hp: 3,
        attackStartTime: null,
      };
    } else {
      player.id = socket.id;
      player.x = 25;
      player.y = 0;
      player.attackCooldown = 0,
      player.facingRight = 1;
      player.jumping = false;
      player.attacking = false;
      player.hp = 3;
      player.attackStartTime = null;
    }
    players.push(player);
    numPlayers++;

    socket.on("inputs", (data) => {
      inputs[socket.id] = data;
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
      players = players.filter((player) => player.id !== socket.id);
      pool.push(inputs[socket.id]);
      delete inputs[socket.id];
      numPlayers--;
    });
  } else {
    // if more than 2 players join - error
    socket.emit("error", "Maximum number of players already reached");
    socket.disconnect();
  }
});
const intervalId = setInterval(() => {
  tick(950 / TICK_RATE);
}, 1000 / TICK_RATE);

server.listen(3001, () => {
  console.log("Server listening on port 3001");
});