/* =========================
   IMPORTS
========================= */

import { bindStorageUI } from "./storage.js";
import { load, STORAGE_KEYS } from "./shared.js";
import { createLinkManager } from "./linkManager.js";
import { createGraph } from "./graphRenderer.js";

/* =========================
   INIT
========================= */

bindStorageUI();

/* =========================
   STATE
========================= */

const state = {
  characters: load(STORAGE_KEYS.characters),
  locations: load(STORAGE_KEYS.locations)
};

/* =========================
   GRAPH INIT
========================= */

const container = document.getElementById("graph-view");

const graph = createGraph(container);

graph.render(state);
