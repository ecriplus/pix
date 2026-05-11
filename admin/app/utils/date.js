export default function formatDateToStandard(date) {
  return new Date(date).toLocaleDateString('en-CA');
}

export function formatMinutes(minutes) {
  if (!minutes) return '-';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}min`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}min`;
}
