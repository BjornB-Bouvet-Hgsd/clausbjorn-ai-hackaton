import { Router, Request, Response } from 'express';
import { searchCompanies, getCompany, NotFoundError } from '../services/brreg';
import { getFinancials } from '../services/regnskap';
import { searchCompanyNews } from '../services/news';
import { searchBouvetProjects } from '../services/bouvet';
import { searchDoffinNotices } from '../services/doffin';

const router = Router();

// GET /api/company/search?query=...
router.get('/search', async (req: Request, res: Response) => {
  const query = req.query.query as string | undefined;

  if (!query || query.trim().length === 0) {
    res.status(400).json({ error: 'Mangler søkeord (query parameter)' });
    return;
  }

  try {
    const results = await searchCompanies(query.trim());
    res.json(results);
  } catch (err) {
    console.error('Søk feilet:', err);
    res.status(502).json({ error: 'Kunne ikke kontakte Brønnøysundregistrene' });
  }
});

// GET /api/company/:orgnr
router.get('/:orgnr', async (req: Request, res: Response) => {
  const orgnr = req.params.orgnr as string;

  if (!/^\d{9}$/.test(orgnr)) {
    res.status(400).json({ error: 'Ugyldig organisasjonsnummer (må være 9 siffer)' });
    return;
  }

  try {
    const company = await getCompany(orgnr);
    res.json(company);
  } catch (err) {
    if (err instanceof NotFoundError) {
      res.status(404).json({ error: err.message });
      return;
    }
    console.error('Oppslag feilet:', err);
    res.status(502).json({ error: 'Kunne ikke kontakte Brønnøysundregistrene' });
  }
});

// GET /api/company/:orgnr/financials
router.get('/:orgnr/financials', async (req: Request, res: Response) => {
  const orgnr = req.params.orgnr as string;

  if (!/^\d{9}$/.test(orgnr)) {
    res.status(400).json({ error: 'Ugyldig organisasjonsnummer (må være 9 siffer)' });
    return;
  }

  try {
    const financials = await getFinancials(orgnr);
    res.json(financials);
  } catch (err) {
    if (err instanceof NotFoundError) {
      res.status(404).json({ error: err.message });
      return;
    }
    console.error('Regnskap-oppslag feilet:', err);
    res.status(502).json({ error: 'Kunne ikke kontakte Brønnøysundregistrene' });
  }
});

// GET /api/company/:orgnr/news
router.get('/:orgnr/news', async (req: Request, res: Response) => {
  const orgnr = req.params.orgnr as string;

  if (!/^\d{9}$/.test(orgnr)) {
    res.status(400).json({ error: 'Ugyldig organisasjonsnummer (må være 9 siffer)' });
    return;
  }

  try {
    const company = await getCompany(orgnr);
    const articles = await searchCompanyNews(company.navn);
    res.json({ companyName: company.navn, articles });
  } catch (err) {
    if (err instanceof NotFoundError) {
      res.status(404).json({ error: err.message });
      return;
    }
    console.error('Nyhetssøk feilet:', err);
    res.status(502).json({ error: 'Kunne ikke hente nyheter' });
  }
});

// GET /api/company/:orgnr/bouvet-projects
router.get('/:orgnr/bouvet-projects', async (req: Request, res: Response) => {
  const orgnr = req.params.orgnr as string;

  if (!/^\d{9}$/.test(orgnr)) {
    res.status(400).json({ error: 'Ugyldig organisasjonsnummer (må være 9 siffer)' });
    return;
  }

  try {
    const company = await getCompany(orgnr);
    const projects = await searchBouvetProjects(company.navn);
    res.json({ companyName: company.navn, projects });
  } catch (err) {
    if (err instanceof NotFoundError) {
      res.status(404).json({ error: err.message });
      return;
    }
    console.error('Bouvet-prosjekter feilet:', err);
    res.status(502).json({ error: 'Kunne ikke hente Bouvet-prosjekter' });
  }
});

// GET /api/company/:orgnr/doffin
router.get('/:orgnr/doffin', async (req: Request, res: Response) => {
  const orgnr = req.params.orgnr as string;

  if (!/^\d{9}$/.test(orgnr)) {
    res.status(400).json({ error: 'Ugyldig organisasjonsnummer (må være 9 siffer)' });
    return;
  }

  try {
    const company = await getCompany(orgnr);
    const notices = await searchDoffinNotices(company.navn);
    res.json({ companyName: company.navn, notices });
  } catch (err) {
    if (err instanceof NotFoundError) {
      res.status(404).json({ error: err.message });
      return;
    }
    console.error('Doffin-søk feilet:', err);
    res.status(502).json({ error: 'Kunne ikke hente anbud fra Doffin' });
  }
});

export default router;
