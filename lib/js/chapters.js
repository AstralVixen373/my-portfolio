/* =========================
   Imports
========================= */

import { bindStorageUI } from "./storage.js";
import { load, save, STORAGE_KEYS } from "./shared.js";
import { exportProject, importProject, deleteProjectData } from "./storage.js";

/* =========================
   INIT STORAGE UI
========================= */

bindStorageUI();

/* =========================
   STATE
========================= */

const app = document.getElementById("view");

if (!app) {
  throw new Error("Missing #view element in HTML");
}

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

  const titleWrapper = create("div");
  titleWrapper.style.cssText = "display:flex;align-items:center;justify-content:center;gap:10px;margin:10px 0 20px;";

  const title = create("h2");
  title.textContent = chapter.title;
  title.style.margin = "0";

  const editBtn = create("button");
  editBtn.textContent = "✍️";
  editBtn.style.cssText = `
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0;

    display: flex;
    align-items: center;
    justify-content: center;

    font-size: 20px;
    line-height: 1;
    height: 100%;

    transform: translateY(-1px);
    opacity: 1;
  `;

  const titleInput = create("input");
  titleInput.value = chapter.title;
  titleInput.style.display = "none";
  titleInput.style.textAlign = "center";
  titleInput.style.fontSize = "1.5rem";
  titleInput.style.fontWeight = "bold";

  function saveTitle() {
    const newTitle = titleInput.value.trim();
    if (!newTitle) return;

    chapter.title = newTitle;
    persist();
    renderChapters();
  }

  editBtn.addEventListener("click", () => {
    title.style.display = "none";
    editBtn.style.display = "none";

    titleInput.style.display = "block";
    titleInput.focus();
  });

  titleInput.addEventListener("blur", () => {
    title.style.display = "block";
    editBtn.style.display = "inline-block";

    saveTitle();
  });

  titleInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      titleInput.blur();
    }
  });

  titleWrapper.append(title, titleInput, editBtn);
  title.style.cssText = "text-align:center;margin:10px 0 20px;";

  const topBar = createTopBar([
    ["← Back", renderChapters],
    ["+ Scene", createScene],
    ["Delete", () => deleteChapter(id), "danger"]
  ]);

  app.append(topBar, titleWrapper, grid);

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

  const title = document.createElement("input");
  const content = document.createElement("textarea");

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
