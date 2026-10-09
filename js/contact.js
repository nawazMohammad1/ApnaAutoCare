/* =========================================================
   APNAAUTOCARE - CONTACT PAGE
   File: contact.js
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  // Ensure the Back to Top link has a valid destination.
  if (!document.getElementById("top")) {
    document.body.id = "top";
  }

  // Keep the footer year current if the shared script has not
  // already populated it.
  const yearElement = document.getElementById("currentYear");

  if (yearElement && !yearElement.textContent.trim()) {
    yearElement.textContent = new Date().getFullYear();
  }

  // Scroll reveal animations.
  // The root class activates the reveal CSS only when JS runs,
  // so content stays visible if JavaScript is disabled.
  document.documentElement.classList.add("js-contact-reveal");

  const revealElements = document.querySelectorAll(".reveal");

  if (!revealElements.length) return;

  // If the browser doesn't support IntersectionObserver,
  // show the content instead of leaving it hidden.
  if (!("IntersectionObserver" in window)) {
    revealElements.forEach((element) => {
      element.classList.add("is-visible");
    });
    return;
  }

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -35px 0px",
    },
  );

  revealElements.forEach((element, index) => {
    // A slight stagger makes groups of cards feel more natural.
    const parent = element.parentElement;
    const siblings = parent
      ? Array.from(parent.querySelectorAll(":scope > .reveal"))
      : [];

    if (siblings.length > 1) {
      element.style.transitionDelay = `${(siblings.indexOf(element) % 3) * 90}ms`;
    } else {
      element.style.transitionDelay = `${Math.min(index % 3, 2) * 50}ms`;
    }

    revealObserver.observe(element);
  });

  // Make sure users returning to the page at a scrolled position
  // don't see content remain hidden.
  window.addEventListener(
    "pageshow",
    () => {
      if (window.scrollY > 0) {
        revealElements.forEach((element) => {
          const rect = element.getBoundingClientRect();

          if (rect.top < window.innerHeight && rect.bottom > 0) {
            element.classList.add("is-visible");
          }
        });
      }
    },
    { once: true },
  );
});
