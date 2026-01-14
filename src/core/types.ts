export interface KuudereEpisode {
  id: string;
  titles: string[];
  number: number;
  aired: string;
  score: number | null;
  recap: boolean | null;
  filler: boolean | null;
  ago: string;
}

export interface KuudereEpisodeLink {
  $id: string;
  serverId: number;
  serverName: string;
  episodeNumber: number;
  dataType: 'sub' | 'dub';
  dataLink: string;
  continue: boolean;
}

export interface KuudereWatchResponse {
  all_episodes: KuudereEpisode[];
  episode_links: KuudereEpisodeLink[];
  episode_id: string;
  success: boolean;
  duration: number;
  current: number;
  intro_start: number;
  intro_end: number;
  outro_start: number;
  outro_end: number;
  userInfo: unknown | null;
  inWatchlist: boolean;
  folder: unknown | null;
  anime_info: unknown; // TODO: Implement Info Type
  related_anime: unknown[];
}

export interface KuudereSearchResult {
  id: string;
  title: string;
  details: string;
  coverImage: string;
}

export interface KuudereSearchResponse {
  success: boolean;
  results: KuudereSearchResult[];
  total: number;
  displayed: number;
  query: string;
  hasMore: boolean;
  viewAllUrl: string;
}

export interface KuudereInfo {
  id: string;
  anilistId: number;
  english: string;
  romaji: string;
  native: string;
  ageRating: string;
  malScore: number;
  averageScore: number;
  duration: number;
  studios: string[];
  genres: string[];
  cover: string;
  banner: string;
  season: string;
  startDate: string;
  status: string;
  synonyms: string[];
  type: string;
  year: number;
  epCount: number;
  subbedCount: number;
  dubbedCount: number;
  description: string;
}

export interface KuudereInfoResponse {
  success: boolean;
  data: KuudereInfo;
}
