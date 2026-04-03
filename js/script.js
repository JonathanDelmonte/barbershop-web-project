const cards = Array.from(document.querySelectorAll(".team-card"));
const prevBtn = document.querySelector(".team-nav.prev");
const nextBtn = document.querySelector(".team-nav.next");

const memberName = document.getElementById("team-member-name");
const captionLine = document.querySelector(".team-caption-line");

let current = 1;
let autoSlide;

function animateCaption(name) {
  memberName.style.animation = "none";
  captionLine.style.animation = "none";

  void memberName.offsetWidth;
  void captionLine.offsetWidth;

  memberName.textContent = name;

  memberName.style.animation = "teamCaptionTextIn 0.5s ease forwards";
  captionLine.style.animation = "teamCaptionLineIn 0.45s ease forwards";
}

function updateCarousel() {
  cards.forEach(card => {
    card.classList.remove("left", "active", "right");
  });

  const total = cards.length;
  const leftIndex = (current - 1 + total) % total;
  const rightIndex = (current + 1) % total;

  cards[current].classList.add("active");
  cards[leftIndex].classList.add("left");
  cards[rightIndex].classList.add("right");

  animateCaption(cards[current].dataset.name);
}

function nextSlide() {
  current = (current + 1) % cards.length;
  updateCarousel();
}

function prevSlide() {
  current = (current - 1 + cards.length) % cards.length;
  updateCarousel();
}

function startAutoSlide() {
  autoSlide = setInterval(nextSlide, 3800);
}

function stopAutoSlide() {
  clearInterval(autoSlide);
}

nextBtn.addEventListener("click", () => {
  stopAutoSlide();
  nextSlide();
  startAutoSlide();
});

prevBtn.addEventListener("click", () => {
  stopAutoSlide();
  prevSlide();
  startAutoSlide();
});

updateCarousel();
startAutoSlide();

document.querySelectorAll('.units-frame').forEach((frame) => {
    const overlay = frame.querySelector('.units-frame-overlay');

    if (!overlay) return;

    overlay.addEventListener('click', () => {
        frame.classList.remove('is-locked');
        frame.classList.add('is-unlocked');
    });

    frame.addEventListener('mouseleave', () => {
        frame.classList.remove('is-unlocked');
        frame.classList.add('is-locked');
    });
});

document.addEventListener('click', (event) => {
    document.querySelectorAll('.units-frame.is-unlocked').forEach((frame) => {
        if (!frame.contains(event.target)) {
            frame.classList.remove('is-unlocked');
            frame.classList.add('is-locked');
        }
    });
});