export function isValidPhone(val) {
  return /^[\+]?[0-9\s\-().]{7,20}$/.test(String(val).trim());
}

export function isValidEmail(val) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(val).trim());
}

export function sanitizeFio(val) {
  return String(val).replace(/[^А-Яа-яЁёA-Za-z\s\-]/g, '');
}

export function splitFio(val) {
  return String(val).trim().split(/\s+/).filter(Boolean);
}

