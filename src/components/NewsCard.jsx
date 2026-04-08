function NewsCard({ article }) {
  return (
    <article className={`news-card tone-${article.tone}`}>
      <div className="news-card-image" aria-hidden="true">
        <div className="news-card-glow" />
      </div>

      <div className="news-card-content">
        <span className="news-card-tag">{article.tag}</span>
        <p className="news-card-category">{article.category}</p>
        <h4>{article.title}</h4>
        <p className="news-card-excerpt">{article.excerpt}</p>
        <div className="news-card-meta">
          <span>{article.author}</span>
          <span>{article.time}</span>
        </div>
      </div>
    </article>
  );
}

export default NewsCard;
