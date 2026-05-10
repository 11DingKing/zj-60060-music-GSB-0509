import * as jsmediatagsModule from "jsmediatags";
import type { Song } from "../types";

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
