// Раздел «Триплекс»: рисует себя в <div id="tx-root" class="tx"> по данным window.TXD (файл tx-data.js).
// Работает и на triplex.html, и в общем каталоге index.html. Тексты и карточки правятся в редакторе admin.html.
// Картинки img/tx_*.webp собирает _Скрипты/triplex_images.py или загружает редактор.
(function () {
  var root = document.getElementById("tx-root"), D = window.TXD;
  if (!root || !D) return;
  var PRINT = /[?&]print\b/.test(location.search);   // PDF не умеет WebP — для него JPEG из img/print
  function pic(name) { return PRINT ? "img/print/" + name + ".jpg" : "img/" + name + ".webp"; }

  var CLS = {g: "glass", m: "mirror", f: "lam"};
  function iso(ly) {
    return '<div class="st">' + ly.map(function (l, i) {
      return '<div class="ly ' + CLS[l[0]] + '" style="--z:' + (i - 1) + (l[1] ? ";--c:" + l[1] : "") + '"></div>';
    }).join("") + "</div>";
  }
  // состав под картинкой: "#цвет" — плашка, "tx_…" — картинка триплекса, иначе номер фото стекла
  function part(p) {
    var img = /^tx_/.test(p[0]) ? '<img src="' + pic(p[0]) + '" alt="">' : p[0].charAt(0) == "#" ? '<span class="chip" style="background:' + p[0] + '"></span>' : '<img src="' + (PRINT ? "img/print/" + p[0] + ".jpg" : "img/" + p[0] + "_s.webp") + '" alt="">';
    return "<figure>" + img + p[1] + "</figure>";
  }
  function zs(m, i) { return m.zp ? ' style="left:' + m.zp[i] + '%"' : ""; }
  // r — картинка; zn — подписи трёх зон (лист А, триплекс, лист Б); lab — свои подписи зон; ly — рисованные слои вместо картинки
  function card(m) {
    var top = m.r ? '<div class="ph"><img src="' + pic("tx_" + m.r) + '" alt="' + m.n + '"' + (PRINT ? "" : ' loading="lazy"') + '>' +
        (m.lab ? m.lab.map(function (l) { return '<span class="zn' + (l[2] ? " ab" : "") + '" style="left:' + l[0] + '%;top:2.5%;max-width:none;white-space:nowrap">' + l[1] + "</span>"; }).join("") : "") +
        (m.zn && m.sum ? '<span class="zn a"' + zs(m, 0) + '>' + m.sum[0][1] + '</span><span class="zn ab"' + zs(m, 1) + '>Триплекс</span><span class="zn b"' + zs(m, 2) + '>' + m.sum[1][1] + "</span>" : "")
      : '<div class="iso" style="position:relative">' + iso(m.ly || [["g"], ["f"], ["g"]]);
    return '<article class="card">' + top + (m.kind ? '<span class="tag o">' + m.kind + "</span>" : "") + "</div>" +
      (m.sum ? '<div class="sum">' + m.sum.map(part).join("<b>+</b>") + "</div>" : "") +
      '<div class="body"><div class="name">' + m.n + '</div><div class="desc">' + (m.d || "") + "</div></div></article>";
  }
  function sec(h, p) { return '<div class="sec"><h2>' + h + "</h2><p>" + (p || "") + "</p></div>"; }
  function spec(cols, style) {
    return '<div class="spec"' + (style ? ' style="' + style + '"' : "") + ">" + cols.map(function (c) {
      return "<div><h3>" + c.h + '</h3><div class="of">' + (c.of || "") + "</div><ul>" + (c.li || []).map(function (x) { return "<li>" + x + "</li>"; }).join("") + "</ul></div>";
    }).join("") + "</div>";
  }
  function section(s) {
    var cards = (s.cards || []).filter(function (c) { return !c.hide; });
    return sec(s.title, s.lead) +
      (s.spec ? spec(s.spec, "margin:0 0 20px") : "") +
      (s.note ? '<div class="spec-note" style="margin:0 0 20px">' + s.note + "</div>" : "") +
      (s.scheme ? '<div class="scheme"><div class="iso"><div class="st"><div class="ly glass" style="--z:-1"></div><div class="ly lam" style="--z:0;--c:rgba(25,179,201,.8)"></div><div class="ly glass" style="--z:1"></div></div></div>' +
        '<div class="scheme-t"><b>' + s.scheme.title + "</b>" + s.scheme.text + "</div></div>" : "") +
      (cards.length ? '<div class="grid">' + cards.map(card).join("") + "</div>" : "") +
      (s.palette ? '<div class="grp" style="margin-top:34px">' + s.palette.title + "</div>" + s.palette.groups.map(function (g) {
        return '<div class="grp">' + g.g + '</div><div class="fls">' + g.items.map(function (f) {
          return '<div class="fl"><i style="--c:' + f[2] + '"></i><span>' + f[0] + "<small>" + f[1] + "</small></span></div>";
        }).join("") + "</div>";
      }).join("") + (s.palette.fine ? '<p class="fine">' + s.palette.fine + "</p>" : "") : "");
  }

  root.innerHTML =
    '<section class="part" id="triplex"><div><div class="kicker">' + D.hero.kicker + "</div>" +
    "<h2>" + D.hero.title + " <em>" + D.hero.em + "</em></h2><p>" + D.hero.text + "</p></div>" +
    '<div class="iso"><div class="st"><div class="ly glass" style="--z:-1"></div><div class="ly lam" style="--z:0"></div><div class="ly glass" style="--z:1"></div></div>' +
    '<div class="lbl a">Стекло или зеркало <i>· лист 1</i></div><div class="lbl b">Плёнка <i>· прозрачная, цветная, с сеткой</i></div><div class="lbl c">Стекло или зеркало <i>· лист 2</i></div></div></section>' +
    spec(D.spec) +
    (D.note ? '<div class="spec-note">' + D.note + "</div>" : "") +
    D.sections.filter(function (s) { return !s.hide; }).map(section).join("");
})();
