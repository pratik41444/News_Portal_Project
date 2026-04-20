// ============================================================================
// NewsCard.jsx - Reusable News Article Card Component
// ============================================================================
// This is a presentational (functional) component that renders a single 
// news article card used in the trending articles grid.
// 
// Props:
// - article (object): Contains article data including:
//   - id: unique identifier
//   - category: article category (e.g., "Tech", "Sports")
//   - title: article headline
//   - excerpt: short summary
//   - author: byline
//   - time: reading time estimate
//   - tone: CSS class for color theming
//   - tag: label badge (e.g., "Hot", "New", "Live")
// ============================================================================

function NewsCard({ article }) {
  return (
    // Article wrapper with dynamic tone-based color styling
    <article className={`news-card tone-${article.tone}`}>
      {/* Visual placeholder for article image/thumbnail */}
      <div className="news-card-image" aria-hidden="true">
        <div className="news-card-glow" />
      </div>

      {/* Article text content and metadata */}
      <div className="news-card-content">
        {/* Tag badge (e.g., "Hot", "New", "Insight") */}
        <span className="news-card-tag">{article.tag}</span>
        
        {/* Category label (e.g., "Markets", "Education") */}
        <p className="news-card-category">{article.category}</p>
        
        {/* Article headline */}
        <h4>{article.title}</h4>
        
        {/* Brief article summary */}
        <p className="news-card-excerpt">{article.excerpt}</p>
        
        {/* Author byline and reading time estimate */}
        <div className="news-card-meta">
          <span>{article.author}</span>
          <span>{article.time}</span>
        </div>
      </div>
    </article>
  );
}

// Export component for use in parent components (e.g., App.jsx)
export default NewsCard;
