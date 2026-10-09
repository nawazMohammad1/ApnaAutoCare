/* =========================================================
   APNAAUTOCARE — PACKAGES PAGE
   File: packages.js
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const packageGrid = document.getElementById("packageGrid");
  const filterButtons = document.querySelectorAll(".package-filter");
  const packageCards = Array.from(document.querySelectorAll(".package-card"));
  const packageCount = document.getElementById("packageCount");
  const packageEmpty = document.getElementById("packageEmpty");
  const resetButton = document.getElementById("resetPackages");

  // Stop safely if this script is loaded on another page.
  if (
    !packageGrid ||
    !filterButtons.length ||
    !packageCards.length ||
    !packageCount ||
    !packageEmpty
  ) {
    return;
  }

  let currentFilter = "all";

  /**
   * Update visible package cards without removing their
   * existing reveal classes used by the shared stylesheet.
   */
  function applyPackageFilter(filter) {
    currentFilter = filter;

    let visibleCount = 0;

    packageCards.forEach((card) => {
      const category = card.dataset.category;
      const shouldShow = filter === "all" || category === filter;

      card.classList.remove("is-filter-visible", "is-filter-hidden");

      if (shouldShow) {
        card.hidden = false;
        card.style.removeProperty("display");

        // Re-trigger the small card entrance animation.
        void card.offsetWidth;
        card.classList.add("is-filter-visible");

        visibleCount += 1;
      } else {
        card.classList.add("is-filter-hidden");
        card.hidden = true;
      }
    });

    // Update the result count.
    packageCount.textContent = `${visibleCount} ${visibleCount === 1 ? "package" : "packages"}`;

    // Display the empty state if no cards match.
    packageEmpty.hidden = visibleCount !== 0;
    packageGrid.hidden = visibleCount === 0;

    // Update selected filter styling and accessibility state.
    filterButtons.forEach((button) => {
      const isActive = button.dataset.filter === filter;

      button.classList.toggle("active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
  }

  // Filter button interactions.
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;

      if (!filter) return;

      applyPackageFilter(filter);
    });
  });

  // Reset all filters.
  if (resetButton) {
    resetButton.addEventListener("click", () => {
      applyPackageFilter("all");

      const allPackagesButton = document.querySelector(
        '.package-filter[data-filter="all"]',
      );

      if (allPackagesButton) {
        allPackagesButton.focus();
      }
    });
  }

  // Support arrow-key navigation between filter buttons.
  const filterGroup = document.querySelector(".package-filters");

  if (filterGroup) {
    filterGroup.addEventListener("keydown", (event) => {
      const keys = ["ArrowLeft", "ArrowRight", "Home", "End"];

      if (!keys.includes(event.key)) return;

      const buttons = Array.from(
        filterGroup.querySelectorAll(".package-filter"),
      );

      const currentIndex = buttons.indexOf(document.activeElement);

      if (currentIndex === -1) return;

      event.preventDefault();

      let nextIndex = currentIndex;

      if (event.key === "ArrowRight") {
        nextIndex = (currentIndex + 1) % buttons.length;
      } else if (event.key === "ArrowLeft") {
        nextIndex = (currentIndex - 1 + buttons.length) % buttons.length;
      } else if (event.key === "Home") {
        nextIndex = 0;
      } else if (event.key === "End") {
        nextIndex = buttons.length - 1;
      }

      buttons[nextIndex].focus();
    });
  }

  // Initial state: show every package.
  applyPackageFilter(currentFilter);
});
