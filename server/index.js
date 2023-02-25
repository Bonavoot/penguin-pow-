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
    facingRight: 1,
    jumping: false,
  });
}

let players = [];

// this tick function is being run in a setInterval function to allow smoother framerate transitions on different hardware capabilities
function tick(delta) {
  for (let i = 0; i < players.length; i++) {
    const player = players[i];
    const input = inputs[player.id];

    // this handles the jump input y axis, and the left/right movement input on the x axis 
    // if statements allow players to move left/right while jumping
    // velocity determines how far penguin will jump depending on current speed
    if (input.ArrowUp && !player.jumping) {
      player.jumping = true;
      player.yVelocity = 35;
    }

    if (player.jumping) {
      player.yVelocity -= 1;
      player.y += player.yVelocity;
      if (player.y < 0) {
        player.y = 0;
        player.jumping = false;
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
        if (player.x < 0) {
          player.x = 0;
        } else if (player.x > 1535) {
          player.x = 1535;
        }
        if (player.y < 0) {
          player.y = 0;
        } else if (player.y > 1030) {
          player.y = 1030;
        }
      }
      io.emit("players", players);
  }
  


io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);
  inputs[socket.id] = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
  };

  let player = pool.pop();
  if (!player) {
    player = {
      id: socket.id,
      facingRight: 1,
      x: 800,
      y: 0,
      jumping: false,
    };
  } else {
    player.id = socket.id;
    player.x = 0;
    player.y = 0;
    player.facingRight = 1;
    player.jumping = false;
  }
  players.push(player);

  socket.on("inputs", (data) => {
    inputs[socket.id] = data;
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
    players = players.filter((player) => player.id !== socket.id);
    pool.push(inputs[socket.id]);
    delete inputs[socket.id];
  });
});

const intervalId = setInterval(() => {
  tick(950 / TICK_RATE);
}, 1000 / TICK_RATE);

server.listen(3001, () => {
  console.log("Server listening on port 3001");
});