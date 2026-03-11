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
            border: '2px solid #E0E0DE',
            borderRadius: 6,
            outline: 'none',
            transition: 'border-color 0.15s',
          }}
          onFocus={(e) => e.currentTarget.style.borderColor = '#E8712B'}
          onBlur={(e) => e.currentTarget.style.borderColor = '#E0E0DE'}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '0.75rem 1.5rem',
            fontSize: '1rem',
            background: '#E8712B',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
            fontWeight: 600,
            transition: 'background 0.15s',
          }}
          onMouseOver={(e) => e.currentTarget.style.background = '#D4631F'}
          onMouseOut={(e) => e.currentTarget.style.background = '#E8712B'}
        >
          {loading ? 'Søker...' : 'Søk'}
        </button>
      </form>

      {error && <div className="error-banner">{error}</div>}

      {searched && !loading && results.length === 0 && !error && (
        <p style={{ color: '#6b7280' }}>Ingen treff.</p>
      )}

      {results.length > 0 && (
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {results.map((r) => (
            <li
              key={r.organisasjonsnummer}
              style={{
                background: '#fff',
                padding: '1rem 1.25rem',
                borderRadius: 6,
                border: '1px solid #E0E0DE',
                transition: 'box-shadow 0.15s',
              }}
              onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)'}
              onMouseOut={(e) => e.currentTarget.style.boxShadow = 'none'}
            >
              <Link
                to={`/company/${r.organisasjonsnummer}`}
                style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1D1D1B' }}
              >
                {r.navn}
              </Link>
              <div style={{ color: '#6B6B6B', fontSize: '0.9rem', marginTop: '0.25rem' }}>
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
