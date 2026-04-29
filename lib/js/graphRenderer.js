export function createGraph(container) {
  return {
    render(state) {
      container.innerHTML = "";

      const nodes = [];
      const links = [];

      console.log("RELATIONSHIP GRAPH MODULE LOADED");
      console.log("GRAPH STATE:", state);
      console.log("NODES:", nodes);
      console.log("CONTAINER SIZE:", container.clientWidth, container.clientHeight);

      if (!state) return;

/* =========================
     BUILD NODES
  ========================= */

      Object.entries(state).forEach(([type, items]) => {
        items.forEach(item => {
          nodes.push({
            id: item.id,
            name: item.name,
            type
          });
        });
      });

/* =========================
     BUILD LINKS
  ========================= */

      nodes.forEach(node => {
        const item = state[node.type].find(i => i.id === node.id);
        if (!item?.links) return;

        Object.entries(item.links).forEach(([type, ids]) => {
          ids.forEach(targetId => {
            links.push({
              from: node.id,
              to: targetId
            });
          });
        });
      });

/* =========================
     LAYOUT
  ========================= */
      const width = container.clientWidth;
      const height = container.clientHeight;

      if (nodes.length === 0 || width === 0 || height === 0) {
        container.innerHTML = "<p style='padding:10px'>No graph data</p>";
        return;
      }

      const positions = {};

      nodes.forEach((node, i) => {
        const angle = (i / nodes.length) * Math.PI * 2;

        positions[node.id] = {
          x: width / 2 + Math.cos(angle) * 140,
          y: height / 2 + Math.sin(angle) * 140
        };
      });

/* =========================
     DRAW LINKS
  ========================= */

      links.forEach(link => {
        const a = positions[link.from];
        const b = positions[link.to];
        if (!a || !b) return;

        const line = document.createElement("div");
        line.className = "line";

        const dx = b.x - a.x;
        const dy = b.y - a.y;

        const length = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx) * 180 / Math.PI;

        line.style.width = length + "px";
        line.style.left = a.x + "px";
        line.style.top = a.y + "px";
        line.style.transform = `rotate(${angle}deg)`;

        container.appendChild(line);
      });

 /* =========================
     DRAW NODES
  ========================= */

      nodes.forEach(node => {
        const el = document.createElement("div");
        el.className = `node ${node.type}`;
        el.textContent = node.name;

        el.style.left = positions[node.id].x + "px";
        el.style.top = positions[node.id].y + "px";

        container.appendChild(el);
      });
    }
  };
}
