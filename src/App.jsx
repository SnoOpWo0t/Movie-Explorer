import { useEffect, useState, useMemo } from 'react'
import './App.css'
import {
  IconFilm,
  IconClapperboard,
  IconBookmark,
  IconBookmarkFilled,
  IconCheckCircle,
  IconCheck,
  IconSun,
  IconMoon,
  IconNight,
  IconSearch,
  IconStar,
  IconClock,
  IconCalendar,
  IconTv,
  IconTrash,
  IconClose,
  IconExternalLink,
  IconArrowRight,
  IconSparkles,
  IconChart,
  IconCollection
} from './components/Icons'

const API_URL = 'https://api.tvmaze.com'

const GENRE_LIST = [
  'All',
  'Drama',
  'Action',
  'Comedy',
  'Sci-Fi',
  'Thriller',
  'Crime',
  'Adventure',
  'Romance',
  'Horror',
  'Mystery',
  'Animation',
  'Fantasy'
]

function getYear(date) {
  return date ? new Date(date).getFullYear() : '—'
}

function stripHtml(html = '') {
  return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim()
}

function formatMinutes(minutes) {
  if (!minutes || minutes <= 0) return '0 hrs'
  const hrs = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hrs === 0) return `${mins}m`
  if (mins === 0) return `${hrs}h`
  return `${hrs}h ${mins}m`
}

export default function App() {
  // Page Navigation State
  const [page, setPage] = useState('home') // 'home' | 'movies' | 'library'

  // Theme State ('dark' | 'night' | 'light')
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('movie_explorer_theme') || 'dark'
  })

  // TVMaze API State
  const [shows, setShows] = useState([])
  const [query, setQuery] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('All')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedShow, setSelectedShow] = useState(null)

  // Watchlist & Watched Tracker Library State
  const [library, setLibrary] = useState(() => {
    try {
      const saved = localStorage.getItem('movie_explorer_library')
      return saved ? JSON.parse(saved) : {}
    } catch {
      return {}
    }
  })

  // Library Page Filters & Search
  const [libraryTab, setLibraryTab] = useState('all') // 'all' | 'watchlist' | 'watched'
  const [librarySearch, setLibrarySearch] = useState('')
  const [librarySort, setLibrarySort] = useState('recent') // 'recent' | 'rating' | 'title'

  // Toast Notifications
  const [toasts, setToasts] = useState([])

  // Apply Theme attribute on html root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('movie_explorer_theme', theme)
  }, [theme])

  // Save library to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('movie_explorer_library', JSON.stringify(library))
    } catch (err) {
      console.error('Failed to save library to localStorage', err)
    }
  }, [library])

  // Toast helper
  function addToast(message, type = 'info', iconType = 'info') {
    const id = Date.now() + Math.random()
    setToasts((prev) => [...prev, { id, message, type, iconType }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3200)
  }

  // Library actions
  function getMovieStatus(showId) {
    return library[showId]?.status || null
  }

  function toggleWatchlist(show) {
    setLibrary((prev) => {
      const next = { ...prev }
      const current = next[show.id]

      if (current?.status === 'watchlist') {
        delete next[show.id]
        addToast(`Removed "${show.name}" from your library`, 'removed', 'trash')
      } else {
        next[show.id] = {
          id: show.id,
          name: show.name,
          image: show.image,
          genres: show.genres || [],
          rating: show.rating,
          premiered: show.premiered,
          runtime: show.runtime || show.averageRuntime || 45,
          summary: show.summary,
          officialSite: show.officialSite,
          url: show.url,
          status: 'watchlist',
          addedAt: Date.now()
        }
        addToast(`Added "${show.name}" to Want to See (Watchlist)`, 'watchlist', 'bookmark')
      }
      return next
    })
  }

  function toggleWatched(show) {
    setLibrary((prev) => {
      const next = { ...prev }
      const current = next[show.id]

      if (current?.status === 'watched') {
        delete next[show.id]
        addToast(`Removed "${show.name}" from your library`, 'removed', 'trash')
      } else {
        next[show.id] = {
          id: show.id,
          name: show.name,
          image: show.image,
          genres: show.genres || [],
          rating: show.rating,
          premiered: show.premiered,
          runtime: show.runtime || show.averageRuntime || 45,
          summary: show.summary,
          officialSite: show.officialSite,
          url: show.url,
          status: 'watched',
          addedAt: Date.now()
        }
        addToast(`Marked "${show.name}" as Already Watched`, 'watched', 'check')
      }
      return next
    })
  }

  function removeFromLibrary(showId, showName = 'Movie') {
    setLibrary((prev) => {
      const next = { ...prev }
      delete next[showId]
      return next
    })
    addToast(`Removed "${showName}" from library`, 'removed', 'trash')
  }

  // Fetch Shows
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
        if (!response.ok) throw new Error('The movie catalog could not be loaded.')
        const data = await response.json()
        const results = query.trim() ? data.map((item) => item.show) : data
        setShows(results || [])
      } catch (requestError) {
        if (requestError.name !== 'AbortError') setError(requestError.message)
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    loadShows()

    return () => controller.abort()
  }, [query])

  // Computed Catalog Filter
  const filteredCatalogShows = useMemo(() => {
    if (selectedGenre === 'All') return shows
    return shows.filter((show) =>
      show.genres?.some((g) => g.toLowerCase() === selectedGenre.toLowerCase())
    )
  }, [shows, selectedGenre])

  // Computed Library List & Statistics
  const libraryList = useMemo(() => Object.values(library), [library])

  const wantToWatchList = useMemo(
    () => libraryList.filter((item) => item.status === 'watchlist'),
    [libraryList]
  )

  const watchedList = useMemo(
    () => libraryList.filter((item) => item.status === 'watched'),
    [libraryList]
  )

  const totalTrackedCount = libraryList.length
  const wantToWatchCount = wantToWatchList.length
  const watchedCount = watchedList.length

  const completionPercentage = totalTrackedCount > 0
    ? Math.round((watchedCount / totalTrackedCount) * 100)
    : 0

  const totalWatchedMinutes = useMemo(() => {
    return watchedList.reduce((acc, curr) => acc + (Number(curr.runtime) || 45), 0)
  }, [watchedList])

  // Filtered & Sorted Library for the Library View
  const filteredLibrary = useMemo(() => {
    let result = libraryList

    if (libraryTab === 'watchlist') {
      result = result.filter((item) => item.status === 'watchlist')
    } else if (libraryTab === 'watched') {
      result = result.filter((item) => item.status === 'watched')
    }

    if (librarySearch.trim()) {
      const q = librarySearch.trim().toLowerCase()
      result = result.filter((item) =>
        item.name?.toLowerCase().includes(q) ||
        item.genres?.some((g) => g.toLowerCase().includes(q))
      )
    }

    return [...result].sort((a, b) => {
      if (librarySort === 'rating') {
        const rA = a.rating?.average || 0
        const rB = b.rating?.average || 0
        return rB - rA
      }
      if (librarySort === 'title') {
        return (a.name || '').localeCompare(b.name || '')
      }
      // 'recent'
      return (b.addedAt || 0) - (a.addedAt || 0)
    })
  }, [libraryList, libraryTab, librarySearch, librarySort])

  function navigateTo(targetPage) {
    setPage(targetPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="app-shell">
      {/* Site Header */}
      <header className="site-header">
        <div className="header-container">
          <div className="header-left">
            <button className="brand" onClick={() => navigateTo('home')} aria-label="Movie Explorer Home">
              <span className="brand-mark">
                <IconClapperboard size={18} />
              </span>
              <span>Movie<span>Explorer</span></span>
            </button>

            <nav className="main-nav" aria-label="Main Navigation">
              <button
                className={`nav-link ${page === 'home' ? 'active' : ''}`}
                onClick={() => navigateTo('home')}
              >
                Home
              </button>
              <button
                className={`nav-link ${page === 'movies' ? 'active' : ''}`}
                onClick={() => navigateTo('movies')}
              >
                Browse Movies
              </button>
              <button
                className={`nav-link ${page === 'library' ? 'active' : ''}`}
                onClick={() => navigateTo('library')}
              >
                My Library
                {totalTrackedCount > 0 && (
                  <span className="nav-pill-badge" title={`${wantToWatchCount} to watch, ${watchedCount} seen`}>
                    {wantToWatchCount} / {watchedCount}
                  </span>
                )}
              </button>
            </nav>
          </div>

          <div className="header-right">
            {/* Theme Selector: Light, Dark, Night */}
            <div className="theme-switcher" role="radiogroup" aria-label="Theme mode switcher">
              <button
                className={`theme-btn ${theme === 'light' ? 'active' : ''}`}
                onClick={() => setTheme('light')}
                title="Switch to Light mode"
                aria-label="Light mode"
              >
                <IconSun size={14} className="theme-icon" />
                <span>Light</span>
              </button>
              <button
                className={`theme-btn ${theme === 'dark' ? 'active' : ''}`}
                onClick={() => setTheme('dark')}
                title="Switch to Dark mode"
                aria-label="Dark mode"
              >
                <IconMoon size={14} className="theme-icon" />
                <span>Dark</span>
              </button>
              <button
                className={`theme-btn ${theme === 'night' ? 'active' : ''}`}
                onClick={() => setTheme('night')}
                title="Switch to Night / Midnight mode"
                aria-label="Night OLED mode"
              >
                <IconNight size={14} className="theme-icon" />
                <span>Night</span>
              </button>
            </div>

            {/* Quick Library Counter CTA */}
            <button
              className="header-library-btn"
              onClick={() => navigateTo('library')}
              title="Open My Library and Movie Tracker"
            >
              <IconCollection size={15} />
              <span>Library</span>
              <span className="counts">
                <span title="Want to see" style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                  <IconBookmark size={11} /> {wantToWatchCount}
                </span>
                <span title="Already watched" style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                  <IconCheckCircle size={11} /> {watchedCount}
                </span>
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Pages Router */}
      {page === 'home' && (
        <main>
          <section className="hero-section">
            <div className="hero-content">
              <p className="eyebrow">
                <span className="eyebrow-dot" /> Your personal cinema universe
              </p>
              <h1 className="hero-title">
                Find a film<br /><em>worth watching.</em>
              </h1>
              <p className="hero-description">
                Discover brilliant movies and shows, maintain your personal watchlist of what you want to see, and track what you've already experienced.
              </p>

              <div className="hero-actions">
                <button className="primary-button" onClick={() => navigateTo('movies')}>
                  Start Exploring <IconArrowRight size={15} />
                </button>
                <button className="secondary-button" onClick={() => navigateTo('library')}>
                  <IconBookmark size={15} />
                  <span>View My Library ({totalTrackedCount})</span>
                </button>
              </div>

              {/* Quick Tracker Summary on Hero */}
              <div className="hero-tracker-summary">
                <div className="tracker-stat-item">
                  <span className="stat-label">Want to See</span>
                  <span className="stat-val watchlist-val" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <IconBookmark size={16} /> {wantToWatchCount}
                  </span>
                </div>
                <div className="tracker-stat-item">
                  <span className="stat-label">Already Seen</span>
                  <span className="stat-val watched-val" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <IconCheckCircle size={16} /> {watchedCount}
                  </span>
                </div>
                <div className="tracker-stat-item">
                  <span className="stat-label">Total Tracked</span>
                  <span className="stat-val">{totalTrackedCount}</span>
                </div>
                <div className="tracker-stat-item">
                  <span className="stat-label">Completed</span>
                  <span className="stat-val">{completionPercentage}%</span>
                </div>
              </div>
            </div>

            <div className="hero-art" aria-label="A collage of movie posters">
              <div className="poster-stack poster-back">
                <img src="https://static.tvmaze.com/uploads/images/original_untouched/1/4600.jpg" alt="Person of Interest poster" />
              </div>
              <div className="poster-stack poster-middle">
                <img src="https://static.tvmaze.com/uploads/images/original_untouched/81/203625.jpg" alt="Game of Thrones poster" />
              </div>
              <div className="poster-stack poster-front">
                <img src="https://static.tvmaze.com/uploads/images/original_untouched/1/4601.jpg" alt="Breaking Bad poster" />
              </div>
              <div className="art-badge">
                TRACK<br />
                <span>your favorites</span>
              </div>
            </div>
          </section>

          {/* Features Strip */}
          <section className="features-strip">
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon" style={{ color: 'var(--watchlist-color)' }}>
                  <IconBookmark size={28} />
                </div>
                <h3>Want to See Watchlist</h3>
                <p>Bookmark captivating titles you plan to watch later with one click, never losing track of great recommendations.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon" style={{ color: 'var(--watched-color)' }}>
                  <IconCheckCircle size={28} />
                </div>
                <h3>Already Seen Tracker</h3>
                <p>Mark movies you've completed, calculate your total watch time, and monitor your personal viewing progress.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon" style={{ color: 'var(--accent)' }}>
                  <IconSparkles size={28} />
                </div>
                <h3>Light, Dark & Night Modes</h3>
                <p>Seamlessly switch between warm Light, sleek Dark, and midnight OLED Night mode for comfortable viewing at any hour.</p>
              </div>
            </div>
          </section>
        </main>
      )}

      {page === 'movies' && (
        <main className="catalog-page">
          <section className="catalog-header">
            <div>
              <p className="eyebrow">
                <span className="eyebrow-dot" /> The Catalog
              </p>
              <h1>
                Pick your next<br /><em>adventure.</em>
              </h1>
            </div>
            <p className="catalog-subtitle">
              Browse hundreds of acclaimed shows and movies. Save titles to your watchlist or mark them as watched directly from each card.
            </p>
          </section>

          {/* Search and Genre Filters */}
          <div className="toolbar-wrap">
            <div className="search-container">
              <span className="search-icon">
                <IconSearch size={18} />
              </span>
              <input
                className="search-input"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search movies & shows by title..."
                aria-label="Search movies by title"
              />
              {query && (
                <button
                  className="clear-button"
                  onClick={() => setQuery('')}
                  aria-label="Clear search text"
                >
                  <IconClose size={16} />
                </button>
              )}
            </div>

            <div className="genre-chips-wrap" role="group" aria-label="Genre filters">
              {GENRE_LIST.map((genre) => (
                <button
                  key={genre}
                  className={`genre-chip ${selectedGenre === genre ? 'active' : ''}`}
                  onClick={() => setSelectedGenre(genre)}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>

          {/* Loading, Error & Empty States */}
          {loading && (
            <div className="status-message">
              <span className="loader" /> Finding something good for you...
            </div>
          )}
          {error && (
            <div className="status-message error-message">
              <span>{error}</span>
              <button onClick={() => setQuery(query)}>Try again</button>
            </div>
          )}
          {!loading && !error && filteredCatalogShows.length === 0 && (
            <div className="status-message">
              No titles matched your search criteria. Try a different query or genre filter.
            </div>
          )}

          {/* Movie Catalog Grid */}
          {!loading && !error && filteredCatalogShows.length > 0 && (
            <section className="movie-grid" aria-label="Movie list">
              {filteredCatalogShows.map((show) => {
                const status = getMovieStatus(show.id)
                return (
                  <MovieCard
                    key={show.id}
                    show={show}
                    status={status}
                    onDetails={() => setSelectedShow(show)}
                    onToggleWatchlist={() => toggleWatchlist(show)}
                    onToggleWatched={() => toggleWatched(show)}
                  />
                )
              })}
            </section>
          )}
        </main>
      )}

      {page === 'library' && (
        <main className="library-page">
          <section className="library-header">
            <p className="eyebrow">
              <span className="eyebrow-dot" /> Personal Collection & Tracker
            </p>
            <h1>
              My Library & <em>Tracker.</em>
            </h1>
          </section>

          {/* Statistics Dashboard */}
          <section className="tracker-dashboard">
            <div className="dashboard-card card-total">
              <div className="dashboard-card-top">
                <span className="dashboard-card-title">Total Movies Tracked</span>
                <div className="dashboard-card-icon">
                  <IconFilm size={20} />
                </div>
              </div>
              <div className="dashboard-card-number">{totalTrackedCount}</div>
              <span className="dashboard-card-hint">Combined in your library</span>
            </div>

            <div className="dashboard-card card-watchlist">
              <div className="dashboard-card-top">
                <span className="dashboard-card-title">Want to See (Watchlist)</span>
                <div className="dashboard-card-icon">
                  <IconBookmark size={20} />
                </div>
              </div>
              <div className="dashboard-card-number" style={{ color: 'var(--watchlist-color)' }}>
                {wantToWatchCount}
              </div>
              <span className="dashboard-card-hint">Queued up for future viewing</span>
            </div>

            <div className="dashboard-card card-watched">
              <div className="dashboard-card-top">
                <span className="dashboard-card-title">Already Seen (Watched)</span>
                <div className="dashboard-card-icon">
                  <IconCheckCircle size={20} />
                </div>
              </div>
              <div className="dashboard-card-number" style={{ color: 'var(--watched-color)' }}>
                {watchedCount}
              </div>
              <span className="dashboard-card-hint">Titles you've finished</span>
            </div>

            <div className="dashboard-card">
              <div className="dashboard-card-top">
                <span className="dashboard-card-title">Viewing Progress</span>
                <div className="dashboard-card-icon">
                  <IconClock size={20} />
                </div>
              </div>
              <div className="dashboard-card-number">{completionPercentage}%</div>
              <div className="progress-bar-wrap">
                <div className="progress-bar-fill" style={{ width: `${completionPercentage}%` }} />
              </div>
              <span className="dashboard-card-hint">~{formatMinutes(totalWatchedMinutes)} total watched time</span>
            </div>
          </section>

          {/* Library Filters, Search and Sorting Bar */}
          <div className="library-controls">
            <div className="library-tab-group" role="tablist">
              <button
                className={`library-tab-btn ${libraryTab === 'all' ? 'active' : ''}`}
                onClick={() => setLibraryTab('all')}
              >
                <IconFilm size={14} /> All Tracked <span className="library-tab-count">{totalTrackedCount}</span>
              </button>
              <button
                className={`library-tab-btn ${libraryTab === 'watchlist' ? 'active' : ''}`}
                onClick={() => setLibraryTab('watchlist')}
              >
                <IconBookmark size={14} /> Want to See <span className="library-tab-count">{wantToWatchCount}</span>
              </button>
              <button
                className={`library-tab-btn ${libraryTab === 'watched' ? 'active' : ''}`}
                onClick={() => setLibraryTab('watched')}
              >
                <IconCheckCircle size={14} /> Watched <span className="library-tab-count">{watchedCount}</span>
              </button>
            </div>

            <div className="library-search-sort">
              <input
                className="library-search-input"
                value={librarySearch}
                onChange={(e) => setLibrarySearch(e.target.value)}
                placeholder="Filter saved titles or genres..."
                aria-label="Filter saved titles"
              />

              <select
                className="library-sort-select"
                value={librarySort}
                onChange={(e) => setLibrarySort(e.target.value)}
                aria-label="Sort library by"
              >
                <option value="recent">Recently Added</option>
                <option value="rating">Highest Rating</option>
                <option value="title">Title (A–Z)</option>
              </select>
            </div>
          </div>

          {/* Library Cards Grid or Empty State */}
          {filteredLibrary.length === 0 ? (
            <div className="empty-library-card">
              <div className="empty-icon" style={{ color: 'var(--accent)', display: 'flex', justifyContent: 'center' }}>
                <IconClapperboard size={52} />
              </div>
              <h2>No movies found in this view</h2>
              <p>
                {totalTrackedCount === 0
                  ? "You haven't added any movies yet! Browse our catalog and bookmark titles you want to see or mark what you've already seen."
                  : 'No saved movies match your current search or tab filters.'}
              </p>
              <button className="primary-button" onClick={() => navigateTo('movies')}>
                Browse Movies to Add <IconArrowRight size={14} />
              </button>
            </div>
          ) : (
            <section className="movie-grid" aria-label="Tracked library movies">
              {filteredLibrary.map((show) => (
                <article key={show.id} className="movie-card">
                  <div className="card-poster-wrap" onClick={() => setSelectedShow(show)}>
                    <img
                      src={show.image?.medium || show.image?.original || 'https://placehold.co/300x420/18211f/f4efe6?text=No+Poster'}
                      alt={`${show.name} poster`}
                      loading="lazy"
                    />
                    <div className="poster-overlay-gradient" />
                    
                    <span className={`card-status-badge ${show.status}`}>
                      {show.status === 'watchlist' ? (
                        <>
                          <IconBookmarkFilled size={11} /> Want to See
                        </>
                      ) : (
                        <>
                          <IconCheck size={11} /> Watched
                        </>
                      )}
                    </span>
                  </div>

                  <div className="card-content">
                    <h2 className="card-title" onClick={() => setSelectedShow(show)} title={show.name}>
                      {show.name}
                    </h2>
                    <p className="card-genres">
                      {show.genres?.slice(0, 2).join(' · ') || 'Television'}
                    </p>

                    <div className="card-meta-row">
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <IconCalendar size={11} /> {getYear(show.premiered)}
                      </span>
                      <span className="card-rating">
                        <IconStar size={11} /> {show.rating?.average || '—'}
                      </span>
                    </div>

                    <div className="library-card-actions">
                      <button
                        className="toggle-status-btn"
                        onClick={() => {
                          if (show.status === 'watchlist') {
                            toggleWatched(show)
                          } else {
                            toggleWatchlist(show)
                          }
                        }}
                        title={show.status === 'watchlist' ? 'Mark as watched' : 'Move to watchlist'}
                      >
                        {show.status === 'watchlist' ? (
                          <>
                            <IconCheck size={12} /> Mark as Seen
                          </>
                        ) : (
                          <>
                            <IconBookmark size={12} /> Move to Watchlist
                          </>
                        )}
                      </button>
                      <button
                        className="remove-btn"
                        onClick={() => removeFromLibrary(show.id, show.name)}
                        title="Remove from library"
                        aria-label={`Remove ${show.name} from library`}
                      >
                        <IconTrash size={13} />
                      </button>
                    </div>

                    <button
                      className="card-details-btn"
                      style={{ marginTop: '8px' }}
                      onClick={() => setSelectedShow(show)}
                    >
                      Details <IconExternalLink size={11} />
                    </button>
                  </div>
                </article>
              ))}
            </section>
          )}
        </main>
      )}

      {/* Site Footer */}
      <footer className="site-footer">
        <div className="footer-container">
          <div className="footer-brand">
            <span className="brand-mark">
              <IconClapperboard size={14} />
            </span>
            <span>MovieExplorer</span>
          </div>
          <p>Made for curious viewers · Discover & Track · © 2026 MovieExplorer</p>
          <a href="https://www.tvmaze.com" target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            Data provided by TVMaze <IconExternalLink size={11} />
          </a>
        </div>
      </footer>

      {/* Movie Details Modal */}
      {selectedShow && (
        <DetailsModal
          show={selectedShow}
          status={getMovieStatus(selectedShow.id)}
          onClose={() => setSelectedShow(null)}
          onToggleWatchlist={() => toggleWatchlist(selectedShow)}
          onToggleWatched={() => toggleWatched(selectedShow)}
          onRemove={() => removeFromLibrary(selectedShow.id, selectedShow.name)}
        />
      )}

      {/* Floating Toast Notifications */}
      {toasts.length > 0 && (
        <div className="toast-container" aria-live="polite">
          {toasts.map((toast) => (
            <div key={toast.id} className={`toast-item ${toast.type}`}>
              {toast.iconType === 'bookmark' && <IconBookmark size={16} style={{ color: 'var(--watchlist-color)' }} />}
              {toast.iconType === 'check' && <IconCheckCircle size={16} style={{ color: 'var(--watched-color)' }} />}
              {toast.iconType === 'trash' && <IconTrash size={16} style={{ color: 'var(--text-muted)' }} />}
              <span>{toast.message}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function MovieCard({ show, status, onDetails, onToggleWatchlist, onToggleWatched }) {
  const image = show.image?.medium || show.image?.original || 'https://placehold.co/300x420/18211f/f4efe6?text=No+Poster'

  return (
    <article className="movie-card">
      <div className="card-poster-wrap" onClick={onDetails} role="button" tabIndex={0} aria-label={`View details for ${show.name}`}>
        <img src={image} alt={`${show.name} poster`} loading="lazy" />
        <div className="poster-overlay-gradient" />

        {/* Live Status Badge */}
        {status && (
          <span className={`card-status-badge ${status}`}>
            {status === 'watchlist' ? (
              <>
                <IconBookmarkFilled size={10} /> Want to See
              </>
            ) : (
              <>
                <IconCheck size={10} /> Watched
              </>
            )}
          </span>
        )}

        {/* Quick Hover Action Buttons */}
        <div
          className="poster-quick-actions"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className={`quick-action-btn ${status === 'watchlist' ? 'active-watchlist' : ''}`}
            onClick={onToggleWatchlist}
            title={status === 'watchlist' ? 'In Watchlist (click to remove)' : 'Add to Want to See watchlist'}
          >
            <IconBookmark size={12} />
            <span>{status === 'watchlist' ? 'Saved' : 'Watchlist'}</span>
          </button>
          <button
            className={`quick-action-btn ${status === 'watched' ? 'active-watched' : ''}`}
            onClick={onToggleWatched}
            title={status === 'watched' ? 'Marked as Watched (click to remove)' : 'Mark as Already Seen'}
          >
            <IconCheck size={12} />
            <span>{status === 'watched' ? 'Seen' : 'Mark Seen'}</span>
          </button>
        </div>
      </div>

      <div className="card-content">
        <h2 className="card-title" onClick={onDetails} title={show.name}>
          {show.name}
        </h2>
        <p className="card-genres">
          {show.genres?.slice(0, 2).join(' · ') || 'Television'}
        </p>

        <div className="card-meta-row">
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <IconCalendar size={11} /> {getYear(show.premiered)}
          </span>
          <span className="card-rating">
            <IconStar size={11} /> {show.rating?.average || '—'}
          </span>
        </div>

        <div className="card-footer-buttons">
          <button className="card-details-btn" onClick={onDetails}>
            See Details <IconExternalLink size={11} />
          </button>
        </div>
      </div>
    </article>
  )
}

function DetailsModal({ show, status, onClose, onToggleWatchlist, onToggleWatched, onRemove }) {
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const poster = show.image?.original || show.image?.medium || 'https://placehold.co/400x550/18211f/f4efe6?text=No+Poster'
  const summary = stripHtml(show.summary) || 'No synopsis description is available for this title yet.'
  const year = getYear(show.premiered)
  const runtime = show.runtime || show.averageRuntime ? `${show.runtime || show.averageRuntime} min` : 'Series'
  const rating = show.rating?.average ? `${show.rating.average}` : 'Not Rated'

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
      role="presentation"
    >
      <section className="details-modal" role="dialog" aria-modal="true" aria-labelledby="details-title">
        <button className="modal-close" onClick={onClose} aria-label="Close details modal">
          <IconClose size={16} />
        </button>

        <div className="modal-image">
          <img src={poster} alt={`${show.name} poster`} />
        </div>

        <div className="modal-content">
          <p className="eyebrow">
            <span className="eyebrow-dot" /> Show Details
          </p>
          <h2 id="details-title">{show.name}</h2>

          <div className="modal-facts">
            <span><IconStar size={13} /> {rating}</span>
            <span><IconCalendar size={13} /> {year}</span>
            <span><IconClock size={13} /> {runtime}</span>
            <span><IconTv size={13} /> {show.status || 'Active'}</span>
          </div>

          <div className="modal-genre-list">
            {show.genres?.map((genre) => (
              <span key={genre} className="modal-genre-tag">
                {genre}
              </span>
            ))}
          </div>

          <p className="modal-summary">{summary}</p>

          {/* Interactive Watch Status Box */}
          <div className="modal-tracker-box">
            <div className="modal-tracker-header">
              <span>Your Watch Status</span>
              {status && (
                <span style={{
                  color: status === 'watchlist' ? 'var(--watchlist-color)' : 'var(--watched-color)',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px'
                }}>
                  {status === 'watchlist' ? (
                    <>
                      <IconBookmarkFilled size={12} /> In Your Watchlist
                    </>
                  ) : (
                    <>
                      <IconCheckCircle size={12} /> Marked as Watched
                    </>
                  )}
                </span>
              )}
            </div>

            <div className="modal-tracker-buttons">
              <button
                className={`modal-track-btn ${status === 'watchlist' ? 'active-watchlist' : ''}`}
                onClick={onToggleWatchlist}
              >
                <IconBookmark size={15} />
                <span>{status === 'watchlist' ? 'In Watchlist (Saved)' : 'Want to See'}</span>
              </button>

              <button
                className={`modal-track-btn ${status === 'watched' ? 'active-watched' : ''}`}
                onClick={onToggleWatched}
              >
                <IconCheckCircle size={15} />
                <span>{status === 'watched' ? 'Watched (Finished)' : 'Mark as Watched'}</span>
              </button>

              {status && (
                <button
                  className="modal-track-btn"
                  onClick={onRemove}
                  style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                >
                  <IconTrash size={14} />
                  <span>Remove</span>
                </button>
              )}
            </div>
          </div>

          <div className="modal-actions-footer">
            {show.officialSite || show.url ? (
              <a
                className="modal-link"
                href={show.officialSite || show.url}
                target="_blank"
                rel="noreferrer"
              >
                Official Page <IconExternalLink size={13} />
              </a>
            ) : <span />}
          </div>
        </div>
      </section>
    </div>
  )
}
