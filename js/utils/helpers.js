/**
 * Фильтрация массива проектов по технологии (functional: filter).
 * @param {Array} projects
 * @param {string} tech - '' или конкретная технология
 * @returns {Array}
 */
export function filterByTech(projects, tech) {
  if (!tech) return projects;
  return projects.filter((p) => p.tech.includes(tech));
}

/**
 * Фильтрация массива проектов по году (functional: filter).
 * @param {Array} projects
 * @param {string|number} year - '' или конкретный год
 * @returns {Array}
 */
export function filterByYear(projects, year) {
  if (!year) return projects;
  return projects.filter((p) => p.year === Number(year));
}

/**
 * Фильтрация массива проектов по статусу (functional: filter).
 * @param {Array} projects
 * @param {string} status - '' или конкретный статус
 * @returns {Array}
 */
export function filterByStatus(projects, status) {
  if (!status) return projects;
  return projects.filter((p) => p.status === status);
}

/**
 * Получить уникальные технологии из всех проектов (functional: reduce + map).
 * @param {Array} projects
 * @returns {string[]}
 */
export function getUniqueTechs(projects) {
  const set = projects.reduce((acc, p) => {
    p.tech.forEach((t) => acc.add(t));
    return acc;
  }, new Set());
  return Array.from(set).sort();
}

/**
 * Получить уникальные годы из всех проектов (functional: map + Set).
 * @param {Array} projects
 * @returns {number[]}
 */
export function getUniqueYears(projects) {
  return [...new Set(projects.map((p) => p.year))].sort((a, b) => b - a);
}

/**
 * Получить уникальные статусы из всех проектов (functional: map + Set).
 * @param {Array} projects
 * @returns {string[]}
 */
export function getUniqueStatuses(projects) {
  return [...new Set(projects.map((p) => p.status))];
}

/**
 * Сортировка массива по ключу (functional: sort на копии).
 * @param {Array} arr
 * @param {string} key
 * @param {'asc'|'desc'} dir
 * @returns {Array}
 */
export function sortBy(arr, key, dir = 'asc') {
  return [...arr].sort((a, b) => {
    const va = a[key] ?? '';
    const vb = b[key] ?? '';
    if (va < vb) return dir === 'asc' ? -1 : 1;
    if (va > vb) return dir === 'asc' ? 1 : -1;
    return 0;
  });
}
