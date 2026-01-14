export interface FormatSearchAnime {
  title: string;
  image: string;
  id: string;
  year: number;
  format: string | undefined;
}

export interface FormatSearchPagination {
  hasMore: boolean;
  total: number;
  displayed: number;
}

export interface FormatSearchResponse {
  pagination: FormatSearchPagination;
  results: FormatSearchAnime[];
}

export interface FormatEpisode {
  id: string;
  title: string | null;
  image: string | null;
  number: number;
  isFiller: boolean | null;
  isRecap: boolean | null;
  aired: string;
  score: number | null;
  ago: string;
}

export enum VideoType {
  HLS = 'hls',
  DASH = 'dash',
  MP4 = 'mp4',
}

export interface IntroOutro {
  start?: number | null;
  end?: number | null;
}

export interface Download {
  url?: string | null;
  quality?: string | null;
}

export interface VideoSource {
  url?: string | null;
  isM3U8?: boolean | null;
  type?: VideoType | string | null;
  quality?: string | number | null;
  isDub?: boolean | null;
}

export interface Subtitle {
  id?: string | null;
  url?: string | null;
  label?: string | null;
  srcLang?: string | null;
  format?: string | null;
}

export interface Source<T = unknown> {
  headers?: Record<string, unknown> | null;
  intro?: IntroOutro | null;
  outro?: IntroOutro | null;
  sources: Partial<VideoSource>[];
  subtitles?: Partial<Subtitle>[] | null;
  download?: Partial<Download>[] | string | null;
  chapters?: string | null;
  thumbnails?: string | null;
  metadata?: T | null;
}
