export function calculateETA(
  distance: number,
  speed: number
): { hours: number; minutes: number; arrival: Date } | null {
  if (speed <= 0 || distance < 0) return null;
  const totalHours = distance / speed;
  const hours = Math.floor(totalHours);
  const minutes = Math.round((totalHours - hours) * 60);
  const arrival = new Date(Date.now() + totalHours * 3600000);
  return { hours, minutes, arrival };
}

export function formatDuration(hours: number, minutes: number): string {
  if (hours === 0) return `${minutes}分`;
  if (minutes === 0) return `${hours}時間`;
  return `${hours}時間${minutes}分`;
}
