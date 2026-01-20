export function normalizeDateTime(datetime: string): Date {
  if (datetime.includes('Z') || datetime.match(/[+-]\d{2}:\d{2}$/)) {
    return new Date(datetime);
  }
  
  if (!datetime.match(/T\d{2}:\d{2}:\d{2}/)) {
    datetime += ':00';
  }
  
  return new Date(datetime);
}


export function friendlyDateMessage(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const formatted = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).format(dateObj);
  return formatted;
}

export function friendlyDuration(fromTs: Date | string, toTs: Date | string): string {
  const start = typeof fromTs === 'string' ? new Date(fromTs) : fromTs;
  const end = typeof toTs === 'string' ? new Date(toTs) : toTs;
  let diffMs = Math.abs(end.getTime() - start.getTime());
  const minutes = Math.floor(diffMs / (1000 * 60)) % 60;
  const hours   = Math.floor(diffMs / (1000 * 60 * 60)) % 24;
  const days    = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const parts: string[] = [];
  if (days) parts.push(`${days} day${days === 1 ? "" : "s"}`);
  if (hours) parts.push(`${hours} hour${hours === 1 ? "" : "s"}`);
  if (minutes) parts.push(`${minutes} minute${minutes === 1 ? "" : "s"}`);
  return parts.length ? parts.join(" ") : "0 minutes";
}


export function parseDuration(duration: string): number {
  let totalMs = 0;

  const units = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };

  const parts = duration.trim().replace(/\s+/g, "").match(/\d+[smhd]/g);

  if (!parts) {
    throw new Error(`Invalid duration: ${duration}`);
  }

  for (const part of parts) {
    const value = Number(part.slice(0, -1));
    const unit = part.slice(-1);

    totalMs += value * units[unit as keyof typeof units];
  }

  return totalMs;
}
