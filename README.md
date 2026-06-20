<div align="center">

<img src="https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js"/>
<img src="https://img.shields.io/badge/Express-4.19-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express"/>
<img src="https://img.shields.io/badge/Socket.io-4.7-black?style=for-the-badge&logo=socket.io&logoColor=white" alt="Socket.io"/>
<img src="https://img.shields.io/badge/Status-Live-success?style=for-the-badge" alt="Status"/>

# 💬 Pulse — Real-Time Chat Application
### *Live. Instant. Wherever you are.*

> A real-time multi-room chat app with typing indicators and live presence — built with Node.js, Express & Socket.io.

**Developed & Designed by [Vignesh Yadala](https://github.com/Vigneshyadala) — © 2026**

[![Live Demo](https://img.shields.io/badge/🌐%20Live%20Demo-pulse--chat--rj4d.onrender.com-339933?style=for-the-badge)](https://pulse-chat-rj4d.onrender.com/)
[![GitHub](https://img.shields.io/badge/GitHub-Vigneshyadala-black?style=for-the-badge&logo=github)](https://github.com/Vigneshyadala/pulse-chat)

</div>

---

[🎯 Features](#-key-features) • [🏗 Architecture](#-system-architecture) • [🛠 Tech Stack](#-technology-stack) • [🚀 Setup](#-installation--setup) • [📡 Events](#-socketio-events) • [👨‍💻 Author](#-developer)

---

## 🎯 Problem Statement

Most chat demos built for class projects fall short of showing real engineering:

| Challenge | Impact |
|-----------|--------|
| 🖥️ **Tab-only demos** | Only works in one browser, not a real multi-device experience |
| 🔄 **Polling-based "live" updates** | Laggy, wasteful, doesn't feel real-time |
| 👥 **No presence awareness** | Users can't tell who else is actually in the room |
| ⌨️ **No typing feedback** | Conversations feel robotic and disconnected |
| 🔌 **Messy disconnect handling** | Stale "online" users linger after closing a tab |

> **Result:** Chat demos that look like chat apps but don't behave like one.

---

## 💡 The Solution

A **lightweight real-time chat server** built on **Express + Socket.io**, using WebSocket rooms to scope messages, presence, and typing state — entirely in memory, zero database setup required.

```
🙋 Join Room → 🔌 WebSocket Connect → 💬 Live Messages
                                    ↘ ⌨️ Typing Indicators
                                    ↘ 🟢 Online Presence
```

---

## ✨ Key Features

### 💬 Real-Time Messaging
- Messages broadcast instantly to everyone in a room via Socket.io
- No polling, no refresh — server pushes updates over a persistent WebSocket
- Message history scoped per room, capped per-message length for safety

### 🏠 Multiple Chat Rooms
- Pre-built rooms: `general`, `projects`, `random`, `help`
- Users can join or create any custom room name
- Switching rooms cleanly leaves the old one and updates presence

### ⌨️ Live Typing Indicators
- Debounced `typing` events show "Name is typing…" with an animated dot
- Automatically clears when a message is sent or typing stops

### 🟢 Online Presence
- Sidebar lists everyone currently in the room
- Updates instantly on join, leave, or disconnect
- Handles abrupt tab closes via Socket.io's built-in `disconnect` event

### 📶 Connection Status Badge
- Top-right indicator shows live server connection state
- Useful for debugging flaky networks during demos

### 📱 Responsive Design
- Collapsible sidebar for mobile
- Works across desktop and mobile browsers on the same network or deployed live

---

## 🏗 System Architecture

### Core Components

| Component | File | Description |
|-----------|------|-------------|
| 🌐 **Backend Server** | `server.js` | Express + Socket.io — rooms, messages, presence, typing |
| 🎨 **Frontend UI** | `public/index.html` | Chat UI + Socket.io client logic |
| 📦 **Dependency Manifest** | `package.json` | Express, Socket.io, Socket.io-client |

### Data Flow

```javascript
// Step 1: Join
Client emits 'join_room' → Server adds user to room → 'presence_update' broadcast

// Step 2: Messaging
Client emits 'send_message' → io.to(room).emit('new_message') → All clients in room update instantly

// Step 3: Typing
Client emits 'typing' (debounced) → Server tracks per-room Set → 'typing_update' broadcast

// Step 4: Disconnect
Socket 'disconnect' fires → Server removes user from room → 'presence_update' + 'typing_update' broadcast
```

---

## 🛠 Technology Stack

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&logoColor=white)](https://socket.io/)

| Technology | Purpose | Version |
|------------|---------|---------|
| **Node.js** | JavaScript runtime | 18+ |
| **Express** | Static file server & HTTP layer | ^4.19.2 |
| **Socket.io** | WebSocket-based real-time engine | ^4.7.5 |
| **Socket.io-client** | Frontend real-time connection | ^4.8.3 |
| **Vanilla HTML/CSS/JS** | Frontend UI, no framework overhead | — |

---

## 💻 Technical Implementation

### 1. Room-Scoped Broadcasting
```javascript
socket.join(room);
roomUsers[room] = roomUsers[room] || {};
roomUsers[room][socket.id] = currentUser;

io.to(room).emit('presence_update', getRoomUserList(room));
```

### 2. Real-Time Messaging
```javascript
socket.on('send_message', ({ text }) => {
  const payload = {
    id: currentUser.id,
    name: currentUser.name,
    avatar: currentUser.avatar,
    text: text.trim().slice(0, 1000),
    ts: Date.now()
  };
  io.to(currentRoom).emit('new_message', payload);
});
```

### 3. Typing Indicators
```javascript
socket.on('typing', () => {
  typingState[currentRoom] = typingState[currentRoom] || new Set();
  typingState[currentRoom].add(socket.id);
  io.to(currentRoom).emit('typing_update', getTypingNames(currentRoom));
});
```

### 4. Clean Disconnect Handling
```javascript
socket.on('disconnect', () => {
  delete roomUsers[currentRoom]?.[socket.id];
  typingState[currentRoom]?.delete(socket.id);
  io.to(currentRoom).emit('presence_update', getRoomUserList(currentRoom));
});
```

---

## 🚀 Installation & Setup

### Prerequisites
- [Node.js](https://nodejs.org) v18 or higher
- npm (comes with Node.js)

### Step-by-Step

**1. Install dependencies**
```bash
npm install
```

**2. Start the server**
```bash
npm start
```

**3. Open in your browser**
```
http://localhost:3000
```

### Testing multi-user chat locally
Open `http://localhost:3000` in two different browser windows, or have a friend on the same Wi-Fi visit `http://YOUR_LOCAL_IP:3000`. Pick a name, join the same room, and chat.

---

## ☁️ Deployment

Pulse is a standard Node.js app and deploys easily on free tiers.

### Deploy on Render (recommended)

| Step | Action |
|------|--------|
| 1️⃣ | Push this folder to a GitHub repo |
| 2️⃣ | Go to [render.com](https://render.com) → **New** → **Web Service** |
| 3️⃣ | Connect your GitHub repo |
| 4️⃣ | Build Command: `npm install` · Start Command: `npm start` |
| 5️⃣ | Click **Deploy** → live URL like `https://pulse-chat.onrender.com` |

### Deploy on Railway

| Step | Action |
|------|--------|
| 1️⃣ | Push to GitHub |
| 2️⃣ | Go to [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub repo** |
| 3️⃣ | Railway auto-detects Node.js and deploys |

✅ **Live and deployed:** [https://pulse-chat-rj4d.onrender.com/](https://pulse-chat-rj4d.onrender.com/)

> 💡 **Tip:** Put the live deployed link on your resume, not just the GitHub repo — it's far more convincing to a recruiter.

---

## 📡 Socket.io Events

| Direction | Event | Payload | Description |
|-----------|-------|---------|--------------|
| Client → Server | `join_room` | `{ room, name, avatar }` | Join or switch to a room |
| Client → Server | `send_message` | `{ text }` | Send a chat message |
| Client → Server | `typing` | — | Notify room the user is typing |
| Client → Server | `stop_typing` | — | Clear typing state |
| Server → Client | `joined` | `{ room, rooms, you }` | Confirms join, sends room list |
| Server → Client | `new_message` | `{ id, name, avatar, text, ts }` | Broadcasts a new message |
| Server → Client | `presence_update` | `User[]` | Updated list of users in room |
| Server → Client | `typing_update` | `User[]` | Updated list of users typing |
| Server → Client | `user_joined` / `user_left` | `User` | Join/leave notifications |

---

## 📁 Project Structure

```
pulse-chat/
├── server.js              # 🌐 Express + Socket.io backend (rooms, messages, presence, typing)
├── package.json            # 📦 Dependencies & scripts
└── public/
    └── index.html           # 🎨 Frontend (UI + Socket.io client logic)
```

---

## 🔍 How It Works (for your interview / viva)

- The **server** (`server.js`) keeps track of which users are in which room using an in-memory object, and uses Socket.io's room feature (`socket.join(room)`) to scope broadcasts.
- When a user sends a message, the server emits `new_message` to everyone in that room (`io.to(room).emit(...)`) — this is what makes it real-time: no polling, no refresh, the server pushes the update over a persistent WebSocket connection.
- **Typing indicators** work the same way: the client emits a `typing` event on every keystroke (debounced), the server tracks who's typing per room, and broadcasts the list to everyone else in that room.
- **Presence** (the online users list) updates whenever someone joins, leaves, or disconnects, via Socket.io's built-in `disconnect` event — so it stays accurate even if someone closes their browser tab without clicking "leave."

---

## 🚀 Future Roadmap

| Feature | Phase |
|---------|-------|
| 🗄️ MongoDB message persistence | Phase 1 |
| 🔐 JWT-based authentication | Phase 1 |
| 📩 Private 1-on-1 direct messages | Phase 2 |
| ❤️ Read receipts & message reactions | Phase 2 |
| 🖼️ File / image sharing | Phase 3 |

---

## 📊 Project Stats

| | | | |
|--|--|--|--|
| 🏠 **4** Default Rooms | 🔌 **9** Socket Events | ⚡ **WebSocket** Real-Time | 📱 **Responsive** UI |

### Skills Demonstrated
1. **Real-Time Systems** — WebSocket-based architecture with Socket.io
2. **Room-Based Broadcasting** — scoped event emission per chat room
3. **State Management** — in-memory presence & typing tracking
4. **Full-Stack Dev** — Express backend + vanilla JS frontend
5. **Event-Driven Design** — clean client/server event contracts
6. **Deployment** — Render/Railway production deployment

---

## 📸 Try It Live

> 🌐 Try it now → [pulse-chat-rj4d.onrender.com](https://pulse-chat-rj4d.onrender.com/)

---

## 👨‍💻 Developers

<div align="center">

| Name | Role | GitHub |
|------|------|--------|
| **Vignesh Yadala** | Developer & Designer | [![GitHub](https://img.shields.io/badge/GitHub-Vigneshyadala-black?style=flat&logo=github)](https://github.com/Vigneshyadala) |

</div>

*Built as part of a CSE fresher project portfolio. Design: crimson/rose dark theme with an ambient "pulse" animation to visually echo the real-time nature of the app.*

---

<div align="center">

**💬 Pulse — All Rights Reserved © Vignesh Yadala 2026**

*Built with Node.js, Express & Socket.io*

🌟 *If this project helped you, consider giving it a star!* 🌟

</div>
