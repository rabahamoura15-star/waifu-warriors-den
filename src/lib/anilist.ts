const ANILIST_URL = "https://graphql.anilist.co";

const TRENDING_QUERY = `
query ($page: Int, $perPage: Int, $type: MediaType) {
  Page(page: $page, perPage: $perPage) {
    media(type: $type, sort: TRENDING_DESC, isAdult: false) {
      id
      title { romaji english native }
      coverImage { extraLarge large color }
      bannerImage
      description(asHtml: false)
      genres
      averageScore
      popularity
      status
      chapters
      episodes
      format
      season
      seasonYear
      meanScore
      trending
      nextAiringEpisode { airingAt episode }
    }
  }
}`;

const SEARCH_QUERY = `
query ($search: String, $type: MediaType, $page: Int, $perPage: Int) {
  Page(page: $page, perPage: $perPage) {
    media(search: $search, type: $type, sort: SEARCH_MATCH, isAdult: false) {
      id
      title { romaji english native }
      coverImage { extraLarge large color }
      bannerImage
      description(asHtml: false)
      genres
      averageScore
      popularity
      status
      chapters
      format
    }
  }
}`;

const POPULAR_QUERY = `
query ($page: Int, $perPage: Int, $type: MediaType) {
  Page(page: $page, perPage: $perPage) {
    media(type: $type, sort: POPULARITY_DESC, isAdult: false) {
      id
      title { romaji english native }
      coverImage { extraLarge large color }
      bannerImage
      description(asHtml: false)
      genres
      averageScore
      popularity
      status
      chapters
      format
    }
  }
}`;

export interface AniMedia {
  id: number;
  title: { romaji: string; english: string | null; native: string | null };
  coverImage: { extraLarge: string; large: string; color: string | null };
  bannerImage: string | null;
  description: string | null;
  genres: string[];
  averageScore: number | null;
  popularity: number;
  status: string;
  chapters: number | null;
  episodes: number | null;
  format: string;
  season: string | null;
  seasonYear: number | null;
  meanScore: number | null;
  trending: number;
  nextAiringEpisode: { airingAt: number; episode: number } | null;
}

async function query(q: string, variables: Record<string, unknown>): Promise<{ Page: { media: AniMedia[] } }> {
  const res = await fetch(ANILIST_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: q, variables }),
  });
  const json = await res.json();
  return json.data;
}

export async function getTrending(type: "MANGA" | "ANIME" = "MANGA", page = 1, perPage = 20) {
  const data = await query(TRENDING_QUERY, { page, perPage, type });
  return data.Page.media;
}

export async function getPopular(type: "MANGA" | "ANIME" = "MANGA", page = 1, perPage = 20) {
  const data = await query(POPULAR_QUERY, { page, perPage, type });
  return data.Page.media;
}

export async function searchMedia(search: string, type: "MANGA" | "ANIME" = "MANGA", page = 1, perPage = 20) {
  const data = await query(SEARCH_QUERY, { search, type, page, perPage });
  return data.Page.media;
}

export function getTitle(media: AniMedia): string {
  return media.title.english || media.title.romaji || media.title.native || "Unknown";
}

export function getGoogleSearchUrl(media: AniMedia, chapter?: number): string {
  const title = getTitle(media);
  const q = chapter ? `${title} chapter ${chapter} read online` : `${title} read online`;
  return `https://www.google.com/search?q=${encodeURIComponent(q)}`;
}
