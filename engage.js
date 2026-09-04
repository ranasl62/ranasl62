(function () {
  "use strict";

  var DELAY_MS = 120000;
  var COUNT_KEY = "rh-engage-count";
  var SESSION_KEY = "rh-engage-session";
  var panel = document.getElementById("engage");
  if (!panel) return;

  try {
    if (sessionStorage.getItem(SESSION_KEY) === "1") return;
  } catch (_) {}

  var MESSAGES = [
    {
      kicker: "Still here?",
      title: "Thanks for reading carefully.",
      copy: "If something here fits a lab, a team, or a collaboration—I’d like to hear from you.",
      later: "Not now"
    },
    {
      kicker: "Welcome back",
      title: "You returned. That usually means interest.",
      copy: "Faculty, hiring managers, collaborators—happy to talk research fit, RAG/agents work, or a coffee chat.",
      later: "Maybe later"
    },
    {
      kicker: "Deep dive detected",
      title: "Two minutes is a long time on a CV page.",
      copy: "Either the coffee is strong, or something here is useful. If it’s the latter—let’s connect.",
      later: "Keep reading"
    },
    {
      kicker: "Third visit energy",
      title: "We should stop meeting like this.",
      copy: "Unless you want to meet on purpose: research advising, a role, or a short collaboration note.",
      later: "Not today"
    },
    {
      kicker: "Serious reader",
      title: "Appreciate the careful look.",
      copy: "Interested in a funded Ph.D. in CS / health informatics—and open to engineering roles that ship trustworthy AI.",
      later: "Dismiss"
    },
    {
      kicker: "Plot twist",
      title: "This popup has seen you before.",
      copy: "Different message, same offer: hello, LinkedIn, or a hire / collaborate note. No spam—just an open door.",
      later: "Close"
    },
    {
      kicker: "Quiet CTA",
      title: "No hard sell. Just an invitation.",
      copy: "If my EHR-risk methods or production AI stack matches what you need, a short email is enough.",
      later: "Thanks, not now"
    },
    {
      kicker: "Round again",
      title: "Back for another lap?",
      copy: "I won’t invent new jokes forever—but I will answer a thoughtful message. Research, hiring, or collaboration welcome.",
      later: "Carry on"
    }
  ];

  function getCount() {
    try {
      var n = parseInt(localStorage.getItem(COUNT_KEY) || "0", 10);
      return isNaN(n) || n < 0 ? 0 : n;
    } catch (_) {
      return 0;
    }
  }

  function setCount(n) {
    try {
      localStorage.setItem(COUNT_KEY, String(n));
    } catch (_) {}
  }

  function applyMessage(msg) {
    var kicker = panel.querySelector(".engage-kicker");
    var title = document.getElementById("engage-title");
    var copy = document.getElementById("engage-copy");
    var later = panel.querySelector(".engage-later");
    if (kicker) kicker.textContent = msg.kicker;
    if (title) title.textContent = msg.title;
    if (copy) copy.textContent = msg.copy;
    if (later) later.textContent = msg.later;
  }

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

    var count = getCount();
    applyMessage(MESSAGES[count % MESSAGES.length]);
    setCount(count + 1);

    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch (_) {}

    panel.hidden = false;
    document.documentElement.classList.add("engage-open");
    requestAnimationFrame(function () {
      panel.classList.add("is-visible");
    });
    var closeBtn = panel.querySelector(".engage-close");
    if (closeBtn) closeBtn.focus();
  }

  function dismiss() {
    panel.classList.remove("is-visible");
    document.documentElement.classList.remove("engage-open");
    window.setTimeout(function () {
      panel.hidden = true;
    }, 280);
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
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
