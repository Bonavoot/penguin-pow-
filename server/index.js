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

function tick(delta) {
  for (let i = 0; i < players.length; i++) {
    const player = players[i];
    const input = inputs[player.id];

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
    } else {
      if (input.ArrowLeft) {
        player.x -= delta;
        player.facingRight = -1;
      } else if (input.ArrowRight) {
        player.x += delta;
        player.facingRight = 1;
      }
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
      x: 0,
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