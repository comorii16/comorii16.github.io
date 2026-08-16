/** "2026-08-14" -> "2026.08.14" (서버/클라이언트 결과가 항상 같도록 로케일에 의존하지 않는다) */
export function formatDate(date: string): string {
  return date.replaceAll('-', '.');
}
