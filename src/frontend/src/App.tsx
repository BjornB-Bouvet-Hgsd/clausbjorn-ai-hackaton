import { Routes, Route, Link } from 'react-router-dom';
import SearchPage from './pages/SearchPage';
import CompanyPage from './pages/CompanyPage';

export default function App() {
  return (
    <>
      <header style={{
        background: '#11133C',
        borderBottom: '2px solid #1D43C6',
        padding: '1rem 1.5rem',
        marginBottom: '2rem',
      }}>
        <div style={{ maxWidth: 960, margin: '0 auto', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <svg width="52" height="52" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Concentric radar rings — brighter, fading outward */}
            <circle cx="50" cy="50" r="38" stroke="#4E8BFF" strokeWidth="4" fill="none" opacity="0.25"/>
            <circle cx="50" cy="50" r="28" stroke="#4E8BFF" strokeWidth="3.5" fill="none" opacity="0.5"/>
            <circle cx="50" cy="50" r="18" stroke="#5FA0FF" strokeWidth="3" fill="none" opacity="0.75"/>
            <circle cx="50" cy="50" r="8" stroke="#78FE9C" strokeWidth="2.5" fill="none" opacity="1"/>
            {/* Antenna stick — diagonal from bottom-left through center */}
            <line x1="22" y1="82" x2="58" y2="18" stroke="#4E8BFF" strokeWidth="5" strokeLinecap="round"/>
            {/* Base circle at bottom-left of antenna */}
            <circle cx="25" cy="78" r="8" fill="#78FE9C" opacity="0.8"/>
            {/* Signal dot at top of antenna */}
            <circle cx="56" cy="22" r="5" fill="#CDFE5C"/>
          </svg>
          <Link to="/" style={{ color: '#FFFFFF', textDecoration: 'none', display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
            <span style={{ fontSize: '1.6rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Bouvet</span>
            <span style={{ fontSize: '1.6rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Signal</span>
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
