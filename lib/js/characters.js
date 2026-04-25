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
   DOM
========================= */

const el = {
  form: document.getElementById("character-form"),
  name: document.getElementById("name"),
  desc: document.getElementById("description"),
  list: document.getElementById("character-list"),
  cancel: document.getElementById("cancel-edit"),
  search: document.getElementById("search"),
};

el.submit = el.form.querySelector("button[type='submit']");

/* =========================
   STATE
========================= */

const state = {
  characters: load(STORAGE_KEYS.characters),
  editId: null,
};

/* =========================
   CRUD
========================= */

function saveCharacters() {
  save(STORAGE_KEYS.characters, state.characters);
}

function upsertCharacter({ id, name, description }) {
  if (id) {
    state.characters = state.characters.map(c =>
      c.id === id ? { ...c, name, description } : c
    );
  } else {
    state.characters.push({
      id: Date.now(),
      name,
      description,
    });
  }

  saveCharacters();
}

function removeCharacter(id) {
  state.characters = state.characters.filter(c => c.id !== id);
  saveCharacters();
}

/* =========================
   RENDERING
========================= */

function getCharacters() {
  const q = el.search.value.toLowerCase();

  return state.characters
    .filter(c => c.name.toLowerCase().includes(q))
    .sort((a, b) => a.name.localeCompare(b.name));
}

function render() {
  el.list.innerHTML = "";
  getCharacters().forEach(c => el.list.appendChild(createCard(c)));
}

function createCard(char) {
  const li = create("li");

  const card = create("div", { className: "card" });

  const title = create("h3", { text: char.name });
  const desc = create("p", { text: char.description });

  const actions = create("div", { className: "actions" });

  ["edit", "delete"].forEach(action => {
    const btn = create("button", {
      text: capitalize(action),
      dataset: { action, id: char.id },
    });

    if (action === "delete") {
      btn.classList.add("danger");
    }

    actions.appendChild(btn);
  });

  card.append(title, desc, actions);
  li.appendChild(card);

  return li;
}

/* =========================
   EVENTS
========================= */

el.form.addEventListener("submit", e => {
  e.preventDefault();

  const name = el.name.value.trim();
  const description = el.desc.value.trim();
  if (!name || !description) return;

  upsertCharacter({
    id: state.editId,
    name,
    description,
  });

  resetForm();
  render();
});

el.list.addEventListener("click", e => {
  const { action, id } = e.target.dataset;
  if (!action) return;

  const char = state.characters.find(c => c.id == id);
  if (!char) return;

  if (action === "delete") {
    removeCharacter(char.id);
    render();
  }

  if (action === "edit") {
    fillForm(char);
  }
});

el.cancel.addEventListener("click", resetForm);
el.search.addEventListener("input", render);

/* =========================
   HELPERS
========================= */

function create(tag, opts = {}) {
  const el = document.createElement(tag);

  if (opts.className) el.className = opts.className;
  if (opts.text) el.textContent = opts.text;

  if (opts.dataset) {
    Object.entries(opts.dataset).forEach(([k, v]) => {
      el.dataset[k] = v;
    });
  }

  return el;
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function fillForm(char) {
  el.name.value = char.name;
  el.desc.value = char.description;

  state.editId = char.id;

  el.submit.textContent = "Update";
  el.cancel.style.display = "inline";
}

function resetForm() {
  state.editId = null;

  el.form.reset();
  el.submit.textContent = "Add character";
  el.cancel.style.display = "none";
}

/* =========================
   INIT
========================= */

render();
