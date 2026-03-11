import { BrregRegnskap, CompanyFinancials, FinancialYear } from '../types';
import { getCompany, NotFoundError } from './brreg';

const REGNSKAP_BASE_URL = 'https://data.brreg.no/regnskapsregisteret/regnskap';
const TIMEOUT_MS = 10_000;
const MAX_YEARS = 3;

export async function getFinancials(orgnr: string): Promise<CompanyFinancials> {
  // Hent selskapsinfo for navn
  const company = await getCompany(orgnr);

  const url = `${REGNSKAP_BASE_URL}/${encodeURIComponent(orgnr)}`;
  const response = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS) });

  if (response.status === 404) {
    throw new NotFoundError(`Fant ingen regnskap for orgnr ${orgnr}`);
  }

  if (!response.ok) {
    throw new Error(`Regnskapsregisteret feilet med status ${response.status}`);
  }

  const regnskaper = (await response.json()) as BrregRegnskap[];

  const years = regnskaper
    .map(mapToFinancialYear)
    .sort((a, b) => b.aar - a.aar)
    .slice(0, MAX_YEARS);

  return {
    organisasjonsnummer: orgnr,
    navn: company.navn,
    regnskapsaar: years,
  };
}

function mapToFinancialYear(regnskap: BrregRegnskap): FinancialYear {
  const year = new Date(regnskap.regnskapsperiode.tilDato).getFullYear();
  const r = regnskap.resultatregnskapResultat;
  const e = regnskap.eiendeler;
  const eg = regnskap.egenkapitalGjeld;

  return {
    aar: year,
    sumInntekter: r?.driftsresultat?.driftsinntekter?.sumDriftsinntekter,
    driftsresultat: r?.driftsresultat?.driftsresultat,
    aarsresultat: r?.aarsresultat,
    sumEiendeler: e?.sumEiendeler,
    sumEgenkapital: eg?.egenkapital?.sumEgenkapital,
    sumGjeld: eg?.gjeldOversikt?.sumGjeld,
  };
}
