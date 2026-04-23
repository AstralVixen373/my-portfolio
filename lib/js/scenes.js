import { load, save } from "./shared.js";

const STORAGE_KEY = "sb_chapters";

/* =========================
   DOM
========================= */

const app = document.getElementById("view");

/* =========================
   STATE
========================= */

let chapters = load(STORAGE_KEY);
let currentChapterId = null;

/* =========================
   INIT
========================= */

renderChapters();

/* =========================
   CORE
========================= */

function persist() {
  save(STORAGE_KEY, chapters);
}

function findChapter(id) {
  return chapters.find(c => c.id === id);
}

/* =========================
   VIEW 1: CHAPTERS
========================= */

function renderChapters() {
  clearApp();

  const grid = create("div", { className: "card-grid" });

  const btn = createButton("+ New Chapter", createChapter);

  app.append(btn, grid);

  chapters.forEach(ch => {
    grid.appendChild(
      createCard(
        ch.title,
        `${ch.scenes.length} scenes`,
        () => openChapter(ch.id)
      )
    );
  });
}

/* =========================
   CHAPTER
========================= */

function createChapter() {
  chapters.push({
    id: Date.now(),
    title: "Untitled Chapter",
    scenes: []
  });

  persist();
  renderChapters();
}

function openChapter(id) {
  currentChapterId = id;
  const chapter = findChapter(id);

  clearApp();

  const grid = create("div", { className: "card-grid" });

  const topBar = createTopBar([
    ["← Back", renderChapters],
    ["+ New Scene", createScene],
    ["Delete Chapter", () => deleteChapter(id), "danger"]
  ]);

  const title = create("h2", {
    text: chapter?.title || "",
    style: "text-align:center; margin:10px 0 20px;"
  });

  app.append(topBar, title, grid);

  chapter.scenes.forEach(scene => {
    grid.appendChild(
      createCard(
        scene.title,
        preview(scene.content),
        () => openScene(scene.id)
      )
    );
  });
}

function deleteChapter(id) {
  chapters = chapters.filter(c => c.id !== id);
  persist();
  renderChapters();
}

/* =========================
   SCENES
========================= */

function createScene() {
  const chapter = findChapter(currentChapterId);

  chapter.scenes.push({
    id: Date.now(),
    title: "Untitled Scene",
    content: "",
    updatedAt: Date.now()
  });

  persist();
  openChapter(currentChapterId);
}

function openScene(id) {
  const chapter = findChapter(currentChapterId);
  const scene = chapter.scenes.find(s => s.id === id);
  if (!scene) return;

  clearApp();

  const topBar = createTopBar([
    ["← Back", () => openChapter(currentChapterId)],
    ["Delete Scene", () => deleteScene(id), "danger"]
  ], "scene-actions");

  const title = create("input");
  title.value = scene.title;

  const content = create("textarea");
  content.value = scene.content;

  const save = () => {
    scene.title = title.value;
    scene.content = content.value;
    scene.updatedAt = Date.now();
    persist();
  };

  title.addEventListener("input", save);
  content.addEventListener("input", save);

  app.append(topBar, title, content);
}

function deleteScene(id) {
  const chapter = findChapter(currentChapterId);
  chapter.scenes = chapter.scenes.filter(s => s.id !== id);

  persist();
  openChapter(currentChapterId);
}

/* =========================
   HELPERS (DRY CORE)
========================= */

function clearApp() {
  app.innerHTML = "";
}

function create(tag, opts = {}) {
  const el = document.createElement(tag);

  if (opts.className) el.className = opts.className;
  if (opts.text) el.textContent = opts.text;
  if (opts.style) el.style = opts.style;

  return el;
}

function createButton(text, handler, type) {
  const btn = create("button", { text });

  if (type === "danger") btn.style.background = "#ff4d4d";

  btn.addEventListener("click", handler);
  return btn;
}

function createTopBar(buttons, extraClass = "chapter-actions") {
  const bar = create("div", {
    className: `top-actions ${extraClass}`
  });

  buttons.forEach(([text, handler, type]) => {
    bar.appendChild(createButton(text, handler, type));
  });

  return bar;
}

function createCard(title, subtitle, onClick) {
  const card = create("div", { className: "card" });

  const h3 = create("h3", { text: title });
  const p = create("p", { text: subtitle });

  card.append(h3, p);
  card.addEventListener("click", onClick);

  return card;
}

function preview(text = "") {
  return text.length > 80
    ? text.slice(0, 80).trim() + "..."
    : text || "Empty scene...";
}
