/* =========================================================
   APNAAUTOCARE - PRIVACY POLICY
   File: privacy.js
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  // Keep the footer year current.
  const yearElement = document.getElementById("currentYear");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // Scroll reveal animations.
  // Content remains visible when JavaScript is disabled.
  document.documentElement.classList.add("js-privacy-reveal");

  const revealElements = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -25px 0px",
      },
    );

    revealElements.forEach((element, index) => {
      element.style.transitionDelay = `${(index % 3) * 70}ms`;
      revealObserver.observe(element);
    });

    // Make sure visible content is revealed after page restoration.
    window.addEventListener("pageshow", () => {
      revealElements.forEach((element) => {
        const rect = element.getBoundingClientRect();

        if (rect.top < window.innerHeight && rect.bottom > 0) {
          element.classList.add("is-visible");
        }
      });
    });
  } else {
    revealElements.forEach((element) => {
      element.classList.add("is-visible");
    });
  }

  // Highlight the active section in the table of contents.
  const tocLinks = Array.from(document.querySelectorAll(".privacy-toc-link"));

  const sections = tocLinks
    .map((link) => {
      const href = link.getAttribute("href");

      if (!href || !href.startsWith("#")) return null;

      return document.getElementById(href.slice(1));
    })
    .filter(Boolean);

  function setActiveLink(sectionId) {
    tocLinks.forEach((link) => {
      const isActive = link.getAttribute("href") === `#${sectionId}`;

      link.classList.toggle("active", isActive);

      if (isActive) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  if ("IntersectionObserver" in window && sections.length) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const visibleSections = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visibleSections.length) {
          setActiveLink(visibleSections[0].target.id);
        }
      },
      {
        rootMargin: "-18% 0px -68% 0px",
        threshold: 0,
      },
    );

    sections.forEach((section) => {
      sectionObserver.observe(section);
    });
  }

  // Update the active item immediately when a TOC link is clicked.
  tocLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const targetId = link.getAttribute("href")?.slice(1);

      if (targetId && document.getElementById(targetId)) {
        setActiveLink(targetId);
      }
    });
  });

  // Back-to-top links use the #top anchor in privacy.html.
});
