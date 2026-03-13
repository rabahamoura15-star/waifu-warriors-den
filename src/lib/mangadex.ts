// MangaDex API integration
const MANGADEX_URL = "https://api.mangadex.org";

export interface MangaDexManga {
  id: string;
  attributes: {
    title: { en?: string; [key: string]: string };
    description: { en?: string; [key: string]: string };
    tags: { attributes: { name: { en: string } } }[];
    status: string;
    year?: number;
    contentRating: string;
    lastChapter?: string;
    publicationDemographic?: string;
  };
  relationships: {
    type: string;
    attributes?: {
      fileName?: string;
    };
  }[];
}

export interface MangaDexCover {
  data: {
    attributes: {
      fileName: string;
    };
  };
}

async function mangadexFetch(path: string): Promise<unknown> {
  const res = await fetch(`${MANGADEX_URL}${path}`);
  if (!res.ok) throw new Error(`MangaDex ${res.status}`);
  return res.json();
}

function getCoverUrl(manga: MangaDexManga): string {
  const coverRel = manga.relationships.find(rel => rel.type === 'cover_art');
  if (coverRel?.attributes?.fileName) {
    return `https://uploads.mangadex.org/covers/${manga.id}/${coverRel.attributes.fileName}`;
  }
  return '';
}

function getTitle(manga: MangaDexManga): string {
  return manga.attributes.title.en || Object.values(manga.attributes.title)[0] || 'Unknown';
}

function getDescription(manga: MangaDexManga): string {
  return manga.attributes.description.en || Object.values(manga.attributes.description)[0] || '';
}

function getGenres(manga: MangaDexManga): string[] {
  return manga.attributes.tags.map(tag => tag.attributes.name.en);
}

// Convert MangaDex format to our AniMedia format for compatibility
function toAniMedia(manga: MangaDexManga): import("@/lib/anilist").AniMedia {
  return {
    id: parseInt(manga.id, 16), // Convert hex ID to number
    title: {
      romaji: getTitle(manga),
      english: manga.attributes.title.en,
      native: null,
    },
    coverImage: {
      extraLarge: getCoverUrl(manga),
      large: getCoverUrl(manga),
      color: null,
    },
    bannerImage: null,
    description: getDescription(manga),
    genres: getGenres(manga),
    averageScore: null, // MangaDex doesn't have scores
    popularity: 0,
    status: manga.attributes.status.toUpperCase(),
    chapters: manga.attributes.lastChapter ? parseInt(manga.attributes.lastChapter) : null,
    episodes: null,
    format: 'MANGA',
    season: null,
    seasonYear: manga.attributes.year,
    meanScore: null,
    trending: 0,
    nextAiringEpisode: null,
  };
}

export async function mangadexTrending(
  limit = 20,
  filterNsfw = true,
): Promise<import("@/lib/anilist").AniMedia[]> {
  const contentRatings = filterNsfw
    ? ["safe", "suggestive"]
    : ["safe", "suggestive", "erotica", "pornographic"];
  const ratingParams = contentRatings.map((r) => `contentRating[]=${encodeURIComponent(r)}`).join("&");
  const data = await mangadexFetch(
    `/manga?limit=${limit}&order[followedCount]=desc&${ratingParams}&includes[]=cover_art`,
  );
  const mangas = (data as { data: MangaDexManga[] }).data;
  return mangas.map(toAniMedia);
}

export async function mangadexSearch(
  query: string,
  limit = 20,
  filterNsfw = true,
): Promise<import("@/lib/anilist").AniMedia[]> {
  const contentRatings = filterNsfw
    ? ["safe", "suggestive"]
    : ["safe", "suggestive", "erotica", "pornographic"];
  const ratingParams = contentRatings.map((r) => `contentRating[]=${encodeURIComponent(r)}`).join("&");
  const data = await mangadexFetch(
    `/manga?title=${encodeURIComponent(query)}&limit=${limit}&${ratingParams}&includes[]=cover_art`,
  );
  const mangas = (data as { data: MangaDexManga[] }).data;
  return mangas.map(toAniMedia);
}

export async function mangadexGetById(id: string): Promise<import("@/lib/anilist").AniMedia | null> {
  try {
    const data = await mangadexFetch(`/manga/${id}?includes[]=cover_art`);
    const manga = (data as { data: MangaDexManga }).data;
    return toAniMedia(manga);
  } catch {
    return null;
  }
}