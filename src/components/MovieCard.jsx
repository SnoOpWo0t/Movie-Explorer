function MovieCard({ show, onSelectShow }) {
  const posterUrl = show.image?.medium || 'https://placehold.co/300x420/1f2937/9ca3af?text=No+Poster'
  const genres = show.genres && show.genres.length > 0 ? show.genres.join(', ') : 'Television'
  const year = show.premiered ? show.premiered.slice(0, 4) : 'N/A'
  const rating = show.rating?.average ? show.rating.average : 'N/A'

  return (
    <div className="movie-card">
      <div className="poster-container" onClick={() => onSelectShow(show)}>
        <img src={posterUrl} alt={show.name} />
      </div>

      <div className="card-info">
        <h3 className="movie-title">{show.name}</h3>
        <p className="movie-genre">{genres}</p>
        
        <div className="card-footer">
          <span className="movie-rating">⭐ {rating}</span>
          <span className="movie-bullet">•</span>
          <span className="movie-year">📅 {year}</span>
        </div>

        <button className="details-button" onClick={() => onSelectShow(show)}>
          See Details
        </button>
      </div>
    </div>
  )
}

export default MovieCard
