
const express = require("express");
const http = require("http");
const socket = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = socket(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());

const documents = {};

io.on("connection", socket => {
  socket.on("get-document", documentId => {
    if (!documents[documentId]) {
      documents[documentId] = "";
    }

    socket.join(documentId);
    socket.emit("load-document", documents[documentId]);

    socket.on("send-changes", delta => {
      socket.broadcast.to(documentId).emit("receive-changes", delta);
    });

    socket.on("save-document", data => {
      documents[documentId] = data;
    });
  });
});

server.listen(3001, () => {
  console.log("Server running on port 3001");
});
