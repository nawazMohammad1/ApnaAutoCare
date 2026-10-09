/* =====================================================
   APNAAUTOCARE — MAIN JAVASCRIPT
   Preloader, navigation and subtle animations
   ===================================================== */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
  // ---------- 1. PRELOADER ----------

  const preloader = document.getElementById("preloader");

  function hidePreloader() {
    if (!preloader || preloader.classList.contains("loaded")) return;

    preloader.classList.add("loaded");
    document.body.classList.remove("loading");
  }

  document.body.classList.add("loading");

  if (document.readyState === "complete") {
    setTimeout(hidePreloader, 350);
  } else {
    window.addEventListener(
      "load",
      () => {
        setTimeout(hidePreloader, 350);
      },
      { once: true },
    );
  }

  // Fallback so a slow external image cannot keep the
  // preloader covering the page indefinitely.
  setTimeout(hidePreloader, 2500);

  // ---------- 2. MOBILE NAVIGATION ----------

  const menuToggle = document.getElementById("menuToggle");
  const navMenu = document.getElementById("navMenu");

  function closeMenu() {
    if (!menuToggle || !navMenu) return;

    navMenu.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");

    const icon = menuToggle.querySelector("i");

    if (icon) {
      icon.classList.remove("fa-xmark");
      icon.classList.add("fa-bars");
    }

    document.body.classList.remove("menu-open");
  }

  function openMenu() {
    if (!menuToggle || !navMenu) return;

    navMenu.classList.add("open");
    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Close navigation menu");

    const icon = menuToggle.querySelector("i");

    if (icon) {
      icon.classList.remove("fa-bars");
      icon.classList.add("fa-xmark");
    }

    document.body.classList.add("menu-open");
  }

  if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
      const isOpen = navMenu.classList.contains("open");

      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Close the menu after a navigation link is selected.
    navMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    // Close when clicking outside the navigation.
    document.addEventListener("click", (event) => {
      if (
        navMenu.classList.contains("open") &&
        !navMenu.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        closeMenu();
      }
    });

    // Close the menu using the Escape key.
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    });

    // Restore the desktop navigation layout when resizing.
    window.addEventListener("resize", () => {
      if (window.innerWidth > 850) {
        closeMenu();
      }
    });
  }

  // ---------- 3. STICKY NAVBAR SHADOW ----------

  const siteHeader = document.getElementById("siteHeader");

  function updateHeader() {
    if (!siteHeader) return;

    siteHeader.classList.toggle("scrolled", window.scrollY > 15);
  }

  window.addEventListener("scroll", updateHeader, {
    passive: true,
  });

  updateHeader();

  // ---------- 4. SCROLL REVEAL ANIMATIONS ----------

  const revealElements = document.querySelectorAll(".reveal");

  // Respect reduced-motion preferences and provide a fallback
  // for browsers that do not support IntersectionObserver.
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealElements.forEach((element) => {
      element.classList.add("visible");
    });
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -35px 0px",
      },
    );

    revealElements.forEach((element, index) => {
      // Slight stagger for adjacent cards.
      const card = element.matches(
        ".service-card, .process-card, .review-card",
      );

      if (card) {
        element.style.transitionDelay = `${(index % 4) * 80}ms`;
      }

      revealObserver.observe(element);
    });
  }

  // ---------- 5. AUTOMATIC COPYRIGHT YEAR ----------

  const currentYear = document.getElementById("currentYear");

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  // ---------- 6. BACK-TO-TOP INTERACTION ----------

  const backToTop = document.querySelector(".back-to-top");

  if (backToTop) {
    backToTop.addEventListener("click", (event) => {
      event.preventDefault();

      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    });
  }

  // ---------- 7. IMAGE FALLBACK ----------

  // Hide a failed photo instead of displaying a broken image icon.
  // The surrounding card retains its layout and background.
  document.querySelectorAll("img").forEach((img) => {
    img.addEventListener(
      "error",
      () => {
        img.classList.add("image-unavailable");
        img.style.visibility = "hidden";
      },
      { once: true },
    );
  });
});
