# 🎬 Movie Explorer

A React web application for browsing and discovering movies and television shows. Built with React, Vite, and the public TVMaze API.

---

## 💡 About The Project

I created this project to practice key React concepts:
- **Component Architecture**: Breaking down UI into modular reusable components (`Navbar`, `Hero`, `MovieCard`, `MovieDetailsModal`).
- **React Hooks**: Using `useState` for state management and `useEffect` for asynchronous data fetching and keyboard events.
- **REST API Integration**: Fetching and parsing data from the free TVMaze API.
- **Search & Debounce**: Live searching for shows with dynamic query updates.
- **Responsive Web Design**: Mobile-first CSS with CSS Grid, Flexbox, and media queries.

---

## ✨ Features

- **Landing Hero Section**: Eye-catching poster collage and introduction.
- **Show Catalog & Grid**: Clean display of shows with poster art, genres, release year, and community ratings.
- **Real-time Search**: Live title search with instant query updates and one-click clear button.
- **Show Details Modal**: Click any card or "See details" button to view runtime, full description, genres, rating, and links to the official page.
- **Keyboard & Click Handling**: Modal can be closed with the `Escape` key or by clicking anywhere on the background.
- **Fully Responsive**: Adapts smoothly to mobile phones, tablets, and desktop screens.

---

## 🛠️ Built With

- [React 19](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [TVMaze API](https://www.tvmaze.com/api) - Free REST API for TV show data
- Vanilla CSS (Custom properties, CSS Grid, Flexbox)

---

## 🚀 How to Run Locally

1. **Clone or open the repository**:
   ```bash
   cd "Movie Explorer"
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. Open your browser at `http://localhost:5173` to explore the app!

---

## 📝 Scripts

- `npm run dev` - Starts the Vite local development server
- `npm run build` - Builds the production bundle
- `npm run preview` - Previews the production build locally
- `npm run lint` - Checks code formatting with ESLint
