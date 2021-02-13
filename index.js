const express = require("express");
const socketio = require("socket.io");
const http = require("http");

const router = require("./router");
const port = process.env.PORT || 5000;
const cors = require("cors");
const app = express();
const server = http.createServer(app);
const io = socketio(server);
const { addUser, removeUser, getUser, getUsersInRoom } = require("./users.js");

app.use(router);
app.use(cors());
io.on("connection", socket => {
  /** When the event has been fired from the client */
  socket.on("join", ({ name, room }, callback) => {
    console.log(
      `user joined with id: ${socket.id} and name : ${name} and room ${room}`
    );
    const { error, user } = addUser({ id: socket.id, name, room });

    if (error) return callback(error);

    console.log(`joining user in room : ${user.room}`);
    socket.join(user.room);

    socket.emit("message", {
      user: "admin",
      text: `${user.name}, welcome to room ${user.room}.`
    });
    socket.broadcast
      .to(user.room)
      .emit("message", { user: "admin", text: `${user.name} has joined!` });

    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room)
    });

    callback();
  });

  //listen to sent messages
  socket.on("sendMessage", (message, callback) => {
    const user = getUser(socket.id);
    console.log(
      `message here with socketId : ${socket.id} and ${user.name} and ${user.room}`
    );
    io.to(user.room).emit("message", { user: user.name, text: message });

    callback();
  });

  /**When the client has disconnected */
  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    if (user) {
      io.to(user.room).emit("message", {
        user: "Admin",
        text: `${user.name} has left.`
      });
      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUsersInRoom(user.room)
      });
    }
  });
});

server.listen(port, () => {
  console.log(`server has started on port ${port}`);
});
