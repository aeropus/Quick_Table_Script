/**
 * qts.js – Aeropus Quick Table Grid Scripts
 * Version: 0.3
 * Author: Luković
 * License: MIT
 * Description: Wandelt <qts>-Tags oder externe .aeqts-Dateien in HTML-Grids um.
 */

(function(){

  function parseQTS(qtsEl, rawText = null) {
    // rawText benutzen, wenn extern geladen
    const raw = rawText !== null ? rawText : qtsEl.innerHTML;

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
      .map(row => row.split(";")
        .map(c => c.replace(/[\[\]]/g, "").trim())
        .filter(c => c.length > 0)
      );

    // Grid erstellen
    const grid = document.createElement("div");
    grid.className = "qts-grid";
    grid.style.display = "grid";
    grid.style.gridTemplateColumns = `repeat(${w}, 1fr)`;
    grid.style.gap = "6px";

    content.forEach((row, y) => {
      row.forEach((cell, x) => {
        const div = document.createElement("div");
        div.className = `qts-cell h${y+1} w${x+1}`;
        div.textContent = cell;
        div.style.padding = "6px 10px";
        div.style.borderRadius = "6px";
        div.style.background = "#1e1e1e";
        div.style.color = "#eee";
        div.style.textAlign = "center";
        grid.appendChild(div);
      });
    });

    // Styles anwenden
    const styleMatch = raw.match(/<qts-style>([\s\S]*?)<\/qts-style>/i);
    if(styleMatch){
      const styleEl = document.createElement("style");
      styleEl.textContent = styleMatch[1]
        .replace(/coordinate\s+h:(\*|\d+);w:(\*|\d+)/gi, (_,hVal,wVal)=>
          `.qts-cell${hVal==="*"?"":".h"+hVal}${wVal==="*"?"":".w"+wVal}`
        );
      document.head.appendChild(styleEl);
    }

    if(qtsEl) qtsEl.replaceWith(grid);
    else document.body.appendChild(grid);
  }

  // DOM QTS-Tags automatisch parsen
  function parseAllQTS() {
    document.querySelectorAll("qts").forEach(parseQTS);
  }

  // Externe AEQTS laden
  function loadAEQTS(url) {
    return fetch(url)
      .then(res => res.text())
      .then(txt => parseQTS(null, txt))
      .catch(err => console.error("QTS load error:", err));
  }

  // Auto starten
  if(document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", parseAllQTS);
  } else {
    parseAllQTS();
  }

  // Globale Funktion
  window.QTS = {
    load: loadAEQTS
  };

})();
