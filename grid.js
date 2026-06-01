/* =====================================================================
   grid.js  ·  two small jobs, both commented
   ---------------------------------------------------------------------
   1) SQUARE ROWS : set each grid's --unit (row height) to equal one
      column's width, so cells are true squares at any viewport size.
   2) DRAW LINES  : read each cell's  data-edges="t r b l"  and append a
      <span class="gridline gridline--X"> for each requested side.
   No build step, no dependencies. Just include it before </body>.
   ===================================================================== */

(function () {
  "use strict";

  /* ---- 1. keep every .grid's rows square ---- */
  function sizeGrid(grid) {
    const cs   = getComputedStyle(grid);
    const cols = parseInt(cs.getPropertyValue("--cols")) || 4;
    const padL = parseFloat(cs.paddingLeft)  || 0;
    const padR = parseFloat(cs.paddingRight) || 0;
    const gap  = parseFloat(cs.columnGap)    || 0;        // 0 in our system
    const inner = grid.clientWidth - padL - padR;
    const unit  = (inner - gap * (cols - 1)) / cols;
    grid.style.setProperty("--unit", unit + "px");
  }

  /* ---- 2. turn data-edges into line elements (run once per cell) ---- */
  function drawLines(cell) {
    if (cell.dataset.linesDone) return;          // don't double-draw
    const raw = (cell.dataset.edges || "").trim();
    if (raw) {
      const edges = raw === "all"
        ? ["t", "r", "b", "l"]
        : raw.split(/\s+/);
      edges.forEach(function (e) {
        if (["t", "r", "b", "l"].indexOf(e) === -1) return;
        const ln = document.createElement("span");
        ln.className = "gridline gridline--" + e;
        cell.appendChild(ln);
      });
    }
    cell.dataset.linesDone = "1";
  }

  /* ---- wire everything up ---- */
  function init() {
    const grids = document.querySelectorAll(".grid");
    grids.forEach(function (grid) {
      grid.querySelectorAll(".cell").forEach(drawLines);
      sizeGrid(grid);

      // re-measure on resize (ResizeObserver where available)
      if (window.ResizeObserver) {
        new ResizeObserver(function () { sizeGrid(grid); }).observe(grid);
      }
    });
    window.addEventListener("resize", function () {
      grids.forEach(sizeGrid);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
