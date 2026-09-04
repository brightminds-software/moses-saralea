document.addEventListener("DOMContentLoaded", () => {
  // ==============================
  // BASIC SETTINGS
  // ==============================
  // No event time was supplied, so the countdown targets the start of
  // 8 January 2027 in East Africa Time (+03:00). Change this line later
  // if the couple provides an exact ceremony time.
  const EVENT_DATE = "2027-01-08T00:00:00+03:00";

  const opening = document.getElementById("opening");
  const openInvitation = document.getElementById("openInvitation");
  const mainContent = document.getElementById("mainContent");

  const countdownBar = document.getElementById("countdownBar");
  const countdownReopen = document.getElementById("reopenCountdown");
  const closeCountdown = document.getElementById("closeCountdown");

  // ==============================
  // OPEN INVITATION
  // ==============================
  document.body.classList.add("locked");

  // Trigger opening-screen entrance reveals.
  requestAnimationFrame(() => {
    document.querySelectorAll(".reveal-up").forEach((el) => el.classList.add("visible"));
  });

  openInvitation.addEventListener("click", () => {
    opening.classList.add("dismissed");
    mainContent.removeAttribute("aria-hidden");
    document.body.classList.remove("locked");

    // Give the opening transition time to finish, then remove it.
    window.setTimeout(() => {
      opening.setAttribute("aria-hidden", "true");
    }, 1100);
  });

  // ==============================
  // SCROLL REVEALS
  // ==============================
  const revealItems = document.querySelectorAll(".reveal");

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealItems.forEach((item) => revealObserver.observe(item));

  // ==============================
  // COUNTDOWN
  // ==============================
  const elements = {
    days: document.getElementById("days"),
    hours: document.getElementById("hours"),
    minutes: document.getElementById("minutes"),
    seconds: document.getElementById("seconds")
  };

  function pad(value, digits = 2) {
    return String(value).padStart(digits, "0");
  }

  function updateCountdown() {
    const target = new Date(EVENT_DATE).getTime();
    const now = Date.now();
    const distance = Math.max(0, target - now);

    const totalSeconds = Math.floor(distance / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    elements.days.textContent = pad(days, 3);
    elements.hours.textContent = pad(hours);
    elements.minutes.textContent = pad(minutes);
    elements.seconds.textContent = pad(seconds);

    if (distance <= 0) {
      countdownBar.querySelector(".countdown-label strong").textContent = "It’s the day!";
      countdownBar.querySelector(".countdown-label small").textContent = "08 January 2027";
    }
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // ==============================
  // COUNTDOWN MINIMIZE / REOPEN
  // ==============================
  closeCountdown.addEventListener("click", () => {
    countdownBar.classList.add("hidden");
    countdownReopen.classList.add("show");
  });

  countdownReopen.addEventListener("click", () => {
    countdownBar.classList.remove("hidden");
    countdownReopen.classList.remove("show");
  });

  // ==============================
  // SLIDESHOW
  // ==============================
  const slides = [...document.querySelectorAll(".slide")];
  const slideCounter = document.getElementById("slideCounter");
  const prevSlide = document.getElementById("prevSlide");
  const nextSlide = document.getElementById("nextSlide");

  let currentSlide = 0;
  let slideTimer;

  function renderSlide(index) {
    if (!slides.length) return;

    currentSlide = (index + slides.length) % slides.length;

    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === currentSlide);
    });

    slideCounter.textContent = `${pad(currentSlide + 1)} / ${pad(slides.length)}`;
  }

  function restartSlideTimer() {
    window.clearInterval(slideTimer);
    slideTimer = window.setInterval(() => {
      renderSlide(currentSlide + 1);
    }, 5500);
  }

  prevSlide.addEventListener("click", () => {
    renderSlide(currentSlide - 1);
    restartSlideTimer();
  });

  nextSlide.addEventListener("click", () => {
    renderSlide(currentSlide + 1);
    restartSlideTimer();
  });

  renderSlide(0);
  restartSlideTimer();

  // ==============================
  // EXTRA POLISH: close countdown
  // once page reaches very bottom, then reopen
  // ==============================
  const footerObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        countdownBar.classList.add("hidden");
        countdownReopen.classList.remove("show");
      }
    });
  }, { threshold: 0.35 });

  const closing = document.querySelector(".closing");
  if (closing) footerObserver.observe(closing);

  // Restore countdown after leaving closing section.
  const pageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting && !countdownBar.classList.contains("hidden")) {
        countdownBar.classList.remove("hidden");
      }
    });
  }, { threshold: 0.35 });

  const contactSection = document.getElementById("contact");
  if (contactSection) pageObserver.observe(contactSection);

  // ==============================
  // COPY GIFT NUMBER
  // ==============================
  const copyGiftNumber = document.getElementById("copyGiftNumber");
  const giftNumber = document.getElementById("giftNumber");
  const copyStatus = document.getElementById("copyStatus");

  async function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return;
    }

    const temp = document.createElement("textarea");
    temp.value = text;
    temp.setAttribute("readonly", "");
    temp.style.position = "fixed";
    temp.style.opacity = "0";
    document.body.appendChild(temp);
    temp.select();
    const copied = document.execCommand("copy");
    temp.remove();

    if (!copied) {
      throw new Error("Copy command failed");
    }
  }

  copyGiftNumber.addEventListener("click", async () => {
    const number = giftNumber.textContent.trim().replace(/\s+/g, "");

    try {
      await copyText(number);
      copyGiftNumber.classList.add("copied");
      copyGiftNumber.querySelector("span:last-child").textContent = "Copied!";
      copyStatus.textContent = "0704594253 has been copied.";
      window.setTimeout(() => {
        copyGiftNumber.classList.remove("copied");
        copyGiftNumber.querySelector("span:last-child").textContent = "Copy Number";
        copyStatus.textContent = "";
      }, 2200);
    } catch {
      copyStatus.textContent = "Please copy the number manually: 0704594253";
    }
  });

  // ==============================
  // BACK TO TOP
  // ==============================
  const backTop = document.getElementById("backTop");

  window.addEventListener("scroll", () => {
    backTop.classList.toggle("show", window.scrollY > 700);
  }, { passive: true });

  backTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // ==============================
  // OPTIONAL: PAUSE SLIDESHOW WHEN TAB IS HIDDEN
  // ==============================
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      window.clearInterval(slideTimer);
    } else {
      restartSlideTimer();
    }
  });
});
