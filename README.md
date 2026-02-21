# Tidepool

A community funding platform where pledges are held (not charged) until a goal is reached. If the goal is met, everyone pays. If not, nobody does.

## Project Structure

```
hack-europe/
├── frontend/          # React/Vite/TypeScript frontend
├── backend/           # Ruby on Rails API backend
├── .github/           # CI/CD workflows
└── README.md
```

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and builds
- **TanStack Query** for data fetching
- **Tailwind CSS** + **shadcn/ui** for styling
- **Mapbox GL** for location features
- **Framer Motion** for animations

### Backend
- **Ruby on Rails 8** (API mode)
- **PostgreSQL** with UUID primary keys
- **RSpec** for testing

## Development Setup

### Prerequisites
- Node.js 18+ (or Bun)
- Ruby 3.2+
- PostgreSQL 14+

### Quick Start

```bash
# Clone the repository
git clone https://github.com/your-username/hack-europe.git
cd hack-europe

# Backend setup
cd backend
bundle install
rails db:create db:migrate db:seed
rails server -p 3000

# Frontend setup (in a new terminal)
cd frontend
npm install
npm run dev
```

The frontend runs at `http://localhost:8080` and the API at `http://localhost:3000`.

### Environment Variables

Create a `.env` file in the `frontend/` directory:

```env
VITE_MAPBOX_TOKEN=your_mapbox_token
VITE_API_URL=http://localhost:3000/api/v1
```

Create a `.env` file in the `backend/` directory:

```env
FRONTEND_URL=http://localhost:8080
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/initiatives` | List all initiatives (supports `?status=` and `?search=`) |
| GET | `/api/v1/initiatives/:id` | Get initiative details with pledgers and updates |
| POST | `/api/v1/initiatives` | Create a new initiative |
| POST | `/api/v1/initiatives/:id/pledges` | Create a pledge for an initiative |

## Running Tests

### Backend
```bash
cd backend
bundle exec rspec
```

### Frontend
```bash
cd frontend
npm test
```

## Deployment

The project includes GitHub Actions workflows for CI/CD:
- **Backend**: Runs RSpec tests on push
- **Frontend**: Runs Vitest tests and builds on push

## License

MIT
