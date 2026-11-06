"use strict";

const slides = Array.from(document.querySelectorAll(".slide"));
const navigation = document.getElementById("slide-nav");
const previousButton = document.getElementById("prev-slide");
const nextButton = document.getElementById("next-slide");
const progressBar = document.querySelector(".progress-track");
const progressFill = document.getElementById("progress-fill");
const currentNumber = document.getElementById("current-number");
let currentSlide = 0;

const slideNames = [
  "Титульна сторінка",
  "Що таке водорості",
  "Водорості в продуктах",
  "Як водорості потрапляють у продукти",
  "Де шукати водорості на упаковках",
  "Користь водоростей",
  "Цікаві факти",
  "Висновок"
];

const slideButtons = slides.map((slide, index) => {
  const button = document.createElement("button");
  button.className = "dot-button";
  button.type = "button";
  button.setAttribute("aria-label", `Слайд ${index + 1}: ${slideNames[index]}`);
  button.setAttribute("aria-current", index === 0 ? "true" : "false");
  button.addEventListener("click", () => showSlide(index));
  navigation.append(button);
  return button;
});

function showSlide(index) {
  const nextIndex = Math.max(0, Math.min(index, slides.length - 1));
  if (nextIndex === currentSlide && slides[currentSlide].classList.contains("active")) return;

  currentSlide = nextIndex;
  slides.forEach((slide, slideIndex) => {
    const isActive = slideIndex === currentSlide;
    slide.classList.toggle("active", isActive);
    slide.setAttribute("aria-hidden", String(!isActive));
  });
  slideButtons.forEach((button, buttonIndex) => {
    button.setAttribute("aria-current", String(buttonIndex === currentSlide));
  });

  previousButton.disabled = currentSlide === 0;
  nextButton.disabled = currentSlide === slides.length - 1;
  currentNumber.textContent = String(currentSlide + 1).padStart(2, "0");
  progressFill.style.width = `${((currentSlide + 1) / slides.length) * 100}%`;
  progressBar.setAttribute("aria-valuenow", String(currentSlide + 1));
  history.replaceState(null, "", `#slide-${currentSlide + 1}`);
}

function getStartingSlide() {
  const match = window.location.hash.match(/^#slide-(\d+)$/);
  if (!match) return 0;
  const requestedIndex = Number(match[1]) - 1;
  return Number.isInteger(requestedIndex) && requestedIndex >= 0 && requestedIndex < slides.length
    ? requestedIndex
    : 0;
}

previousButton.addEventListener("click", () => showSlide(currentSlide - 1));
nextButton.addEventListener("click", () => showSlide(currentSlide + 1));

document.querySelectorAll("[data-go]").forEach((button) => {
  button.addEventListener("click", () => {
    if (button.dataset.go === "first") {
      showSlide(0);
      return;
    }
    showSlide(currentSlide + 1);
  });
});

document.addEventListener("keydown", (event) => {
  if (event.altKey || event.ctrlKey || event.metaKey || event.target.closest("input, textarea, select, [contenteditable='true']")) return;
  if (event.key === " " && event.target.closest("button, a")) return;

  if (event.key === "ArrowRight" || event.key === "PageDown" || event.key === " ") {
    event.preventDefault();
    showSlide(currentSlide + 1);
  } else if (event.key === "ArrowLeft" || event.key === "PageUp") {
    event.preventDefault();
    showSlide(currentSlide - 1);
  } else if (event.key === "Home") {
    showSlide(0);
  } else if (event.key === "End") {
    showSlide(slides.length - 1);
  }
});

window.addEventListener("hashchange", () => {
  const match = window.location.hash.match(/^#slide-(\d+)$/);
  if (match) showSlide(Number(match[1]) - 1);
});

showSlide(getStartingSlide());
