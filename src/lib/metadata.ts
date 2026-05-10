import type { Song, Lyrics } from "../types";
import { getLyricsBySongId, addLyrics, updateLyrics } from "./db";
import { parseAudioMetadata } from "../utils/audio";
import { lyricsToLRC } from "../utils/lyrics";

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

export async function createSongFromFile(
  file: File,
): Promise<{ song: Song; blob: Blob }> {
  const metadata = await parseAudioMetadata(file);
  const songId = generateId();
  const audioBlobId = generateId();

  const song: Song = {
    id: songId,
    title: metadata.title,
    artist: metadata.artist,
    album: metadata.album,
    duration: metadata.duration,
    track: metadata.track,
    genre: metadata.genre,
    year: metadata.year,
    coverImage: metadata.coverImage,
    audioBlobId,
    playCount: 0,
    addedAt: Date.now(),
  };

  return { song, blob: file };
}

export { parseLRC } from "../utils/lyrics";
export { Lyrics };

export async function getLyrics(songId: string): Promise<Lyrics | undefined> {
  return getLyricsBySongId(songId);
}

export async function saveLyrics(
  songId: string,
  parsedLines: { time: number; text: string }[],
): Promise<void> {
  const existing = await getLyricsBySongId(songId);
  const content = lyricsToLRC(parsedLines);

  if (existing) {
    await updateLyrics({
      ...existing,
      content,
      parsed: parsedLines as Lyrics["parsed"],
    });
  } else {
    await addLyrics({
      id: generateId(),
      songId,
      content,
      parsed: parsedLines as Lyrics["parsed"],
    });
  }
}
