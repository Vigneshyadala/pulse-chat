# Pulse — Real-time Chat Application

A real-time chat app with rooms, live typing indicators, and online presence — built with **Node.js**, **Express**, and **Socket.io**. Unlike a tab-only demo, this runs on an actual server, so anyone on any device (laptop, phone, different Wi-Fi networks) can join the same room and chat live.

![Tech stack](https://img.shields.io/badge/Node.js-18+-339933) ![Tech stack](https://img.shields.io/badge/Socket.io-4.7-black) ![Tech stack](https://img.shields.io/badge/Express-4.19-grey)

## Features

- **Real-time messaging** — messages appear instantly for everyone in the room, powered by Socket.io WebSockets
- **Multiple chat rooms** — `general`, `projects`, `random`, `help`, or create your own
- **Live typing indicators** — see "Name is typing..." with an animated dot
- **Online presence** — sidebar shows who's currently in the room, updates instantly on join/leave
- **Connection status indicator** — top-right badge shows live server connection state
- **Responsive design** — works on desktop and mobile (collapsible sidebar)
- **No database needed** — runs entirely in memory, perfect for a demo or fresher project

## Tech stack

| Layer       | Tech                          |
|-------------|--------------------------------|
| Backend     | Node.js, Express, Socket.io    |
| Frontend    | Vanilla HTML/CSS/JS, Socket.io client |
| Real-time   | WebSockets (via Socket.io)     |

## Run it locally

**Requirements:** [Node.js](https://nodejs.org) v18 or higher.

```bash
# 1. Install dependencies
npm install

# 2. Start the server
npm start

# 3. Open in your browser
# http://localhost:3000
```

To test real multi-user chat locally: open `http://localhost:3000` in two different browser windows (or have a friend on the same Wi-Fi visit `http://YOUR_LOCAL_IP:3000`), pick a name, join the same room, and chat.

## Deploy it (so anyone, anywhere can use it)

This is a standard Node.js app, so it deploys easily on free tiers:

### Deploy on Render (recommended, matches your project sheet's tip)

1. Push this folder to a GitHub repo
2. Go to [render.com](https://render.com) → **New** → **Web Service**
3. Connect your GitHub repo
4. Set:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Click **Deploy** — Render gives you a live URL like `https://pulse-chat.onrender.com`

### Deploy on Railway

1. Push to GitHub
2. Go to [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub repo**
3. Railway auto-detects Node.js and deploys — done

Once deployed, share the live URL with anyone — they can join from their own phone or laptop and chat with you in real time. **Put this live link on your resume**, not just the GitHub repo — it's far more convincing to a recruiter.

## Project structure

```
pulse-chat/
├── server.js          # Express + Socket.io backend (rooms, messages, presence, typing)
├── package.json
└── public/
    └── index.html      # Frontend (UI + Socket.io client logic)
```

## How it works (for your interview / viva)

- The **server** (`server.js`) keeps track of which users are in which room using an in-memory object, and uses Socket.io's room feature (`socket.join(room)`) to scope broadcasts.
- When a user sends a message, the server emits `new_message` to everyone in that room (`io.to(room).emit(...)`) — this is what makes it real-time: no polling, no refresh, the server pushes the update over a persistent WebSocket connection.
- **Typing indicators** work the same way: the client emits a `typing` event on every keystroke (debounced), the server tracks who's typing per room, and broadcasts the list to everyone else in that room.
- **Presence** (the online users list) updates whenever someone joins, leaves, or disconnects, via Socket.io's built-in `disconnect` event — so it stays accurate even if someone closes their browser tab without clicking "leave."

## Possible extensions (good talking points for interviews)

- Add MongoDB to persist messages so chat history survives a server restart
- Add JWT-based authentication instead of just a display name
- Add private 1-on-1 direct messages alongside public rooms
- Add read receipts and message reactions
- Add file/image sharing using Socket.io's binary support or a cloud storage upload

---

Built as part of a CSE fresher project portfolio. Design: crimson/rose dark theme with an ambient "pulse" animation to visually echo the real-time nature of the app.
