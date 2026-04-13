import { packagingGroups } from './packagingGroups';

export interface KartonArticle {
  name: string;
  group: string;
  height: number;
  diameter: number;
}

export interface KartonEntry {
  size: string;
  articles: KartonArticle[];
}

/** Build karton-centric data: each karton size -> articles using it */
function buildKartonData(): KartonEntry[] {
  const map: Record<string, KartonEntry> = {};

  for (const group of packagingGroups) {
    for (const article of group.articles) {
      if (!article.karton) continue; // skip beutel-only articles
      const key = article.karton;
      if (!map[key]) {
        map[key] = { size: key, articles: [] };
      }
      map[key]!.articles.push({
        name: article.name,
        group: group.name,
        height: article.height,
        diameter: article.diameter,
      });
    }
  }

  // Sort by first dimension (smallest first)
  return Object.values(map).sort(
    (a, b) => parseInt(a.size) - parseInt(b.size),
  );
}

export const kartonData = buildKartonData();
export const kartonSizes = kartonData.map((k) => k.size);
