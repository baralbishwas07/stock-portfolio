# Stock Portfolio — Management App

A React + TypeScript frontend application for visualizing stock performance and managing a personal stock investment portfolio.

## Tech Stack

| Category | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Build Tool | Vite |
| State Management | Zustand |
| Data Fetching | TanStack Query |
| Table | TanStack Table |
| Charts | Highcharts |
| UI Library | Material UI (MUI) 5 |
| Testing | Vitest + Testing Library |
| Persistence | localStorage |


## Getting Started

### Prerequisites

- Node.js 18+ and npm 9+

### Installation

```bash
# Clone the repository
git clone https://github.com/baralbishwas07/stock-portfolio.git
cd stock-portfolio

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will instantly launch and open at [http://localhost:3000](http://localhost:3000).

### Running Tests

```bash
# Run tests in watch mode
npm run test

# Run tests once (CI mode)
npm run test:run
```

## Project Structure

```
src/
├── __tests__/         # Unit and integration tests (Vitest + RTL)
├── components/
│   ├── charts/        # Highcharts components (StockLineChart, StockColumnChart)
│   ├── layout/        # Navbar, Layout wrapper
│   └── portfolio/     # PortfolioTable, StockFormModal, PortfolioToolbar
├── data/              # Mock stock trend generator & mock variables
├── pages/             # DashboardPage and PortfolioPage
├── store/             # Zustand global state (usePortfolioStore)
├── types/             # Explicit TypeScript interfaces
├── App.tsx            # Root component handling React Router
├── main.tsx           # Entry point injecting providers (QueryClient)
├── theme.ts           # MUI Indigo/Slate custom theme configuration
└── index.css          # Global styling overrides
