import { STORAGE_KEYS, load, save } from "./shared.js";

export function exportProject() {
  const data = {
    characters: load(STORAGE_KEYS.characters),
    chapters: load(STORAGE_KEYS.chapters),
    locations: load(STORAGE_KEYS.locations),
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "story-project.json";
  a.click();

  URL.revokeObjectURL(url);
}

export function importProject(file) {
  const reader = new FileReader();

  reader.onload = ({ target }) => {
    try {
      const data = JSON.parse(target.result);

      if (Array.isArray(data.characters)) {
        save(STORAGE_KEYS.characters, data.characters);
      }

      if (Array.isArray(data.chapters)) {
        save(STORAGE_KEYS.chapters, data.chapters);
      }

      if (Array.isArray(data.locations)) {
        save(STORAGE_KEYS.locations, data.locations);
      }

      location.reload();
    } catch {
      alert("Invalid project file");
    }
  };

  reader.readAsText(file);
}
