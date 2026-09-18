import { useEffect } from 'react'

function cleanSummary(text) {
  if (!text) return 'No description available for this show.'
  return text.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim()
}

function MovieDetailsModal({ show, onClose }) {
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'auto'
    }
  }, [onClose])

  const poster = show.image?.original || show.image?.medium || 'https://placehold.co/400x550/1f2937/9ca3af?text=No+Poster'
  const summary = cleanSummary(show.summary)
  const year = show.premiered ? show.premiered.slice(0, 4) : 'N/A'
  const rating = show.rating?.average || 'N/A'
  const runtime = show.runtime ? `${show.runtime} mins` : 'Series'
  const officialUrl = show.officialSite || show.url

  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="details-modal">
        <button className="modal-close" onClick={onClose} aria-label="Close modal">
          &times;
        </button>

        <div className="modal-image">
          <img src={poster} alt={show.name} />
        </div>

        <div className="modal-content">
          <h2>{show.name}</h2>

          <div className="modal-facts">
            <span>⭐ Rating: {rating}</span>
            <span>|</span>
            <span>📅 Release: {year}</span>
            <span>|</span>
            <span>⏱️ {runtime}</span>
          </div>

          {show.genres && show.genres.length > 0 && (
            <div className="genre-list">
              {show.genres.map((genre) => (
                <span key={genre} className="genre-badge">{genre}</span>
              ))}
            </div>
          )}

          <div className="summary-section">
            <h4>Overview:</h4>
            <p className="summary-text">{summary}</p>
          </div>

          <div className="modal-actions">
            {officialUrl && (
              <a 
                className="modal-link-button" 
                href={officialUrl} 
                target="_blank" 
                rel="noreferrer"
              >
                Visit Official Website
              </a>
            )}
            <button className="modal-bottom-close" onClick={onClose}>
              ✕ Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MovieDetailsModal
