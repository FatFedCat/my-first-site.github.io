/**
 * Форматирование даты в читаемый вид (ru-RU).
 * @param {string|Date} dateStr
 * @returns {string}
 */
export function formatDate(dateStr) {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Относительное время (например: «3 дн. назад»).
 * @param {string|Date} dateStr
 * @returns {string}
 */
export function getRelativeTime(dateStr) {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '—';
  const diffDays = Math.floor((Date.now() - date.getTime()) / 86_400_000);

  if (diffDays === 0) return 'сегодня';
  if (diffDays === 1) return 'вчера';
  if (diffDays < 7) return `${diffDays} дн. назад`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} нед. назад`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} мес. назад`;
  return `${Math.floor(diffDays / 365)} г. назад`;
}
