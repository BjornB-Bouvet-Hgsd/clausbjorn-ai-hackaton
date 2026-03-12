// --- Brreg Enhetsregisteret types ---

export interface BrregEnhet {
  organisasjonsnummer: string;
  navn: string;
  organisasjonsform?: {
    kode: string;
    beskrivelse: string;
  };
  naeringskode1?: {
    kode: string;
    beskrivelse: string;
  };
  forretningsadresse?: {
    adresse?: string[];
    postnummer?: string;
    poststed?: string;
    kommune?: string;
    land?: string;
  };
  antallAnsatte?: number;
  stiftelsesdato?: string;
  sisteInnsendteAarsregnskap?: string;
  konkurs?: boolean;
  underAvvikling?: boolean;
  underTvangsavviklingEllerTvangsopplosning?: boolean;
}

export interface BrregSokResponse {
  _embedded?: {
    enheter: BrregEnhet[];
  };
  page: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  };
}

// --- Brreg Regnskapsregisteret types ---

export interface BrregRegnskap {
  id: number;
  journalnr: string;
  regnskapstype: string;
  regnskapsperiode: {
    fraDato: string;
    tilDato: string;
  };
  valuta: string;
  avviklingsregnskap: boolean;
  oppstillingsplan: string;
  resultatregnskapResultat?: {
    ordinaertResultatFoerSkattekostnad?: number;
    aarsresultat?: number;
    finansresultat?: {
      nettoFinans?: number;
      finansinntekt?: {
        sumFinansinntekter?: number;
      };
      finanskostnad?: {
        sumFinanskostnad?: number;
      };
    };
    driftsresultat?: {
      driftsresultat?: number;
      driftsinntekter?: {
        sumDriftsinntekter?: number;
      };
      driftskostnad?: {
        sumDriftskostnad?: number;
      };
    };
  };
  eiendeler?: {
    sumEiendeler?: number;
  };
  egenkapitalGjeld?: {
    sumEgenkapitalGjeld?: number;
    egenkapital?: {
      sumEgenkapital?: number;
    };
    gjeldOversikt?: {
      sumGjeld?: number;
    };
  };
}

// --- App API response types ---

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

// --- News API response types ---

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

// --- Bouvet prosjekter ---

export interface BouvetProject {
  tittel: string;
  kunde: string;
  url: string;
  imageUrl?: string;
  bransje: string;
  kompetanseomraader: string[];
}

// --- Roller (People) ---

export interface BrregRollePersonNavn {
  fornavn: string;
  mellomnavn?: string;
  etternavn: string;
}

export interface BrregRollePerson {
  fodselsdato?: string;
  navn: BrregRollePersonNavn;
}

export interface BrregRolle {
  type: { kode: string; beskrivelse: string };
  person?: BrregRollePerson;
  fratraadt?: boolean;
}

export interface BrregRollegruppe {
  type: { kode: string; beskrivelse: string };
  roller: BrregRolle[];
}

export interface BrregRollerResponse {
  rollegrupper: BrregRollegruppe[];
}

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
