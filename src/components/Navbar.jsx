function Navbar({ activeTab, setActiveTab, onExploreClick }) {
  return (
    <header className="site-header">
      <div className="brand" onClick={() => setActiveTab('home')}>
        <span className="brand-logo">🎬</span>
        <span className="brand-title">MovieExplorer</span>
      </div>

      <nav className="main-nav">
        <button 
          className={activeTab === 'home' ? 'active' : ''} 
          onClick={() => setActiveTab('home')}
        >
          Home
        </button>
        <button 
          className={activeTab === 'movies' ? 'active' : ''} 
          onClick={onExploreClick}
        >
          Browse
        </button>
      </nav>

      <button className="header-cta" onClick={onExploreClick}>
        Explore Shows
      </button>
    </header>
  )
}

export default Navbar
