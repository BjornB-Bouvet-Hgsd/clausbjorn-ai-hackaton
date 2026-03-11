import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCompany, getFinancials, getCompanyNews, getBouvetProjects, getDoffinNotices, CompanyDetails, CompanyFinancials, CompanyNews, BouvetProjectsResponse, DoffinResponse } from '../services/api';
import FinancialTable from '../components/FinancialTable';
import FinancialChart from '../components/FinancialChart';
import NewsList from '../components/NewsList';
import BouvetProjectList from '../components/BouvetProjectList';
import DoffinList from '../components/DoffinList';

type Tab = 'okonomi' | 'nyheter' | 'prosjekter' | 'anbud';

export default function CompanyPage() {
  const { orgnr } = useParams<{ orgnr: string }>();
  const [company, setCompany] = useState<CompanyDetails | null>(null);
  const [financials, setFinancials] = useState<CompanyFinancials | null>(null);
  const [news, setNews] = useState<CompanyNews | null>(null);
  const [bouvetProjects, setBouvetProjects] = useState<BouvetProjectsResponse | null>(null);
  const [doffin, setDoffin] = useState<DoffinResponse | null>(null);
  const [newsLoading, setNewsLoading] = useState(true);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [doffinLoading, setDoffinLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('okonomi');

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

    getCompanyNews(orgnr)
      .then(setNews)
      .catch(() => setNews(null))
      .finally(() => setNewsLoading(false));

    getBouvetProjects(orgnr)
      .then(setBouvetProjects)
      .catch(() => setBouvetProjects(null))
      .finally(() => setProjectsLoading(false));

    getDoffinNotices(orgnr)
      .then(setDoffin)
      .catch(() => setDoffin(null))
      .finally(() => setDoffinLoading(false));
  }, [orgnr]);

  if (loading) return <p><span className="spinner" /> Laster selskapsdata...</p>;
  if (error) return <div className="error-banner">{error} <Link to="/">← Tilbake</Link></div>;
  if (!company) return <p>Fant ikke selskapet.</p>;

  const addr = company.forretningsadresse;
  const finCount = financials?.regnskapsaar.length ?? 0;
  const newsCount = news?.articles.length ?? 0;
  const projectCount = bouvetProjects?.projects.length ?? 0;
  const doffinCount = doffin?.notices.length ?? 0;

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
        <p style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: '#6b7280' }}>
          Se mer på{' '}
          <a href={`https://proff.no/selskap/-/${company.organisasjonsnummer}`} target="_blank" rel="noopener noreferrer">
            Proff.no
          </a>
        </p>
      </div>

      <div className="tabs">
        <button
          className={`tab-button${activeTab === 'okonomi' ? ' active' : ''}`}
          onClick={() => setActiveTab('okonomi')}
        >
          Økonomi
          {finCount > 0 && <span className="tab-badge">{finCount}</span>}
        </button>
        <button
          className={`tab-button${activeTab === 'nyheter' ? ' active' : ''}`}
          onClick={() => setActiveTab('nyheter')}
        >
          Nyheter
          {!newsLoading && newsCount > 0 && <span className="tab-badge">{newsCount}</span>}
        </button>
        <button
          className={`tab-button${activeTab === 'prosjekter' ? ' active' : ''}`}
          onClick={() => setActiveTab('prosjekter')}
        >
          Våre prosjekter
          {!projectsLoading && projectCount > 0 && <span className="tab-badge">{projectCount}</span>}
        </button>
        <button
          className={`tab-button${activeTab === 'anbud' ? ' active' : ''}`}
          onClick={() => setActiveTab('anbud')}
        >
          Anbud
          {!doffinLoading && doffinCount > 0 && <span className="tab-badge">{doffinCount}</span>}
        </button>
      </div>

      {activeTab === 'okonomi' && (
        financials && finCount > 0 ? (
          <>
            <FinancialTable years={financials.regnskapsaar} />
            <FinancialChart years={financials.regnskapsaar} />
          </>
        ) : (
          <p style={{ color: '#6b7280' }}>Ingen regnskapsdata tilgjengelig.</p>
        )
      )}

      {activeTab === 'nyheter' && (
        newsLoading ? (
          <p><span className="spinner" /> Laster nyheter...</p>
        ) : news && newsCount > 0 ? (
          <NewsList articles={news.articles} />
        ) : (
          <p style={{ color: '#6b7280' }}>Ingen nyhetsartikler funnet.</p>
        )
      )}

      {activeTab === 'prosjekter' && (
        projectsLoading ? (
          <p><span className="spinner" /> Søker etter Bouvet-prosjekter...</p>
        ) : bouvetProjects && projectCount > 0 ? (
          <BouvetProjectList projects={bouvetProjects.projects} />
        ) : (
          <p style={{ color: '#6b7280' }}>Ingen Bouvet-prosjekter funnet for dette selskapet.</p>
        )
      )}

      {activeTab === 'anbud' && (
        doffinLoading ? (
          <p><span className="spinner" /> Søker etter anbud på Doffin...</p>
        ) : doffin && doffinCount > 0 ? (
          <DoffinList notices={doffin.notices} />
        ) : (
          <p style={{ color: '#6b7280' }}>Ingen relevante anbud funnet på Doffin.</p>
        )
      )}
    </div>
  );
}
