import { BouvetProject } from '../services/api';

interface Props {
  projects: BouvetProject[];
}

export default function BouvetProjectList({ projects }: Props) {
  if (projects.length === 0) {
    return <p style={{ color: '#6b7280' }}>Ingen Bouvet-prosjekter funnet for dette selskapet.</p>;
  }

  return (
    <div style={{ marginTop: '1.5rem' }}>
      <h3 style={{ marginBottom: '0.75rem', color: '#1D1D1B' }}>Bouvet-prosjekter</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {projects.map((p, i) => (
          <a
            key={i}
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              gap: '1rem',
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
            {p.imageUrl && (
              <img
                src={p.imageUrl}
                alt=""
                style={{
                  width: 160,
                  height: 90,
                  objectFit: 'cover',
                  borderRadius: 4,
                  flexShrink: 0,
                }}
              />
            )}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, color: '#1D1D1B', marginBottom: '0.25rem' }}>
                {p.tittel}
              </div>
              {p.kunde && (
                <div style={{ fontSize: '0.85rem', color: '#6B6B6B', marginBottom: '0.25rem' }}>
                  {p.kunde}
                </div>
              )}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.25rem' }}>
                {p.bransje && (
                  <span style={{
                    fontSize: '0.75rem',
                    background: '#F0F0EE',
                    color: '#1D1D1B',
                    padding: '0.15rem 0.5rem',
                    borderRadius: 12,
                  }}>
                    {p.bransje}
                  </span>
                )}
                {p.kompetanseomraader.map((k, j) => (
                  <span key={j} style={{
                    fontSize: '0.75rem',
                    background: '#FFF3EB',
                    color: '#E8712B',
                    padding: '0.15rem 0.5rem',
                    borderRadius: 12,
                  }}>
                    {k}
                  </span>
                ))}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#E8712B', marginTop: '0.35rem' }}>
                Les mer på bouvet.no →
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
