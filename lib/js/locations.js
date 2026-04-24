/*Here will be the UI for locations.html*/

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
