import { BouvetProject } from '../types';

const BOUVET_SEARCH_API = 'https://www.bouvet.no/sok/_/service/no.bouvet.bouvet/global-search';
const BOUVET_BASE_URL = 'https://www.bouvet.no';
const TIMEOUT_MS = 15_000;
const MAX_PROJECTS = 10;

interface SearchHit {
  type: string;
  heading: string;
  url: string;
  lead?: string;
  image?: { src?: string; thumbnail?: string };
}

export async function searchBouvetProjects(companyName: string): Promise<BouvetProject[]> {
  const searchTerms = buildSearchTerms(companyName);
  const seen = new Set<string>();
  const results: BouvetProject[] = [];

  for (const term of searchTerms) {
    if (results.length >= MAX_PROJECTS) break;

    const url = `${BOUVET_SEARCH_API}?query=${encodeURIComponent(term)}`;
    const response = await fetch(url, {
      signal: AbortSignal.timeout(TIMEOUT_MS),
      headers: { 'Accept': 'application/json' },
    });

    if (!response.ok) continue;

    const data = await response.json() as { hits: SearchHit[] };
    if (!data.hits || !Array.isArray(data.hits)) continue;

    // Filtrer til kun prosjekter (URL starter med /prosjekter/)
    const projectHits = data.hits.filter((h) => h.url?.startsWith('/prosjekter/'));

    for (const hit of projectHits) {
      if (seen.has(hit.url) || results.length >= MAX_PROJECTS) continue;
      seen.add(hit.url);

      const imgSrc = hit.image?.thumbnail ?? hit.image?.src;

      results.push({
        tittel: hit.heading,
        kunde: hit.type,
        url: `${BOUVET_BASE_URL}${hit.url}`,
        imageUrl: imgSrc
          ? (imgSrc.startsWith('http') ? imgSrc : `${BOUVET_BASE_URL}/${imgSrc}`)
          : undefined,
        bransje: '',
        kompetanseomraader: [],
      });
    }
  }

  return results;
}

function buildSearchTerms(companyName: string): string[] {
  const lower = companyName.toLowerCase();

  // Fjern vanlige suffiks
  const cleaned = lower
    .replace(/\b(as|asa|holding|group|norge|norway|konsern)\b/gi, '')
    .trim()
    .replace(/\s+/g, ' ');

  const terms: string[] = [];

  if (cleaned.length > 2) {
    terms.push(cleaned);
  }

  // Legg til hvert vesentlige ord (> 3 bokstaver) som egen term
  const words = cleaned.split(' ').filter((w) => w.length > 3);
  for (const word of words) {
    if (!terms.includes(word)) {
      terms.push(word);
    }
  }

  return terms;
}
