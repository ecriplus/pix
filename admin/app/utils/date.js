export default function formatDateToStandard(date) {
  return new Date(date).toLocaleDateString('en-CA');
}
