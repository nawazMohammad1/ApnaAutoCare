/* =========================================================
   APNAAUTOCARE - TERMS & CONDITIONS PAGE
   File: terms.js
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  /* Current year */
  const yearElement = document.getElementById("currentYear");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  /* Reveal animations */
  const revealElements = document.querySelectorAll(".terms-reveal");

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -30px 0px",
      },
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });
  } else {
    revealElements.forEach((element) => {
      element.classList.add("is-visible");
    });
  }

  /* Table of contents */
  const tocLinks = Array.from(document.querySelectorAll(".terms-toc-link"));

  const sections = tocLinks
    .map((link) => {
      const href = link.getAttribute("href");

      if (!href || !href.startsWith("#")) {
        return null;
      }

      const section = document.getElementById(href.slice(1));

      return section ? { link, section } : null;
    })
    .filter(Boolean);

  function setActiveLink(activeLink) {
    tocLinks.forEach((link) => {
      const isActive = link === activeLink;

      link.classList.toggle("active", isActive);

      if (isActive) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  tocLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");

      if (!href || !href.startsWith("#")) {
        return;
      }

      const target = document.getElementById(href.slice(1));

      if (!target) {
        return;
      }

      event.preventDefault();
      setActiveLink(link);

      target.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
        block: "start",
      });

      if (history.replaceState) {
        history.replaceState(null, "", href);
      }
    });
  });

  /* Update active section while scrolling */
  if ("IntersectionObserver" in window && sections.length) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const visibleSections = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => {
            return a.boundingClientRect.top - b.boundingClientRect.top;
          });

        if (!visibleSections.length) {
          return;
        }

        const visibleSection = visibleSections[0].target;

        const matchingItem = sections.find(
          (item) => item.section === visibleSection,
        );

        if (matchingItem) {
          setActiveLink(matchingItem.link);
        }
      },
      {
        rootMargin: "-18% 0px -68% 0px",
        threshold: 0,
      },
    );

    sections.forEach(({ section }) => {
      sectionObserver.observe(section);
    });
  }

  /* Back-to-top button */
  const backToTop = document.getElementById("backToTop");

  if (backToTop) {
    backToTop.addEventListener("click", (event) => {
      event.preventDefault();

      window.scrollTo({
        top: 0,
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
      });

      if (history.replaceState) {
        history.replaceState(null, "", "#top");
      }
    });
  }
});
