(function () {

  function parseQTS(qtsEl) {
    const raw = qtsEl.innerText;

    const gridMatch = raw.match(/grid\s+h:(\d+);w:(\d+)/i);
    if (!gridMatch) return;
    const h = Number(gridMatch[1]);
    const w = Number(gridMatch[2]);

    const contentMatch = raw.match(/<qts-content>([\s\S]*?)<\/qts-content>/i);
    if (!contentMatch) return;
    const content = contentMatch[1]
      .trim()
      .split("\n")
      .map(r => r.split(";").map(c => c.replace(/[\[\]]/g,"").trim()).filter(c => c.length > 0));

    const grid = document.createElement("div");
    grid.className = "qts-grid";
    grid.style.gridTemplateColumns = `repeat(${w}, 1fr)`;

    content.forEach((row, y) => {
      row.forEach((cell, x) => {
        const d = document.createElement("div");
        d.className = `qts-cell h${y+1} w${x+1}`;
        d.textContent = cell;
        grid.appendChild(d);
      });
    });

    const styleMatch = raw.match(/<qts-style>([\s\S]*?)<\/qts-style>/i);
    if (styleMatch) {
      const style = document.createElement("style");
      style.innerHTML = styleMatch[1]
        .replace(/coordinate\s+h:(\*|\d+);w:(\*|\d+)/gi, (_, hh, ww) =>
          `.qts-cell${hh==="*"?"":".h"+hh}${ww==="*"?"":".w"+ww}`
        );
      document.head.appendChild(style);
    }

    qtsEl.replaceWith(grid);
  }

  function parseAllQTS() {
    document.querySelectorAll("qts").forEach(parseQTS);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", parseAllQTS);
  } else {
    parseAllQTS();
  }

})();
