/* =====================================================
   APNAAUTOCARE — SERVICES PAGE JAVASCRIPT
   Search, category filtering and result counter
   ===================================================== */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const serviceGrid = document.getElementById("serviceGrid");
  const searchInput = document.getElementById("serviceSearch");
  const filterButtons = document.querySelectorAll(".filter-btn");
  const serviceCount = document.getElementById("serviceCount");
  const emptyState = document.getElementById("serviceEmpty");
  const resetButton = document.getElementById("resetServices");

  // Exit safely if this script is loaded on another page.
  if (!serviceGrid || !searchInput || !serviceCount || !emptyState) {
    return;
  }

  const serviceCards = Array.from(
    serviceGrid.querySelectorAll(".directory-card"),
  );

  let activeCategory = "all";

  // Normalize search terms for reliable matching.
  function normalizeText(value) {
    return value.toLowerCase().trim().replace(/\s+/g, " ");
  }

  // Filter by category and search query together.
  function filterServices() {
    const query = normalizeText(searchInput.value);
    let visibleCount = 0;

    serviceCards.forEach((card) => {
      const category = card.dataset.category || "";
      const searchableText = normalizeText(
        [
          card.dataset.search || "",
          card.querySelector("h3")?.textContent || "",
          card.querySelector("p")?.textContent || "",
        ].join(" "),
      );

      const matchesCategory =
        activeCategory === "all" || category === activeCategory;

      const matchesSearch = query === "" || searchableText.includes(query);

      const shouldShow = matchesCategory && matchesSearch;

      card.hidden = !shouldShow;

      if (shouldShow) {
        visibleCount++;
      }
    });

    // Update the number of currently visible results.
    serviceCount.textContent = `${visibleCount} ${visibleCount === 1 ? "service" : "services"}`;

    // Display a useful empty state if nothing matches.
    emptyState.hidden = visibleCount !== 0;
    serviceGrid.hidden = visibleCount === 0;
  }

  // Category filter interaction.
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeCategory = button.dataset.filter || "all";

      filterButtons.forEach((item) => {
        const isActive = item === button;

        item.classList.toggle("active", isActive);
        item.setAttribute("aria-pressed", String(isActive));
      });

      filterServices();
    });
  });

  // Search updates as the user types.
  searchInput.addEventListener("input", filterServices);

  // Reset button restores all eight services.
  if (resetButton) {
    resetButton.addEventListener("click", () => {
      activeCategory = "all";
      searchInput.value = "";

      filterButtons.forEach((button) => {
        const isAll = button.dataset.filter === "all";

        button.classList.toggle("active", isAll);
        button.setAttribute("aria-pressed", String(isAll));
      });

      filterServices();
      searchInput.focus();
    });
  }

  // Support clearing the search with Escape.
  searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      searchInput.value = "";
      filterServices();
    }
  });

  // Set the initial count and visibility.
  filterServices();
});
