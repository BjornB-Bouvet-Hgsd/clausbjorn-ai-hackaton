/**
 * Generates a LinkedIn people-search URL for a given person.
 * Opens the LinkedIn search page pre-filled with the person's name,
 * company, and role — the user can then click the correct profile.
 */
export function generateLinkedInSearchUrl(
  name: string,
  companyName: string,
): string {
  const keywords = `${name} ${companyName}`;
  const encoded = encodeURIComponent(keywords);
  return `https://www.linkedin.com/search/results/people/?keywords=${encoded}&origin=GLOBAL_SEARCH_HEADER`;
}
