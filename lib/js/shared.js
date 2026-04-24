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

export function load(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch {
    return [];
  }
}

export function save(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// NOTE: UI wiring for import/export is duplicated across pages
// TODO: Centralize in a ui.js later and call ui.js or storage.js across pages
