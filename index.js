const express = require("express");
const socketio = require("socket.io");
const http = require("http");

const router = require("./router");
const port = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(router);

io.on("connection", socket => {
  console.log("We have a new connection");
  socket.on("disconnect", () => {
    console.log("User has left!!");
  });
});

server.listen(port, () => {
  console.log(`server has started on port ${port}`);
});
