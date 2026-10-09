/* =========================================================
   APNAAUTOCARE - BOOKING PAGE
   File: booking.js
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const $ = (selector, parent = document) => parent.querySelector(selector);
  const $$ = (selector, parent = document) =>
    Array.from(parent.querySelectorAll(selector));

  /* ================= PRELOADER ================= */

  const preloader = $("#preloader");

  const hidePreloader = () => {
    if (preloader) {
      preloader.classList.add("loaded");
      preloader.setAttribute("aria-hidden", "true");
    }
  };

  // Keep a fallback so the page does not remain covered if load is delayed.
  window.addEventListener("load", hidePreloader, { once: true });
  window.setTimeout(hidePreloader, 1800);

  /* ================= NAVBAR ================= */

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

  const backToTopFloating = $("#backToTop");

  const updateScrollUI = () => {
    const scrollPosition = window.scrollY;

    if (siteHeader) {
      siteHeader.classList.toggle("scrolled", scrollPosition > 20);
    }

    if (backToTopFloating) {
      backToTopFloating.classList.toggle("visible", scrollPosition > 450);
    }
  };

  window.addEventListener("scroll", updateScrollUI, { passive: true });
  updateScrollUI();

  if (backToTopFloating) {
    backToTopFloating.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ================= FOOTER YEAR ================= */

  const currentYear = $("#currentYear");
  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  /* ================= REVEAL ANIMATION ================= */

  const revealItems = $$(".reveal");
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (
    revealItems.length &&
    "IntersectionObserver" in window &&
    !prefersReducedMotion
  ) {
    document.documentElement.classList.add("js-reviews-reveal");

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -30px 0px" },
    );

    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  /* ================= DATE RESTRICTION ================= */

  const dateInput = $("#appointmentDate");

  const getLocalDateString = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  if (dateInput) {
    dateInput.min = getLocalDateString(new Date());

    dateInput.addEventListener("change", () => {
      clearFieldError(dateInput);

      if (dateInput.value && dateInput.value < getLocalDateString(new Date())) {
        showFieldError(dateInput, "Please choose today or a future date.");
      }
    });
  }

  /* ================= CHARACTER COUNTER ================= */

  const problemDescription = $("#problemDescription");
  const problemCharCount = $("#problemCharCount");

  if (problemDescription && problemCharCount) {
    const updateCharacterCount = () => {
      problemCharCount.textContent = `${problemDescription.value.length} / ${problemDescription.maxLength}`;
    };

    problemDescription.addEventListener("input", updateCharacterCount);
    updateCharacterCount();
  }

  /* ================= FORM VALIDATION ================= */

  const bookingForm = $("#bookingForm");
  const bookingFormStatus = $("#bookingFormStatus");
  const bookingModal = $("#bookingModal");
  const modalDialog = $(".modal-dialog");
  const modalClose = $("#modalClose");
  const editBooking = $("#editBooking");
  const bookingPreview = $("#bookingPreview");
  const copyBooking = $("#copyBooking");
  const copyStatus = $("#copyStatus");

  const fieldErrorMap = {
    serviceType: "serviceTypeError",
    vehicleType: "vehicleTypeError",
    carBrand: "carBrandError",
    carModel: "carModelError",
    appointmentDate: "appointmentDateError",
    appointmentTime: "appointmentTimeError",
    serviceLocation: "serviceLocationError",
    customerName: "customerNameError",
    customerPhone: "customerPhoneError",
    customerEmail: "customerEmailError",
    bookingConsent: "bookingConsentError",
  };

  const showFieldError = (field, message) => {
    if (!field) return;

    field.classList.add("invalid");
    field.setAttribute("aria-invalid", "true");

    const errorId = fieldErrorMap[field.name] || `${field.id}Error`;
    const errorElement = document.getElementById(errorId);

    if (errorElement) {
      errorElement.textContent = message;
    }
  };

  const clearFieldError = (field) => {
    if (!field) return;

    field.classList.remove("invalid");
    field.removeAttribute("aria-invalid");

    const errorId = fieldErrorMap[field.name] || `${field.id}Error`;
    const errorElement = document.getElementById(errorId);

    if (errorElement) {
      errorElement.textContent = "";
    }
  };

  const requiredFields = [
    "serviceType",
    "vehicleType",
    "carBrand",
    "carModel",
    "appointmentDate",
    "appointmentTime",
    "serviceLocation",
    "customerName",
    "customerPhone",
    "bookingConsent",
  ];

  requiredFields.forEach((name) => {
    const field = bookingForm?.elements.namedItem(name);
    if (!field) return;

    const eventName =
      field.type === "checkbox" || field.tagName === "SELECT"
        ? "change"
        : "input";

    field.addEventListener(eventName, () => clearFieldError(field));
  });

  const validateBookingForm = () => {
    let isValid = true;
    let firstInvalidField = null;

    const fail = (field, message) => {
      showFieldError(field, message);
      isValid = false;
      if (!firstInvalidField) firstInvalidField = field;
    };

    requiredFields.forEach((name) => {
      const field = bookingForm.elements.namedItem(name);
      if (field) clearFieldError(field);
    });

    if (bookingFormStatus) bookingFormStatus.textContent = "";

    const serviceType = $("#serviceType");
    if (!serviceType.value) {
      fail(serviceType, "Please choose a service.");
    }

    const vehicleType = $("#vehicleType");
    if (!vehicleType.value) {
      fail(vehicleType, "Please select your vehicle type.");
    }

    const carBrand = $("#carBrand");
    if (!carBrand.value.trim()) {
      fail(carBrand, "Please enter your car brand.");
    } else if (carBrand.value.trim().length < 2) {
      fail(carBrand, "Please enter a valid car brand.");
    }

    const carModel = $("#carModel");
    if (!carModel.value.trim()) {
      fail(carModel, "Please enter your car model.");
    }

    const appointmentDate = $("#appointmentDate");
    if (!appointmentDate.value) {
      fail(appointmentDate, "Please select a preferred date.");
    } else if (appointmentDate.value < getLocalDateString(new Date())) {
      fail(appointmentDate, "Please choose today or a future date.");
    }

    const appointmentTime = $("#appointmentTime");
    if (!appointmentTime.value) {
      fail(appointmentTime, "Please choose a preferred time.");
    }

    const serviceLocation = $("#serviceLocation");
    if (!serviceLocation.value) {
      fail(serviceLocation, "Please select a location preference.");
    }

    const customerName = $("#customerName");
    const cleanedName = customerName.value.trim();

    if (!cleanedName) {
      fail(customerName, "Please enter your full name.");
    } else if (cleanedName.length < 2) {
      fail(customerName, "Please enter a name with at least 2 characters.");
    } else if (/[<>]/.test(cleanedName)) {
      fail(customerName, "Please remove unsupported characters.");
    }

    const customerPhone = $("#customerPhone");
    const phoneDigits = customerPhone.value.replace(/\D/g, "");

    // Indian mobile numbers are normally 10 digits beginning with 6-9.
    // Accept an optional country prefix in the typed input.
    const validIndianPhone =
      /^[6-9]\d{9}$/.test(phoneDigits) || /^91[6-9]\d{9}$/.test(phoneDigits);

    if (!customerPhone.value.trim()) {
      fail(customerPhone, "Please enter your mobile number.");
    } else if (!validIndianPhone) {
      fail(customerPhone, "Enter a valid 10-digit Indian mobile number.");
    }

    const customerEmail = $("#customerEmail");
    const emailValue = customerEmail.value.trim();

    clearFieldError(customerEmail);

    if (emailValue && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(emailValue)) {
      fail(customerEmail, "Please enter a valid email address.");
    }

    const bookingConsent = $("#bookingConsent");
    if (!bookingConsent.checked) {
      fail(bookingConsent, "Please agree to the contact and privacy notice.");
    }

    if (!isValid && firstInvalidField) {
      firstInvalidField.focus({ preventScroll: true });
      firstInvalidField.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }

    return isValid;
  };

  /* ================= BUILD BOOKING PREVIEW ================= */

  const getValue = (id, fallback = "Not provided") => {
    const element = document.getElementById(id);
    if (!element) return fallback;

    if (element.tagName === "SELECT") {
      return element.value
        ? element.options[element.selectedIndex].text
        : fallback;
    }

    return element.value.trim() || fallback;
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return "Not provided";

    // Parse local date components rather than using UTC conversion.
    const [year, month, day] = dateValue.split("-").map(Number);
    const date = new Date(year, month - 1, day);

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const buildPreviewRows = () => {
    const dateValue = $("#appointmentDate").value;

    return [
      ["Service", getValue("serviceType")],
      ["Package", getValue("packageType", "No package selected")],
      ["Vehicle type", getValue("vehicleType")],
      ["Car brand", getValue("carBrand")],
      ["Car model", getValue("carModel")],
      ["Registration", getValue("registrationNumber", "Not provided")],
      ["Preferred date", formatDate(dateValue)],
      ["Preferred time", getValue("appointmentTime")],
      ["Location preference", getValue("serviceLocation")],
      ["Customer name", getValue("customerName")],
      ["Mobile number", getValue("customerPhone")],
      ["Email", getValue("customerEmail", "Not provided")],
      ["Area / locality", getValue("customerAddress", "Not provided")],
      ["Issue / notes", getValue("problemDescription", "No additional notes")],
    ];
  };

  const createPreview = () => {
    if (!bookingPreview) return;

    bookingPreview.replaceChildren();

    buildPreviewRows().forEach(([label, value]) => {
      const row = document.createElement("div");
      row.className = "preview-row";

      const labelElement = document.createElement("span");
      labelElement.textContent = label;

      const valueElement = document.createElement("strong");
      valueElement.textContent = value;

      row.append(labelElement, valueElement);
      bookingPreview.appendChild(row);
    });
  };

  /* ================= MODAL CONTROLS ================= */

  let previouslyFocusedElement = null;

  const openModal = () => {
    if (!bookingModal) return;

    previouslyFocusedElement = document.activeElement;
    bookingModal.classList.add("open");
    bookingModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");

    if (copyStatus) copyStatus.textContent = "";

    window.setTimeout(() => {
      if (modalDialog) modalDialog.focus();
    }, 50);
  };

  const closeModal = ({ returnFocus = true } = {}) => {
    if (!bookingModal) return;

    bookingModal.classList.remove("open");
    bookingModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");

    if (returnFocus && previouslyFocusedElement) {
      previouslyFocusedElement.focus();
    }
  };

  if (bookingForm) {
    bookingForm.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!validateBookingForm()) {
        if (bookingFormStatus) {
          bookingFormStatus.textContent =
            "Please check the highlighted fields and try again.";
        }
        return;
      }

      createPreview();
      openModal();
    });
  }

  if (modalClose) {
    modalClose.addEventListener("click", () => closeModal());
  }

  if (editBooking) {
    editBooking.addEventListener("click", () => {
      closeModal();
      const firstField = $("#serviceType");
      if (firstField) {
        firstField.focus({ preventScroll: true });
        firstField.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });
  }

  if (bookingModal) {
    bookingModal.addEventListener("click", (event) => {
      if (event.target.closest("[data-close-modal]")) {
        closeModal();
      }
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && bookingModal?.classList.contains("open")) {
      closeModal();
    }

    // Keep keyboard focus inside the open dialog.
    if (event.key === "Tab" && bookingModal?.classList.contains("open")) {
      const focusable = $$(
        "button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled])",
        bookingModal,
      ).filter((element) => element.offsetParent !== null);

      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  /* ================= COPY BOOKING SUMMARY ================= */

  const getPlainTextSummary = () => {
    const rows = buildPreviewRows();

    return [
      "APNAAUTOCARE - BOOKING REQUEST PREVIEW",
      "--------------------------------------",
      ...rows.map(([label, value]) => `${label}: ${value}`),
      "",
      "Note: This is a preview only. The appointment has not been submitted or confirmed.",
    ].join("\n");
  };

  const fallbackCopy = (text) => {
    const temporaryTextArea = document.createElement("textarea");
    temporaryTextArea.value = text;
    temporaryTextArea.setAttribute("readonly", "");
    temporaryTextArea.style.position = "fixed";
    temporaryTextArea.style.opacity = "0";
    document.body.appendChild(temporaryTextArea);
    temporaryTextArea.select();

    let copied = false;

    try {
      copied = document.execCommand("copy");
    } catch {
      copied = false;
    }

    temporaryTextArea.remove();
    return copied;
  };

  if (copyBooking) {
    copyBooking.addEventListener("click", async () => {
      const summaryText = getPlainTextSummary();

      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(summaryText);
          if (copyStatus) copyStatus.textContent = "Booking summary copied.";
        } else {
          const copied = fallbackCopy(summaryText);

          if (copyStatus) {
            copyStatus.textContent = copied
              ? "Booking summary copied."
              : "Copy was unavailable. Please select and copy the details manually.";
          }
        }
      } catch {
        const copied = fallbackCopy(summaryText);

        if (copyStatus) {
          copyStatus.textContent = copied
            ? "Booking summary copied."
            : "Copy was unavailable. Please copy the details manually.";
        }
      }
    });
  }
});
