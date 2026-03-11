import { DoffinNotice } from '../types';

const mockNotices: DoffinNotice[] = [
  // --- Arriva Shipping AS ---
  {
    notice_id: 'DOF-550e8400-e29b-41d4-a716-446655440001',
    title: 'Anskaffelse av dataplattform for flåte- og logistikkdata',
    description:
      'Arriva Shipping AS inviterer til åpen anbudskonkurranse for etablering av skybasert dataplattform for sanntidsanalyse av fartøysdata, ruteoptimalisering, drivstofforbruk og integrasjon mot eksisterende ERP-system. Løsningen skal støtte prediktivt vedlikehold og rapportering knyttet til ESG-krav.',
    contracting_authority: {
      name: 'Arriva Shipping AS',
      org_number: '921456789',
      region: 'Vestland',
    },
    cpv_codes: ['72200000', '72300000'],
    estimated_value_nok: 12500000,
    procedure_type: 'Åpen anbudskonkurranse',
    publication_date: '2025-03-11',
    deadline_date: '2025-04-25',
    status: 'Open',
  },
  {
    notice_id: 'DOF-550e8400-e29b-41d4-a716-446655440002',
    title: 'Anskaffelse av IoT-løsning for overvåkning av skip og kaiinfrastruktur',
    description:
      'Arriva Shipping AS ønsker tilbud på sensorbasert IoT-løsning for overvåkning av motorstatus, vibrasjoner og energiforbruk på skip, samt overvåkning av kaiinfrastruktur. Løsningen skal integreres med eksisterende Azure-miljø og legge til rette for prediktiv analyse og varsling.',
    contracting_authority: {
      name: 'Arriva Shipping AS',
      org_number: '921456789',
      region: 'Vestland',
    },
    cpv_codes: ['48000000', '72227000'],
    estimated_value_nok: 8900000,
    procedure_type: 'Konkurranse med forhandling',
    publication_date: '2025-03-11',
    deadline_date: '2025-04-15',
    status: 'Open',
  },
  {
    notice_id: 'DOF-550e8400-e29b-41d4-a716-446655440003',
    title: 'Anskaffelse av CRM-system for kunde- og kontraktsoppfølging',
    description:
      'Arriva Shipping AS har behov for nytt CRM-system for håndtering av kunder, kontrakter og salgsprosesser. Systemet skal støtte integrasjon mot økonomisystem og rapporteringsverktøy, samt legge til rette for automatiserte arbeidsprosesser og analyse av kundedata.',
    contracting_authority: {
      name: 'Arriva Shipping AS',
      org_number: '921456789',
      region: 'Vestland',
    },
    cpv_codes: ['72200000', '48000000'],
    estimated_value_nok: 4700000,
    procedure_type: 'Åpen anbudskonkurranse',
    publication_date: '2025-03-11',
    deadline_date: '2025-04-10',
    status: 'Open',
  },

  // --- Kolumbus AS ---
  {
    notice_id: 'DOF-9f1c2a10-8a44-4b8e-9a11-100000000001',
    title: 'Anskaffelse av dataplattform for sanntidsanalyse av kollektivtrafikk',
    description:
      'Kolumbus AS inviterer til åpen anbudskonkurranse for etablering av skybasert dataplattform for innsamling og analyse av sanntidsdata fra busser, hurtigbåter og billettsystemer. Løsningen skal støtte ruteoptimalisering, kapasitetsanalyse, prediktivt vedlikehold og rapportering knyttet til klima- og bærekraftsmål.',
    contracting_authority: {
      name: 'Kolumbus AS',
      org_number: '918862158',
      region: 'Rogaland',
    },
    cpv_codes: ['72200000', '72300000'],
    estimated_value_nok: 18500000,
    procedure_type: 'Åpen anbudskonkurranse',
    publication_date: '2025-03-11',
    deadline_date: '2025-04-30',
    status: 'Open',
  },
  {
    notice_id: 'DOF-9f1c2a10-8a44-4b8e-9a11-100000000002',
    title: 'Anskaffelse av IoT- og sensorløsning for overvåkning av bussflåte',
    description:
      'Kolumbus AS ønsker tilbud på IoT-basert løsning for overvåkning av kjøretøydata, inkludert batteristatus for elbusser, energiforbruk, temperatur og teknisk tilstand. Løsningen skal integreres med eksisterende Azure-miljø og legge til rette for sanntidsvarsling og prediktiv analyse.',
    contracting_authority: {
      name: 'Kolumbus AS',
      org_number: '918862158',
      region: 'Rogaland',
    },
    cpv_codes: ['48000000', '72227000'],
    estimated_value_nok: 9600000,
    procedure_type: 'Konkurranse med forhandling',
    publication_date: '2025-03-11',
    deadline_date: '2025-04-20',
    status: 'Open',
  },
  {
    notice_id: 'DOF-9f1c2a10-8a44-4b8e-9a11-100000000003',
    title: 'Anskaffelse av CRM- og kundedialogplattform for mobilitetstjenester',
    description:
      'Kolumbus AS har behov for nytt CRM-system for håndtering av kundedialog, abonnementer og partneravtaler innen mobilitetstjenester. Systemet skal støtte integrasjon mot billettsystem, betalingsløsninger og analyseverktøy, samt bidra til automatisert oppfølging og forbedret kundeinnsikt.',
    contracting_authority: {
      name: 'Kolumbus AS',
      org_number: '918862158',
      region: 'Rogaland',
    },
    cpv_codes: ['72200000', '48000000'],
    estimated_value_nok: 6200000,
    procedure_type: 'Åpen anbudskonkurranse',
    publication_date: '2025-03-11',
    deadline_date: '2025-04-15',
    status: 'Open',
  },
];

export async function searchDoffinNotices(companyName: string): Promise<DoffinNotice[]> {
  const q = companyName.toLowerCase();
  return mockNotices.filter(
    (n) =>
      n.contracting_authority.name.toLowerCase().includes(q) ||
      n.title.toLowerCase().includes(q) ||
      n.description.toLowerCase().includes(q),
  );
}
