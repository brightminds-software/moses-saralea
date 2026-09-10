document.addEventListener("DOMContentLoaded", () => {
  const EVENT_DATE = "2027-01-08T00:00:00+03:00";

  // Envelope opening
  const opening = document.getElementById("opening");
  const openButton = document.getElementById("openInvitation");
  const main = document.getElementById("mainContent");

  const openEnvelope = () => {
    const flap = document.querySelector(".flap");
    if (flap) flap.style.transform = "rotateX(180deg)";
    opening?.classList.add("opening-active");
    window.setTimeout(() => {
      opening?.classList.add("dismissed");
      main?.removeAttribute("aria-hidden");
      document.body.classList.remove("locked");
    }, 620);
    window.setTimeout(() => opening?.remove(), 1500);
  };

  const envelopeTap = document.getElementById("envelopeTap");
  envelopeTap?.addEventListener("click", openEnvelope);
  envelopeTap?.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openEnvelope();
    }
  });
  openButton?.addEventListener("click", openEnvelope);

  // Five-second hero slide rotation
  const slides = [...document.querySelectorAll(".hero-slide")];
  let slideIndex = 0;

  if (slides.length > 1) {
    window.setInterval(() => {
      slides[slideIndex].classList.remove("active");
      slideIndex = (slideIndex + 1) % slides.length;
      slides[slideIndex].classList.add("active");
    }, 5000);
  }

  // Countdown
  const nodes = {
    days: document.getElementById("days"),
    hours: document.getElementById("hours"),
    minutes: document.getElementById("minutes"),
    seconds: document.getElementById("seconds")
  };

  const pad = (value, size) => String(value).padStart(size, "0");

  function updateCountdown() {
    const distance = Math.max(0, new Date(EVENT_DATE).getTime() - Date.now());
    const total = Math.floor(distance / 1000);

    nodes.days.textContent = pad(Math.floor(total / 86400), 3);
    nodes.hours.textContent = pad(Math.floor((total % 86400) / 3600), 2);
    nodes.minutes.textContent = pad(Math.floor((total % 3600) / 60), 2);
    nodes.seconds.textContent = pad(total % 60, 2);
  }

  updateCountdown();
  window.setInterval(updateCountdown, 1000);


  // Lightweight 12-image gallery. Only the active image is swapped; there is
  // one timer, so slow image loads cannot create a queue of transitions.
  const galleryImages = Array.from({ length: 12 }, (_, i) => `images/Image${i + 1}.jpg`);
  const galleryCaptions = [
    "Together, in the little moments.",
    "A memory worth keeping close.",
    "Laughter, warmth and family.",
    "The journey continues.",
    "A beautiful chapter in our story.",
    "Two lives, one shared direction.",
    "Love lives in the ordinary days.",
    "A quiet moment before the celebration.",
    "Surrounded by warmth and memories.",
    "The people and moments that matter.",
    "Almost time for the next chapter.",
    "Ready for the day ahead."
  ];
  const galleryMain = document.getElementById("galleryMainImage");
  const galleryWrap = document.getElementById("galleryImageWrap");
  const galleryCaption = document.getElementById("galleryCaption");
  const galleryCurrent = document.getElementById("galleryCurrent");
  const gallerySideText = document.getElementById("gallerySideText");
  const galleryProgress = document.getElementById("galleryProgress");
  const galleryThumbs = [...document.querySelectorAll(".gallery-thumb")];
  const galleryPrev = document.getElementById("galleryPrev");
  const galleryNext = document.getElementById("galleryNext");
  let galleryIndex = 0;
  let galleryTimer = null;
  let galleryBusy = false;

  function updatePreviewSlots() {
    galleryThumbs.forEach((thumb, slot) => {
      const index = (galleryIndex + slot) % galleryImages.length;
      const img = thumb.querySelector("img");
      if (img) {
        img.src = galleryImages[index];
        img.alt = `Photo ${index + 1}`;
      }
      thumb.dataset.index = String(index);
      thumb.classList.toggle("active", slot === 0);
      thumb.setAttribute("aria-label", `View photo ${index + 1}`);
    });
  }

  function resetGalleryTimer() {
    if (galleryTimer) window.clearTimeout(galleryTimer);
    if (galleryMain) {
      galleryTimer = window.setTimeout(() => showGallery(galleryIndex + 1), 5000);
    }
  }

  function startProgress() {
    if (!galleryProgress) return;
    galleryProgress.style.transition = "none";
    galleryProgress.style.width = "0%";
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        galleryProgress.style.transition = "width 5s linear";
        galleryProgress.style.width = "100%";
      });
    });
  }

  function preloadGalleryImages(center) {
    [1, 2, 3].forEach((step) => {
      const img = new Image();
      img.src = galleryImages[(center + step) % galleryImages.length];
    });
  }

  function showGallery(index, immediate = false) {
    if (!galleryMain || !galleryWrap || galleryBusy) return;
    galleryBusy = true;
    galleryIndex = (index + galleryImages.length) % galleryImages.length;
    const nextSrc = galleryImages[galleryIndex];
    galleryWrap.classList.add("changing");

    const apply = () => {
      galleryMain.src = nextSrc;
      galleryMain.alt = galleryIndex === 0 ? "Sara and Moses" : `Photo ${galleryIndex + 1}`;
      galleryCaption.textContent = galleryCaptions[galleryIndex];
      galleryCurrent.textContent = String(galleryIndex + 1).padStart(2, "0");
      gallerySideText.textContent = galleryCaptions[galleryIndex];
      updatePreviewSlots();
      preloadGalleryImages(galleryIndex);
      galleryWrap.classList.remove("changing");
      galleryBusy = false;
      startProgress();
      resetGalleryTimer();
    };

    if (immediate) {
      apply();
      return;
    }

    const nextImage = new Image();
    nextImage.onload = apply;
    nextImage.onerror = apply;
    nextImage.src = nextSrc;
  }

  galleryThumbs.forEach((thumb) => {
    thumb.addEventListener("click", () => showGallery(Number(thumb.dataset.index)));
  });
  galleryPrev?.addEventListener("click", () => showGallery(galleryIndex - 1));
  galleryNext?.addEventListener("click", () => showGallery(galleryIndex + 1));

  if (galleryMain) {
    updatePreviewSlots();
    galleryMain.addEventListener("error", () => {
      galleryWrap?.classList.remove("changing");
      galleryBusy = false;
      resetGalleryTimer();
    });
    galleryMain.addEventListener("load", () => {
      galleryWrap?.classList.remove("changing");
      galleryBusy = false;
    });
    startProgress();
    resetGalleryTimer();
  }

  // Gift copy
  const choices = [...document.querySelectorAll(".gift-option")];
  const status = document.getElementById("giftStatus");

  choices.forEach((choice) => {
    choice.addEventListener("click", async () => {
      choices.forEach((item) => item.classList.remove("selected"));
      choice.classList.add("selected");

      const name = choice.dataset.name;
      const number = choice.dataset.number;
      status.textContent = `${name}'s number is selected.`;

      let copied = false;
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(number);
          copied = true;
        } else {
          const textarea = document.createElement("textarea");
          textarea.value = number;
          textarea.setAttribute("readonly", "");
          textarea.style.position = "fixed";
          textarea.style.opacity = "0";
          document.body.appendChild(textarea);
          textarea.select();
          copied = document.execCommand("copy");
          textarea.remove();
        }
      } catch {
        copied = false;
      }

      const copy = choice.querySelector(".gift-copy");

      if (copied) {
        copy.textContent = "Copied";
        status.textContent = `${number} for ${name} has been copied.`;
        window.setTimeout(() => {
          copy.textContent = "Copy";
        }, 2200);
      } else {
        status.textContent = `Please copy ${number} manually.`;
      }
    });
  });
});


// Final polish: current year and back-to-top button.
(() => {
  const year = document.getElementById("currentYear");
  if (year) year.textContent = new Date().getFullYear();

  const topButton = document.getElementById("backTop");
  if (!topButton) return;

  const toggleTop = () => {
    topButton.classList.toggle("show", window.scrollY > 450);
  };

  window.addEventListener("scroll", toggleTop, { passive: true });
  toggleTop();

  topButton.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
})();
