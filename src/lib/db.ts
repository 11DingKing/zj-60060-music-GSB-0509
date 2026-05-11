import { openDB, IDBPDatabase } from "idb";
import type {
  Song,
  Playlist,
  Lyrics,
  AudioBlob,
  EqualizerPreset,
} from "../types";

const DB_NAME = "MusicPlayerDB";
const DB_VERSION = 1;

type StoreName = "songs" | "playlists" | "lyrics" | "audioBlobs" | "equalizerPresets";

interface MusicPlayerDB {
  songs: Song;
  playlists: Playlist;
  lyrics: Lyrics;
  audioBlobs: AudioBlob;
  equalizerPresets: EqualizerPreset;
}

let db: IDBPDatabase<MusicPlayerDB> | null = null;

export async function getDB(): Promise<IDBPDatabase<MusicPlayerDB>> {
  if (!db) {
    db = await openDB<MusicPlayerDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("songs")) {
          const songsStore = db.createObjectStore("songs", { keyPath: "id" });
          songsStore.createIndex("artist", "artist");
          songsStore.createIndex("album", "album");
          songsStore.createIndex("addedAt", "addedAt");
          songsStore.createIndex("playCount", "playCount");
        }

        if (!db.objectStoreNames.contains("playlists")) {
          db.createObjectStore("playlists", { keyPath: "id" });
        }

        if (!db.objectStoreNames.contains("lyrics")) {
          const lyricsStore = db.createObjectStore("lyrics", { keyPath: "id" });
          lyricsStore.createIndex("songId", "songId", { unique: true });
        }

        if (!db.objectStoreNames.contains("audioBlobs")) {
          const audioBlobsStore = db.createObjectStore("audioBlobs", {
            keyPath: "id",
          });
          audioBlobsStore.createIndex("songId", "songId", { unique: true });
        }

        if (!db.objectStoreNames.contains("equalizerPresets")) {
          db.createObjectStore("equalizerPresets", { keyPath: "id" });
        }
      },
    });
  }
  return db;
}

async function getAll<T extends StoreName>(
  storeName: T
): Promise<MusicPlayerDB[T][]> {
  const database = await getDB();
  return database.getAll(storeName);
}

async function getById<T extends StoreName>(
  storeName: T,
  id: string
): Promise<MusicPlayerDB[T] | undefined> {
  const database = await getDB();
  return database.get(storeName, id);
}

async function add<T extends StoreName>(
  storeName: T,
  item: MusicPlayerDB[T]
): Promise<void> {
  const database = await getDB();
  await database.add(storeName, item);
}

async function put<T extends StoreName>(
  storeName: T,
  item: MusicPlayerDB[T]
): Promise<void> {
  const database = await getDB();
  await database.put(storeName, item);
}

async function remove<T extends StoreName>(
  storeName: T,
  id: string
): Promise<void> {
  const database = await getDB();
  await database.delete(storeName, id);
}

async function getByIndex<T extends StoreName>(
  storeName: T,
  indexName: string,
  value: string
): Promise<MusicPlayerDB[T] | undefined> {
  const database = await getDB();
  const index = database.transaction(storeName).store.index(indexName);
  return index.get(value);
}

export async function getAllSongs(): Promise<Song[]> {
  return getAll("songs");
}

export async function getSongById(id: string): Promise<Song | undefined> {
  return getById("songs", id);
}

export async function addSong(song: Song, audioBlob: Blob): Promise<void> {
  const database = await getDB();
  const tx = database.transaction(["songs", "audioBlobs"], "readwrite");

  await tx.objectStore("songs").add(song);
  await tx.objectStore("audioBlobs").add({
    id: song.audioBlobId,
    blob: audioBlob,
    songId: song.id,
  });

  await tx.done;
}

export async function updateSong(song: Song): Promise<void> {
  return put("songs", song);
}

export async function deleteSong(id: string): Promise<void> {
  const database = await getDB();
  const tx = database.transaction(
    ["songs", "audioBlobs", "lyrics"],
    "readwrite",
  );

  const song = await tx.objectStore("songs").get(id);
  if (song) {
    await tx.objectStore("songs").delete(id);

    if (song.audioBlobId) {
      await tx.objectStore("audioBlobs").delete(song.audioBlobId);
    }

    if (song.lyricsId) {
      await tx.objectStore("lyrics").delete(song.lyricsId);
    }
  }

  await tx.done;
}

export async function getAudioBlob(blobId: string): Promise<Blob | undefined> {
  const audioBlob = await getById("audioBlobs", blobId);
  return audioBlob?.blob;
}

export async function getAllPlaylists(): Promise<Playlist[]> {
  return getAll("playlists");
}

export async function getPlaylistById(
  id: string,
): Promise<Playlist | undefined> {
  return getById("playlists", id);
}

export async function addPlaylist(playlist: Playlist): Promise<void> {
  return add("playlists", playlist);
}

export async function updatePlaylist(playlist: Playlist): Promise<void> {
  playlist.updatedAt = Date.now();
  return put("playlists", playlist);
}

export async function deletePlaylist(id: string): Promise<void> {
  return remove("playlists", id);
}

export async function getLyricsBySongId(
  songId: string,
): Promise<Lyrics | undefined> {
  return getByIndex("lyrics", "songId", songId);
}

export async function addLyrics(lyrics: Lyrics): Promise<void> {
  return add("lyrics", lyrics);
}

export async function updateLyrics(lyrics: Lyrics): Promise<void> {
  return put("lyrics", lyrics);
}

export async function getAllEqualizerPresets(): Promise<EqualizerPreset[]> {
  return getAll("equalizerPresets");
}

export async function addEqualizerPreset(
  preset: EqualizerPreset,
): Promise<void> {
  return add("equalizerPresets", preset);
}

export async function updateEqualizerPreset(
  preset: EqualizerPreset,
): Promise<void> {
  return put("equalizerPresets", preset);
}

export async function deleteEqualizerPreset(id: string): Promise<void> {
  return remove("equalizerPresets", id);
}

export const defaultEqualizerPresets: EqualizerPreset[] = [
  {
    id: "default-flat",
    name: "Flat",
    isDefault: true,
    frequencies: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  },
  {
    id: "default-pop",
    name: "Pop",
    isDefault: true,
    frequencies: [-1, 2, 4, 4, 2, 0, -2, -2, -1, -1],
  },
  {
    id: "default-rock",
    name: "Rock",
    isDefault: true,
    frequencies: [4, 3, 2, 0, -1, 0, 2, 3, 4, 4],
  },
  {
    id: "default-classical",
    name: "Classical",
    isDefault: true,
    frequencies: [3, 2, 1, 0, -1, -1, 0, 1, 2, 3],
  },
  {
    id: "default-vocal",
    name: "Vocal",
    isDefault: true,
    frequencies: [-2, -1, 1, 3, 4, 4, 3, 1, -1, -2],
  },
  {
    id: "default-bass",
    name: "Bass Boost",
    isDefault: true,
    frequencies: [6, 5, 4, 2, 0, 0, 0, 0, 0, 0],
  },
];

export async function initializeDefaultPresets(): Promise<void> {
  const existingPresets = await getAllEqualizerPresets();
  const existingIds = new Set(existingPresets.map((p) => p.id));

  for (const preset of defaultEqualizerPresets) {
    if (!existingIds.has(preset.id)) {
      await addEqualizerPreset(preset);
    }
  }
}
