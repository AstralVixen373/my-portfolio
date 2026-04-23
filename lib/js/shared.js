/* =========================
   Storage Keys
========================= */

export const STORAGE_KEYS = {
  characters: "sb_characters",
  chapters: "sb_chapters",
  locations: "sb_locations"
};

/* =========================
   Storage Helpers
========================= */

export function load(key, fallback = []) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
}

export function save(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
