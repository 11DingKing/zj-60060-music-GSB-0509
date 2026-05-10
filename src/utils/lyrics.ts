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

export function formatLRCTime(time: number): string {
  return `${Math.floor(time / 60)
    .toString()
    .padStart(2, "0")}:${(time % 60).toFixed(2).padStart(5, "0")}`;
}

export function lyricsToLRC(lines: { time: number; text: string }[]): string {
  return lines.map((l) => `[${formatLRCTime(l.time)}]${l.text}`).join("\n");
}
