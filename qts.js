/**
 * qts.js – Aeropus Quick Table Grid Scripts
 * Version: 0.4
 * Author: Luković
 * License: MIT
 * Description: Wandelt <qts>-Tags oder externe .aeqts-Dateien in HTML-Grids um.
 */

(function(){

  function parseQTS(qtsEl, rawText=null){
    const raw = rawText !== null ? rawText : qtsEl.innerHTML;

    // Grid
    const gridMatch = raw.match(/grid\s+h:(\d+);w:(\d+)/i);
    if(!gridMatch) return;
    const w = +gridMatch[2];

    // Content
    const contentMatch = raw.match(/<qts-content>([\s\S]*?)<\/qts-content>/i);
    if(!contentMatch) return;
    const rows = contentMatch[1].trim().split(/\r?\n/).map(r=>
      r.split(";").map(c=>c.replace(/[\[\]]/g,"").trim()).filter(Boolean)
    );

    // Grid erstellen
    const grid = document.createElement("div");
    grid.className = "qts-grid";
    grid.style.display = "grid";
    grid.style.gridTemplateColumns = `repeat(${w},1fr)`;
    grid.style.gap = "6px";

    rows.forEach((row,y)=>{
      row.forEach((cell,x)=>{
        const div = document.createElement("div");
        div.className = `qts-cell h${y+1} w${x+1}`;
        div.textContent = cell;
        div.style.padding="6px 10px";
        div.style.borderRadius="6px";
        div.style.background="#1e1e1e";
        div.style.color="#eee";
        div.style.textAlign="center";
        div.style.fontFamily="system-ui, sans-serif";
        grid.appendChild(div);
      });
    });

    // Styles
    const styleMatch = raw.match(/<qts-style>([\s\S]*?)<\/qts-style>/i);
    if(styleMatch){
      const styleEl=document.createElement("style");
      styleEl.textContent = styleMatch[1].replace(/coordinate\s+h:(\*|\d+);w:(\*|\d+)/gi, (_,hVal,wVal)=>
        `.qts-cell${hVal==="*"?"":".h"+hVal}${wVal==="*"?"":".w"+wVal}`
      );
      document.head.appendChild(styleEl);
    }

    qtsEl.replaceWith(grid);
  }

  function parseAllQTS(){
    document.querySelectorAll("qts").forEach(parseQTS);
  }

  function loadAEQTS(url){
    return fetch(url)
      .then(r=>r.text())
      .then(txt=>parseQTS(null,txt))
      .catch(e=>console.error("QTS load error:",e));
  }

  if(document.readyState==="loading"){
    document.addEventListener("DOMContentLoaded",parseAllQTS);
  }else{
    parseAllQTS();
  }

  window.QTS={load: loadAEQTS};

})();
