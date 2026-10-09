/* =========================================================
   APNAAUTOCARE - GALLERY PAGE
   File: gallery.js
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const $ = (selector, parent = document) => parent.querySelector(selector);
  const $$ = (selector, parent = document) =>
    Array.from(parent.querySelectorAll(selector));

  /* ================= PRELOADER ================= */

  const preloader = $("#preloader");

  const hidePreloader = () => {
    if (!preloader) return;

    preloader.classList.add("loaded");
    preloader.setAttribute("aria-hidden", "true");
  };

  window.addEventListener("load", hidePreloader, { once: true });
  window.setTimeout(hidePreloader, 1800);

  /* ================= MOBILE NAVIGATION ================= */

  const siteHeader = $("#siteHeader");
  const menuToggle = $("#menuToggle");
  const navMenu = $("#navMenu");

  const closeMenu = () => {
    if (!menuToggle || !navMenu) return;

    navMenu.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");

    const icon = $("i", menuToggle);

    if (icon) {
      icon.classList.remove("fa-xmark");
      icon.classList.add("fa-bars");
    }
  };

  if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("open");

      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation menu" : "Open navigation menu",
      );

      const icon = $("i", menuToggle);

      if (icon) {
        icon.classList.toggle("fa-bars", !isOpen);
        icon.classList.toggle("fa-xmark", isOpen);
      }
    });

    $$(".nav-menu a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("click", (event) => {
      if (
        navMenu.classList.contains("open") &&
        !navMenu.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        closeMenu();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 900) closeMenu();
    });
  }

  /* ================= HEADER & BACK TO TOP ================= */

  const backToTop = $("#backToTop");

  const updateScrollUI = () => {
    const scrollPosition = window.scrollY;

    if (siteHeader) {
      siteHeader.classList.toggle("scrolled", scrollPosition > 20);
    }

    if (backToTop) {
      backToTop.classList.toggle("visible", scrollPosition > 450);
    }
  };

  window.addEventListener("scroll", updateScrollUI, { passive: true });
  updateScrollUI();

  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }

  const currentYear = $("#currentYear");

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  /* ================= REVEAL ANIMATIONS ================= */

  const revealItems = $$(".reveal");

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (
    revealItems.length &&
    "IntersectionObserver" in window &&
    !prefersReducedMotion
  ) {
    document.documentElement.classList.add("js-gallery-reveal");

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
        threshold: 0.12,
        rootMargin: "0px 0px -25px 0px",
      },
    );

    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  /* ================= GALLERY FILTERS ================= */

  const galleryGrid = $("#galleryGrid");
  const galleryCards = galleryGrid ? $$(".gallery-card", galleryGrid) : [];

  const filterButtons = $$(".gallery-filter");
  const galleryCount = $("#galleryCount");
  const galleryResults = $("#galleryResults");
  const galleryEmpty = $("#galleryEmpty");
  const resetGallery = $("#resetGallery");

  let activeFilter = "all";

  const getVisibleCards = () => galleryCards.filter((card) => !card.hidden);

  const updateGallery = (filter = "all") => {
    activeFilter = filter;

    galleryCards.forEach((card) => {
      const category = card.dataset.category;
      const shouldShow = filter === "all" || category === filter;

      card.hidden = !shouldShow;
    });

    filterButtons.forEach((button) => {
      const isActive = button.dataset.filter === filter;

      button.classList.toggle("active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });

    const visibleCards = getVisibleCards();
    const count = visibleCards.length;

    if (galleryCount) {
      galleryCount.textContent = String(count);
    }

    if (galleryResults) {
      const selectedButton = filterButtons.find(
        (button) => button.dataset.filter === filter,
      );

      const categoryName = selectedButton
        ? selectedButton.textContent.trim()
        : "All Photos";

      galleryResults.textContent =
        filter === "all"
          ? `Showing all ${count} photos`
          : `Showing ${count} ${categoryName.toLowerCase()}`;
    }

    if (galleryEmpty) {
      galleryEmpty.hidden = count !== 0;
    }
  };

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      updateGallery(button.dataset.filter || "all");
    });
  });

  if (resetGallery) {
    resetGallery.addEventListener("click", () => {
      updateGallery("all");

      const firstFilter = $('.gallery-filter[data-filter="all"]');
      if (firstFilter) firstFilter.focus();
    });
  }

  updateGallery("all");

  /* ================= LIGHTBOX ================= */

  const lightbox = $("#galleryLightbox");
  const lightboxDialog = $(".lightbox-dialog", lightbox || document);
  const lightboxImage = $("#lightboxImage");
  const lightboxTitle = $("#lightboxTitle");
  const lightboxCategory = $("#lightboxCategory");
  const lightboxCounter = $("#lightboxCounter");

  const lightboxClose = $("#lightboxClose");
  const lightboxPrev = $("#lightboxPrev");
  const lightboxNext = $("#lightboxNext");

  let currentImageIndex = 0;
  let lastFocusedElement = null;
  let visibleImageButtons = [];

  const getImageData = (button) => {
    const image = $("img", button);

    return {
      src: button.dataset.full || image?.src || "",
      alt: image?.alt || button.dataset.title || "Gallery photo",
      title: button.dataset.title || image?.alt || "Gallery photo",
      category: button.dataset.categoryLabel || "Gallery",
    };
  };

  const refreshLightboxItems = () => {
    visibleImageButtons = getVisibleCards()
      .map((card) => $(".gallery-image-button", card))
      .filter(Boolean);
  };

  const updateLightboxImage = () => {
    if (!visibleImageButtons.length) return;

    if (currentImageIndex < 0) {
      currentImageIndex = visibleImageButtons.length - 1;
    }

    if (currentImageIndex >= visibleImageButtons.length) {
      currentImageIndex = 0;
    }

    const button = visibleImageButtons[currentImageIndex];
    const data = getImageData(button);

    if (lightboxImage) {
      lightboxImage.src = data.src;
      lightboxImage.alt = data.alt;
    }

    if (lightboxTitle) {
      lightboxTitle.textContent = data.title;
    }

    if (lightboxCategory) {
      lightboxCategory.textContent = data.category;
    }

    if (lightboxCounter) {
      lightboxCounter.textContent = `${currentImageIndex + 1} / ${visibleImageButtons.length}`;
    }

    if (lightboxPrev) {
      lightboxPrev.disabled = visibleImageButtons.length < 2;
    }

    if (lightboxNext) {
      lightboxNext.disabled = visibleImageButtons.length < 2;
    }
  };

  const openLightbox = (button) => {
    if (!lightbox) return;

    refreshLightboxItems();

    currentImageIndex = visibleImageButtons.indexOf(button);

    if (currentImageIndex < 0) return;

    lastFocusedElement = document.activeElement;

    updateLightboxImage();

    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("lightbox-open");

    window.setTimeout(() => {
      if (lightboxClose) lightboxClose.focus();
      else if (lightboxDialog) lightboxDialog.focus();
    }, 30);
  };

  const closeLightbox = ({ returnFocus = true } = {}) => {
    if (!lightbox) return;

    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("lightbox-open");

    if (returnFocus && lastFocusedElement) {
      lastFocusedElement.focus();
    }
  };

  const showPreviousImage = () => {
    if (!visibleImageButtons.length) return;

    currentImageIndex =
      (currentImageIndex - 1 + visibleImageButtons.length) %
      visibleImageButtons.length;

    updateLightboxImage();
  };

  const showNextImage = () => {
    if (!visibleImageButtons.length) return;

    currentImageIndex = (currentImageIndex + 1) % visibleImageButtons.length;

    updateLightboxImage();
  };

  galleryCards.forEach((card) => {
    const imageButton = $(".gallery-image-button", card);

    if (!imageButton) return;

    imageButton.addEventListener("click", () => {
      openLightbox(imageButton);
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener("click", () => closeLightbox());
  }

  if (lightboxPrev) {
    lightboxPrev.addEventListener("click", showPreviousImage);
  }

  if (lightboxNext) {
    lightboxNext.addEventListener("click", showNextImage);
  }

  if (lightbox) {
    lightbox.addEventListener("click", (event) => {
      if (event.target.closest("[data-close-lightbox]")) {
        closeLightbox();
      }
    });
  }

  /* ================= KEYBOARD CONTROLS ================= */

  document.addEventListener("keydown", (event) => {
    if (!lightbox?.classList.contains("open")) return;

    if (event.key === "Escape") {
      event.preventDefault();
      closeLightbox();
      return;
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      showPreviousImage();
      return;
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      showNextImage();
      return;
    }

    // Keep keyboard focus inside the lightbox.
    if (event.key === "Tab") {
      const focusableElements = $$("button:not([disabled])", lightbox).filter(
        (element) => element.offsetParent !== null,
      );

      if (!focusableElements.length) return;

      const first = focusableElements[0];
      const last = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  /* ================= IMAGE FALLBACK ================= */

  // If a remote image URL fails, mark it so it can be diagnosed in CSS
  // or browser developer tools. The alt text remains available.
  $$(".gallery-card img, .gallery-feature-image img").forEach((image) => {
    image.addEventListener("error", () => {
      image.classList.add("image-load-error");
    });
  });
});
