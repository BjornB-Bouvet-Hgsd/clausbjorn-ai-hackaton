# Bedriftsøk — Architecture Overview

A company research tool that aggregates public Norwegian business data into a single dashboard. Search for companies, view financials, read news, browse Bouvet project history, and check public procurement notices.

## Tech Stack

| Layer    | Technology                                  |
| -------- | ------------------------------------------- |
| Frontend | React 19, TypeScript, Vite, React Router v7, Recharts |
| Backend  | Node.js, Express 5, TypeScript              |
| Other    | fast-xml-parser (RSS), CORS                 |

No database — all data is fetched on demand from external sources.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│  FRONTEND  (React + Vite, port 5173)                    │
│                                                         │
│  SearchPage ──────────────────► CompanyPage              │
│  /                                /company/:orgnr        │
│                                   ├─ Økonomi (table+chart)│
│                                   ├─ Nyheter             │
│                                   ├─ Bouvet-prosjekter   │
│                                   └─ Doffin-anbud        │
└────────────────────┬────────────────────────────────────┘
                     │  /api/company/*  (Vite proxy)
┌────────────────────▼────────────────────────────────────┐
│  BACKEND  (Express, port 3001)                          │
│                                                         │
│  routes/company.ts  →  services/                        │
│    GET /search           brreg.ts ────────► Brreg       │
│    GET /:orgnr           regnskap.ts ─────► Brreg       │
│    GET /:orgnr/financials                    Regnskap   │
│    GET /:orgnr/news      news.ts ─────────► Google News │
│    GET /:orgnr/bouvet    bouvet.ts ───────► Bouvet.no   │
│    GET /:orgnr/doffin    doffin.ts ───────► (mock data) │
└─────────────────────────────────────────────────────────┘
                     │
        ┌────────────┼─────────────┬──────────────┐
        ▼            ▼             ▼              ▼
  ┌──────────┐ ┌──────────┐ ┌───────────┐ ┌───────────┐
  │  Brreg   │ │  Brreg   │ │  Google   │ │ Bouvet.no │
  │Enhets-   │ │Regnskaps-│ │  News RSS │ │ Search    │
  │registeret│ │registeret│ │           │ │ API       │
  └──────────┘ └──────────┘ └───────────┘ └───────────┘
```

## External Data Sources

### 1. Brønnøysundregistrene — Enhetsregisteret

- **URL:** `https://data.brreg.no/enhetsregisteret/api/enheter`
- **Provides:** Company search results and details — name, org number, business form, address, industry code (NACE), employee count, founding date, bankruptcy status.
- **License:** NLOD (Norwegian open data)
- **Used by:** `brreg.ts` (search + company lookup)

### 2. Brønnøysundregistrene — Regnskapsregisteret

- **URL:** `https://data.brreg.no/regnskapsregisteret/regnskap/{orgnr}`
- **Provides:** Annual financial statements (last 3 years) — revenue, operating result, annual result, total assets, equity, debt.
- **License:** NLOD (Norwegian open data)
- **Used by:** `regnskap.ts`

### 3. Google News RSS

- **URL:** `https://news.google.com/rss/search?q={company}&hl=no&gl=NO&ceid=NO:no`
- **Provides:** Recent news articles about the company — title, link, source, publication date, description snippet.
- **Used by:** `news.ts` (RSS → JSON via fast-xml-parser)

### 4. Bouvet.no Search API

- **URL:** `https://www.bouvet.no/sok/_/service/no.bouvet.bouvet/global-search`
- **Provides:** Bouvet consulting projects for the company — title, customer name, URL, image, tags.
- **Used by:** `bouvet.ts` (filters results to `/prosjekter/` pages, deduplicates)

### 5. Doffin (Mock)

- **Source:** Hardcoded mock data in `doffin.ts`
- **Provides:** Public procurement notices — notice ID, title, contracting authority, estimated value, deadline, status, procedure type.
- **Note:** Not connected to a real API. Contains sample data for two companies.

## Backend API

All endpoints live under `/api/company`:

| Endpoint                      | Purpose                          |
| ----------------------------- | -------------------------------- |
| `GET /search?query={term}`    | Search companies by name         |
| `GET /:orgnr`                 | Company details                  |
| `GET /:orgnr/financials`      | Financial statements (3 years)   |
| `GET /:orgnr/news`            | News articles                    |
| `GET /:orgnr/bouvet-projects` | Bouvet project history           |
| `GET /:orgnr/doffin`          | Procurement notices (mock)       |

Input validation enforces 9-digit org numbers. External API calls use 10–15 second timeouts.

## Frontend Pages

- **`/`** — Search page with text input; displays matching companies as clickable cards.
- **`/company/:orgnr`** — Company detail page with tabbed sections:
  - **Økonomi** — Financial table + bar chart (Recharts)
  - **Nyheter** — News article list
  - **Bouvet-prosjekter** — Project cards with thumbnails
  - **Doffin-anbud** — Procurement notice cards

Company details and financials load immediately. News, Bouvet projects, and Doffin data load in parallel with loading indicators.

## Data Flow

1. User searches on `SearchPage` → frontend calls `GET /api/company/search?query=...`
2. Backend queries Brreg Enhetsregisteret → returns matching companies
3. User clicks a result → navigates to `/company/:orgnr`
4. `CompanyPage` fires parallel requests for details, financials, news, projects, and procurement
5. Backend fetches from the respective external sources and returns JSON
6. Frontend renders each section as data arrives

## Project Structure

```
src/
├── backend/
│   └── src/
│       ├── index.ts            # Express app, CORS, health check
│       ├── types.ts            # Shared TypeScript interfaces
│       ├── routes/company.ts   # REST endpoints + validation
│       └── services/
│           ├── brreg.ts        # Enhetsregisteret client
│           ├── regnskap.ts     # Regnskapsregisteret client
│           ├── news.ts         # Google News RSS parser
│           ├── bouvet.ts       # Bouvet.no search client
│           └── doffin.ts       # Mock Doffin data
└── frontend/
    └── src/
        ├── App.tsx             # Router + layout
        ├── pages/
        │   ├── SearchPage.tsx
        │   └── CompanyPage.tsx
        ├── components/
        │   ├── FinancialTable.tsx
        │   ├── FinancialChart.tsx
        │   ├── NewsList.tsx
        │   ├── BouvetProjectList.tsx
        │   └── DoffinList.tsx
        └── services/api.ts     # Backend API client
```

## Running Locally

```bash
# Backend
cd src/backend
npm install
npm run dev          # port 3001

# Frontend
cd src/frontend
npm install
npm run dev          # port 5173 (proxies /api → backend)
```
