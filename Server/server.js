const express = require("express");
const app = express();
const { Server } = require("socket.io");
const http = require("http");
const { Socket } = require("socket.io-client");
const ACTION = require("../src/Action");
const server = http.createServer(app);

const io = new Server(server);
const userSocketMap = {};

function getAllClients(roomID) {
  console.log(io.sockets.adapter.rooms.get(roomID));
  return Array.from(io.sockets.adapter.rooms.get(roomID) || []).map(
    (socketId) => {
      return {
        socketId,
        userName: userSocketMap[socketId],
      };
    }
  );
}

io.on("connection", (socket) => {
  console.log("socket Connected", socket.id); // Socket Id
  socket.on(ACTION.JOIN, ({ roomID, userName }) => {
    userSocketMap[socket.id] = userName;
    socket.join(roomID);
    const clients = getAllClients(roomID);
    clients.forEach(({ socketId }) => {
      io.to(socketId).emit(ACTION.JOINED, {
        clients,
        userName,
        socketId: socket.id,
      });
    });
  });

  socket.on(ACTION.CODE_CHANGE, ({ roomID, code }) => {
    socket.in(roomID).emit(ACTION.CODE_CHANGE, { code });
  });

  socket.on(ACTION.SYNC_CODE, ({ socketId, code }) => {
    io.to(socketId).emit(ACTION.CODE_CHANGE, { code });
  });

  socket.on(ACTION.DISCONNETING, () => {
    const rooms = [...socket.rooms];
    rooms.forEach((roomID) => {
      socket.in(roomID).emit(ACTION.DISCONNECTED, {
        socketId: socket.id,
        userName: userSocketMap[socket.id],
      });
    });
  });

  delete userSocketMap[socket.id];
  socket.leave();
});

const PORT = process.env.PORT || 2100;
server.listen(PORT, () => console.log(`Listensing on port ${PORT}`));

module.exports = server
