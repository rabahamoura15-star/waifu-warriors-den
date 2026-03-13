const ANILIST_URL = "https://graphql.anilist.co";

const MEDIA_FIELDS = `
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
`;

const TRENDING_QUERY = `
query ($page: Int, $perPage: Int, $type: MediaType, $isAdult: Boolean) {
  Page(page: $page, perPage: $perPage) {
    media(type: $type, sort: TRENDING_DESC, isAdult: $isAdult) {
      ${MEDIA_FIELDS}
    }
  }
}`;

const SEARCH_QUERY = `
query ($search: String, $type: MediaType, $page: Int, $perPage: Int, $isAdult: Boolean) {
  Page(page: $page, perPage: $perPage) {
    media(search: $search, type: $type, sort: SEARCH_MATCH, isAdult: $isAdult) {
      ${MEDIA_FIELDS}
    }
  }
}`;

const POPULAR_QUERY = `
query ($page: Int, $perPage: Int, $type: MediaType, $isAdult: Boolean) {
  Page(page: $page, perPage: $perPage) {
    media(type: $type, sort: POPULARITY_DESC, isAdult: $isAdult) {
      ${MEDIA_FIELDS}
    }
  }
}`;

const DETAIL_QUERY = `
query ($id: Int) {
  Media(id: $id) {
    ${MEDIA_FIELDS}
    characters(sort: ROLE, perPage: 12) {
      edges {
        role
        node {
          id
          name { full native }
          image { large medium }
          description
          gender
          age
        }
      }
    }
    relations {
      edges {
        relationType
        node {
          id
          title { romaji english }
          coverImage { large }
          format
          type
        }
      }
    }
  }
}`;

export interface AniCharacterNode {
  id: number;
  name: { full: string; native: string | null };
  image: { large?: string | null; medium?: string | null };
}

export interface AniCharacterEdge {
  role: string | null;
  node: AniCharacterNode;
}

export interface AniRelationNode {
  id: number;
  title: { romaji: string; english: string | null };
  coverImage: { large: string };
  format: string;
  type: string;
}

export interface AniRelationEdge {
  relationType: string;
  node: AniRelationNode;
}

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
  characters?: { edges: AniCharacterEdge[] };
  relations?: { edges: AniRelationEdge[] };
}

async function query<T>(q: string, variables: Record<string, unknown>): Promise<T> {
  const res = await fetch(ANILIST_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: q, variables }),
  });
  const json = await res.json();
  return json.data;
}

export async function getTrending(
  type: "MANGA" | "ANIME" = "MANGA",
  page = 1,
  perPage = 20,
  filterNsfw = true,
) {
  const data = await query(TRENDING_QUERY, {
    page,
    perPage,
    type,
    isAdult: !filterNsfw,
  });
  return data.Page.media as AniMedia[];
}

export async function getPopular(
  type: "MANGA" | "ANIME" = "MANGA",
  page = 1,
  perPage = 20,
  filterNsfw = true,
) {
  const data = await query(POPULAR_QUERY, {
    page,
    perPage,
    type,
    isAdult: !filterNsfw,
  });
  return data.Page.media as AniMedia[];
}

export async function searchMedia(
  search: string,
  type: "MANGA" | "ANIME" = "MANGA",
  page = 1,
  perPage = 20,
  filterNsfw = true,
) {
  const data = await query(SEARCH_QUERY, {
    search,
    type,
    page,
    perPage,
    isAdult: !filterNsfw,
  });
  return data.Page.media as AniMedia[];
}

export async function getMediaById(id: number): Promise<AniMedia | null> {
  const data = await query(DETAIL_QUERY, { id });
  return data?.Media || null;
}

export function getTitle(media: AniMedia): string {
  return media.title.english || media.title.romaji || media.title.native || "Unknown";
}

export function getGoogleSearchUrl(media: AniMedia, chapter?: number): string {
  const title = getTitle(media);
  const q = chapter ? `${title} chapter ${chapter} read online` : `${title} read online`;
  return `https://www.google.com/search?q=${encodeURIComponent(q)}`;
}
