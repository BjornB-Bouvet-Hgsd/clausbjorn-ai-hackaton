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
