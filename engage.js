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
      kicker: "Research and engineering",
      title: "Thank you for reading.",
      copy: "If this work is relevant to a laboratory, a clinical research group, or an engineering team, a short note is welcome.",
      later: "Not now"
    },
    {
      kicker: "Welcome back",
      title: "Glad you returned.",
      copy: "I am happy to discuss the diagnosis research, the open framework, or production retrieval and agent systems.",
      later: "Maybe later"
    },
    {
      kicker: "A closer look",
      title: "Research and production engineering.",
      copy: "The publications and the EHR Risk Framework are described with the diagnosis research. Volkswagen work is production retrieval and agent systems.",
      later: "Keep reading"
    },
    {
      kicker: "Collaboration",
      title: "Inquiries are welcome.",
      copy: "Universities, clinicians, and research groups can write about the diagnosis methods or the open framework.",
      later: "Not today"
    },
    {
      kicker: "Open software",
      title: "The framework is research software.",
      copy: "It is for research and education only. It is not a medical device and not for patient care.",
      later: "Dismiss"
    },
    {
      kicker: "Contact",
      title: "A direct note is enough.",
      copy: "Email or LinkedIn is the right next step. There is no mailing list.",
      later: "Close"
    },
    {
      kicker: "Fit",
      title: "Three places to look.",
      copy: "Diagnosis papers, the EHR Risk Framework, and production RAG and agent systems. A short email is enough if one of them fits.",
      later: "Thanks, not now"
    },
    {
      kicker: "Follow-up",
      title: "Happy to reply.",
      copy: "Research, hiring, and collaboration notes are all welcome.",
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
