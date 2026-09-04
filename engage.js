(function () {
  "use strict";

  var DELAY_MS = 120000;
  var STORAGE_KEY = "rh-engage-dismissed";
  var panel = document.getElementById("engage");
  if (!panel) return;

  try {
    if (sessionStorage.getItem(STORAGE_KEY) === "1") return;
  } catch (_) {}

  var elapsed = 0;
  var lastTick = null;
  var shown = false;
  var timerId = null;

  function tick() {
    if (shown || document.hidden) {
      lastTick = null;
      return;
    }
    var now = Date.now();
    if (lastTick != null) elapsed += now - lastTick;
    lastTick = now;
    if (elapsed >= DELAY_MS) {
      show();
      return;
    }
    timerId = window.setTimeout(tick, 1000);
  }

  function show() {
    if (shown) return;
    shown = true;
    if (timerId) window.clearTimeout(timerId);
    panel.hidden = false;
    requestAnimationFrame(function () {
      panel.classList.add("is-visible");
    });
    var closeBtn = panel.querySelector(".engage-close");
    if (closeBtn) closeBtn.focus();
  }

  function dismiss() {
    panel.classList.remove("is-visible");
    window.setTimeout(function () {
      panel.hidden = true;
    }, 280);
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch (_) {}
  }

  panel.addEventListener("click", function (e) {
    var t = e.target;
    if (t && t.closest && t.closest("[data-engage-dismiss]")) {
      e.preventDefault();
      dismiss();
    }
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !panel.hidden) dismiss();
  });

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
      lastTick = null;
    } else if (!shown) {
      lastTick = Date.now();
      if (!timerId) timerId = window.setTimeout(tick, 1000);
    }
  });

  lastTick = Date.now();
  timerId = window.setTimeout(tick, 1000);
})();
