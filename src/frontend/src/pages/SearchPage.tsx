import { useState } from 'react';
import { Link } from 'react-router-dom';
import { searchCompanies, CompanySearchResult } from '../services/api';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<CompanySearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    setLoading(true);
    setError('');
    setSearched(true);
    try {
      const data = await searchCompanies(trimmed);
      setResults(data);
    } catch {
      setError('Kunne ikke utføre søk. Prøv igjen.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <form onSubmit={handleSearch} className="search-form" style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Søk på bedriftsnavn eller org.nr..."
          style={{
            flex: 1,
            padding: '0.75rem 1rem',
            fontSize: '1rem',
            border: '2px solid rgba(255,255,255,0.15)',
            borderRadius: 8,
            outline: 'none',
            transition: 'border-color 0.15s',
            background: 'rgba(255,255,255,0.05)',
            color: '#FFFFFF',
          }}
          onFocus={(e) => e.currentTarget.style.borderColor = '#1D43C6'}
          onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '0.75rem 1.5rem',
            fontSize: '1rem',
            background: '#1D43C6',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            cursor: 'pointer',
            fontWeight: 600,
            transition: 'background 0.15s',
          }}
          onMouseOver={(e) => e.currentTarget.style.background = '#1639A8'}
          onMouseOut={(e) => e.currentTarget.style.background = '#1D43C6'}
        >
          {loading ? 'Søker...' : 'Søk'}
        </button>
      </form>

      {error && <div className="error-banner">{error}</div>}

      {searched && !loading && results.length === 0 && !error && (
        <p style={{ color: '#C3D5E1' }}>Ingen treff.</p>
      )}

      {results.length > 0 && (
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {results.map((r) => (
            <li
              key={r.organisasjonsnummer}
              style={{
                background: 'rgba(255,255,255,0.05)',
                padding: '1rem 1.25rem',
                borderRadius: 8,
                border: '1px solid rgba(255,255,255,0.1)',
                transition: 'border-color 0.15s, background 0.15s',
              }}
              onMouseOver={(e) => { e.currentTarget.style.borderColor = '#1D43C6'; e.currentTarget.style.background = 'rgba(29,67,198,0.1)'; }}
              onMouseOut={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
            >
              <Link
                to={`/company/${r.organisasjonsnummer}`}
                style={{ fontSize: '1.1rem', fontWeight: 600, color: '#FFFFFF' }}
              >
                {r.navn}
              </Link>
              <div style={{ color: '#C3D5E1', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                {r.organisasjonsnummer}
                {r.organisasjonsform && ` · ${r.organisasjonsform}`}
                {r.poststed && ` · ${r.poststed}`}
                {r.antallAnsatte != null && ` · ${r.antallAnsatte} ansatte`}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
