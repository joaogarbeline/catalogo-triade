export const VENDEDOR_COOKIE_NAME = "vendedor_hash";
export const VENDEDOR_COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 dias

export function getBaseUrl() {
  return process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
}
