/* =========================================================
   APNAAUTOCARE — REVIEWS PAGE
   File: reviews.js

   Features:
   1. Filter review cards by star rating
   2. Reset filters
   3. Interactive star rating selection
   4. Feedback character counter
   5. Front-end form validation and preview notice
   6. Scroll reveal animations
   7. Smooth in-page navigation
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  /* -------------------------------------------------------
     1. REVIEW FILTERS
  ------------------------------------------------------- */

  const reviewGrid = document.getElementById("reviewCardGrid");
  const reviewCards = Array.from(document.querySelectorAll(".review-card"));
  const filterButtons = Array.from(document.querySelectorAll(".review-filter"));
  const resultCount = document.getElementById("reviewResultCount");
  const emptyState = document.getElementById("reviewEmpty");
  const resetButton = document.getElementById("resetReviewFilters");

  function applyReviewFilter(filter = "all") {
    if (!reviewGrid || !reviewCards.length) return;

    let visibleCount = 0;

    reviewCards.forEach((card) => {
      const rating = card.dataset.rating;
      const shouldShow = filter === "all" || rating === filter;

      card.hidden = !shouldShow;

      if (shouldShow) {
        visibleCount += 1;
      }
    });

    filterButtons.forEach((button) => {
      const isActive = button.dataset.filter === filter;

      button.classList.toggle("active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });

    if (resultCount) {
      resultCount.textContent = `${visibleCount} sample ${visibleCount === 1 ? "review" : "reviews"}`;
    }

    if (emptyState) {
      emptyState.hidden = visibleCount !== 0;
    }

    reviewGrid.hidden = visibleCount === 0;
  }

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      applyReviewFilter(button.dataset.filter || "all");
    });
  });

  if (resetButton) {
    resetButton.addEventListener("click", () => {
      applyReviewFilter("all");

      const allButton = document.querySelector(
        '.review-filter[data-filter="all"]',
      );

      if (allButton) {
        allButton.focus();
      }
    });
  }

  applyReviewFilter("all");

  /* -------------------------------------------------------
     2. INTERACTIVE STAR RATING
  ------------------------------------------------------- */

  const ratingInputs = Array.from(
    document.querySelectorAll('input[name="reviewRating"]'),
  );
  const ratingLabels = ratingInputs.map((input) =>
    document.querySelector(`label[for="${input.id}"]`),
  );
  const ratingHint = document.getElementById("ratingHint");

  const ratingDescriptions = {
    1: "1 star — Needs improvement",
    2: "2 stars — Below expectations",
    3: "3 stars — Satisfactory",
    4: "4 stars — Very good",
    5: "5 stars — Excellent",
  };

  function updateRatingDisplay(rating) {
    ratingLabels.forEach((label, index) => {
      if (!label) return;

      label.classList.toggle("is-previewed", index < Number(rating));
    });

    if (ratingHint) {
      ratingHint.textContent =
        ratingDescriptions[rating] || "Choose a star rating";
    }
  }

  ratingInputs.forEach((input) => {
    input.addEventListener("change", () => {
      updateRatingDisplay(input.value);
    });
  });

  ratingLabels.forEach((label, index) => {
    if (!label) return;

    label.addEventListener("mouseenter", () => {
      updateRatingDisplay(index + 1);
    });
  });

  const ratingChoice = document.querySelector(".rating-choice");

  if (ratingChoice) {
    ratingChoice.addEventListener("mouseleave", () => {
      const selected = ratingInputs.find((input) => input.checked);
      updateRatingDisplay(selected ? selected.value : 0);
    });

    ratingChoice.addEventListener("focusout", () => {
      window.requestAnimationFrame(() => {
        if (!ratingChoice.contains(document.activeElement)) {
          const selected = ratingInputs.find((input) => input.checked);
          updateRatingDisplay(selected ? selected.value : 0);
        }
      });
    });
  }

  /* -------------------------------------------------------
     3. FEEDBACK CHARACTER COUNTER
  ------------------------------------------------------- */

  const reviewMessage = document.getElementById("reviewMessage");
  const reviewCharCount = document.getElementById("reviewCharCount");

  function updateCharacterCount() {
    if (!reviewMessage || !reviewCharCount) return;

    reviewCharCount.textContent = reviewMessage.value.length;
  }

  if (reviewMessage) {
    reviewMessage.addEventListener("input", updateCharacterCount);
    updateCharacterCount();
  }

  /* -------------------------------------------------------
     4. FRONT-END FEEDBACK FORM
  ------------------------------------------------------- */

  const reviewForm = document.getElementById("reviewForm");
  const formStatus = document.getElementById("reviewFormStatus");

  if (reviewForm && formStatus) {
    reviewForm.addEventListener("submit", (event) => {
      event.preventDefault();

      formStatus.hidden = true;
      formStatus.replaceChildren();

      if (!reviewForm.checkValidity()) {
        reviewForm.reportValidity();
        return;
      }

      const formData = new FormData(reviewForm);
      const name = String(formData.get("reviewName") || "").trim();
      const topic = String(formData.get("reviewTopic") || "");
      const rating = String(formData.get("reviewRating") || "");
      const message = String(formData.get("reviewMessage") || "").trim();

      if (!name || !topic || !rating || message.length < 10) {
        reviewForm.reportValidity();
        return;
      }

      // The demo does not send or save this information.
      const heading = document.createElement("strong");
      heading.textContent = "Your feedback preview is ready.";

      const detail = document.createElement("p");
      detail.textContent =
        `Thank you, ${name}. You selected ${rating} out of 5 stars ` +
        `for ${topic}. This is only a local preview; your feedback ` +
        "has not been submitted or stored. Connect a secure backend " +
        "or review service to accept real feedback.";

      formStatus.append(heading, detail);
      formStatus.hidden = false;

      formStatus.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
        block: "nearest",
      });
    });
  }

  /* -------------------------------------------------------
     5. SCROLL REVEAL ANIMATIONS
  ------------------------------------------------------- */

  const revealElements = document.querySelectorAll(".reveal");
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealElements.forEach((element) => {
      element.classList.add("is-visible");
    });
  } else {
    document.documentElement.classList.add("js-reviews-reveal");

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
        rootMargin: "0px 0px -30px 0px",
      },
    );

    revealElements.forEach((element) => {
      const parent = element.parentElement;

      const siblings = parent
        ? Array.from(parent.querySelectorAll(":scope > .reveal"))
        : [];

      if (siblings.length > 1) {
        const siblingIndex = siblings.indexOf(element);
        element.style.transitionDelay = `${Math.min(siblingIndex * 75, 225)}ms`;
      }

      revealObserver.observe(element);
    });
  }

  /* -------------------------------------------------------
     6. SMOOTH IN-PAGE NAVIGATION
  ------------------------------------------------------- */

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);

      if (!target) return;

      event.preventDefault();

      const behavior = window.matchMedia("(prefers-reduced-motion: reduce)")
        .matches
        ? "auto"
        : "smooth";

      target.scrollIntoView({
        behavior,
        block: "start",
      });

      // Keep the URL in sync without reloading the page.
      if (window.history && window.history.replaceState) {
        window.history.replaceState(null, "", targetId);
      }
    });
  });
});
