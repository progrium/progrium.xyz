// Small enhancements. The site works without any of this.
(function () {
  var root = document.documentElement;

  function stored() {
    try { return localStorage.getItem("theme"); } catch (e) { return null; }
  }
  function current() {
    var t = root.getAttribute("data-theme");
    if (t) return t;
    return window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  function label() {
    var k = document.getElementById("modekey");
    if (k) k.querySelector(".mk-l").textContent = current() === "dark" ? "light" : "dark";
  }

  document.addEventListener("DOMContentLoaded", function () {
    // dark mode: follows the system until you press the key, then remembers
    var key = document.getElementById("modekey");
    if (key) {
      label();
      key.addEventListener("click", function () {
        var next = current() === "dark" ? "light" : "dark";
        root.setAttribute("data-theme", next);
        try { localStorage.setItem("theme", next); } catch (e) {}
        label();
      });
      if (window.matchMedia) matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function () {
        if (!stored()) label();
      });
    }

    // 9/ux: boot into a full-viewport iframe. no way out but reload.
    var boot = document.getElementById("bootkey");
    if (boot) boot.addEventListener("click", function () {
      var f = document.createElement("iframe");
      f.src = "https://progrium.github.io/9ux/progrium.html";
      f.title = "9/ux";
      f.style.cssText = "position:fixed;inset:0;width:100vw;height:100vh;border:0;margin:0;padding:0;z-index:2147483647;background:#000";
      document.body.appendChild(f);
      document.body.style.overflow = "hidden";
      f.focus();
    });

    // language label on highlighted code
    document.querySelectorAll("pre > code[class^='language-']").forEach(function (c) {
      c.parentElement.setAttribute("data-lang", c.className.replace(/^language-/, "").split(" ")[0]);
    });

    // youtube: nothing loads from youtube until you press play
    document.querySelectorAll("a.vid[data-yt]").forEach(function (a) {
      a.addEventListener("click", function (ev) {
        ev.preventDefault();
        var f = document.createElement("iframe");
        f.className = "vid";
        f.src = "https://www.youtube-nocookie.com/embed/" + a.getAttribute("data-yt") + "?autoplay=1";
        f.title = a.getAttribute("data-title") || "YouTube video";
        f.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
        f.allowFullscreen = true;
        a.replaceWith(f);
      });
    });
  });
})();
