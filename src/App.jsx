import { useEffect, useState } from 'react'
import './App.css'

const API_URL = 'https://api.tvmaze.com'

function getYear(date) {
  return date ? new Date(date).getFullYear() : '—'
}

function stripHtml(html = '') {
  return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim()
}

function App() {
  const [page, setPage] = useState('home')
  const [shows, setShows] = useState([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedShow, setSelectedShow] = useState(null)

  useEffect(() => {
    const controller = new AbortController()
    const endpoint = query.trim()
      ? `${API_URL}/search/shows?q=${encodeURIComponent(query.trim())}`
      : `${API_URL}/shows`

    async function loadShows() {
      setLoading(true)
      setError('')

      try {
        const response = await fetch(endpoint, { signal: controller.signal })
        if (!response.ok) throw new Error('The movie list could not be loaded.')
        const data = await response.json()
        const results = query.trim() ? data.map((item) => item.show) : data
        setShows(results)
      } catch (requestError) {
        if (requestError.name !== 'AbortError') setError(requestError.message)
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    loadShows()

    return () => controller.abort()
  }, [query])

  function goToMovies() {
    setPage('movies')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="app-shell">
      <header className="site-header">
        <button className="brand" onClick={() => setPage('home')} aria-label="Movie Explorer home">
          <span className="brand-mark">✦</span>
          <span>Movie<span>Explorer</span></span>
        </button>
        <nav className="main-nav" aria-label="Main navigation">
          <button className={page === 'home' ? 'active' : ''} onClick={() => setPage('home')}>Home</button>
          <button className={page === 'movies' ? 'active' : ''} onClick={goToMovies}>Browse movies</button>
        </nav>
        <button className="header-cta" onClick={goToMovies}>Explore now <span>↗</span></button>
      </header>

      {page === 'home' ? (
        <main>
          <section className="hero">
            <div className="hero-copy">
              <p className="eyebrow"><span className="eyebrow-dot" /> Your next favorite story is here</p>
              <h1>Find a film<br /><em>worth watching.</em></h1>
              <p className="hero-description">
                An easy-going guide to brilliant shows and unforgettable characters.
                Browse something new, or search for a familiar favorite.
              </p>
              <button className="primary-button" onClick={goToMovies}>Start exploring <span>→</span></button>
              <div className="hero-note"><span>✦</span> Curated from thousands of titles</div>
            </div>
            <div className="hero-art" aria-label="A collage of movie posters">
              <div className="poster-pile poster-back"><img src="https://static.tvmaze.com/uploads/images/original_untouched/1/4600.jpg" alt="" /></div>
              <div className="poster-pile poster-middle"><img src="https://static.tvmaze.com/uploads/images/original_untouched/81/203625.jpg" alt="" /></div>
              <div className="poster-pile poster-front"><img src="https://static.tvmaze.com/uploads/images/original_untouched/1/4601.jpg" alt="" /></div>
              <div className="art-sticker">PLAY<br /><span>something<br />great</span></div>
            </div>
          </section>

          <section className="intro-strip">
            <p className="eyebrow">A little inspiration</p>
            <h2>Stories for every kind<br />of <em>evening.</em></h2>
            <button className="text-button" onClick={goToMovies}>See all titles <span>→</span></button>
          </section>
        </main>
      ) : (
        <main className="catalog-page">
          <section className="catalog-heading">
            <div>
              <p className="eyebrow"><span className="eyebrow-dot" /> The collection</p>
              <h1>Pick your next<br /><em>adventure.</em></h1>
            </div>
            <p className="catalog-summary">A growing collection of shows to keep you company, curated by the TVMaze community.</p>
          </section>

          <div className="search-wrap">
            <span className="search-icon">⌕</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by title..."
              aria-label="Search movies by title"
            />
            {query && <button className="clear-search" onClick={() => setQuery('')} aria-label="Clear search">×</button>}
          </div>

          {loading && <div className="status-message"><span className="loader" />Finding something good...</div>}
          {error && <div className="status-message error-message">{error} <button onClick={() => setQuery(query)}>Try again</button></div>}
          {!loading && !error && shows.length === 0 && <div className="status-message">No titles matched “{query}”. Try another search.</div>}

          {!loading && !error && shows.length > 0 && (
            <section className="movie-grid" aria-live="polite">
              {shows.map((show) => <MovieCard key={show.id} show={show} onDetails={setSelectedShow} />)}
            </section>
          )}
        </main>
      )}

      <footer className="site-footer">
        <div className="footer-brand"><span className="brand-mark">✦</span> MovieExplorer</div>
        <p>Made for curious viewers · © 2026 MovieExplorer</p>
        <a href="https://www.tvmaze.com" target="_blank" rel="noreferrer">Data by TVMaze ↗</a>
      </footer>

      {selectedShow && <DetailsModal show={selectedShow} onClose={() => setSelectedShow(null)} />}
    </div>
  )
}

function MovieCard({ show, onDetails }) {
  const image = show.image?.medium || 'https://placehold.co/300x420/18211f/f4efe6?text=No+poster'
  return (
    <article className="movie-card">
      <button className="poster-button" onClick={() => onDetails(show)} aria-label={`View details for ${show.name}`}>
        <img src={image} alt={`${show.name} poster`} />
        <span className="poster-hover">View details <span>↗</span></span>
      </button>
      <div className="card-info">
        <div>
          <h2>{show.name}</h2>
          <p>{show.genres?.slice(0, 2).join(' · ') || 'Television'}</p>
        </div>
        <span className="rating">★ {show.rating?.average || '—'}</span>
      </div>
      <div className="card-meta"><span>{getYear(show.premiered)}</span><span className="meta-dot" /> <span>{show.status || 'Unknown'}</span></div>
      <button className="details-button" onClick={() => onDetails(show)}>See details <span>↗</span></button>
    </article>
  )
}

function DetailsModal({ show, onClose }) {
  useEffect(() => {
    const onKeyDown = (event) => event.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="details-modal" role="dialog" aria-modal="true" aria-labelledby="details-title">
        <button className="modal-close" onClick={onClose} aria-label="Close details">×</button>
        <div className="modal-image"><img src={show.image?.original || show.image?.medium} alt="" /></div>
        <div className="modal-content">
          <p className="eyebrow"><span className="eyebrow-dot" /> Show details</p>
          <h2 id="details-title">{show.name}</h2>
          <div className="modal-facts">
            <span>★ {show.rating?.average || 'Not rated'}</span>
            <span>{getYear(show.premiered)}</span>
            <span>{show.runtime ? `${show.runtime} min` : 'Series'}</span>
          </div>
          <div className="genre-list">{show.genres?.map((genre) => <span key={genre}>{genre}</span>)}</div>
          <p className="summary">{stripHtml(show.summary) || 'No description is available for this title yet.'}</p>
          <a className="modal-link" href={show.officialSite || show.url} target="_blank" rel="noreferrer">Visit official page <span>↗</span></a>
        </div>
      </section>
    </div>
  )
}

export default App
