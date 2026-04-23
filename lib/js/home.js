import { load, STORAGE_KEYS } from "./shared.js";

/* =========================
   DOM
========================= */

const el = {
  charCount: document.getElementById("char-count"),
  sceneCount: document.getElementById("scene-count"),
  locationCount: document.getElementById("location-count"),
  wordCount: document.getElementById("word-count"),
  sceneTotal: document.getElementById("scene-total"),
  progressFill: document.getElementById("progress-fill"),
  recentList: document.getElementById("recent-scenes")
};

/* =========================
   DATA
========================= */

function getData() {
  return {
    characters: load(STORAGE_KEYS.characters),
    scenes: load("sb_scenes"),
    locations: load("sb_locations")
  };
}

/* =========================
   STATS
========================= */

function updateStats() {
  const { characters, scenes, locations } = getData();

  setText(el.charCount, characters.length);
  setText(el.sceneCount, scenes.length);
  setText(el.locationCount, locations.length);

  updateProgress(scenes);
  renderRecentScenes(scenes);
}

/* =========================
   PROGRESS
========================= */

const WORD_GOAL = 50000;

function countWords(text = "") {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

function updateProgress(scenes) {
  const totalWords = scenes.reduce(
    (sum, s) => sum + countWords(s.content),
    0
  );

  setText(el.wordCount, `${totalWords} words`);
  setText(el.sceneTotal, `${scenes.length} scenes`);

  const progress = Math.min((totalWords / WORD_GOAL) * 100, 100);
  el.progressFill.style.width = `${progress}%`;
}

/* =========================
   RECENT SCENES
========================= */

function renderRecentScenes(scenes) {
  el.recentList.innerHTML = "";

  const recent = [...scenes]
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .slice(0, 5);

  if (!recent.length) {
    return appendTextItem(el.recentList, "No scenes yet.");
  }

  recent.forEach(scene => {
    const link = createLink(
      `scenes.html?id=${scene.id}`,
      scene.title || "Untitled scene"
    );

    el.recentList.appendChild(wrap("li", link));
  });
}

/* =========================
   HELPERS
========================= */

function setText(node, value) {
  node.textContent = value;
}

function createLink(href, text) {
  const a = document.createElement("a");
  a.href = href;
  a.textContent = text;
  return a;
}

function wrap(tag, child) {
  const el = document.createElement(tag);
  el.appendChild(child);
  return el;
}

function appendTextItem(parent, text) {
  const li = document.createElement("li");
  li.textContent = text;
  parent.appendChild(li);
}

/* =========================
   INIT
========================= */

updateStats();
