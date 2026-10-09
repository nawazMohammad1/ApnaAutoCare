/* =========================================================
   APNAAUTOCARE - FAQ PAGE
   File: faq.js
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  const faqItems = Array.from(document.querySelectorAll(".faq-item"));
  const questions = Array.from(document.querySelectorAll(".faq-question"));
  const categoryButtons = Array.from(
    document.querySelectorAll(".faq-category"),
  );

  const searchInput = document.getElementById("faqSearch");
  const clearSearchButton = document.getElementById("clearFaqSearch");
  const resultsCount = document.getElementById("faqResultsCount");
  const toggleAllButton = document.getElementById("toggleAllFaqs");
  const emptyState = document.getElementById("faqEmpty");
  const resetButton = document.getElementById("resetFaq");
  const accordion = document.getElementById("faqAccordion");
  const currentYear = document.getElementById("currentYear");

  let activeCategory = "all";

  // Footer year.
  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  // Set a consistent starting state for every accordion item.
  function setQuestionState(button, shouldOpen) {
    const answerId = button.getAttribute("aria-controls");
    const answer = document.getElementById(answerId);
    const item = button.closest(".faq-item");

    if (!answer || !item) return;

    button.setAttribute("aria-expanded", String(shouldOpen));
    answer.hidden = !shouldOpen;
    item.classList.toggle("is-open", shouldOpen);

    const icon = button.querySelector(".faq-toggle i");

    if (icon) {
      icon.className = shouldOpen ? "fa-solid fa-minus" : "fa-solid fa-plus";
    }
  }

  function closeAllQuestions() {
    questions.forEach((button) => setQuestionState(button, false));
  }

  // Accordion: clicking the same question closes it.
  // Different questions can remain open at the same time.
  questions.forEach((button) => {
    button.addEventListener("click", () => {
      const willOpen = button.getAttribute("aria-expanded") !== "true";
      setQuestionState(button, willOpen);
      updateExpandAllButton();
    });
  });

  function getVisibleItems() {
    return faqItems.filter((item) => !item.hidden);
  }

  function updateExpandAllButton() {
    if (!toggleAllButton) return;

    const visibleItems = getVisibleItems();
    const allOpen =
      visibleItems.length > 0 &&
      visibleItems.every((item) => {
        const button = item.querySelector(".faq-question");
        return button && button.getAttribute("aria-expanded") === "true";
      });

    toggleAllButton.innerHTML = allOpen
      ? 'Collapse all <i class="fa-solid fa-minus"></i>'
      : 'Expand all <i class="fa-solid fa-plus"></i>';

    toggleAllButton.setAttribute("aria-expanded", String(allOpen));
  }

  // Expand or collapse only the currently visible questions.
  if (toggleAllButton) {
    toggleAllButton.addEventListener("click", () => {
      const visibleItems = getVisibleItems();

      const allOpen =
        visibleItems.length > 0 &&
        visibleItems.every((item) => {
          const button = item.querySelector(".faq-question");
          return button && button.getAttribute("aria-expanded") === "true";
        });

      visibleItems.forEach((item) => {
        const button = item.querySelector(".faq-question");

        if (button) {
          setQuestionState(button, !allOpen);
        }
      });

      updateExpandAllButton();
    });
  }

  // Search and category filtering.
  function filterQuestions() {
    const searchTerm = (searchInput?.value || "").trim().toLowerCase();

    let visibleCount = 0;

    faqItems.forEach((item) => {
      const category = item.dataset.category || "";
      const question = item.querySelector(".faq-question-text");
      const answer = item.querySelector(".faq-answer-inner");

      const searchableText = [
        question?.textContent || "",
        answer?.textContent || "",
        category,
      ]
        .join(" ")
        .toLowerCase();

      const matchesCategory =
        activeCategory === "all" || category === activeCategory;

      const matchesSearch =
        searchTerm === "" || searchableText.includes(searchTerm);

      const shouldShow = matchesCategory && matchesSearch;

      item.hidden = !shouldShow;

      // Close hidden items so a filtered answer never remains open
      // outside the current result set.
      if (!shouldShow) {
        const button = item.querySelector(".faq-question");

        if (button) {
          setQuestionState(button, false);
        }
      } else {
        visibleCount += 1;
      }
    });

    if (resultsCount) {
      if (
        visibleCount === faqItems.length &&
        !searchTerm &&
        activeCategory === "all"
      ) {
        resultsCount.textContent = `Showing all ${faqItems.length} questions`;
      } else {
        resultsCount.textContent = `Showing ${visibleCount} of ${faqItems.length} questions`;
      }
    }

    if (emptyState) {
      emptyState.hidden = visibleCount !== 0;
    }

    if (accordion) {
      accordion.classList.toggle("has-no-results", visibleCount === 0);
    }

    if (clearSearchButton) {
      clearSearchButton.hidden = searchTerm.length === 0;
    }

    updateExpandAllButton();
  }

  // Category controls.
  categoryButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeCategory = button.dataset.category || "all";

      categoryButtons.forEach((categoryButton) => {
        const isActive = categoryButton === button;

        categoryButton.classList.toggle("active", isActive);
        categoryButton.setAttribute("aria-pressed", String(isActive));
      });

      filterQuestions();
    });
  });

  // Live search.
  if (searchInput) {
    searchInput.addEventListener("input", filterQuestions);
  }

  // Clear search without changing the selected category.
  if (clearSearchButton) {
    clearSearchButton.addEventListener("click", () => {
      if (searchInput) {
        searchInput.value = "";
        searchInput.focus();
      }

      filterQuestions();
    });
  }

  // Reset both search and category selection.
  function resetFilters() {
    activeCategory = "all";

    if (searchInput) {
      searchInput.value = "";
    }

    categoryButtons.forEach((button) => {
      const isActive = button.dataset.category === "all";

      button.classList.toggle("active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });

    closeAllQuestions();
    filterQuestions();
  }

  if (resetButton) {
    resetButton.addEventListener("click", resetFilters);
  }

  // Initialize all answers as closed and filters as active.
  closeAllQuestions();
  filterQuestions();

  // Scroll reveal animations.
  document.documentElement.classList.add("js-faq-reveal");

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
        threshold: 0.1,
        rootMargin: "0px 0px -25px 0px",
      },
    );

    revealElements.forEach((element, index) => {
      element.style.transitionDelay = `${(index % 3) * 70}ms`;
      revealObserver.observe(element);
    });

    // Reveal content already in view when restoring a page.
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
});
