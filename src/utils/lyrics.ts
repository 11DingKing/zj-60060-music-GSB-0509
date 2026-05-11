import type { LyricLine } from '../types';

export function parseLRC(content: string): LyricLine[] {
  const lines = content.split('\n');
  const result: LyricLine[] = [];
  const timeRegex = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/g;

  for (const line of lines) {
    const matches = [...line.matchAll(timeRegex)];
    if (matches.length === 0) continue;

    let text = line.replace(timeRegex, '').trim();

    for (const match of matches) {
      const minutes = parseInt(match[1], 10);
      const seconds = parseInt(match[2], 10);
      const milliseconds = parseInt(match[3].padEnd(3, '0'), 10);
      const time = minutes * 60 + seconds + milliseconds / 1000;
      result.push({ time, text });
    }
  }

  return result.sort((a, b) => a.time - b.time);
}

export function formatLRC(parsedLines: LyricLine[]): string {
  return parsedLines
    .map(
      (l) =>
        `[${Math.floor(l.time / 60)
          .toString()
          .padStart(2, '0')}:${(l.time % 60)
          .toFixed(2)
          .padStart(5, '0')}]${l.text}`
    )
    .join('\n');
}

export function findActiveLyricIndex(
  lyrics: LyricLine[],
  currentTime: number
): number {
  if (!lyrics || lyrics.length === 0) return -1;

  for (let i = lyrics.length - 1; i >= 0; i--) {
    if (currentTime >= lyrics[i].time) {
      return i;
    }
  }

  return -1;
}
