import type { AniMedia } from "./anilist";

const NSFW_TAGS = new Set([
  "hentai",
  "adult",
  "ecchi",
  "gore",
  "porn",
  "sex",
  "mature",
]);

export function isNsfwMedia(media: AniMedia): boolean {
  // Some APIs expose NSFW markers in genres/tags.
  const fields = [
    ...(media.genres || []),
    media.title?.romaji || "",
    media.title?.english || "",
    media.title?.native || "",
    media.description || "",
  ];

  return fields.some((value) => {
    if (!value) return false;
    const normalized = value.toLowerCase();
    return Array.from(NSFW_TAGS).some((tag) => normalized.includes(tag));
  });
}

export function filterNsfwMedia(media: AniMedia[] | undefined, filterEnabled: boolean) {
  if (!filterEnabled) return media || [];
  if (!media) return [];
  return media.filter((m) => !isNsfwMedia(m));
}
