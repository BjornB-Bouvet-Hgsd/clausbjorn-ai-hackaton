import { Routes, Route, Link } from 'react-router-dom';
import SearchPage from './pages/SearchPage';
import CompanyPage from './pages/CompanyPage';

export default function App() {
  return (
    <>
      <header style={{
        background: '#FFFFFF',
        borderBottom: '3px solid #E8712B',
        padding: '1rem 1.5rem',
        marginBottom: '2rem',
      }}>
        <div style={{ maxWidth: 960, margin: '0 auto', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="6" fill="#E8712B"/>
            <text x="16" y="22" textAnchor="middle" fill="white" fontSize="18" fontWeight="bold" fontFamily="Helvetica, Arial, sans-serif">B</text>
          </svg>
          <Link to="/" style={{ color: '#1D1D1B', textDecoration: 'none', fontSize: '1.4rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
            Bedriftsøk
          </Link>
        </div>
      </header>
      <main style={{ maxWidth: 960, margin: '0 auto', padding: '0 1.5rem 2rem' }}>
        <Routes>
          <Route path="/" element={<SearchPage />} />
          <Route path="/company/:orgnr" element={<CompanyPage />} />
          <Route path="*" element={
            <div style={{ textAlign: 'center', marginTop: '3rem' }}>
              <h2>404 – Siden finnes ikke</h2>
              <p style={{ marginTop: '0.5rem' }}><Link to="/">Gå til forsiden</Link></p>
            </div>
          } />
        </Routes>
      </main>
    </>
  );
}
