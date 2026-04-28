/* =========================
   IMPORTS
========================= */

import { bindStorageUI } from "./storage.js";
import { load, save, STORAGE_KEYS } from "./shared.js";

/* =========================
   INIT
========================= */

bindStorageUI();

const app = document.getElementById("view");
if (!app) throw new Error("Missing #view");

/* =========================
   STATE
========================= */

const state = {
  characters: load(STORAGE_KEYS.characters) || [],
  currentId: null,
  view: "list" // list | editor
};

function persist() {
  save(STORAGE_KEYS.characters, state.characters);
}

/* =========================
   HELPERS
========================= */

const getCurrent = () =>
  state.characters.find(c => c.id === state.currentId);

/* =========================
   ACTIONS
========================= */

function setView(view, payload = {}) {
  Object.assign(state, payload, { view });
  render();
}

function addCharacter() {
  state.characters.push({
    id: Date.now(),
    name: "Unnamed Character",
    description: "",
    updatedAt: Date.now()
  });

  persist();
  render();
}

function removeCharacter(id) {
  state.characters = state.characters.filter(c => c.id !== id);
  persist();

  setView("list", { currentId: null });
}

/* =========================
   RENDER ROOT
========================= */

function render() {
  app.innerHTML = "";

  if (state.view === "list") renderList();
  if (state.view === "editor") renderEditor();
}

/* =========================
   LIST VIEW (GRID)
========================= */

function renderList() {
  const grid = create("div", "card-grid");

  app.append(
    createButton("+ New Character", addCharacter),
    grid
  );

  state.characters
    .sort((a, b) => a.name.localeCompare(b.name))
    .forEach(char => {
      grid.appendChild(
        createCard(
          char.name,
          preview(char.description),
          () => setView("editor", { currentId: char.id })
        )
      );
    });
}

/* =========================
   EDITOR VIEW
========================= */

function renderEditor() {
  const char = getCurrent();
  if (!char) return setView("list");

  const title = create("input", "scene-title");
  const content = create("textarea", "scene-content");

  title.value = char.name;
  content.value = char.description;

  const saveChanges = debounce(() => {
    char.name = title.value;
    char.description = content.value;
    char.updatedAt = Date.now();
    persist();
  }, 300);

  title.addEventListener("input", saveChanges);
  content.addEventListener("input", saveChanges);

  const topBar = createTopBar([
    ["← Back", () => setView("list")],
    ["Delete", () => removeCharacter(char.id), "danger"]
  ]);

  app.append(topBar, title, content);
}

/* =========================
   COMPONENTS
========================= */

function create(tag, className) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  return el;
}

function createButton(text, handler, type) {
  const btn = create("button");
  btn.textContent = text;

  if (type === "danger") {
    btn.classList.add("danger");
  }

  btn.onclick = handler;
  return btn;
}

function createTopBar(buttons) {
  const bar = create("div", "top-actions");

  buttons.forEach(([text, handler, type]) => {
    bar.appendChild(createButton(text, handler, type));
  });

  return bar;
}

function createCard(title, subtitle, onClick) {
  const card = create("div", "card");

  const h3 = create("h3");
  const p = create("p");

  h3.textContent = title;
  p.textContent = subtitle;

  card.append(h3, p);
  card.onclick = onClick;

  return card;
}

/* =========================
   UTILITIES
========================= */

function preview(text = "") {
  return text.length > 80
    ? text.slice(0, 80).trim() + "..."
    : text || "No description...";
}

function debounce(fn, delay = 300) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), delay);
  };
}

/* =========================
   START
========================= */

render();
