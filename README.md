<p align="center">
  <img src="https://img.icons8.com/fluency/96/water.png" alt="Tidepool Logo" width="80" height="80"/>
</p>

<h1 align="center">Tidepool!</h1>

<p align="center">
  <strong>Community-powered funding that only charges when goals are met</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=white" alt="React"/>
  <img src="https://img.shields.io/badge/Rails-8-CC0000?style=flat-square&logo=rubyonrails&logoColor=white" alt="Rails"/>
  <img src="https://img.shields.io/badge/Stripe-Payments-635BFF?style=flat-square&logo=stripe&logoColor=white" alt="Stripe"/>
  <img src="https://img.shields.io/badge/PostgreSQL-DB-4169E1?style=flat-square&logo=postgresql&logoColor=white" alt="PostgreSQL"/>
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Mapbox-Maps-000000?style=flat-square&logo=mapbox&logoColor=white" alt="Mapbox"/>
</p>

---

## The Concept

> **Pool your power. Fund what matters.**

Tidepool is a collective funding platform with a twist: **funds are held, not charged, until the goal is met**.

| Outcome | What Happens |
|---------|--------------|
| Goal reached | Everyone pays, project happens |
| Goal not reached | Nobody pays, funds released |

This eliminates the risk for backers and ensures projects only move forward with full community support.

---

## Features

- **Interactive Globe Map** — Explore initiatives around the world with Mapbox GL
- **Secure Stripe Payments** — Card holds that only charge when goals are met
- **Real-time Progress** — Live countdown timers and funding progress bars
- **Smart Goal Tracking** — Automatic status updates when targets are reached
- **Celebration Effects** — Confetti when goals are hit
- **Fully Responsive** — Works on desktop, tablet, and mobile

---

## Quick Start

### Prerequisites

- Node.js 18+
- Ruby 3.2+
- PostgreSQL 14+

### 1. Clone & Install

```bash
git clone https://github.com/yourusername/tidepool.git
cd tidepool

# Frontend
cd frontend && npm install

# Backend
cd ../backend && bundle install
```

### 2. Environment Setup

**Frontend** (`frontend/.env`):
```env
VITE_MAPBOX_TOKEN=pk.your_mapbox_token
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key
```

**Backend** (`backend/.env`):
```env
STRIPE_SECRET_KEY=sk_test_your_stripe_secret
FRONTEND_URL=http://localhost:8080
```

### 3. Database Setup

```bash
cd backend
rails db:create db:migrate db:seed
```

### 4. Start Development Servers

```bash
# Terminal 1 - Backend (port 3000)
cd backend && rails server

# Terminal 2 - Frontend (port 8080)
cd frontend && npm run dev
```

Open [http://localhost:8080](http://localhost:8080)

---

## Tech Stack

| Frontend | Backend | Infrastructure |
|----------|---------|----------------|
| React 18 | Ruby on Rails 8 | Docker Ready |
| TypeScript | PostgreSQL | Kamal Deploy |
| Vite | Stripe API | GitHub Actions |
| Tailwind CSS | BCrypt | Solid Queue |
| shadcn/ui | RSpec | |
| Mapbox GL | | |
| TanStack Query | | |
| Framer Motion | | |

---

## Project Structure

```
tidepool/
├── frontend/              # React + Vite frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/           # Utilities & API
│   └── ...
│
├── backend/               # Rails API backend
│   ├── app/
│   │   ├── controllers/   # API controllers
│   │   ├── models/        # ActiveRecord models
│   │   └── services/      # Business logic
│   └── ...
│
└── README.md
```

---

## API Endpoints

| Method | Endpoint | Description |
|:------:|----------|-------------|
| GET | `/api/v1/initiatives` | List all initiatives |
| GET | `/api/v1/initiatives/:id` | Get initiative details |
| POST | `/api/v1/initiatives` | Create new initiative |
| POST | `/api/v1/initiatives/:id/pledges` | Create a pledge |
| POST | `/api/v1/payment_intents` | Create Stripe payment intent |

**Query Parameters:**
- `?status=open|funded|failed` — Filter by status
- `?search=query` — Search by title/description

---

## Test Cards

| Card | Number | Result |
|------|--------|--------|
| Visa | `4242 4242 4242 4242` | Success |
| Decline | `4000 0000 0000 0002` | Declined |
| 3D Secure | `4000 0025 0000 3155` | Auth Required |

Use any future expiry date and any 3-digit CVC.

---

## API Keys

| Service | Get Key | Variable |
|---------|---------|----------|
| Mapbox | [mapbox.com](https://account.mapbox.com/access-tokens/) | `VITE_MAPBOX_TOKEN` |
| Stripe (Public) | [stripe.com](https://dashboard.stripe.com/test/apikeys) | `VITE_STRIPE_PUBLISHABLE_KEY` |
| Stripe (Secret) | [stripe.com](https://dashboard.stripe.com/test/apikeys) | `STRIPE_SECRET_KEY` |

---

## Running Tests

```bash
# Backend
cd backend && bundle exec rspec

# Frontend
cd frontend && npm test
```

---

## License

MIT
