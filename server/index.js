import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';

const io = new Server({
  connectionStateRecovery: true,
  cors: {
    origin: "http://localhost:3000"
  }
});

io.on('connection', (socket) => {
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });
});

io.listen(4000);
