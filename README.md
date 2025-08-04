# HealthCheck Client

Health declaration app built with React, TypeScript, and Tailwind CSS. This application allows users to submit health declarations and view records with a clean, responsive interface.

## Live Demo

**[View Live App](https://healthcheck.temus.me)**

## Features

- **Multi-step Form**: Intuitive health declaration form with validation
- **Records Management**: View and paginate through health declaration records
- **Responsive Design**: Mobile-friendly design
- **Smooth Animations**: Polished user experience with motion animations
- **TypeScript**: Full type safety and better developer experience
- **Modern UI**: Clean interface built with Tailwind CSS

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Motion (Framer Motion)
- **Icons**: React Icons (Feather)
- **Build Tool**: Vite
- **Deployment**: Hosted on Railway

## Backend

The backend API server is built with Node.js and hosted on Railway.

**[Backend Repository](https://github.com/tim-lyw/healthcheck-server)**

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/healthcheck-client.git
cd healthcheck-client
```

2. Install dependencies
```bash
npm install
```

3. Create environment file
```bash
cp .env.example .env
```

4. Update the environment variables in `.env`
```
VITE_API_BASE_URL=your_backend_url
```

5. Start the development server
```bash
npm run dev
```

The app will be available at `http://localhost:5173`


## Development

### Scripts

- `npm run dev` - Start development server

### Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Main page components
├── services/           # API services
├── types/              # TypeScript type definitions
└── main.tsx           # Application entry point
```

Built by Timothy Loh
