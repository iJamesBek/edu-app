/** Deterministic thousands grouping, identical on server and client (no Intl differences). */
export function formatNumber(value: number, locale: string): string {
  const separator = locale === "en" ? "," : " ";
  const [int, frac] = String(value).split(".");
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
  return frac ? `${grouped}${locale === "en" ? "." : ","}${frac}` : grouped;
}
