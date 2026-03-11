import { DoffinNotice } from '../services/api';

interface Props {
  notices: DoffinNotice[];
}

function formatNOK(value: number): string {
  return value.toLocaleString('nb-NO', { style: 'currency', currency: 'NOK', maximumFractionDigits: 0 });
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('nb-NO', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function DoffinList({ notices }: Props) {
  if (notices.length === 0) {
    return <p style={{ color: '#6b7280' }}>Ingen relevante anbud funnet på Doffin.</p>;
  }

  return (
    <div style={{ marginTop: '1.5rem' }}>
      <h3 style={{ marginBottom: '0.75rem', color: '#1D1D1B' }}>Anbud fra Doffin</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {notices.map((notice) => (
          <a
            key={notice.notice_id}
            href={`https://doffin.no/notices/${notice.notice_id}`}
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
              {notice.title}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#6B6B6B', marginBottom: '0.35rem' }}>
              {notice.contracting_authority.name} · {notice.contracting_authority.region} · {notice.status}
            </div>
            <div
              style={{
                fontSize: '0.9rem',
                color: '#444',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                marginBottom: '0.5rem',
              }}
            >
              {notice.description}
            </div>
            <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.8rem', color: '#6B6B6B' }}>
              <span>Frist: {formatDate(notice.deadline_date)}</span>
              <span>Verdi: {formatNOK(notice.estimated_value_nok)}</span>
              <span>{notice.procedure_type}</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
