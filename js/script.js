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



/* =========================================
   HEADER / MENU FULLSCREEN - ALPHA PRIME
========================================= */
(() => {
  const header = document.querySelector(".site-header");
  const toggleButton = document.querySelector(".site-header__toggle");
  const menu = document.querySelector(".site-menu");
  const menuPanel = document.querySelector(".site-menu__panel");
  const menuLinks = Array.from(document.querySelectorAll(".site-menu__link[data-target]"));

  if (!header || !toggleButton || !menu || !menuPanel) return;

  const iconUse = toggleButton.querySelector("use");
  const ICON_MENU = "assets/icons/sprite.svg#icon-header-menu";
  const ICON_CLOSE = "assets/icons/sprite.svg#icon-header-close";

  let isMenuOpen = false;
  let lastFocusedElement = null;

  function setToggleIcon(isOpen) {
    if (!iconUse) return;

    const icon = isOpen ? ICON_CLOSE : ICON_MENU;
    iconUse.setAttribute("href", icon);
    iconUse.setAttribute("xlink:href", icon);
  }

  function lockScroll() {
    document.body.classList.add("menu-open", "menu-is-open");
    document.body.style.overflow = "hidden";
  }

  function unlockScroll() {
    document.body.classList.remove("menu-open", "menu-is-open");
    document.body.style.overflow = "";
  }

  function openMenu() {
    if (isMenuOpen) return;

    isMenuOpen = true;
    lastFocusedElement = document.activeElement;

    header.classList.add("is-menu-open");
    menu.classList.add("is-open");

    toggleButton.setAttribute("aria-expanded", "true");
    toggleButton.setAttribute("aria-label", "Fechar menu");
    menu.setAttribute("aria-hidden", "false");

    setToggleIcon(true);
    lockScroll();

    const firstLink = menu.querySelector(".site-menu__link");
    if (firstLink) firstLink.focus();
  }

  function closeMenu(restoreFocus = true) {
    if (!isMenuOpen) return;

    isMenuOpen = false;

    header.classList.remove("is-menu-open");
    menu.classList.remove("is-open");

    toggleButton.setAttribute("aria-expanded", "false");
    toggleButton.setAttribute("aria-label", "Abrir menu");
    menu.setAttribute("aria-hidden", "true");

    setToggleIcon(false);
    unlockScroll();

    if (restoreFocus && lastFocusedElement) {
      lastFocusedElement.focus();
    }
  }

  function toggleMenu() {
    if (isMenuOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  function getHeaderOffset() {
    return header.offsetHeight || 0;
  }

  function getTargetSection(targetName) {
    if (!targetName) return null;
    return document.getElementById(targetName);
  }

function scrollToSection(section, extraOffset = 0) {
  if (!section) return;

  const startY = window.scrollY;
  const headerOffset = getHeaderOffset() + 12;

  const targetY =
    section.getBoundingClientRect().top +
    window.scrollY -
    headerOffset +
    extraOffset;

  const distance = targetY - startY;
  const duration = 900;
  let startTime = null;

  function easeInOutCubic(t) {
    return t < 0.5
      ? 4 * t * t * t
      : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function animation(currentTime) {
    if (!startTime) startTime = currentTime;

    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeInOutCubic(progress);

    window.scrollTo(0, startY + distance * easedProgress);

    if (progress < 1) {
      requestAnimationFrame(animation);
    }
  }

  requestAnimationFrame(animation);
}

  function updateHeaderOnScroll() {
    if (window.scrollY > 20 && !isMenuOpen) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
  }

  function updateCurrentMenuItem() {
    const scrollPosition = window.scrollY + getHeaderOffset() + 120;
    let currentSection = "";

    menuLinks.forEach((link) => {
      const targetName = link.dataset.target;
      const section = getTargetSection(targetName);

      if (!section) return;

      const sectionTop = section.offsetTop;
      const sectionBottom = sectionTop + section.offsetHeight;

      if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
        currentSection = targetName;
      }
    });

    menuLinks.forEach((link) => {
      link.classList.toggle("is-current", link.dataset.target === currentSection);
    });
  }

  function trapFocus(event) {
    if (!isMenuOpen || event.key !== "Tab") return;

    const focusableElements = menu.querySelectorAll(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
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

  toggleButton.addEventListener("click", toggleMenu);

  menuLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();

      const targetName = link.dataset.target;
      const extraOffset = Number(link.dataset.offset || 0);
      const section = getTargetSection(targetName);

      if (!section) return;

      closeMenu(false);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          scrollToSection(section, extraOffset);
        });
      });
    });
  });

  menu.addEventListener("click", (event) => {
    if (event.target === menu) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isMenuOpen) {
      closeMenu();
    }

    trapFocus(event);
  });

  window.addEventListener("scroll", () => {
    updateHeaderOnScroll();
    updateCurrentMenuItem();
  });

  window.addEventListener("resize", updateHeaderOnScroll);

  updateHeaderOnScroll();
  updateCurrentMenuItem();
  setToggleIcon(false);
  menu.setAttribute("aria-hidden", "true");
  
  document.body.classList.remove("menu-open", "menu-is-open");
  document.body.style.overflow = "";
  menu.classList.remove("is-open");
  header.classList.remove("is-menu-open");
})();

/* ========================================
   PATCH FINAL - estado do header no hero
   ======================================== */

document.addEventListener("DOMContentLoaded", () => {
    const hero = document.querySelector(".hero");
    const header = document.querySelector(".site-header");

    if (!hero || !header) return;

    function updateHeaderState() {
        const heroBottom = hero.getBoundingClientRect().bottom;
        const threshold = header.offsetHeight + 12;
        const heroIsVisible = heroBottom > threshold;

        document.body.classList.toggle("header-hero", heroIsVisible);
        document.body.classList.toggle("header-compact", !heroIsVisible);
    }

    updateHeaderState();

    window.addEventListener("scroll", updateHeaderState, { passive: true });
    window.addEventListener("resize", updateHeaderState);
});