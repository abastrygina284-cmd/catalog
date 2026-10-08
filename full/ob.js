// Раздел «Обработка»: рисует себя в <div id="ob-root" class="ob"> по данным window.OBD (файл ob-data.js).
// Работает и на obrabotka.html, и в общем каталоге index.html. Тексты и карточки правятся в редакторе admin.html.
(function () {
  var root = document.getElementById("ob-root"), D = window.OBD;
  if (!root || !D) return;
  var PRINT = /[?&]print\b/.test(location.search);   // PDF не умеет WebP — для него JPEG из img/print
  function pic(name) { return PRINT ? "img/print/ob_" + name + ".jpg" : "img/ob_" + name + ".webp"; }

  // в общем каталоге раздел триплекса на той же странице, на отдельной — в соседнем файле
  var txHref = document.getElementById("tx-root") ? "#triplex" : "triplex.html";

  root.innerHTML =
    '<section class="part one" id="obrabotka"><div><div class="kicker">' + D.hero.kicker + "</div>" +
    "<h2>" + D.hero.title + " <em>" + D.hero.em + "</em></h2><p>" + D.hero.text + "</p></div></section>" +
    D.groups.filter(function (c) { return !c.hide; }).map(function (c) {
      var items = c.items.filter(function (i) { return !i.hide; });
      return '<div class="sec"><h2>' + c.g + "</h2><p>" + (c.lead || "") + '</p></div><div class="grid">' + items.map(function (i) {
        var top = '<div class="ph"><img src="' + pic(i.ph) + '" alt="' + i.n + '"' + (PRINT ? "" : ' loading="lazy"') + "></div>";
        // extra — маленькая вторая картинка с подписью (например, как разрушается закалённое стекло)
        var extra = i.extra ? '<div class="sum" style="justify-content:flex-start;gap:12px"><img src="' + pic(i.extra[0]) + '" alt="" style="width:92px;height:92px;flex:none"><span style="flex:1;min-width:0;font-size:12px;color:var(--muted);font-weight:600;line-height:1.3">' + i.extra[1] + "</span></div>" : "";
        var o = i.o || [];
        return '<article class="card">' + top + extra + '<div class="body"><div class="name">' + i.n + '</div><div class="desc">' + (i.d || "") +
          (i.link ? ' <a href="' + txHref + '" style="color:var(--accent);font-weight:700;white-space:nowrap">Все варианты →</a>' : "") + "</div>" +
          (o.length ? '<div class="opts">' + o.map(function (x) { return "<span>" + x + "</span>"; }).join("") + "</div>" : "") + "</div></article>";
      }).join("") + "</div>";
    }).join("");
})();
