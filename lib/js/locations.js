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
  form: document.getElementById("location-form"),
  name: document.getElementById("name"),
  desc: document.getElementById("description"),
  list: document.getElementById("location-list"),
  cancel: document.getElementById("cancel-edit"),
  search: document.getElementById("search"),
};

el.submit = el.form.querySelector("button[type='submit']");

/* =========================
   STATE
========================= */

const state = {
  locations: load(STORAGE_KEYS.locations),
  editId: null,
};

/* =========================
   CRUD
========================= */

function saveLocations() {
  save(STORAGE_KEYS.locations, state.locations);
}

function upsertLocation({ id, name, description }) {
  if (id) {
    state.locations = state.locations.map(l =>
      l.id === id ? { ...l, name, description } : l
    );
  } else {
    state.locations.push({
      id: Date.now(),
      name,
      description,
    });
  }

  saveLocations();
}

function removeLocation(id) {
  state.locations = state.locations.filter(l => l.id !== id);
  saveLocations();
}

/* =========================
   RENDERING
========================= */

function getLocations() {
  const q = el.search.value.toLowerCase();

  return state.locations
    .filter(l => l.name.toLowerCase().includes(q))
    .sort((a, b) => a.name.localeCompare(b.name));
}

function render() {
  el.list.innerHTML = "";
  getLocations().forEach(l => el.list.appendChild(createCard(l)));
}

function createCard(loc) {
  const li = create("li");

  const card = create("div", { className: "card" });

  const title = create("h3", { text: loc.name });
  const desc = create("p", { text: loc.description });

  const actions = create("div", { className: "actions" });

  ["edit", "delete"].forEach(action => {
    const btn = create("button", {
      text: capitalize(action),
      dataset: { action, id: loc.id },
    });

    if (action === "delete") btn.classList.add("danger");

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

  upsertLocation({
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

  const loc = state.locations.find(l => l.id == id);
  if (!loc) return;

  if (action === "delete") {
    removeLocation(loc.id);
    render();
  }

  if (action === "edit") {
    fillForm(loc);
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

function fillForm(loc) {
  el.name.value = loc.name;
  el.desc.value = loc.description;

  state.editId = loc.id;

  el.submit.textContent = "Update";
  el.cancel.style.display = "inline";
}

function resetForm() {
  state.editId = null;

  el.form.reset();
  el.submit.textContent = "Add location";
  el.cancel.style.display = "none";
}

/* =========================
   INIT
========================= */

render();
