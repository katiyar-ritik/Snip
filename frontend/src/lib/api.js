// In production the frontend is served by the same Express app, so relative
// paths work for both the API and the redirect short-links. In dev, Vite
// proxies /api to the backend, but short-link redirects need the backend
// origin directly.
export const API_ORIGIN = import.meta.env.DEV ? "http://localhost:3000" : "";

export async function createLink(url, alias) {
  const res = await fetch("/api/links", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url, alias: alias || undefined }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to create link.");
  return data;
}

export async function fetchStats(code) {
  const res = await fetch(`/api/links/${code}/stats`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to load stats.");
  return data;
}

export function shortLinkUrl(code) {
  return `${API_ORIGIN}/${code}`;
}

export function qrCodeUrl(code) {
  return `${API_ORIGIN}/api/links/${code}/qrcode`;
}
