/* =====================================================================
   LUX INTERIORES · cocinas-integrales.html
   seccion-seo.js — guárdalo y cárgalo al final del <body>:
   <script src="seccion-seo.js" defer></script>
   Hace 2 cosas (ambas opcionales; la página funciona sin JS):
   1) Anima suavemente el acordeón FAQ (abre uno, cierra los demás)
   2) Mide los clics a WhatsApp (GA4 / GTM / Meta Pixel si existen)
   ===================================================================== */
(function () {
  'use strict';

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canAnimate = typeof Element.prototype.animate === 'function';

  /* ---------- 1) Acordeón FAQ ---------- */
  var items = [];

  document.querySelectorAll('.lxs-faq details').forEach(function (d) {
    var summary = d.querySelector('summary');
    var panel = d.querySelector('.lxs-faq-a');
    if (!summary || !panel) return;

    var anim = null;
    var item = { el: d, isOpen: d.open, toggle: null };

    function reset() {
      anim = null;
      panel.style.overflow = '';
    }

    function toggle(target) {
      var current = anim ? panel.getBoundingClientRect().height : (d.open ? panel.offsetHeight : 0);
      if (anim) { var old = anim; anim = null; old.cancel(); }

      item.isOpen = target;
      if (target) d.open = true;

      var to = target ? panel.scrollHeight : 0;
      panel.style.overflow = 'hidden';

      var a = panel.animate(
        { height: [current + 'px', to + 'px'], opacity: target ? [0, 1] : [1, 0] },
        { duration: 300, easing: 'cubic-bezier(.4, 0, .2, 1)', fill: 'forwards' }
      );
      anim = a;

      a.onfinish = function () {
        if (anim !== a) return;
        d.open = target;
        reset();
        a.cancel();
      };
      a.oncancel = function () {
        if (anim === a) reset();
      };
    }

    item.toggle = toggle;
    items.push(item);

    summary.addEventListener('click', function (e) {
      if (!canAnimate || reduce) return; // comportamiento nativo sin animación
      e.preventDefault();
      var target = !item.isOpen;
      if (target) {
        items.forEach(function (other) {
          if (other !== item && other.isOpen) other.toggle(false);
        });
      }
      toggle(target);
    });
  });

  /* ---------- 2) Medición de clics a WhatsApp ---------- */
  document.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('a[href*="wa.me/"]') : null;
    if (!a) return;

    var loc = a.getAttribute('data-wa') ||
      (a.classList.contains('floating') ? 'flotante' :
        (a.closest('header') ? 'menu' :
          (a.closest('.lx-hero') ? 'hero' : 'otro')));

    try {
      if (typeof gtag === 'function') {
        gtag('event', 'whatsapp_click', { wa_location: loc, page_path: location.pathname });
      } else {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ event: 'whatsapp_click', wa_location: loc, page_path: location.pathname });
      }
      if (typeof fbq === 'function') fbq('track', 'Contact', { content_name: loc });
    } catch (err) { /* la medición nunca debe romper el enlace */ }
  });

})();