/* =============================================================
   GLOBAL.JS — GreySphere
   1. Injects header.html and footer.html into every page.
   2. Initialises shared behaviours: mobile nav, scroll reveal,
      active nav link, newsletter form.

   HOW TO USE ON ANY PAGE:
   ─────────────────────────────────────────────────────────────
   Add these two placeholder divs in your <body>:

     <!-- at the very top of <body> -->
     <div id="site-header"></div>

     <!-- at the very bottom of <body>, before </body> -->
     <div id="site-footer"></div>

   Then load this script at the bottom of <body>:

     <script src="global.js"></script>

   That's it. Everything else is automatic.

   HERE IS FULL CODE - USE THE CODE BELOW IF REQUIRED
   
   <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>About Us — GreySphere</title>

    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="stylesheet" href="https://fonts.cdnfonts.com/css/general-sans" />
    <link rel="stylesheet" href="global.css" />

    <style>
      /* Page-specific styles only go here *
      </style>
      </head>
      <body>
        <div id="site-header"></div>
    
        <!-- ======= YOUR PAGE CONTENT HERE ======= -->
        <main>...</main>
        <!-- ======================================= -->
    
        <div id="site-footer"></div>
    
        <script src="global.js"></script>
        <script>
          /* Page-specific JS only (no mobile nav, no newsletter, no scroll reveal) *
        </script>
      </body>
    </html>
    
============================================================= */

(function () {
  /* ----------------------------------------------------------
     1. INJECT HEADER + FOOTER via fetch()
     Works on any web server (localhost, Netlify, your host, etc.)
     If you need it to work from a local file:// path without a
     server, see the fallback comment at the bottom of this file.
  ---------------------------------------------------------- */
  function loadFragment(url, targetId, callback) {
    fetch(url)
      .then(function (res) {
        if (!res.ok) throw new Error("Could not load " + url);
        return res.text();
      })
      .then(function (html) {
        var target = document.getElementById(targetId);
        if (target) {
          target.innerHTML = html;
          if (typeof callback === "function") callback();
        }
      })
      .catch(function (err) {
        console.warn("[global.js] Fragment load failed:", err.message);
      });
  }

  /* Load header first, then footer.
     After both are injected, run the shared initialisers. */
  var headerLoaded = false;
  var footerLoaded = false;

function onFragmentReady() {
    if (headerLoaded && footerLoaded) {
      rewriteFragmentLinks();
      initMobileNav();
      initScrollReveal();
      initActiveNavLink();
      initNewsletter();
    }
  }

  function rewriteFragmentLinks() {
    document.querySelectorAll("#site-header a, #site-footer a").forEach(function(link) {
      var href = link.getAttribute("href");
      if (!href) return;
      if (href.startsWith("http") || href.startsWith("mailto") || href.startsWith("tel")) return;
      if (href.startsWith("/")) return;
      link.setAttribute("href", _base + href);
    });
  }

var _base = (function () {
  var scripts = document.querySelectorAll('script[src*="global.js"]');
  if (scripts.length) {
    var src = scripts[scripts.length - 1].src;
    return src.replace(/global\.js.*$/, "");
  }
  // Fallback: walk up from current path until we hit the root
  var path = window.location.pathname.replace(/\/[^/]*$/, "/");
  return path;
})();
  
    loadFragment(_base + "header.html", "site-header", function () {
      headerLoaded = true;
      onFragmentReady();
    });
  
    loadFragment(_base + "footer.html", "site-footer", function () {
      footerLoaded = true;
      onFragmentReady();
    });

  /* ----------------------------------------------------------
     2. MOBILE NAV
  ---------------------------------------------------------- */
  function initMobileNav() {
    var toggle = document.getElementById("navToggle");
    var menu = document.getElementById("mobileMenu");
    var closeBtn = document.getElementById("mobileMenuClose");

    if (!toggle || !menu) return;

    function openMenu() {
      toggle.classList.add("open");
      menu.classList.add("open");
      document.body.style.overflow = "hidden";
    }
    function closeMenu() {
      toggle.classList.remove("open");
      menu.classList.remove("open");
      document.body.style.overflow = "";
    }

    toggle.addEventListener("click", function () {
      menu.classList.contains("open") ? closeMenu() : openMenu();
    });
    if (closeBtn) closeBtn.addEventListener("click", closeMenu);

    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });
    menu.addEventListener("click", function (e) {
      if (e.target === menu) closeMenu();
    });
  }

  /* ----------------------------------------------------------
     3. SCROLL REVEAL (IntersectionObserver)
     Watches .reveal, .reveal-left, .reveal-right elements that
     exist at page load AND any injected by the fragments.
  ---------------------------------------------------------- */
  function initScrollReveal() {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) entry.target.classList.add("active");
        });
      },
      { threshold: 0.1 }
    );

    document
      .querySelectorAll(".reveal, .reveal-left, .reveal-right")
      .forEach(function (el) {
        observer.observe(el);
      });
  }

  /* ----------------------------------------------------------
     4. ACTIVE NAV LINK
     Adds .nav-active to the link whose href matches the current
     page filename (e.g. "contact.html", "about.html", "index.html").
  ---------------------------------------------------------- */
  function initActiveNavLink() {
    var currentPage = window.location.pathname.split("/").pop() || "index.html";

    /* Map anchor-only links on index.html back to index.html */
    if (currentPage === "") currentPage = "index.html";

    document.querySelectorAll(".nav-links a").forEach(function (link) {
      var href = link.getAttribute("href") || "";
      var hrefPage = href.split("#")[0].split("/").pop() || "index.html";

      // ← ADD THIS: section anchor links are never "active pages"
      if (href.indexOf("#") !== -1) return;

      var hrefPage = href.split("/").pop() || "index.html";

      if (hrefPage === currentPage && !link.classList.contains("nav-cta")) {
        link.classList.add("nav-active");
      }
      if (
        currentPage === "contact.html" &&
        link.classList.contains("nav-cta")
      ) {
        link.classList.add("nav-active");
      }
      /* Exact page match — skip the CTA button (it already has a special style) */
      if (hrefPage === currentPage && !link.classList.contains("nav-cta")) {
        link.classList.add("nav-active");
      }
      /* Special case: mark "Contact us" CTA as active on contact.html */
      if (
        currentPage === "contact.html" &&
        link.classList.contains("nav-cta")
      ) {
        link.classList.add("nav-active");
      }
    });
  }

  /* ----------------------------------------------------------
     5. NEWSLETTER FORM (footer)
     Shared across all pages.
  ---------------------------------------------------------- */
  function initNewsletter() {
    const SHEET_URL =
      "https://script.google.com/macros/s/AKfycbyjefVRi4vJJaZhwGIxHNFiAVDKK1eGTs_vuDs8PCVkqHg1Me3AejRlhZqKxOs9CVrzsw/exec";

    const btn = document.getElementById("nlBtn");
    if (!btn) return;

    btn.addEventListener("click", async function () {
      const name = document.getElementById("nlName")?.value.trim() || "";
      const email = document.getElementById("nlEmail")?.value.trim() || "";
      const consent = document.getElementById("nlConsent");

      if (!email) {
        alert("Please enter email");
        return;
      }

      if (!consent || !consent.checked) {
        alert("Please accept checkbox");
        return;
      }

      btn.textContent = "Sending...";
      btn.disabled = true;

      try {
        // ✅ IMPORTANT: ONLY URLSearchParams (NO JSON, NO FormData)
        await fetch(SHEET_URL, {
          method: "POST",
          body: new URLSearchParams({
            formType: "newsletter",
            Name: name,
            Email: email,
            Consent: "Yes",
          }),
        });

        btn.textContent = "✓ Subscribed!";
        btn.style.background = "#10b981";

        setTimeout(() => {
          btn.textContent = "Submit";
          btn.style.background = "";
          btn.disabled = false;

          document.getElementById("nlName").value = "";
          document.getElementById("nlEmail").value = "";
          consent.checked = false;
        }, 3000);
      } catch (err) {
        console.error(err);
        btn.textContent = "Submit";
        btn.disabled = false;
        alert("Something went wrong");
      }
    });
  }
})();

/* =============================================================
   NOTE — Running from a local file:// path (no server)?
   ─────────────────────────────────────────────────────────────
   fetch() is blocked by browsers on file:// URLs. Two options:

   Option A (recommended): run a tiny local server.
     - With Node:  npx serve .
     - With Python: python -m http.server 8000
     Then open http://localhost:8000

   Option B: Inline the HTML directly in global.js instead of
   fetching it. Replace the loadFragment() calls with:

     document.getElementById("site-header").innerHTML = `
       ... paste header.html content here ...
     `;
     document.getElementById("site-footer").innerHTML = `
       ... paste footer.html content here ...
     `;

   Then remove the fetch block entirely.
============================================================= */
