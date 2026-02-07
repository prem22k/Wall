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

2. Update `.env` with your MongoDB connection string and admin password:
   ```
   MONGODB_URI=mongodb://localhost:27017/wall
   PORT=3001
   ADMIN_PASSWORD=your_secure_password_here
   ```

   > **Security Note:** Change the `ADMIN_PASSWORD` to a strong password before deploying to production.

3. Start MongoDB and seed the admin user:
   ```bash
   # Start MongoDB
   npm run mongo:start
   
   # Create admin user in database
   npm run seed:admin
   ```

   This will create an admin user with the password from your `.env` file.

### Running the App

**Quick start (all-in-one):**
```bash
npm run dev:full
```
This starts MongoDB, backend, and frontend all at once.

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
| PUT | `/api/notes/:id` | Update a note |
| DELETE | `/api/notes/:id` | Delete a note |
| POST | `/api/admin/auth` | Admin authentication |

## Admin Panel

Access the admin panel at `/admin` to manage notes:
- View all notes
- Edit note content
- Delete notes
- Secure password authentication

**Default credentials:**
- Username: `admin` (stored in database)
- Password: Set via `ADMIN_PASSWORD` in `.env`

**Security features:**
- Passwords are hashed with bcrypt in MongoDB
- CORS protection for API endpoints
- Rate limiting (100 requests per 15 minutes)
- Secure authentication endpoint

**To change admin password:**
1. Update `ADMIN_PASSWORD` in `.env`
2. Run `npm run seed:admin` to update the database

## GitHub Codespaces

The app automatically detects GitHub Codespaces and configures the correct API URLs. No manual configuration needed - just run:

```bash
npm run dev:full
```

The frontend will automatically connect to the backend via the forwarded ports.

## Security Best Practices

1. **Change the default password** - Update `ADMIN_PASSWORD` in `.env`
2. **Use strong passwords** - At least 12 characters with mixed case, numbers, symbols
3. **Enable HTTPS** - Use reverse proxy (nginx/caddy) in production
4. **Environment variables** - Never commit `.env` files to git
5. **Database security** - Use MongoDB authentication in production
6. **Regular updates** - Keep dependencies up to date with `npm audit`

## API Endpoints
| GET | `/api/health` | Health check |

## License

MIT
