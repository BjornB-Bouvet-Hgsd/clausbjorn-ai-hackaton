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
