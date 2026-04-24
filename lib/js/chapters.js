import { load, save, STORAGE_KEYS } from "./shared.js";

/* =========================
   STATE
========================= */

const app = document.getElementById("view");

let chapters = load(STORAGE_KEYS.chapters);
let currentChapterId = null;

/* =========================
   INIT
========================= */

renderChapters();

/* =========================
   STORAGE
========================= */

const persist = () =>
  save(STORAGE_KEYS.chapters, chapters);

const findChapter = id =>
  chapters.find(c => c.id === id);

/* =========================
   RENDER: CHAPTER LIST
========================= */

function renderChapters() {
  clear();

  const grid = create("div", "card-grid");

  app.append(
    createButton("+ New Chapter", createChapter),
    grid
  );

  chapters.forEach(ch =>
    grid.appendChild(
      createCard(
        ch.title,
        `${ch.scenes.length} scenes`,
        () => openChapter(ch.id)
      )
    )
  );
}

/* =========================
   CHAPTER CRUD
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

function deleteChapter(id) {
  chapters = chapters.filter(c => c.id !== id);
  persist();
  renderChapters();
}

/* =========================
   OPEN CHAPTER
========================= */

function openChapter(id) {
  currentChapterId = id;

  const chapter = findChapter(id);
  if (!chapter) return;

  clear();

  const grid = create("div", "card-grid");

  const title = create("h2");
  title.textContent = chapter.title;
  title.style.cssText = "text-align:center;margin:10px 0 20px;";

  const topBar = createTopBar([
    ["← Back", renderChapters],
    ["+ Scene", createScene],
    ["Delete", () => deleteChapter(id), "danger"]
  ]);

  app.append(topBar, title, grid);

  chapter.scenes.forEach(scene =>
    grid.appendChild(
      createCard(
        scene.title,
        preview(scene.content),
        () => openScene(scene.id)
      )
    )
  );
}

/* =========================
   SCENES
========================= */

function createScene() {
  const chapter = findChapter(currentChapterId);
  if (!chapter) return;

  chapter.scenes.push({
    id: Date.now(),
    title: "Untitled Scene",
    content: "",
    updatedAt: Date.now()
  });

  persist();
  openChapter(currentChapterId);
}

function deleteScene(id) {
  const chapter = findChapter(currentChapterId);
  if (!chapter) return;

  chapter.scenes = chapter.scenes.filter(s => s.id !== id);

  persist();
  openChapter(currentChapterId);
}

/* =========================
   SCENE VIEW
========================= */

function openScene(id) {
  const chapter = findChapter(currentChapterId);
  const scene = chapter?.scenes.find(s => s.id === id);
  if (!scene) return;

  clear();

  const title = create("input");
  const content = create("textarea");

  title.value = scene.title;
  content.value = scene.content;

  const saveScene = () => {
    scene.title = title.value;
    scene.content = content.value;
    scene.updatedAt = Date.now();
    persist();
  };

  title.addEventListener("input", saveScene);
  content.addEventListener("input", saveScene);

  const topBar = createTopBar([
    ["← Back", () => openChapter(currentChapterId)],
    ["Delete", () => deleteScene(id), "danger"]
  ]);

  app.append(topBar, title, content);
}

/* =========================
   Import / Export
========================= */

import { exportProject, importProject } from "./storage.js";

document.getElementById("export-data")
  ?.addEventListener("click", exportProject);

document.getElementById("import-file")
  ?.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) importProject(file);
  });

/* =========================
   HELPERS
========================= */

function clear() {
  app.innerHTML = "";
}

function create(tag, className) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  return el;
}

function createButton(text, handler, type) {
  const btn = create("button");

  btn.textContent = text;
  if (type === "danger") btn.style.background = "#ff4d4d";

  btn.addEventListener("click", handler);
  return btn;
}

function createTopBar(buttons) {
  const bar = create("div", "top-actions");

  buttons.forEach(([text, handler, type]) =>
    bar.appendChild(createButton(text, handler, type))
  );

  return bar;
}

function createCard(title, subtitle, onClick) {
  const card = create("div", "card");

  const h3 = document.createElement("h3");
  h3.textContent = title;

  const p = document.createElement("p");
  p.textContent = subtitle;

  card.append(h3, p);
  card.addEventListener("click", onClick);

  return card;
}

function preview(text = "") {
  return text.length > 80
    ? text.slice(0, 80).trim() + "..."
    : text || "Empty scene...";
}
