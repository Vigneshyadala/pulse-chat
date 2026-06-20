// server.js
// Pulse — Real-time Chat Application backend
// Express serves the frontend; Socket.io handles real-time messaging, rooms,
// typing indicators, and presence across ANY device connected to this server.

const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' } // allow connections from any frontend origin (tighten in production if needed)
});

const PORT = process.env.PORT || 3000;

// Serve the frontend
app.use(express.static(path.join(__dirname, 'public')));

// In-memory state (resets on server restart — fine for a fresher project demo;
// swap for MongoDB/Postgres if you want messages to persist).
const DEFAULT_ROOMS = ['general', 'projects', 'random', 'help'];
const roomUsers = {};     // roomName -> { socketId: { id, name, avatar } }
const typingState = {};   // roomName -> Set of socketIds currently typing

function getRoomUserList(room) {
  return Object.values(roomUsers[room] || {});
}

io.on('connection', (socket) => {
  let currentRoom = null;
  let currentUser = null;

  socket.on('join_room', ({ room, name, avatar }) => {
    room = (room || 'general').toLowerCase().trim().replace(/\s+/g, '-') || 'general';
    name = (name || 'Anonymous').slice(0, 18);
    avatar = avatar || '🦊';

    // Leave previous room if switching
    if (currentRoom) {
      socket.leave(currentRoom);
      delete roomUsers[currentRoom]?.[socket.id];
      io.to(currentRoom).emit('user_left', { id: socket.id, name: currentUser?.name, avatar: currentUser?.avatar });
      io.to(currentRoom).emit('presence_update', getRoomUserList(currentRoom));
    }

    currentRoom = room;
    currentUser = { id: socket.id, name, avatar };

    socket.join(room);
    roomUsers[room] = roomUsers[room] || {};
    roomUsers[room][socket.id] = currentUser;

    // Confirm to the joining client
    socket.emit('joined', { room, rooms: DEFAULT_ROOMS, you: currentUser });

    // Tell everyone else in the room
    socket.to(room).emit('user_joined', currentUser);
    io.to(room).emit('presence_update', getRoomUserList(room));
  });

  socket.on('send_message', ({ text }) => {
    if (!currentRoom || !currentUser || !text || !text.trim()) return;
    const payload = {
      id: currentUser.id,
      name: currentUser.name,
      avatar: currentUser.avatar,
      text: text.trim().slice(0, 1000),
      ts: Date.now()
    };
    // Broadcast to everyone in the room, including sender (keeps ordering consistent)
    io.to(currentRoom).emit('new_message', payload);

    // Sending a message implies they've stopped typing
    if (typingState[currentRoom]) {
      typingState[currentRoom].delete(socket.id);
      io.to(currentRoom).emit('typing_update', getTypingNames(currentRoom));
    }
  });

  socket.on('typing', () => {
    if (!currentRoom || !currentUser) return;
    typingState[currentRoom] = typingState[currentRoom] || new Set();
    typingState[currentRoom].add(socket.id);
    io.to(currentRoom).emit('typing_update', getTypingNames(currentRoom));
  });

  socket.on('stop_typing', () => {
    if (!currentRoom) return;
    typingState[currentRoom]?.delete(socket.id);
    io.to(currentRoom).emit('typing_update', getTypingNames(currentRoom));
  });

  socket.on('disconnect', () => {
    if (currentRoom && currentUser) {
      delete roomUsers[currentRoom]?.[socket.id];
      typingState[currentRoom]?.delete(socket.id);
      io.to(currentRoom).emit('user_left', currentUser);
      io.to(currentRoom).emit('presence_update', getRoomUserList(currentRoom));
      io.to(currentRoom).emit('typing_update', getTypingNames(currentRoom));
    }
  });

  function getTypingNames(room) {
    const ids = Array.from(typingState[room] || []);
    return ids
      .filter((id) => id !== socket.id || true) // include all; client filters itself out by id
      .map((id) => roomUsers[room]?.[id])
      .filter(Boolean);
  }
});

server.listen(PORT, () => {
  console.log(`Pulse chat server running on port ${PORT}`);
});
