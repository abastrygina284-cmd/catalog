// Раскладка карточек без «одиночек»: для каждой сетки подбирается число колонок так, чтобы последний ряд
// не состоял из одной карточки (5 позиций — все пять в ряд помельче, 6 — два ряда по три и т. д.).
// На телефоне (2 колонки) нечётная последняя карточка растягивается на всю ширину. В PDF (?print) раскладка своя.
(function () {
  var MIN = 215, BASE = 270, GAP = 20;
  // PDF (лист A4): у разделов триплекса и обработок число колонок подбирается так же — без одиночной карточки в последнем ряду
  function pick(n, prefs) {
    var i, c;
    for (i = 0; i < prefs.length; i++) { c = prefs[i]; if (n >= c && n % c === 0) return c; }
    for (i = 0; i < prefs.length; i++) { c = prefs[i]; if (n >= c && n % c >= 2) return c; }
    return prefs[prefs.length - 1];
  }
  function balancePdf() {
    document.querySelectorAll(".tx .grid, .ob .grid").forEach(function (g) {
      g.style.setProperty("--pc", pick(g.children.length, g.closest(".ob") ? [3, 4, 5] : [5, 4, 3]));
      g.style.setProperty("--pa", "1/1");
    });
  }
  function balance() {
    if (document.documentElement.classList.contains("pdf")) { balancePdf(); return; }
    document.querySelectorAll(".grid").forEach(function (g) {
      var n = g.children.length, last = g.lastElementChild;
      if (!n) return;
      last.style.gridColumn = "";
      if (window.innerWidth <= 640) {
        g.style.gridTemplateColumns = "";
        if (n % 2 === 1 && n > 1) last.style.gridColumn = "1 / -1";
        return;
      }
      var W = g.clientWidth, fit = Math.max(1, Math.floor((W + GAP) / (BASE + GAP))), best = fit, bestScore = 1e9;
      for (var c = Math.min(fit + 1, 6); c >= Math.max(2, fit - 1); c--) {
        if ((W - GAP * (c - 1)) / c < MIN) continue;
        var rem = n % c;
        var score = (n < c ? (c - n) * 1.5 : rem === 0 ? 0 : rem === 1 ? 6 : 1 + (c - rem) / c) + Math.abs(c - fit) * 0.2;
        if (score < bestScore) { bestScore = score; best = c; }
      }
      g.style.gridTemplateColumns = "repeat(" + best + ",minmax(0,1fr))";
    });
  }
  // PDF «одной длинной страницей» (index.html?print&long): лист шириной 210 мм и высотой во весь каталог, без разрывов.
  // Chrome/Edge допускают страницу до 200 дюймов (5080 мм) — каталог занимает около 3,5 м.
  function longPage() {
    var st = document.createElement("style");
    st.textContent = ".pdf .part{break-before:auto;margin-top:6mm}.pdf body{padding:6mm 0 4mm}.pdf .card,.pdf .sec,.pdf .notes,.pdf .invite,.pdf .spec,.pdf .fl{break-inside:auto;break-after:auto}";
    document.head.appendChild(st);
    var mm = Math.ceil(document.documentElement.scrollHeight * 25.4 / 96) + 4;
    var pg = document.createElement("style");
    pg.textContent = "@page{size:210mm " + mm + "mm;margin:0}";
    document.head.appendChild(pg);
    document.documentElement.setAttribute("data-long-mm", mm);
  }
  balance();
  window.addEventListener("resize", balance);
  if (document.documentElement.classList.contains("pdf") && /[?&]long\b/.test(location.search)) {
    if (document.readyState === "complete") longPage(); else window.addEventListener("load", longPage);
  }
})();
