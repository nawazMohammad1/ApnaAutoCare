/* =========================================================
   APNAAUTOCARE — ABOUT PAGE
   File: about.js
   Shared navigation and preloader stay in script.js
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const revealElements = document.querySelectorAll(".reveal");

  // Reveal content immediately if there is nothing to animate.
  if (!revealElements.length) return;

  // Respect accessibility preferences.
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  // Show all content when motion is disabled.
  if (reduceMotion) {
    revealElements.forEach((element) => {
      element.classList.add("is-visible");
    });

    return;
  }

  // Avoid hiding content in browsers without IntersectionObserver.
  if (!("IntersectionObserver" in window)) {
    revealElements.forEach((element) => {
      element.classList.add("is-visible");
    });

    return;
  }

  // Enable reveal styling only when animation can be observed.
  document.documentElement.classList.add("js-about-reveal");

  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");

        // Animate each element once.
        currentObserver.unobserve(entry.target);
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -35px 0px",
    },
  );

  revealElements.forEach((element, index) => {
    // Small stagger for cards in the same section.
    const siblings = element.parentElement
      ? Array.from(element.parentElement.querySelectorAll(":scope > .reveal"))
      : [];

    if (siblings.length > 1) {
      element.style.transitionDelay = `${Math.min(
        siblings.indexOf(element) * 90,
        270,
      )}ms`;
    }

    observer.observe(element);
  });

  // Keep in-page navigation comfortable without overriding
  // the browser's normal link behavior.
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);

      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      // Update the URL without forcing a page reload.
      if (history.replaceState) {
        history.replaceState(null, "", targetId);
      }
    });
  });
});
