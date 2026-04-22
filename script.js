const form = document.getElementById("character-form");
const nameInput = document.getElementById("name");
const descInput = document.getElementById("description");
const list = document.getElementById("character-list");
const cancelBtn = document.getElementById("cancel-edit");
const searchInput = document.getElementById("search");
const exportBtn = document.getElementById("export-data");
const importFile = document.getElementById("import-file");

let characters = JSON.parse(localStorage.getItem("characters")) || [];

let editMode = false;
let editId = null;

form.addEventListener("submit", (e) => {
  e.preventDefault();

  if (editMode) {
    characters = characters.map((char) => {
      if (char.id === editId) {
        return {
          ...char,
          name: nameInput.value,
          description: descInput.value
        };
      }
      return char;
    });

    editMode = false;
    editId = null;

    form.querySelector("button").textContent = "Add character";
  } else {
    const character = {
      id: Date.now(),
      name: nameInput.value,
      description: descInput.value
    };

    characters.push(character);
  }

  renderCharacters();
  form.reset();
});

list.addEventListener("click", (e) => {
  const id = Number(e.target.dataset.id);
  const action = e.target.dataset.action;

  if (!action) return;

  if (action === "delete") {
    characters = characters.filter((char) => char.id !== id);
    renderCharacters();
  }

  if (action === "edit") {
    const character = characters.find((char) => char.id === id);

    nameInput.value = character.name;
    descInput.value = character.description;

    editMode = true;
    editId = id;

    form.querySelector("button").textContent = "Update";
    cancelBtn.style.display = "inline";
  }
});

cancelBtn.addEventListener("click", () => {
  editMode = false;
  editId = null;

  form.reset();
  form.querySelector("button").textContent = "Add character";

  cancelBtn.style.display = "none";
});

searchInput.addEventListener("input", renderCharacters);

exportBtn.addEventListener("click", () => {
  const data = JSON.stringify(characters, null, 2);

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

  const reader = new FileReader();

  reader.onload = (event) => {
    characters = JSON.parse(event.target.result);

    renderCharacters();
  };

  reader.readAsText(file);
});

function renderCharacters() {
  list.innerHTML = "";

  const query = searchInput.value.toLowerCase();

  const filtered = characters.filter((char) =>
    char.name.toLowerCase().includes(query)
  );

  filtered.sort((a, b) => a.name.localeCompare(b.name));

  filtered.forEach((char) => {
    const li = document.createElement("li");

  li.innerHTML = `
  <div class="card">
    <h3>${char.name}</h3>
    <p>${char.description}</p>

    <div class="actions">
      <button data-action="edit" data-id="${char.id}">Edit</button>
      <button data-action="delete" data-id="${char.id}">Delete</button>
    </div>
  </div>
`;

    list.appendChild(li);
  });

  localStorage.setItem("characters", JSON.stringify(characters));
}
renderCharacters();
