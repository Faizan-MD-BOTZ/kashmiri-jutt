export function normalizePhoneNumber(value) {
  return String(value ?? '').replace(/\D/g, '');
}

export function isValidPhoneNumber(value) {
  const digits = normalizePhoneNumber(value);
  return digits.length >= 10 && digits.length <= 15;
}

export function normalizeBaseUrl(value) {
  const trimmed = String(value ?? '').trim();
  if (!trimmed) return '';

  let parsed;
  try {
    parsed = new URL(trimmed);
  } catch {
    return '';
  }

  if (parsed.protocol !== 'https:' || parsed.username || parsed.password) return '';
  return parsed.origin;
}

export function buildPairCodeUrl(baseUrl, phoneNumber) {
  const origin = normalizeBaseUrl(baseUrl);
  const digits = normalizePhoneNumber(phoneNumber);
  if (!origin) throw new Error('This server URL is not a valid HTTPS address.');
  if (!isValidPhoneNumber(digits)) throw new Error('Enter 10–15 digits, including your country code.');

  const endpoint = new URL('/code', origin);
  endpoint.searchParams.set('number', digits);
  return endpoint.toString();
}

export function selectHealthyServer(servers, random = Math.random) {
  const healthy = servers.filter(server => server?.online === true);
  if (healthy.length === 0) return null;
  const index = Math.min(healthy.length - 1, Math.floor(random() * healthy.length));
  return healthy[index];
}

export function extractPairCode(payload) {
  return typeof payload?.code === 'string' ? payload.code.trim() : '';
}
