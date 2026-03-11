import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCompany, getFinancials, CompanyDetails, CompanyFinancials } from '../services/api';
import FinancialTable from '../components/FinancialTable';
import FinancialChart from '../components/FinancialChart';

export default function CompanyPage() {
  const { orgnr } = useParams<{ orgnr: string }>();
  const [company, setCompany] = useState<CompanyDetails | null>(null);
  const [financials, setFinancials] = useState<CompanyFinancials | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!orgnr) return;
    setLoading(true);
    setError('');

    Promise.all([getCompany(orgnr), getFinancials(orgnr)])
      .then(([comp, fin]) => {
        setCompany(comp);
        setFinancials(fin);
      })
      .catch(() => setError('Kunne ikke hente selskapsdata.'))
      .finally(() => setLoading(false));
  }, [orgnr]);

  if (loading) return <p><span className="spinner" /> Laster selskapsdata...</p>;
  if (error) return <div className="error-banner">{error} <Link to="/">← Tilbake</Link></div>;
  if (!company) return <p>Fant ikke selskapet.</p>;

  const addr = company.forretningsadresse;

  return (
    <div>
      <Link to="/" style={{ fontSize: '0.9rem', marginBottom: '1rem', display: 'inline-block', color: '#E8712B' }}>
        ← Tilbake til søk
      </Link>

      <div style={{ background: '#fff', padding: '1.5rem', borderRadius: 6, border: '1px solid #E0E0DE', marginBottom: '1.5rem' }}>
        <h2 style={{ marginBottom: '0.75rem', color: '#1D1D1B' }}>{company.navn}</h2>
        <table style={{ fontSize: '0.95rem', lineHeight: 2 }}>
          <tbody>
            <tr><td style={{ color: '#6B6B6B', paddingRight: '1.5rem' }}>Org.nr</td><td>{company.organisasjonsnummer}</td></tr>
            {company.organisasjonsform && <tr><td style={{ color: '#6B6B6B', paddingRight: '1.5rem' }}>Type</td><td>{company.organisasjonsform}</td></tr>}
            {company.naeringskode && <tr><td style={{ color: '#6B6B6B', paddingRight: '1.5rem' }}>Næring</td><td>{company.naeringskode}</td></tr>}
            {addr && <tr><td style={{ color: '#6B6B6B', paddingRight: '1.5rem' }}>Adresse</td><td>{[...(addr.adresse ?? []), `${addr.postnummer ?? ''} ${addr.poststed ?? ''}`].join(', ')}</td></tr>}
            {company.antallAnsatte != null && <tr><td style={{ color: '#6B6B6B', paddingRight: '1.5rem' }}>Ansatte</td><td>{company.antallAnsatte}</td></tr>}
            {company.stiftelsesdato && <tr><td style={{ color: '#6B6B6B', paddingRight: '1.5rem' }}>Stiftet</td><td>{company.stiftelsesdato}</td></tr>}
            {company.konkurs && <tr><td style={{ color: '#6B6B6B', paddingRight: '1.5rem' }}>Status</td><td style={{ color: '#C0392B', fontWeight: 600 }}>Under konkurs</td></tr>}
          </tbody>
        </table>
      </div>

      {financials && financials.regnskapsaar.length > 0 ? (
        <>
          <FinancialTable years={financials.regnskapsaar} />
          <FinancialChart years={financials.regnskapsaar} />
        </>
      ) : (
        <p style={{ color: '#6b7280' }}>Ingen regnskapsdata tilgjengelig.</p>
      )}

      <p style={{ marginTop: '1.5rem', fontSize: '0.85rem', color: '#6b7280' }}>
        Se mer på{' '}
        <a href={`https://proff.no/selskap/-/${company.organisasjonsnummer}`} target="_blank" rel="noopener noreferrer">
          Proff.no
        </a>
      </p>
    </div>
  );
}
