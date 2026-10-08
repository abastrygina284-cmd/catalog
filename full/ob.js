// Раздел «Обработка»: рисует себя в <div id="ob-root" class="ob">. Работает и на obrabotka.html, и в общем каталоге index.html.
// Состав — по «Прайсу партнёра» от 28.09.2026. ph — фото (img/ob_*.webp, с сайта yugros.ru); s — временная схема, пока фото нет.
(function () {
  var root = document.getElementById("ob-root");
  if (!root) return;
  var PRINT = /[?&]print\b/.test(location.search);   // PDF не умеет WebP — для него JPEG из img/print

  var G = '<rect x="40" y="18" width="120" height="114" rx="3" fill="var(--glass)" stroke="var(--glass-d)" stroke-width="2"/>';
  var A = 'stroke="var(--accent)" stroke-width="2.5" fill="none" stroke-linecap="round"';
  function svg(inner) { return '<svg viewBox="0 0 200 150" role="img" aria-hidden="true">' + inner + "</svg>"; }

  var CAT = [
    {g: "Форма, кромка, отверстия", lead: "Размер, контур, вид торца, отверстия и вырезы под фурнитуру.", items: [
      {ph: "rezka", n: "Резка", d: "Раскрой листа по вашим размерам. Кромка после реза острая, без обработки.", o: ["Прямоугольник", "Сложная форма"],
        s: '<rect x="30" y="18" width="88" height="114" rx="3" fill="var(--glass)" stroke="var(--glass-d)" stroke-width="2"/><rect x="128" y="18" width="42" height="114" rx="3" fill="var(--glass)" stroke="var(--glass-d)" stroke-width="2"/><path d="M123 8v134" stroke="var(--accent)" stroke-width="2.5" stroke-dasharray="7 6"/>'},
      {n: "Обработка кромки", d: "Торец становится безопасным и аккуратным.", o: ["Шлифовка", "Полировка", "Прямолинейная", "На ЧПУ"], ph: "kromka"},
      {n: "Фацет", d: "Скошенная грань по периметру — как рамка.", o: ["5–10 мм", "15", "20", "25", "30", "35/40 мм"], ph: "facet"},
      {n: "Фрезерование", d: "Криволинейный контур и фигурные вырезы на станке с ЧПУ.", o: ["Полированная кромка", "Шлифованная кромка"], ph: "frez"},
      {ph: "otverstia", n: "Сверление отверстий", d: "Диаметры от 5 до 70 мм.", o: ["Ø 5–28", "Ø 30–70", "Зенковка"],
        s: G + '<circle cx="70" cy="48" r="7" fill="#fff" stroke="var(--accent)" stroke-width="2.5"/><circle cx="130" cy="48" r="7" fill="#fff" stroke="var(--accent)" stroke-width="2.5"/><circle cx="100" cy="92" r="17" fill="#fff" stroke="var(--accent)" stroke-width="2.5"/>'},
      {ph: "vyrezy", n: "Вырезы под фурнитуру", d: "Стандартные вырезы под петли, замки и коннекторы.", o: ["Под петлю", "Под замок", "Под розетку"],
        s: '<path d="M40 18h120v30h-16q-8 0-8 8v8q0 8 8 8h16v60H40z" fill="var(--glass)" stroke="var(--glass-d)" stroke-width="2"/><path d="M160 48h-16q-8 0-8 8v8q0 8 8 8h16" ' + A + '/><rect x="64" y="90" width="30" height="22" rx="3" fill="#fff" stroke="var(--accent)" stroke-width="2.5"/>'}
    ]},
    {g: "Прочность и безопасность", lead: "Чтобы стекло выдерживало нагрузку и не ранило.", items: [
      {n: "Закалка", d: "Ударопрочное стекло: прочнее обычного в 7 раз. Разрушается безопасно — на мелкие осколки.", o: ["4–12 мм"], ph: "zakalka", extra: ["zakalka_break", "Так разрушается закалённое стекло: весь лист — в мелкие тупые осколки"]},
      {n: "Триплекс", d: "Два стекла, склеенные плёнкой: осколки остаются на плёнке.", o: ["Сырой", "Закалённый", "С цветной плёнкой"], ph: "triplex", link: 1},
      {ph: "lamzerkal", n: "Ламинация зеркал", d: "Плёнка безопасности клеится с тыльной стороны зеркала: при ударе осколки остаются на ней.", o: [],
        s: '<defs><linearGradient id="mir" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f4f6f8"/><stop offset=".45" stop-color="#b9c2cb"/><stop offset=".6" stop-color="#eef1f4"/><stop offset="1" stop-color="#9aa5b0"/></linearGradient></defs><rect x="40" y="18" width="120" height="114" rx="3" fill="url(#mir)" stroke="#9aa5b0" stroke-width="2"/><path d="M160 96v36h-36z" fill="#2b3a48"/><path d="M124 132q6-30 36-36" ' + A + "/>"}
    ]},
    {g: "Цвет и декор", lead: "Меняем внешний вид поверхности.", items: [
      {ph: "stemalit", n: "Стемалит", d: "Глухое непрозрачное стекло: керамическая краска наносится с обратной стороны и запекается.", o: ["Чёрный", "Белый", "Серый RAL 7024", "Цвет — по согласованию"],
        s: '<rect x="30" y="26" width="64" height="98" rx="3" fill="#15171a"/><rect x="68" y="26" width="64" height="98" rx="3" fill="#f6f6f3" stroke="var(--line)" stroke-width="2"/><rect x="106" y="26" width="64" height="98" rx="3" fill="#474b4e"/>'},
      {n: "Пескоструйная обработка", d: "Матовый рисунок или сплошное матирование. Гидрофобное покрытие входит.", o: ["Сплошная", "Рисунок"], ph: "pesk"},
      {n: "Гравирование", d: "Прорезанные в стекле линии, играющие на свету.", o: ["V-образная 6 и 10 мм", "U-образная 4 и 15 мм", "Полированная", "Шлифованная"], ph: "grav"},
      {n: "УФ-печать", d: "Полноцветное изображение на стекле, зеркале и других материалах.", o: ["На стекле и зеркале", "На сатине", "Цветопроба"], ph: "uf"}
    ]},
    {g: "Сборка и защита", lead: "Склейка деталей и уход за поверхностью.", items: [
      {ph: "skleyka", n: "УФ-склейка", d: "Прозрачный шов стекло-стекло: витрины, полки, кубы.", o: ["6–12 мм", "На УФ-клей", "На герметик"],
        s: '<path d="M50 40h70v80H50z" fill="var(--glass)" stroke="var(--glass-d)" stroke-width="2"/><path d="M120 40l36-18v80l-36 18z" fill="#c5e3ee" stroke="var(--glass-d)" stroke-width="2"/><path d="M50 40l36-18h70l-36 18z" fill="#e8f5fa" stroke="var(--glass-d)" stroke-width="2"/><path d="M120 40v80" ' + A + "/>"},
      {ph: "prikleyka", n: "Приклейка элементов", d: "Крепёж, ручки и декор на УФ-клей.", o: [],
        s: G + '<rect x="88" y="62" width="24" height="26" rx="4" fill="#9aa5b0" stroke="#66707c" stroke-width="2"/><path d="M100 62V46" stroke="#66707c" stroke-width="4" stroke-linecap="round"/>'},
      {ph: "clearshield", n: "Покрытие Clear Shield", d: "Защитный слой: вода и налёт не задерживаются, стекло легче мыть.", o: [],
        s: G + '<g fill="#fff" stroke="var(--accent)" stroke-width="2"><path d="M74 44q10 14 0 22-10-8 0-22z"/><path d="M112 70q10 14 0 22-10-8 0-22z"/><path d="M138 38q8 11 0 18-8-7 0-18z"/><path d="M86 96q8 11 0 18-8-7 0-18z"/></g>'}
    ]}
  ];

  // в общем каталоге раздел триплекса на той же странице, на отдельной — в соседнем файле
  var txHref = document.getElementById("tx-root") ? "#triplex" : "triplex.html";

  root.innerHTML =
    '<section class="part one" id="obrabotka"><div><div class="kicker">Каталог партнёра · обработка</div>' +
    "<h2>Обработка стекла: <em>что мы делаем</em></h2>" +
    "<p>От реза и кромки до печати и склейки — на одном заводе. Расчёт стоимости — у вашего менеджера.</p></div></section>" +
    CAT.map(function (c) {
      return '<div class="sec"><h2>' + c.g + "</h2><p>" + c.lead + '</p></div><div class="grid">' + c.items.map(function (i) {
        var top = i.ph ? '<div class="ph"><img src="' + (PRINT ? "img/print/ob_" + i.ph + ".jpg" : "img/ob_" + i.ph + ".webp") + '" alt="' + i.n + '"' + (PRINT ? "" : ' loading="lazy"') + '></div>'
          : '<div class="pic">' + svg(i.s) + '<span class="tag o" style="top:auto;bottom:12px">Схема</span></div>';
        var extra = i.extra ? '<div class="sum" style="justify-content:flex-start;gap:12px"><img src="' + (PRINT ? "img/print/ob_" + i.extra[0] + ".jpg" : "img/ob_" + i.extra[0] + ".webp") + '" alt="" style="width:92px;height:92px;flex:none"><span style="flex:1;min-width:0;font-size:12px;color:var(--muted);font-weight:600;line-height:1.3">' + i.extra[1] + '</span></div>' : "";
        return '<article class="card">' + top + extra + '<div class="body"><div class="name">' + i.n + '</div><div class="desc">' + i.d +
          (i.link ? ' <a href="' + txHref + '" style="color:var(--accent);font-weight:700;white-space:nowrap">Все варианты →</a>' : "") + "</div>" +
          (i.o.length ? '<div class="opts">' + i.o.map(function (x) { return "<span>" + x + "</span>"; }).join("") + "</div>" : "") + "</div></article>";
      }).join("") + "</div>";
    }).join("");
})();
