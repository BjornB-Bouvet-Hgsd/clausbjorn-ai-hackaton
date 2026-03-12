import { PersonRole } from '../services/api';

interface Props {
  dagligLeder: PersonRole | null;
  styreleder: PersonRole | null;
}

const cardStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.05)',
  padding: '1.25rem',
  borderRadius: 8,
  border: '1px solid rgba(255,255,255,0.1)',
};

export default function PeopleList({ dagligLeder, styreleder }: Props) {
  return (
    <div style={{ marginTop: '1.5rem' }}>
      <h3 style={{ marginBottom: '0.75rem', color: '#FFFFFF' }}>Nøkkelpersoner</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <RoleCard label="Daglig leder" person={dagligLeder} />
        <RoleCard label="Styrets leder" person={styreleder} />
      </div>
    </div>
  );
}

function RoleCard({ label, person }: { label: string; person: PersonRole | null }) {
  return (
    <div style={cardStyle}>
      <div style={{ fontSize: '0.8rem', color: '#78FE9C', fontWeight: 600, marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {label}
      </div>
      {person ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontWeight: 600, color: '#FFFFFF', fontSize: '1.05rem' }}>{person.name}</span>
          {person.linkedinSearchUrl && (
            <a
              href={person.linkedinSearchUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Søk på LinkedIn"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                padding: '0.2rem 0.55rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: '#78FE9C',
                border: '1px solid #78FE9C',
                borderRadius: 4,
                textDecoration: 'none',
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(120,254,156,0.1)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              LinkedIn (søk) ↗
            </a>
          )}
        </div>
      ) : (
        <div style={{ color: '#C3D5E1', fontStyle: 'italic' }}>Ikke registrert</div>
      )}
    </div>
  );
}
