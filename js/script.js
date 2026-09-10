document.addEventListener("DOMContentLoaded", () => {
  const EVENT_DATE = "2027-01-08T00:00:00+03:00";

  // Envelope opening
  const opening = document.getElementById("opening");
  const openButton = document.getElementById("openInvitation");
  const main = document.getElementById("mainContent");

  openButton?.addEventListener("click", () => {
    const flap = document.querySelector(".flap");
    if (flap) flap.style.transform = "rotateX(180deg)";
    window.setTimeout(() => {
      opening?.classList.add("dismissed");
      main?.setAttribute("aria-hidden", "false");
      document.body.classList.remove("locked");
    }, 520);
    window.setTimeout(() => opening?.remove(), 1450);
  });

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


// Requested finishing touches
(function(){
  const year=document.getElementById("currentYear"); if(year) year.textContent=new Date().getFullYear();
  const top=document.getElementById("backTop");
  function toggleTop(){if(top) top.classList.toggle("show",window.scrollY>450)}
  addEventListener("scroll",toggleTop,{passive:true}); toggleTop();
  top?.addEventListener("click",()=>scrollTo({top:0,behavior:"smooth"}));
})();
