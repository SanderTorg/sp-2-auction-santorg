# Semester Project 2 - Auction House

An online auction platform where users can browse listings, place bids on items, and manage their own auctions. This project demonstrates full-stack development capabilities using modern web technologies, focusing on performance, accessibility, and user experience.

## Project links

**[Report](https://docs.google.com/document/d/1l8cSlsFTtNDX9OZuSxThM0czarwT-jiKypoGkuGRMrM/edit?usp=sharing)**

**[Github Repo](https://github.com/SanderTorg/sp-2-auction-santorg)**

**[Github Kanban](https://github.com/users/SanderTorg/projects/5/views/1)**

**[Github Gannt Chart](https://github.com/users/SanderTorg/projects/5/views/4)**

**[Netlify Production Deplyment](https://myauctions.netlify.app/)**

**[Netlify Production Overview](https://app.netlify.com/projects/myauctions/overview)**

**[Figma Project](https://www.figma.com/design/80r3vEB9AVj7vDklYE8U0l/Auction-House-SP2?node-id=1-705&t=SFj9K6pPpmFlQWFG-1)**

**[Mobile Design](https://www.figma.com/proto/80r3vEB9AVj7vDklYE8U0l/Auction-House-SP2?page-id=1%3A705&node-id=16-2094&viewport=3405%2C-383%2C0.32&t=VZyqGaS7KthRLeLM-1&scaling=scale-down&content-scaling=fixed&starting-point-node-id=16%3A2094&show-proto-sidebar=1)**

**[Desktop Design](https://www.figma.com/proto/80r3vEB9AVj7vDklYE8U0l/Auction-House-SP2?page-id=0%3A1&node-id=16-3953&viewport=-319%2C380%2C0.2&t=VLCUbvsZdI2Cgesa-1&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=16%3A3953&show-proto-sidebar=1)**

## Features

- **User Authentication**: Register and login to access full features.
- **Browse Listings**: View active auctions with search, filter (by tag), and sort capabilities.
- **Bidding System**: Place bids on items and track auction status in real-time.
- **Listing Management**: Create new listings with image galleries and edit existing ones.
- **User Profiles**: View credits, manage avatar/bio, and track wins and active listings.
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop devices.
- **Modern UI**: Styled with Tailwind CSS, featuring easy custom fast design and smooth animations.

## Tech Stack

- **Frontend Framework**: [Vite](https://vite.dev/) (Vanilla TypeScript)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Testing**:
  - Unit Testing: [Vitest](https://vitest.dev/)
  - E2E Testing: [Playwright](https://playwright.dev/)
- **Deployment**: [Netlify](https://www.netlify.com/)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/SanderTorg/sp-2-auction-santorg.git
   cd sp-2-auction-santorg
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

### Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

### Building for Production

Build the project for deployment:

```bash
npm run build
```

The output will be in the `dist` directory.

### Testing

Run unit tests:

```bash
npm run test
```

Run End-to-End (E2E) tests:

```bash
npm run test:e2e
```

View E2E test report:

```bash
npm run test:e2e:report
```

## Project Structure

```
src/
├── components/     # Reusable UI components (Header, Footer, Cards)
├── pages/          # Page views (Home, Profile, Listings, etc.)
├── services/       # API integration (Auth, Listings, Profiles)
├── styles/         # Global styles and Tailwind configuration
├── types/          # TypeScript interfaces and types
├── utils/          # Helper functions and storage management
└── main.ts         # Application entry point and routing logic
```

## Author

**[Sander Dorgan Torgersen](https://github.com/SanderTorg)**
