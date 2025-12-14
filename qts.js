/**
 * qts.js – Aeropus Quick Table Grid Scripts
 * Version: 0.2
 * Author: Luković
 * License: MIT
 * Description: Wandelt <qts>-Tags oder externe .aeqts-Dateien in HTML-Grids um.
 */

(function () {

  function parseQTS(qtsEl, rawText = null) {
    const raw = rawText || qtsEl.innerText;

    // Grid-Definition
    const gridMatch = raw.match(/grid\s+h:(\d+);w:(\d+)/i);
    if (!gridMatch) return;
    const h = Number(gridMatch[1]);
    const w = Number(gridMatch[2]);

    // Content parsen
    const contentMatch = raw.match(/<qts-content>([\s\S]*?)<\/qts-content>/i);
    if (!contentMatch) return;
    const content = contentMatch[1]
      .trim()
      .split("\n")
      .map(r => r.split(";").map(c => c.replace(/[\[\]]/g, "").trim()).filter(c => c.length > 0));

    // Grid erstellen
    const grid = document.createElement("div");
    grid.className = "qts-grid";
    grid.style.display = "grid";
    grid.style.gridTemplateColumns = `repeat(${w}, 1fr)`;
    grid.style.gap = "6px";

    content.forEach((row, y) => {
      row.forEach((cell, x) => {
        const d = document.createElement("div");
        d.className = `qts-cell h${y+1} w${x+1}`;
        d.textContent = cell;
        d.style.padding = "6px 10px";
        d.style.borderRadius = "6px";
        d.style.background = "#1e1e1e";
        d.style.color = "#eee";
        d.style.fontFamily = "system-ui, sans-serif";
        d.style.textAlign = "center";
        grid.appendChild(d);
      });
    });

    // Styles anwenden
    const styleMatch = raw.match(/<qts-style>([\s\S]*?)<\/qts-style>/i);
    if (styleMatch) {
      const style = document.createElement("style");
      style.innerHTML = styleMatch[1]
        .replace(/coordinate\s+h:(\*|\d+);w:(\*|\d+)/gi, (_, hh, ww) =>
          `.qts-cell${hh==="*"?"":".h"+hh}${ww==="*"?"":".w"+ww}`
        );
      document.head.appendChild(style);
    }

    if (qtsEl) qtsEl.replaceWith(grid);
    else document.body.appendChild(grid);
  }

  // DOM QTS-Tags automatisch parsen
  function parseAllQTS() {
    document.querySelectorAll("qts").forEach(parseQTS);
  }

  // Externe AEQTS laden
  function loadAEQTS(url) {
    return fetch(url)
      .then(r => r.text())
      .then(txt => parseQTS(null, txt));
  }

  // Auto starten
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", parseAllQTS);
  } else {
    parseAllQTS();
  }

  // Globale Funktion
  window.QTS = {
    load: loadAEQTS
  };

})();
