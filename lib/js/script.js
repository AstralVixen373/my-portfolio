/* =========================
   DOM Elements
========================= */

const form = document.getElementById("character-form");
const nameInput = document.getElementById("name");
const descInput = document.getElementById("description");
const list = document.getElementById("character-list");
const cancelBtn = document.getElementById("cancel-edit");
const searchInput = document.getElementById("search");
const exportBtn = document.getElementById("export-data");
const importFile = document.getElementById("import-file");

const submitBtn = form.querySelector("button[type='submit']");

/* =========================
   State
========================= */

const STORAGE_KEY = "characters";

let state = {
  characters: loadCharacters(),
  editMode: false,
  editId: null,
};

/* =========================
   Storage Helpers
========================= */

function loadCharacters() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveCharacters() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.characters));
}

/* =========================
   Core CRUD Actions
========================= */

function addCharacter(name, description) {
  state.characters.push({
    id: Date.now(),
    name,
    description,
  });

  saveCharacters();
}

function updateCharacter(id, name, description) {
  state.characters = state.characters.map((char) =>
    char.id === id ? { ...char, name, description } : char
  );

  saveCharacters();
}

function deleteCharacter(id) {
  state.characters = state.characters.filter((c) => c.id !== id);
  saveCharacters();
}

/* =========================
   Rendering
========================= */

function getFilteredCharacters() {
  const query = searchInput.value.toLowerCase();

  return state.characters
    .filter((c) => c.name.toLowerCase().includes(query))
    .sort((a, b) => a.name.localeCompare(b.name));
}

function render() {
  list.innerHTML = "";

  const characters = getFilteredCharacters();

  characters.forEach(renderCharacter);
}

function renderCharacter(char) {
  const li = document.createElement("li");

  const card = document.createElement("div");
  card.className = "card";

  const title = document.createElement("h3");
  title.textContent = char.name;

  const desc = document.createElement("p");
  desc.textContent = char.description;

  const actions = document.createElement("div");
  actions.className = "actions";

  const editBtn = document.createElement("button");
  editBtn.textContent = "Edit";
  editBtn.dataset.action = "edit";
  editBtn.dataset.id = char.id;

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.dataset.action = "delete";
  deleteBtn.dataset.id = char.id;

  actions.append(editBtn, deleteBtn);
  card.append(title, desc, actions);
  li.appendChild(card);

  list.appendChild(li);
}

/* =========================
   Form Handling
========================= */

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = nameInput.value.trim();
  const description = descInput.value.trim();

  if (!name || !description) return;

  if (state.editMode) {
    updateCharacter(state.editId, name, description);

    state.editMode = false;
    state.editId = null;
    submitBtn.textContent = "Add character";
    cancelBtn.style.display = "none";
  } else {
    addCharacter(name, description);
  }

  form.reset();
  render();
});

/* =========================
   List Actions (Edit/Delete)
========================= */

list.addEventListener("click", (e) => {
  const id = Number(e.target.dataset.id);
  const action = e.target.dataset.action;

  if (!action) return;

  if (action === "delete") {
    deleteCharacter(id);
    render();
  }

  if (action === "edit") {
    const char = state.characters.find((c) => c.id === id);
    if (!char) return;

    nameInput.value = char.name;
    descInput.value = char.description;

    state.editMode = true;
    state.editId = id;

    submitBtn.textContent = "Update";
    cancelBtn.style.display = "inline";
  }
});

/* =========================
   Cancel Edit
========================= */

cancelBtn.addEventListener("click", () => {
  state.editMode = false;
  state.editId = null;

  form.reset();
  submitBtn.textContent = "Add character";
  cancelBtn.style.display = "none";
});

/* =========================
   Search
========================= */

searchInput.addEventListener("input", render);

/* =========================
   Export / Import
========================= */

exportBtn.addEventListener("click", () => {
  const data = JSON.stringify(state.characters, null, 2);

  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "characters.json";
  a.click();

  URL.revokeObjectURL(url);
});

importFile.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = (event) => {
    try {
      state.characters = JSON.parse(event.target.result);
      saveCharacters();
      render();
    } catch {
      alert("Invalid JSON file");
    }
  };

  reader.readAsText(file);

  importFile.value = "";
});

/* =========================
   Init
========================= */

render();
