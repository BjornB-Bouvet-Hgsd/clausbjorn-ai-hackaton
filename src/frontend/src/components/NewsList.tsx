import { NewsArticle } from '../services/api';

interface Props {
  articles: NewsArticle[];
}

export default function NewsList({ articles }: Props) {
  if (articles.length === 0) {
    return <p style={{ color: '#6b7280' }}>Ingen nyhetsartikler funnet.</p>;
  }

  return (
    <div style={{ marginTop: '1.5rem' }}>
      <h3 style={{ marginBottom: '0.75rem', color: '#1D1D1B' }}>Nyheter</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {articles.map((article, i) => (
          <a
            key={i}
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'block',
              background: '#fff',
              padding: '1rem 1.25rem',
              borderRadius: 6,
              border: '1px solid #E0E0DE',
              textDecoration: 'none',
              color: 'inherit',
              transition: 'border-color 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#E8712B')}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#E0E0DE')}
          >
            <div style={{ fontWeight: 600, color: '#1D1D1B', marginBottom: '0.25rem' }}>
              {article.title}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#6B6B6B', marginBottom: '0.35rem' }}>
              {article.source} · {article.publishedAt}
            </div>
            <div
              style={{
                fontSize: '0.9rem',
                color: '#444',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {article.description}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
