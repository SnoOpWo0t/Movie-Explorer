function Hero({ onStartExploring }) {
  return (
    <main>
      <section className="hero">
        <div className="hero-copy">
          <p className="hero-tag">Welcome to Movie Explorer</p>
          <h1>
            Discover Movies & <br />
            <span>TV Shows</span>
          </h1>
          <p className="hero-description">
            Search through thousands of popular titles, check ratings, read summaries, 
            and find your next favorite series to watch.
          </p>
          <div className="hero-actions">
            <button className="primary-button" onClick={onStartExploring}>
              Browse All Shows
            </button>
          </div>
        </div>

        <div className="hero-image-container">
          <img 
            src="https://static.tvmaze.com/uploads/images/original_untouched/81/203625.jpg" 
            alt="Featured show" 
            className="hero-main-poster"
          />
        </div>
      </section>

      <section className="intro-strip">
        <div className="feature-box">
          <h3>🔍 Live Search</h3>
          <p>Quickly search titles by name in real-time.</p>
        </div>
        <div className="feature-box">
          <h3>⭐ Ratings & Info</h3>
          <p>Check ratings, release years, runtimes, and genres.</p>
        </div>
        <div className="feature-box">
          <h3>📺 Official Links</h3>
          <p>Direct links to official show and network pages.</p>
        </div>
      </section>
    </main>
  )
}

export default Hero
