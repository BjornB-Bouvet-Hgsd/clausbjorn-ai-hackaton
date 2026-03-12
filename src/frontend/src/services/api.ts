export interface CompanySearchResult {
  organisasjonsnummer: string;
  navn: string;
  organisasjonsform?: string;
  poststed?: string;
  naeringskode?: string;
  antallAnsatte?: number;
}

export interface CompanyDetails {
  organisasjonsnummer: string;
  navn: string;
  organisasjonsform?: string;
  naeringskode?: string;
  forretningsadresse?: {
    adresse?: string[];
    postnummer?: string;
    poststed?: string;
  };
  antallAnsatte?: number;
  stiftelsesdato?: string;
  konkurs?: boolean;
}

export interface FinancialYear {
  aar: number;
  sumInntekter?: number;
  aarsresultat?: number;
  driftsresultat?: number;
  sumEiendeler?: number;
  sumEgenkapital?: number;
  sumGjeld?: number;
}

export interface CompanyFinancials {
  organisasjonsnummer: string;
  navn: string;
  regnskapsaar: FinancialYear[];
}

const BASE = '/api/company';

export async function searchCompanies(query: string): Promise<CompanySearchResult[]> {
  const res = await fetch(`${BASE}/search?query=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error('Søk feilet');
  return res.json();
}

export async function getCompany(orgnr: string): Promise<CompanyDetails> {
  const res = await fetch(`${BASE}/${orgnr}`);
  if (!res.ok) throw new Error('Fant ikke selskapet');
  return res.json();
}

export async function getFinancials(orgnr: string): Promise<CompanyFinancials> {
  const res = await fetch(`${BASE}/${orgnr}/financials`);
  if (!res.ok) throw new Error('Fant ikke regnskap');
  return res.json();
}

// --- News ---

export interface NewsArticle {
  title: string;
  url: string;
  source: string;
  publishedAt: string;
  description: string;
  thumbnailUrl?: string;
}

export interface CompanyNews {
  companyName: string;
  articles: NewsArticle[];
}

export async function getCompanyNews(orgnr: string): Promise<CompanyNews> {
  const res = await fetch(`${BASE}/${orgnr}/news`);
  if (!res.ok) throw new Error('Kunne ikke hente nyheter');
  return res.json();
}

// --- Bouvet prosjekter ---

export interface BouvetProject {
  tittel: string;
  kunde: string;
  url: string;
  imageUrl?: string;
  bransje: string;
  kompetanseomraader: string[];
}

export interface BouvetProjectsResponse {
  companyName: string;
  projects: BouvetProject[];
}

export async function getBouvetProjects(orgnr: string): Promise<BouvetProjectsResponse> {
  const res = await fetch(`${BASE}/${orgnr}/bouvet-projects`);
  if (!res.ok) throw new Error('Kunne ikke hente Bouvet-prosjekter');
  return res.json();
}

// --- Personer (roller) ---

export interface PersonRole {
  name: string;
  role: string;
  resigned: boolean;
  linkedinSearchUrl: string | null;
}

export interface CompanyPeople {
  organisasjonsnummer: string;
  dagligLeder: PersonRole | null;
  styreleder: PersonRole | null;
}

export async function getCompanyPeople(orgnr: string): Promise<CompanyPeople> {
  const res = await fetch(`${BASE}/${orgnr}/people`);
  if (!res.ok) throw new Error('Kunne ikke hente personer');
  return res.json();
}

// --- Doffin anbud ---

export interface DoffinNotice {
  notice_id: string;
  title: string;
  description: string;
  contracting_authority: {
    name: string;
    org_number: string;
    region: string;
  };
  cpv_codes: string[];
  estimated_value_nok: number;
  procedure_type: string;
  publication_date: string;
  deadline_date: string;
  status: string;
}

export interface DoffinResponse {
  companyName: string;
  notices: DoffinNotice[];
}

export async function getDoffinNotices(orgnr: string): Promise<DoffinResponse> {
  const res = await fetch(`${BASE}/${orgnr}/doffin`);
  if (!res.ok) throw new Error('Kunne ikke hente anbud');
  return res.json();
}
