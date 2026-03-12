import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCompany, getFinancials, getCompanyNews, getBouvetProjects, getDoffinNotices, getCompanyPeople, CompanyDetails, CompanyFinancials, CompanyNews, BouvetProjectsResponse, DoffinResponse, CompanyPeople } from '../services/api';
import FinancialTable from '../components/FinancialTable';
import FinancialChart from '../components/FinancialChart';
import NewsList from '../components/NewsList';
import BouvetProjectList from '../components/BouvetProjectList';
import DoffinList from '../components/DoffinList';
import PeopleList from '../components/PeopleList';

type Tab = 'okonomi' | 'nyheter' | 'prosjekter' | 'anbud' | 'personer';

export default function CompanyPage() {
  const { orgnr } = useParams<{ orgnr: string }>();
  const [company, setCompany] = useState<CompanyDetails | null>(null);
  const [financials, setFinancials] = useState<CompanyFinancials | null>(null);
  const [news, setNews] = useState<CompanyNews | null>(null);
  const [bouvetProjects, setBouvetProjects] = useState<BouvetProjectsResponse | null>(null);
  const [doffin, setDoffin] = useState<DoffinResponse | null>(null);
  const [people, setPeople] = useState<CompanyPeople | null>(null);
  const [newsLoading, setNewsLoading] = useState(true);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [doffinLoading, setDoffinLoading] = useState(true);
  const [peopleLoading, setPeopleLoading] = useState(true);
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

    getCompanyPeople(orgnr)
      .then(setPeople)
      .catch(() => setPeople(null))
      .finally(() => setPeopleLoading(false));
  }, [orgnr]);

  if (loading) return <p><span className="spinner" /> Laster selskapsdata...</p>;
  if (error) return <div className="error-banner">{error} <Link to="/">← Tilbake</Link></div>;
  if (!company) return <p>Fant ikke selskapet.</p>;

  const addr = company.forretningsadresse;
  const finCount = financials?.regnskapsaar.length ?? 0;
  const newsCount = news?.articles.length ?? 0;
  const projectCount = bouvetProjects?.projects.length ?? 0;
  const doffinCount = doffin?.notices.length ?? 0;
  const peopleCount = (people?.dagligLeder ? 1 : 0) + (people?.styreleder ? 1 : 0);

  return (
    <div>
      <Link to="/" style={{ fontSize: '0.9rem', marginBottom: '1rem', display: 'inline-block', color: '#78FE9C' }}>
        ← Tilbake til søk
      </Link>

      <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', marginBottom: '1.5rem' }}>
        <h2 style={{ marginBottom: '0.75rem', color: '#FFFFFF' }}>{company.navn}</h2>
        <table style={{ fontSize: '0.95rem', lineHeight: 2 }}>
          <tbody>
            <tr><td style={{ color: '#C3D5E1', paddingRight: '1.5rem' }}>Org.nr</td><td style={{ color: '#FFFFFF' }}>{company.organisasjonsnummer}</td></tr>
            {company.organisasjonsform && <tr><td style={{ color: '#C3D5E1', paddingRight: '1.5rem' }}>Type</td><td style={{ color: '#FFFFFF' }}>{company.organisasjonsform}</td></tr>}
            {company.naeringskode && <tr><td style={{ color: '#C3D5E1', paddingRight: '1.5rem' }}>Næring</td><td style={{ color: '#FFFFFF' }}>{company.naeringskode}</td></tr>}
            {addr && <tr><td style={{ color: '#C3D5E1', paddingRight: '1.5rem' }}>Adresse</td><td style={{ color: '#FFFFFF' }}>{[...(addr.adresse ?? []), `${addr.postnummer ?? ''} ${addr.poststed ?? ''}`].join(', ')}</td></tr>}
            {company.antallAnsatte != null && <tr><td style={{ color: '#C3D5E1', paddingRight: '1.5rem' }}>Ansatte</td><td style={{ color: '#FFFFFF' }}>{company.antallAnsatte}</td></tr>}
            {company.stiftelsesdato && <tr><td style={{ color: '#C3D5E1', paddingRight: '1.5rem' }}>Stiftet</td><td style={{ color: '#FFFFFF' }}>{company.stiftelsesdato}</td></tr>}
            {company.konkurs && <tr><td style={{ color: '#C3D5E1', paddingRight: '1.5rem' }}>Status</td><td style={{ color: '#EE2950', fontWeight: 600 }}>Under konkurs</td></tr>}
          </tbody>
        </table>
        <p style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: '#C3D5E1' }}>
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
        <button
          className={`tab-button${activeTab === 'personer' ? ' active' : ''}`}
          onClick={() => setActiveTab('personer')}
        >
          Personer
          {!peopleLoading && peopleCount > 0 && <span className="tab-badge">{peopleCount}</span>}
        </button>
      </div>

      {activeTab === 'okonomi' && (
        financials && finCount > 0 ? (
          <>
            <FinancialTable years={financials.regnskapsaar} />
            <FinancialChart years={financials.regnskapsaar} />
          </>
        ) : (
          <p style={{ color: '#C3D5E1' }}>Ingen regnskapsdata tilgjengelig.</p>
        )
      )}

      {activeTab === 'nyheter' && (
        newsLoading ? (
          <p><span className="spinner" /> Laster nyheter...</p>
        ) : news && newsCount > 0 ? (
          <NewsList articles={news.articles} />
        ) : (
          <p style={{ color: '#C3D5E1' }}>Ingen nyhetsartikler funnet.</p>
        )
      )}

      {activeTab === 'prosjekter' && (
        projectsLoading ? (
          <p><span className="spinner" /> Søker etter Bouvet-prosjekter...</p>
        ) : bouvetProjects && projectCount > 0 ? (
          <BouvetProjectList projects={bouvetProjects.projects} />
        ) : (
          <p style={{ color: '#C3D5E1' }}>Ingen Bouvet-prosjekter funnet for dette selskapet.</p>
        )
      )}

      {activeTab === 'anbud' && (
        doffinLoading ? (
          <p><span className="spinner" /> Søker etter anbud på Doffin...</p>
        ) : doffin && doffinCount > 0 ? (
          <DoffinList notices={doffin.notices} />
        ) : (
          <p style={{ color: '#C3D5E1' }}>Ingen relevante anbud funnet på Doffin.</p>
        )
      )}

      {activeTab === 'personer' && (
        peopleLoading ? (
          <p><span className="spinner" /> Henter nøkkelpersoner...</p>
        ) : people ? (
          <PeopleList dagligLeder={people.dagligLeder} styreleder={people.styreleder} />
        ) : (
          <p style={{ color: '#C3D5E1' }}>Kunne ikke hente roller for dette selskapet.</p>
        )
      )}
    </div>
  );
}
