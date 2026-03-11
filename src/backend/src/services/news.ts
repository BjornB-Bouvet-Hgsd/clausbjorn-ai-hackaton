import { XMLParser } from 'fast-xml-parser';
import { NewsArticle } from '../types';

const GOOGLE_NEWS_RSS = 'https://news.google.com/rss/search';
const TIMEOUT_MS = 10_000;
const MAX_ARTICLES = 20;

const parser = new XMLParser({ ignoreAttributes: false });

export async function searchCompanyNews(companyName: string): Promise<NewsArticle[]> {
  const params = new URLSearchParams({
    q: companyName,
    hl: 'no',
    gl: 'NO',
    ceid: 'NO:no',
  });

  const response = await fetch(`${GOOGLE_NEWS_RSS}?${params}`, {
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new Error(`Google News RSS feilet med status ${response.status}`);
  }

  const xml = await response.text();
  const parsed = parser.parse(xml);

  const items = parsed?.rss?.channel?.item;
  if (!items) return [];

  const list = Array.isArray(items) ? items : [items];

  return list.slice(0, MAX_ARTICLES).map((item: any): NewsArticle => {
    // Google News titles are formatted as "Title - Source"
    const titleParts = (item.title ?? '').split(' - ');
    const source = titleParts.length > 1 ? titleParts.pop()!.trim() : 'Ukjent kilde';
    const title = titleParts.join(' - ').trim();

    return {
      title,
      url: item.link ?? '',
      source,
      publishedAt: item.pubDate ?? '',
      description: stripHtml(item.description ?? ''),
    };
  });
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}
