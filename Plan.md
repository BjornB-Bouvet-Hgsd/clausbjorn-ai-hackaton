# Plan: Bedriftsøk med økonomiske nøkkeltall (Feature 1)

## TL;DR
Bygge en enkel web-app med søk på virksomhetsnavn / org.nr som viser omsetning og resultat for de siste 3 år. Frontend i React (TypeScript), backend i Node.js (Express/Fastify). Data hentes fra **Brreg Enhetsregisteret** (selskapsdata + søk) og **Brreg Regnskapsregisteret** (årsregnskap med omsettning/resultat). Begge er gratis, åpne API-er under NLOD-lisens.

---

## Datakilder

### 1. Brønnøysund Enhetsregisteret (søk + grunndata)
- **URL**: `GET https://data.brreg.no/enhetsregisteret/api/enheter?navn={søkeord}` (fritekstsøk)
- **URL**: `GET https://data.brreg.no/enhetsregisteret/api/enheter/{orgnr}` (direkte oppslag)
- **Returnerer**: navn, orgnr, org.form, adresse, næringskode, antall ansatte, stiftelsesdato, sisteInnsendteAarsregnskap m.m.
- **Lisens**: NLOD, ingen registrering nødvendig
- **Rate limit**: Må respekteres (cache anbefalt)

### 2. Brønnøysund Regnskapsregisteret (årsregnskap)
- **URL**: `GET https://data.brreg.no/regnskapsregisteret/regnskap/{orgnr}`
- **Returnerer**: Årsregnskap per år inkl.:
  - `sumInntekter` / `salgsinntekter` (omsetning)
  - `aarsresultat` (resultat)
  - `sumEiendeler`, `sumEgenkapitalOgGjeld` m.m.
- **Lisens**: NLOD, gratis
- Returnerer alle tilgjengelige år – vi filtrerer på de siste 3

---

## Relevante filer (skal opprettes)

- `src/backend/src/index.ts` — Express/Fastify server entrypoint
- `src/backend/src/routes/company.ts` — API-ruter for søk og oppslag
- `src/backend/src/services/brreg.ts` — Integrasjon mot Brreg Enhetsregisteret
- `src/backend/src/services/regnskap.ts` — Integrasjon mot Brreg Regnskapsregisteret
- `src/backend/src/types.ts` — TypeScript-typer for API-respons
- `src/frontend/src/App.tsx` — Hoved-app med routing
- `src/frontend/src/pages/SearchPage.tsx` — Søkeside
- `src/frontend/src/pages/CompanyPage.tsx` — Detaljside med økonomitabell
- `src/frontend/src/components/FinancialTable.tsx` — Tabell for omsetning/resultat
- `src/frontend/src/services/api.ts` — API-klient

---

## Verifisering

1. **Backend**: `curl http://localhost:3001/api/company/search?query=Bouvet` → returnerer liste med Bouvet-enheter
2. **Backend**: `curl http://localhost:3001/api/company/946994636/financials` → returnerer 3 år med omsetning/resultat for Bouvet ASA
3. **Frontend**: Søk på "Bouvet" → se treff → klikk → se faktakort med økonomitabell
4. **Edge cases**: Tom søkestreng gir validieringsfeil, ugyldig orgnr gir 404, Brreg nede gir timeout-melding
5. **Responsivt**: Test i Chrome DevTools mobilvisning

---

## Beslutninger
- **Datakilde**: Brreg Regnskapsregisteret (gratis, åpne data) i stedet for Proff.no Premium API (betalt)
- **Backend**: Node.js med Express/Fastify og TypeScript
- **Frontend**: React med TypeScript
- **Scope inkludert**: Søk, grunndata, omsetning+resultat siste 3 år
- **Scope ekskludert**: Nyheter, anbud (egen feature), PDF-eksport, NLP-analyse (roadmap-items)

---

## Implementeringsfaser

### Fase 1 – Prosjektoppsett & backend-skjelett
> **Mål**: Kjørende Express-server med TypeScript som svarer på health-check.

- [x] Initialiser `src/backend` med `npm init`, installer Express, TypeScript, ts-node, nodemon
- [x] Opprett `tsconfig.json` med streng konfigurasjon
- [x] Opprett `src/backend/src/index.ts` med Express-app som lytter på port 3001
- [x] Opprett `src/backend/src/types.ts` med TypeScript-typer for Brreg-respons og egne API-kontrakter
- [x] Verifisering: `curl http://localhost:3001/health` → `{ "status": "ok" }`

### Fase 2 – Brreg-integrasjon (services)
> **Mål**: Fungerende serviceklasser som henter data fra Brreg sine API-er.

- [x] Opprett `src/backend/src/services/brreg.ts` — søk + oppslag mot Enhetsregisteret
- [x] Opprett `src/backend/src/services/regnskap.ts` — hent regnskap + filtrer siste 3 år
- [x] Feilhåndtering: timeout, 404, Brreg nede
- [x] Verifisering: enhetstester eller manuell test av servicefunksjoner isolert

### Fase 3 – API-ruter
> **Mål**: Backend eksponerer REST-endepunkter for frontend.

- [x] Opprett `src/backend/src/routes/company.ts` med ruter:
  - `GET /api/company/search?query=...` — søk
  - `GET /api/company/:orgnr` — grunndata
  - `GET /api/company/:orgnr/financials` — omsetning/resultat siste 3 år
- [x] Input-validering (tom query, ugyldig orgnr-format)
- [x] CORS-konfigurasjon for lokal utvikling
- [x] Verifisering:
  - `curl http://localhost:3001/api/company/search?query=Bouvet` → liste med treff
  - `curl http://localhost:3001/api/company/946994636/financials` → 3 år med tall

### Fase 4 – Frontend-oppsett & søkeside
> **Mål**: React-app med søkefelt som viser treff fra backend.

- [x] Initialiser `src/frontend` med Vite + React + TypeScript
- [x] Opprett `src/frontend/src/services/api.ts` — API-klient mot backend
- [x] Opprett `src/frontend/src/pages/SearchPage.tsx` — søkefelt + resultatliste
- [x] Opprett `src/frontend/src/App.tsx` med React Router
- [x] Verifisering: Søk på "Bouvet" i nettleser → se liste med treff

### Fase 5 – Detaljside med økonomitabell
> **Mål**: Klikk på treff → se faktakort med grunndata og omsetning/resultat siste 3 år.

- [x] Opprett `src/frontend/src/pages/CompanyPage.tsx` — detaljside med grunndata
- [x] Opprett `src/frontend/src/components/FinancialTable.tsx` — tabell med omsetning/resultat
- [x] Koble opp routing: `/company/:orgnr` → CompanyPage
- [x] Verifisering: Klikk på Bouvet → se faktakort med økonomitabell

### Fase 6 – Polish & edge cases
> **Mål**: Produksjonsklar MVP med god feilhåndtering og UX.

- [x] Loading-states og feilmeldinger i frontend
- [x] Tom-søk-validering, 404-håndtering, timeout-melding ved Brreg-nedetid
- [x] Responsivt design (test i Chrome DevTools mobilvisning)
- [x] Lenke til `https://proff.no/selskap/{orgnr}` i faktakortet
- [x] Valgfritt: stolpediagram for omsetning/resultat (Recharts e.l.)

---

## Videre vurderinger
1. **Proff.no-lenke**: Skal vi inkludere en lenke til `https://proff.no/selskap/{orgnr}` som kilde/referanse i faktakortet? Anbefalt ja — gir brukeren tilgang til mer detaljerte data uten at vi trenger Proff API.
2. **Diagram**: Skal omsetning/resultat vises som tabell eller også som diagram (stolpediagram)? Anbefaler å starte med tabell, legge til diagram som polish.

---
---

# Plan: Nyhetsartikler om selskapet (Feature 2)

## TL;DR
Utvide bedriftsøk-appen med en ny seksjon på detaljsiden som viser **nyhetsartikler og saker** som omtaler det aktuelle selskapet. Artikler hentes via **Google News RSS** med selskapsnavn som søkeord. Vises som en kronologisk liste med tittel, kilde, dato og lenke. Ingen API-nøkkel nødvendig.

---

## Datakilde

### Google News RSS (valgt)
- **URL**: `GET https://news.google.com/rss/search?q={selskapsnavn}&hl=no&gl=NO&ceid=NO:no`
- **Fordeler**: Helt gratis, ingen registrering, ingen API-nøkkel, god dekning av norske kilder
- **Returnerer**: RSS/XML med `title`, `link`, `pubDate`, `description`, `source`
- **Autentisering**: Ingen
- **Rate limit**: Ingen offisiell, men fair use
- **Parsing**: `fast-xml-parser` brukes for å parse RSS-feed

---

## Nye / endrede filer

| Fil | Status | Beskrivelse |
|-----|--------|-------------|
| `src/backend/src/services/news.ts` | **Ny** | Integrasjon mot Google News RSS |
| `src/backend/src/routes/company.ts` | Endres | Nytt endepunkt: `GET /api/company/:orgnr/news` |
| `src/backend/src/types.ts` | Endres | Nye typer for nyhetsartikler |
| `src/frontend/src/services/api.ts` | Endres | Ny funksjon `getCompanyNews(orgnr)` |
| `src/frontend/src/components/NewsList.tsx` | **Ny** | Komponent for å vise nyhetsliste |
| `src/frontend/src/pages/CompanyPage.tsx` | Endres | Legger til NewsList-seksjon |

---

## API-kontrakt

### `GET /api/company/:orgnr/news`

**Request**:
```
GET /api/company/:orgnr/news
```

**Response** (200):
```json
{
  "companyName": "Bouvet ASA",
  "articles": [
    {
      "title": "Bouvet leverer sterke resultater i Q3",
      "url": "https://www.dn.no/...",
      "source": "Dagens Næringsliv",
      "publishedAt": "2025-10-15T08:30:00Z",
      "description": "Konsulentselskapet Bouvet ASA rapporterer ...",
      "thumbnailUrl": "https://..."
    }
  ]
}
```

**Feilkoder**:
- `400` — Ugyldig org.nr-format
- `404` — Selskap ikke funnet (kan ikke slå opp selskapsnavn)
- `502` — Nyhets-API utilgjengelig
- `503` — API-nøkkel mangler / ikke konfigurert

---

## Typer (tillegg til `types.ts`)

```typescript
// Brave News Search API respons
export interface BraveNewsResult {
  title: string;
  url: string;
  description: string;
  age: string;
  meta_url?: { favicon?: string };
  thumbnail?: { src?: string };
}

export interface BraveNewsResponse {
  type: string;
  results: BraveNewsResult[];
}

// Vår API-kontrakt
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
```

---

## Implementeringsfaser

### Fase 7 – Nyhets-service (backend)
> **Mål**: Fungerende service som søker etter nyheter om et selskap via Brave Search API.

- [x] Legg til nye typer i `src/backend/src/types.ts` (`NewsArticle`, `CompanyNews`, Brave-responstyper)
- [x] Opprett `src/backend/src/services/news.ts`:
  - Funksjon `searchCompanyNews(companyName: string): Promise<NewsArticle[]>`
  - Kall Brave News Search: `GET https://api.search.brave.com/res/v1/news/search?q={companyName}&count=20&freshness=py3`
  - API-nøkkel fra `process.env.BRAVE_API_KEY`
  - Map Brave-respons til `NewsArticle[]`
  - 10s timeout, feilhåndtering for 401/429/500
  - Returner tom liste ved feil (graceful degradation — nyheter er ikke kritisk)
- [x] Installer `dotenv` for miljøvariabler: `npm install dotenv`
- [x] Opprett `.env`-fil med `BRAVE_API_KEY=din_nøkkel_her` (legg til i `.gitignore`)
- [ ] Verifisering: Manuell test av `searchCompanyNews("Bouvet ASA")` → returnerer artikler

### Fase 8 – Nyhets-endepunkt (backend route)
> **Mål**: Backend eksponerer REST-endepunkt for nyheter.

- [x] Legg til rute i `src/backend/src/routes/company.ts`:
  - `GET /api/company/:orgnr/news`
  - Valider orgnr (9 siffer)
  - Slå opp selskapsnavn via eksisterende `getCompany(orgnr)`
  - Kall `searchCompanyNews(companyName)`
  - Returner `CompanyNews`-objekt
  - Returner `503` hvis `BRAVE_API_KEY` ikke er satt
- [ ] Verifisering:
  - `curl http://localhost:3001/api/company/946994636/news` → artikler om Bouvet
  - `curl http://localhost:3001/api/company/123/news` → 400 feil
  - Test uten API-nøkkel → 503 med forklarende melding

### Fase 9 – Nyhetsvisning (frontend)
> **Mål**: Detaljsiden viser en liste med nyhetsartikler om selskapet.

- [x] Legg til `getCompanyNews(orgnr)` i `src/frontend/src/services/api.ts`
- [x] Opprett `src/frontend/src/components/NewsList.tsx`:
  - Motta `articles: NewsArticle[]` som props
  - Vis hver artikkel som kort med:
    - Tittel (klikkbar lenke, `target="_blank"`, `rel="noopener noreferrer"`)
    - Kilde + publiseringsdato (formatert til norsk dato)
    - Beskrivelse (maks 2 linjer, truncated)
    - Valgfritt: thumbnail-bilde
  - Sorter nyeste først
  - Vis "Ingen nyhetsartikler funnet" hvis tom liste
  - Vis "Nyheter er ikke tilgjengelig" hvis API-feil (graceful degradation)
- [x] Oppdater `src/frontend/src/pages/CompanyPage.tsx`:
  - Hent nyheter med `getCompanyNews(orgnr)` (parallelt med financials)
  - Legg til `<NewsList>` under økonomiseksjonen
  - Separat loading-state for nyheter (ikke blokker resten av siden)
- [ ] Verifisering:
  - Gå til Bouvet-side → se nyhetsseksjon med relevante artikler
  - Klikk på artikkel → åpnes i ny fane
  - Test uten API-nøkkel → nyheter viser "ikke tilgjengelig", resten av siden fungerer

### Fase 10 – Polish & konfigurasjon
> **Mål**: Robust, brukervennlig nyhetsvisning.

- [x] Legg til graceful degradation: nyheter feiler stille (viser melding, blokkerer ikke resten)
- [ ] Dato-formatering: vis "15. oktober 2025" (norsk format)
- [x] Responsivt: nyhetskort stacker vertikalt på mobil
- [ ] Valgfritt: "Vis flere"-knapp hvis > 5 artikler (vis 5 først)
- [ ] Valgfritt: Cache nyhetsresultater i backend (in-memory, 15 min TTL)
- [ ] Oppdater README med informasjon om `BRAVE_API_KEY`-oppsett

---

## Verifisering (end-to-end)

1. **Backend**: `curl http://localhost:3001/api/company/946994636/news` → JSON med nyhetsartikler om Bouvet
2. **Frontend**: Søk "Bouvet" → klikk → scroll ned → se nyhetsseksjon med artikler
3. **Lenker**: Klikk på en artikkel → åpnes i ny fane med riktig URL
4. **Graceful degradation**: Fjern `BRAVE_API_KEY` → nyheter viser "ikke tilgjengelig", økonomi fungerer fortsatt
5. **Edge cases**: Ukjent selskap → "Ingen nyhetsartikler funnet", timeout → feilmelding

---

## Beslutninger
- **API-valg**: Brave Search API (gratis 2 000 kall/mnd, enkel autentisering, støtter norske kilder)
- **Graceful degradation**: Nyheter er "nice-to-have" — feiler stille uten å påvirke resten av appen
- **Parallell lasting**: Nyheter hentes parallelt med økonomidata for å unngå at siden føles treg
- **Sikkerhet**: API-nøkkel kun på backend (aldri eksponert til frontend), lenker har `rel="noopener noreferrer"`
