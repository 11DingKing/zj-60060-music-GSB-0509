export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  track: string;
  genre: string;
  year: string;
  coverImage?: string;
  audioBlobId: string;
  lyricsId?: string;
  playCount: number;
  lastPlayedAt?: number;
  addedAt: number;
}

export interface Playlist {
  id: string;
  name: string;
  isSmart: boolean;
  smartRule?: SmartRule;
  songIds: string[];
  createdAt: number;
  updatedAt: number;
}

export interface SmartRule {
  type: 'recentlyAdded' | 'mostPlayed' | 'custom';
  customFilters?: CustomFilter[];
  limit?: number;
}

export interface CustomFilter {
  field: 'title' | 'artist' | 'album' | 'genre' | 'year';
  operator: 'contains' | 'equals' | 'startsWith' | 'endsWith';
  value: string;
}

export interface EqualizerPreset {
  id: string;
  name: string;
  isDefault: boolean;
  frequencies: number[];
}

export interface Lyrics {
  id: string;
  songId: string;
  content: string;
  parsed: LyricLine[];
}

export interface LyricLine {
  time: number;
  text: string;
}

export interface AudioBlob {
  id: string;
  blob: Blob;
  songId: string;
}

export type SortField = 'title' | 'artist' | 'album' | 'duration' | 'addedAt' | 'playCount';
export type SortDirection = 'asc' | 'desc';

export type ViewMode = 'song' | 'album' | 'artist';

export type PlayMode = 'sequence' | 'shuffle' | 'repeatOne' | 'repeatAll';

export type VisualizerMode = 'bar' | 'wave' | 'circle';
