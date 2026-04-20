(function () {
  'use strict';

  function init() {
    var root = document.querySelector('[data-tiktok-feed-root]');
    if (!root) return;

    var feed = root.querySelector('[data-tiktok-feed]');
    var sheet = root.querySelector('[data-tiktok-sheet]');
    var sheetBody = root.querySelector('[data-tiktok-sheet-body]');
    var closeBtn = root.querySelector('[data-tiktok-sheet-close]');

    // 1. Pagination dots update as user swipes horizontally
    root.querySelectorAll('[data-tiktok-panel]').forEach(function (panel) {
      var gallery = panel.querySelector('[data-tiktok-gallery]');
      var dots = panel.querySelectorAll('.tiktok-dot');
      if (!gallery || dots.length === 0) return;
      gallery.addEventListener('scroll', function () {
        var idx = Math.round(gallery.scrollLeft / gallery.clientWidth);
        dots.forEach(function (d, i) {
          d.classList.toggle('is-active', i === idx);
        });
      }, { passive: true });
    });

    // 2. Sheet: clone the existing .product-info (rendered by main-product
    //    section with all merchant-configured blocks) for the CURRENT product.
    //    For other products, navigate to their page.
    function openSheet() {
      if (sheetBody.childElementCount === 0) {
        var info = document.querySelector('.main-product-page .product-info');
        if (info) {
          var clone = info.cloneNode(true);
          clone.removeAttribute('id');
          // De-duplicate IDs on the clone so form labels/controls don't clash
          // with the hidden original — but keep classes untouched so scoped
          // theme selectors still match.
          clone.querySelectorAll('[id]').forEach(function (el) {
            el.id = 'tiktok-' + el.id;
          });
          clone.querySelectorAll('[for]').forEach(function (el) {
            el.setAttribute('for', 'tiktok-' + el.getAttribute('for'));
          });
          clone.querySelectorAll('[form]').forEach(function (el) {
            el.setAttribute('form', 'tiktok-' + el.getAttribute('form'));
          });
          // Re-create the ancestor class hierarchy the theme's CSS scopes to.
          // In main-product.liquid the DOM is:
          //   .main-product-page > .product > .product-summary > .position-sticky > .product-info
          // Many theme rules (e.g. `.product-summary .cart-btn`, `.product-summary .quantity-btn`,
          // `.product-summary .product-title`) require .product-summary as an ancestor, so we
          // re-materialize that chain around the clone.
          var outer = document.createElement('div');
          outer.className = 'main-product-page product-page-style-1';
          var row = document.createElement('div');
          row.className = 'product row';
          var summary = document.createElement('div');
          summary.className = 'product-summary';
          summary.appendChild(clone);
          row.appendChild(summary);
          outer.appendChild(row);
          sheetBody.appendChild(outer);
        }
      }
      sheet.setAttribute('data-open', '');
      sheet.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
    function closeSheet() {
      sheet.removeAttribute('data-open');
      sheet.setAttribute('aria-hidden', 'true');
    }

    root.addEventListener('click', function (e) {
      var titleBtn = e.target.closest('[data-tiktok-title]');
      if (!titleBtn) return;
      var panel = titleBtn.closest('[data-tiktok-panel]');
      if (!panel) return;
      if (panel.getAttribute('data-is-current') === '1') {
        e.preventDefault();
        openSheet();
      } else {
        // Non-current product: navigate to its page
        var url = panel.getAttribute('data-product-url');
        if (url) window.location.href = url;
      }
    });

    if (closeBtn) closeBtn.addEventListener('click', closeSheet);
    sheet.addEventListener('click', function (e) {
      if (e.target === sheet) closeSheet();
    });

    // 3. Track the active product — update URL so refresh/share work.
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && entry.intersectionRatio > 0.7) {
            var handle = entry.target.getAttribute('data-product-handle');
            var url = entry.target.getAttribute('data-product-url');
            if (handle && url && window.location.pathname !== url) {
              history.replaceState({ handle: handle }, '', url);
            }
          }
        });
      }, { root: feed, threshold: [0.7] });
      root.querySelectorAll('[data-tiktok-panel]').forEach(function (p) {
        io.observe(p);
      });
    }

    // 4. First-visit swipe hint
    try {
      if (!localStorage.getItem('tiktokFeedHintSeen')) {
        var hint = root.querySelector('[data-tiktok-hint]');
        if (hint) {
          hint.hidden = false;
          setTimeout(function () { hint.hidden = true; }, 3000);
          localStorage.setItem('tiktokFeedHintSeen', '1');
        }
      }
    } catch (e) {}
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
