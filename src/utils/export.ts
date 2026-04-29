import { getAllThoughts } from '../database/thoughtRepo';
import { getAnnotationsByThoughtId } from '../database/annotationRepo';
import { formatDate, formatDateDisplay, formatTime } from './dateFormat';

export async function exportAll(): Promise<void> {
  const thoughts = await getAllThoughts();
  const withAnnotations = await Promise.all(
    thoughts.map(async (t) => ({
      ...t,
      annotations: await getAnnotationsByThoughtId(t.id),
    })),
  );

  const now = new Date();
  const dateLabel = formatDate(now.toISOString());

  const jsonData = {
    version: '1.0',
    exportedAt: now.toISOString(),
    thoughts: withAnnotations.map((t) => ({
      id: t.id, content: t.content, mood: t.mood, tags: t.tags,
      createdAt: t.createdAt,
      location: { latitude: t.latitude, longitude: t.longitude, placeName: t.placeName },
      media: t.media,
      annotations: t.annotations.map((a) => ({
        paragraphIndex: a.paragraphIndex, content: a.content, createdAt: a.createdAt,
        location: { latitude: a.latitude, longitude: a.longitude, placeName: a.placeName },
      })),
    })),
  };

  const jsonBlob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
  downloadBlob(jsonBlob, `thought-journal-${dateLabel}.json`);

  const grouped = new Map<string, typeof withAnnotations>();
  for (const t of withAnnotations) {
    const key = formatDate(t.createdAt);
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(t);
  }

  const lines: string[] = ['# Thought Journal Export', `Exported on ${formatDateDisplay(now.toISOString())}`, ''];
  for (const [, items] of Array.from(grouped.entries()).sort((a, b) => b[0].localeCompare(a[0]))) {
    lines.push(`## ${formatDateDisplay(items[0].createdAt)}`, '');
    for (const t of items) {
      const header = [formatTime(t.createdAt)];
      if (t.mood) header.push(t.mood);
      lines.push(`### ${header.join(' — ')}`, '', t.content, '');
      if (t.tags.length) lines.push(`**Tags:** ${t.tags.join(', ')}  `);
      if (t.placeName) lines.push(`**Location:** ${t.placeName}  `);
      if (t.media.length) {
        const img = t.media.filter((m) => m.type === 'image').length;
        const aud = t.media.filter((m) => m.type === 'audio').length;
        const parts = [img && `${img} image(s)`, aud && `${aud} audio(s)`].filter(Boolean);
        lines.push(`**Media:** ${parts.join(', ')}  `);
      }
      if (t.annotations.length) {
        lines.push('', '**Annotations:**', '');
        for (const a of t.annotations) {
          lines.push(`> *${formatTime(a.createdAt)}${a.placeName ? `, ${a.placeName}` : ''} — §${a.paragraphIndex}*`);
          lines.push(`> ${a.content}`, '> ');
        }
      }
      lines.push('', '---', '');
    }
  }

  const mdBlob = new Blob([lines.join('\n')], { type: 'text/markdown' });
  downloadBlob(mdBlob, `thought-journal-${dateLabel}.md`);
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
