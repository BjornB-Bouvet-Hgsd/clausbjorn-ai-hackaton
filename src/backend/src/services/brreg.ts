import {
  BrregEnhet,
  BrregSokResponse,
  CompanySearchResult,
  CompanyDetails,
} from '../types';

const BRREG_BASE_URL = 'https://data.brreg.no/enhetsregisteret/api';
const TIMEOUT_MS = 10_000;

export async function searchCompanies(query: string): Promise<CompanySearchResult[]> {
  const url = `${BRREG_BASE_URL}/enheter?navn=${encodeURIComponent(query)}&size=20`;

  const response = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS) });

  if (!response.ok) {
    throw new Error(`Brreg søk feilet med status ${response.status}`);
  }

  const data = (await response.json()) as BrregSokResponse;

  if (!data._embedded?.enheter) {
    return [];
  }

  return data._embedded.enheter.map(mapToSearchResult);
}

export async function getCompany(orgnr: string): Promise<CompanyDetails> {
  const url = `${BRREG_BASE_URL}/enheter/${encodeURIComponent(orgnr)}`;

  const response = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS) });

  if (response.status === 404) {
    throw new NotFoundError(`Fant ingen enhet med orgnr ${orgnr}`);
  }

  if (!response.ok) {
    throw new Error(`Brreg oppslag feilet med status ${response.status}`);
  }

  const enhet = (await response.json()) as BrregEnhet;
  return mapToCompanyDetails(enhet);
}

function mapToSearchResult(enhet: BrregEnhet): CompanySearchResult {
  return {
    organisasjonsnummer: enhet.organisasjonsnummer,
    navn: enhet.navn,
    organisasjonsform: enhet.organisasjonsform?.beskrivelse,
    poststed: enhet.forretningsadresse?.poststed,
    naeringskode: enhet.naeringskode1?.beskrivelse,
    antallAnsatte: enhet.antallAnsatte,
  };
}

function mapToCompanyDetails(enhet: BrregEnhet): CompanyDetails {
  return {
    organisasjonsnummer: enhet.organisasjonsnummer,
    navn: enhet.navn,
    organisasjonsform: enhet.organisasjonsform?.beskrivelse,
    naeringskode: enhet.naeringskode1?.beskrivelse,
    forretningsadresse: enhet.forretningsadresse
      ? {
          adresse: enhet.forretningsadresse.adresse,
          postnummer: enhet.forretningsadresse.postnummer,
          poststed: enhet.forretningsadresse.poststed,
        }
      : undefined,
    antallAnsatte: enhet.antallAnsatte,
    stiftelsesdato: enhet.stiftelsesdato,
    konkurs: enhet.konkurs,
  };
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}
