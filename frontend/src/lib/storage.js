const STORAGE_KEY = "snip.links";

export function loadLinks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveLink(link) {
  const links = loadLinks();
  links.unshift(link);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(links));
  } catch {
    // localStorage unavailable (private mode, quota, etc.) — fail silently.
  }
  return links;
}

export function removeLink(shortCode) {
  const links = loadLinks().filter((l) => l.shortCode !== shortCode);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(links));
  } catch {
    // ignore
  }
  return links;
}
