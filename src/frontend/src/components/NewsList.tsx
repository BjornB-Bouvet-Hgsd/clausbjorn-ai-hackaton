import { NewsArticle } from '../services/api';

interface Props {
  articles: NewsArticle[];
}

export default function NewsList({ articles }: Props) {
  if (articles.length === 0) {
    return <p style={{ color: '#C3D5E1' }}>Ingen nyhetsartikler funnet.</p>;
  }

  return (
    <div style={{ marginTop: '1.5rem' }}>
      <h3 style={{ marginBottom: '0.75rem', color: '#FFFFFF' }}>Nyheter</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {articles.map((article, i) => (
          <a
            key={i}
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'block',
              background: 'rgba(255,255,255,0.05)',
              padding: '1rem 1.25rem',
              borderRadius: 8,
              border: '1px solid rgba(255,255,255,0.1)',
              textDecoration: 'none',
              color: 'inherit',
              transition: 'border-color 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#1D43C6')}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
          >
            <div style={{ fontWeight: 600, color: '#FFFFFF', marginBottom: '0.25rem' }}>
              {article.title}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#C3D5E1', marginBottom: '0.35rem' }}>
              {article.source} · {article.publishedAt}
            </div>
            <div
              style={{
                fontSize: '0.9rem',
                color: '#C3D5E1',
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
