import * as jsmediatagsModule from "jsmediatags";
import type { Song, Lyrics, LyricLine } from "../types";
import { getLyricsBySongId, addLyrics, updateLyrics } from "./db";

const jsmediatags = (jsmediatagsModule as any).default || jsmediatagsModule;

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

export interface ParsedMetadata {
  title: string;
  artist: string;
  album: string;
  duration: number;
  track: string;
  genre: string;
  year: string;
  coverImage?: string;
}

function imageToBase64(data: number[] | Uint8Array, format: string): string {
  const uint8Array = data instanceof Uint8Array ? data : new Uint8Array(data);
  let binary = "";
  for (let i = 0; i < uint8Array.length; i++) {
    binary += String.fromCharCode(uint8Array[i]);
  }
  return `data:${format};base64,${btoa(binary)}`;
}

export function parseAudioMetadata(file: File): Promise<ParsedMetadata> {
  return new Promise((resolve) => {
    const audio = new Audio();
    const url = URL.createObjectURL(file);

    audio.addEventListener("loadedmetadata", () => {
      const duration = audio.duration;
      URL.revokeObjectURL(url);

      new jsmediatags.Reader(file).read({
        onSuccess: (tag: any) => {
          const tags = tag.tags;

          let coverImage: string | undefined;
          if (tags.picture) {
            const picture = tags.picture;
            const format = picture.format || "image/jpeg";
            coverImage = imageToBase64(picture.data, format);
          }

          resolve({
            title: tags.title || file.name.replace(/\.[^/.]+$/, ""),
            artist: tags.artist || "Unknown Artist",
            album: tags.album || "Unknown Album",
            duration: isFinite(duration) ? duration : 0,
            track: tags.track || "",
            genre: tags.genre || "",
            year: tags.year || "",
            coverImage,
          });
        },
        onError: () => {
          resolve({
            title: file.name.replace(/\.[^/.]+$/, ""),
            artist: "Unknown Artist",
            album: "Unknown Album",
            duration: isFinite(duration) ? duration : 0,
            track: "",
            genre: "",
            year: "",
          });
        },
      });
    });

    audio.addEventListener("error", () => {
      URL.revokeObjectURL(url);

      new jsmediatags.Reader(file).read({
        onSuccess: (tag: any) => {
          const tags = tag.tags;

          let coverImage: string | undefined;
          if (tags.picture) {
            const picture = tags.picture;
            const format = picture.format || "image/jpeg";
            coverImage = imageToBase64(picture.data, format);
          }

          resolve({
            title: tags.title || file.name.replace(/\.[^/.]+$/, ""),
            artist: tags.artist || "Unknown Artist",
            album: tags.album || "Unknown Album",
            duration: 0,
            track: tags.track || "",
            genre: tags.genre || "",
            year: tags.year || "",
            coverImage,
          });
        },
        onError: () => {
          resolve({
            title: file.name.replace(/\.[^/.]+$/, ""),
            artist: "Unknown Artist",
            album: "Unknown Album",
            duration: 0,
            track: "",
            genre: "",
            year: "",
          });
        },
      });
    });

    audio.src = url;
  });
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

export function parseLRC(content: string): { time: number; text: string }[] {
  const lines = content.split("\n");
  const result: { time: number; text: string }[] = [];

  const timeRegex = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/g;

  for (const line of lines) {
    const matches = [...line.matchAll(timeRegex)];
    if (matches.length === 0) continue;

    let text = line.replace(timeRegex, "").trim();

    for (const match of matches) {
      const minutes = parseInt(match[1], 10);
      const seconds = parseInt(match[2], 10);
      const milliseconds = parseInt(match[3].padEnd(3, "0"), 10);

      const time = minutes * 60 + seconds + milliseconds / 1000;

      result.push({ time, text });
    }
  }

  return result.sort((a, b) => a.time - b.time);
}

export { Lyrics };

export async function getLyrics(songId: string): Promise<Lyrics | undefined> {
  return getLyricsBySongId(songId);
}

export async function saveLyrics(
  songId: string,
  parsedLines: { time: number; text: string }[],
): Promise<void> {
  const existing = await getLyricsBySongId(songId);
  const content = parsedLines
    .map(
      (l) =>
        `[${Math.floor(l.time / 60)
          .toString()
          .padStart(
            2,
            "0",
          )}:${(l.time % 60).toFixed(2).padStart(5, "0")}]${l.text}`,
    )
    .join("\n");

  if (existing) {
    await updateLyrics({
      ...existing,
      content,
      parsed: parsedLines as LyricLine[],
    });
  } else {
    await addLyrics({
      id: generateId(),
      songId,
      content,
      parsed: parsedLines as LyricLine[],
    });
  }
}
