# The Wall

A scrapbook wall for anonymous thoughts.

![The Wall Screenshot](https://github.com/user-attachments/assets/947da8e8-8aca-4515-bbd1-c1978e0842a6)

## About

The Wall is a quiet place for thoughts. It feels like a personal scrapbook, a corkboard filled with handwritten notes, or a journal opened on a quiet desk.

## Features

- **Write notes** that look and feel like paper artifacts
- **Masonry layout** with organically placed notes
- **Paper textures** and handwritten-style typography
- **Subtle animations** - notes lift gently on hover
- **MongoDB persistence** - notes are stored in a database
- **Fallback to localStorage** - works offline too

## Design Philosophy

Everything here is intentionally imperfect:
- Notes have random rotations and offsets
- Colors are warm, muted pastels
- No borders, no boxes, no form fields
- The experience is about writing, not submitting

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or MongoDB Atlas)

### Installation

```bash
npm install
```

### Configuration

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Update `.env` with your MongoDB connection string:
   ```
   MONGODB_URI=mongodb://localhost:27017/wall
   PORT=3001
   ```

### Running the App

**Development (frontend + backend):**
```bash
npm run dev:all
```

**Frontend only:**
```bash
npm run dev
```

**Backend only:**
```bash
npm run dev:server
```

**Production:**
```bash
npm run build
npm start
```

## Tech Stack

- **Frontend:** React 19, Vite, CSS
- **Backend:** Express.js, Mongoose
- **Database:** MongoDB
- **Fonts:** Google Fonts (Caveat, Patrick Hand, Kalam)

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notes` | Get all notes |
| POST | `/api/notes` | Create a new note |
| DELETE | `/api/notes/:id` | Delete a note |
| GET | `/api/health` | Health check |

## License

MIT
