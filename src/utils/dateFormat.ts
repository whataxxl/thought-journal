export function todayStr(): string {
  return formatDate(new Date().toISOString());
}

export function formatDate(isoString: string): string {
  const d = new Date(isoString);
  const year = d.getFullYear();
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatDateDisplay(isoString: string): string {
  const days = ['周日','周一','周二','周三','周四','周五','周六'];
  const d = new Date(isoString);
  return `${d.getMonth() + 1}月${d.getDate()}日 ${days[d.getDay()]}`;
}

export function formatTime(isoString: string): string {
  const d = new Date(isoString);
  const hours = d.getHours().toString().padStart(2, '0');
  const minutes = d.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

export function groupByDate<T extends { createdAt: string }>(
  items: T[],
): { title: string; data: T[] }[] {
  const groups = new Map<string, T[]>();
  for (const item of items) {
    const dateKey = formatDate(item.createdAt);
    const group = groups.get(dateKey);
    if (group) group.push(item);
    else groups.set(dateKey, [item]);
  }
  return Array.from(groups.entries())
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([, data]) => ({ title: formatDateDisplay(data[0].createdAt), data }));
}
