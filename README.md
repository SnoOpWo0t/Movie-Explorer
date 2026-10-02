# Movie Explorer

A modern, high-performance web application for discovering movies and TV shows, curating a personal watchlist, and tracking viewing history with real-time statistics and multi-theme support.

---

## Overview

**Movie Explorer** is built with **React 19**, **Vite**, and **Vanilla CSS Design Tokens**. It integrates with the public [TVMaze API](https://www.tvmaze.com/api) to provide a rich catalog of shows while empowering users to manage what they want to see and track what they have already watched—persisted locally with real-time progress metrics.

---

## Key Features

### 1. Multi-Theme Engine
Seamlessly switch between three hand-crafted visual themes designed for all lighting conditions:
- **Dark Mode**: Classic forest slate and charcoal background with warm terracotta accents.
- **Night Mode (Midnight OLED)**: Deep pitch-black background with high-contrast electric indigo/violet highlights, optimized for late-night viewing.
- **Light Mode**: Warm editorial linen background with rich espresso typography and terracotta accents.
- *Theme preferences automatically persist across sessions via `localStorage`.*

### 2. Personal Watchlist & Watched Movie Tracker
- **Want to See (Watchlist)**: Bookmark movies and shows you plan to watch later with one click.
- **Already Seen (Watched)**: Mark completed titles to keep an accurate record of your entertainment journey.
- **Quick Actions**: Add or switch tracking status directly on movie cards or inside the detailed modal view.
- **Persistent Storage**: All saved titles and status history are saved locally in `localStorage`.

### 3. Analytics & Tracker Dashboard ("My Library")
- **Total Tracked Titles**: Real-time counter of your entire saved catalog.
- **Category Counts**: Instant count breakdowns for *Want to See* and *Already Seen*.
- **Viewing Progress Bar**: Live completion percentage calculation based on your watchlist-to-watched ratio.
- **Estimated Watch Time**: Calculates total hours and minutes watched based on show runtimes.
- **Library Filtering & Sorting**:
  - Filter by tab: *All Tracked*, *Want to See*, or *Already Seen*.
  - Search specifically within your saved collection.
  - Sort by *Recently Added*, *Highest Rating*, or *Title (A–Z)*.

### 4. Interactive Movie Catalog & Instant Search
- Real-time search with live query updates and a quick clear option.
- **Genre Filters**: Quick-filter by Drama, Action, Comedy, Sci-Fi, Thriller, Crime, Adventure, Romance, Horror, Animation, and Fantasy.
- High-resolution poster galleries with dynamic hover states and quick-action overlay buttons.

### 5. Detailed Show Modal
- Comprehensive details including ratings, premiere year, runtime, series status, genre tags, synopsis, and links to official show websites.
- Dedicated **Watch Status Manager** to toggle between *Want to See*, *Mark as Watched*, or *Remove from Library*.
- Accessible modal navigation with `Escape` key and backdrop dismiss support.

### 6. Professional Vector SVG Design
- Clean, vector SVG icon architecture built into reusable React components for crisp rendering across all screen densities.
- Toast notification system providing instant feedback on user actions (adding, updating, or removing titles).

---

## Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | [React 19](https://react.dev/) |
| **Build Tool** | [Vite](https://vitejs.dev/) |
| **Styling** | Vanilla CSS (CSS Variables, Flexbox, CSS Grid) |
| **Icons** | Custom Vector SVG Components (Flaticon / Modern Lineal Style) |
| **Data Source** | [TVMaze REST API](https://www.tvmaze.com/api) |
| **State & Storage** | React Hooks (`useState`, `useEffect`, `useMemo`) + Browser `localStorage` |

---

## Project Structure

```text
Movie Explorer/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── Icons.jsx             # Reusable vector SVG icons
│   │   ├── Hero.jsx
│   │   ├── MovieCard.jsx
│   │   ├── MovieDetailsModal.jsx
│   │   └── Navbar.jsx
│   ├── App.css                   # Theme variables, components & responsive layout
│   ├── App.jsx                   # Main application logic, router & tracker state
│   ├── index.css                 # Base typography & CSS resets
│   └── main.jsx                  # React application root
├── index.html                    # Application entry point & SEO metadata
├── package.json
└── vite.config.js
```

---

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18 or higher recommended)
- `npm` or `bun`

### Installation

1. **Clone or navigate to the project directory**:
   ```bash
   cd "Movie Explorer"
   ```

2. **Install project dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   Navigate to `http://localhost:5173/` in your browser.

---

## Available Scripts

- `npm run dev` - Starts the Vite development server with Hot Module Replacement (HMR).
- `npm run build` - Compiles and optimizes assets for production deployment.
- `npm run preview` - Locally previews the production build.
- `npm run lint` - Runs ESLint to check for code quality and style issues.

---

## Acknowledgments & Data

- Show and movie data provided by the free, public [TVMaze API](https://www.tvmaze.com/api).
- Icon designs inspired by [Flaticon](https://www.flaticon.com/) lineal vector guidelines.
