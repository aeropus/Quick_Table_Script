/**
 * qts.js – Aeropus Quick Table Grid Scripts
 */

(function() {

  function parseQTS(qtsEl) {
    const raw = qtsEl.textContent;

    // Grid
    const gridMatch = raw.match(/grid\s+h:(\d+);w:(\d+)/i);
    if (!gridMatch) return;
    const h = Number(gridMatch[1]);
    const w = Number(gridMatch[2]);

    // Content
    const contentMatch = raw.match(/<qts-content>([\s\S]*?)<\/qts-content>/i);
    if (!contentMatch) return;
    const content = contentMatch[1].trim().split("\n").map(line =>
      line.split(";").map(cell => cell.replace(/[\[\]]/g, "").trim()).filter(c => c.length > 0)
    );

    // Grid erzeugen
    const gridDiv = document.createElement("div");
    gridDiv.className = "qts-grid";
    gridDiv.style.display = "grid";
    gridDiv.style.gridTemplateColumns = `repeat(${w}, 1fr)`;
    gridDiv.style.gap = "6px";

    content.forEach((row, y) => {
      row.forEach((cell, x) => {
        const cellDiv = document.createElement("div");
        cellDiv.className = `qts-cell h${y+1} w${x+1}`;
        cellDiv.textContent = cell;
        cellDiv.style.padding = "6px 10px";
        cellDiv.style.borderRadius = "6px";
        cellDiv.style.background = "#1e1e1e";
        cellDiv.style.color = "#eee";
        cellDiv.style.textAlign = "center";
        gridDiv.appendChild(cellDiv);
      });
    });

    // Styles anwenden
    const styleMatch = raw.match(/<qts-style>([\s\S]*?)<\/qts-style>/i);
    if (styleMatch) {
      const styleEl = document.createElement("style");
      let styleText = styleMatch[1]
        .replace(/coordinate\s+h:(\*|\d+);w:(\*|\d+)/gi, (_, hVal, wVal) =>
          `.qts-cell${hVal==="*"?"":".h"+hVal}${wVal==="*"?"":".w"+wVal}`
        );
      styleEl.textContent = styleText;
      document.head.appendChild(styleEl);
    }

    qtsEl.replaceWith(gridDiv);
  }

  function parseAllQTS() {
    document.querySelectorAll("qts").forEach(parseQTS);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", parseAllQTS);
  } else {
    parseAllQTS();
  }

  window.QTS = { load: url => fetch(url).then(r => r.text()).then(txt => parseQTS({textContent: txt})) };

})();
