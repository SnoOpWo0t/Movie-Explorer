import { useState, useEffect } from 'react'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import MovieCard from './components/MovieCard.jsx'
import MovieDetailsModal from './components/MovieDetailsModal.jsx'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('home')
  const [movies, setMovies] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [selectedMovie, setSelectedMovie] = useState(null)

  useEffect(() => {
    let ignore = false
    const query = searchQuery.trim()
    const url = query
      ? `https://api.tvmaze.com/search/shows?q=${encodeURIComponent(query)}`
      : 'https://api.tvmaze.com/shows'

    async function loadMovies() {
      try {
        setIsLoading(true)
        setErrorMessage('')

        const res = await fetch(url)
        if (!res.ok) throw new Error('Failed to load shows')
        
        const data = await res.json()
        if (!ignore) {
          const results = query ? data.map((item) => item.show) : data
          setMovies(results)
        }
      } catch (err) {
        if (!ignore) {
          setErrorMessage(err.message || 'Error loading shows')
        }
      } finally {
        if (!ignore) {
          setIsLoading(false)
        }
      }
    }

    loadMovies()

    return () => {
      ignore = true
    }
  }, [searchQuery])

  function handleNavigateToMovies() {
    setActiveTab('movies')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="app-shell">
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onExploreClick={handleNavigateToMovies} 
      />

      {activeTab === 'home' ? (
        <Hero onStartExploring={handleNavigateToMovies} />
      ) : (
        <main className="catalog-page">
          <div className="catalog-header">
            <div>
              <h2>Browse Shows</h2>
              <p>Find your favorite movies and TV series</p>
            </div>

            <div className="search-box">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="🔍 Search for a movie..."
              />
              {searchQuery && (
                <button className="clear-btn" onClick={() => setSearchQuery('')}>
                  &times;
                </button>
              )}
            </div>
          </div>

          {isLoading && (
            <div className="status-container">
              <p className="status-text">Loading shows...</p>
            </div>
          )}

          {errorMessage && (
            <div className="status-container error">
              <p>{errorMessage}</p>
              <button onClick={() => setSearchQuery(searchQuery)}>Retry</button>
            </div>
          )}

          {!isLoading && !errorMessage && movies.length === 0 && (
            <div className="status-container">
              <p>No shows found for "{searchQuery}".</p>
            </div>
          )}

          {!isLoading && !errorMessage && movies.length > 0 && (
            <div className="movie-grid">
              {movies.map((movie) => (
                <MovieCard 
                  key={movie.id} 
                  show={movie} 
                  onSelectShow={setSelectedMovie} 
                />
              ))}
            </div>
          )}
        </main>
      )}

      <footer className="site-footer">
        <div className="footer-left">
          <span className="footer-logo">🎬</span>
          <span>MovieExplorer</span>
        </div>
        <p>© 2026 MovieExplorer • Afrin Sultana Akhi</p>
      </footer>

      {selectedMovie && (
        <MovieDetailsModal 
          show={selectedMovie} 
          onClose={() => setSelectedMovie(null)} 
        />
      )}
    </div>
  )
}

export default App
