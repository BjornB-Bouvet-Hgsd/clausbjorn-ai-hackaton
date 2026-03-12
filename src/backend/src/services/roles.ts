import {
  BrregRollerResponse,
  CompanyPeople,
  PersonRole,
} from '../types';
import { NotFoundError } from './brreg';
import { generateLinkedInSearchUrl } from './linkedin';

const BRREG_BASE_URL = 'https://data.brreg.no/enhetsregisteret/api';
const TIMEOUT_MS = 10_000;

export async function getCompanyRoles(orgnr: string, companyName: string): Promise<CompanyPeople> {
  const url = `${BRREG_BASE_URL}/enheter/${encodeURIComponent(orgnr)}/roller`;

  const response = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS) });

  if (response.status === 404) {
    throw new NotFoundError(`Fant ingen roller for orgnr ${orgnr}`);
  }

  if (!response.ok) {
    throw new Error(`Brreg roller-oppslag feilet med status ${response.status}`);
  }

  const data = (await response.json()) as BrregRollerResponse;

  const dagligLeder = findDagligLeder(data, companyName);
  const styreleder = findStyreleder(data, companyName);

  return {
    organisasjonsnummer: orgnr,
    dagligLeder,
    styreleder,
  };
}

function findDagligLeder(data: BrregRollerResponse, companyName: string): PersonRole | null {
  const gruppe = data.rollegrupper?.find((g) => g.type.kode === 'DAGL');
  if (!gruppe) return null;

  const rolle = gruppe.roller?.find((r) => !r.fratraadt && r.person);
  if (!rolle?.person) return null;

  const name = formatName(rolle.person.navn);
  return {
    name,
    role: 'Daglig leder',
    resigned: false,
    linkedinSearchUrl: generateLinkedInSearchUrl(name, companyName),
  };
}

function findStyreleder(data: BrregRollerResponse, companyName: string): PersonRole | null {
  const gruppe = data.rollegrupper?.find((g) => g.type.kode === 'STYR');
  if (!gruppe) return null;

  const rolle = gruppe.roller?.find((r) => r.type.kode === 'LEDE' && !r.fratraadt && r.person);
  if (!rolle?.person) return null;

  const name = formatName(rolle.person.navn);
  return {
    name,
    role: 'Styrets leder',
    resigned: false,
    linkedinSearchUrl: generateLinkedInSearchUrl(name, companyName),
  };
}

function formatName(navn: { fornavn: string; mellomnavn?: string; etternavn: string }): string {
  return [navn.fornavn, navn.mellomnavn, navn.etternavn].filter(Boolean).join(' ');
}
