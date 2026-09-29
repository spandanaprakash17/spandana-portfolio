const root = document.documentElement;
const themeToggle = document.querySelector(".theme-toggle");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const backToTop = document.querySelector(".back-to-top");
const contactForm = document.querySelector("#contact-form");

function applySavedTheme() {
  try {
    const savedTheme = localStorage.getItem("spandana-portfolio-theme");
    if (savedTheme === "light" || savedTheme === "dark") {
      root.dataset.theme = savedTheme;
    }
  } catch {
    // The default dark theme still works when storage is unavailable.
  }
  updateThemeButton();
}

function updateThemeButton() {
  const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
  themeToggle.setAttribute("aria-label", `Switch to ${nextTheme} theme`);
  themeToggle.title = `Switch to ${nextTheme} theme`;
  document.querySelector('meta[name="theme-color"]').content = root.dataset.theme === "dark" ? "#101716" : "#f5f7f2";
}

function toggleTheme() {
  root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
  try {
    localStorage.setItem("spandana-portfolio-theme", root.dataset.theme);
  } catch {
    // Theme changes still apply for this page view.
  }
  updateThemeButton();
}

function setMenuOpen(isOpen) {
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  navLinks.classList.toggle("is-open", isOpen);
}

function setupNavigation() {
  const sectionLinks = [...document.querySelectorAll(".nav-link")];
  const observedSections = sectionLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  const sectionObserver = new IntersectionObserver((entries) => {
    const visibleSections = entries.filter((entry) => entry.isIntersecting);
    if (!visibleSections.length) return;
    const activeId = visibleSections.sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0].target.id;
    sectionLinks.forEach((link) => {
      const isActive = link.getAttribute("href") === `#${activeId}`;
      link.classList.toggle("is-active", isActive);
      if (isActive) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  }, { rootMargin: "-25% 0px -55% 0px", threshold: [0, 0.15, 0.4, 0.7] });

  observedSections.forEach((section) => sectionObserver.observe(section));
  sectionLinks.forEach((link) => link.addEventListener("click", () => setMenuOpen(false)));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setMenuOpen(false);
  });
  document.addEventListener("click", (event) => {
    if (!navLinks.contains(event.target) && !menuToggle.contains(event.target)) setMenuOpen(false);
  });
}

function setupRevealAnimations() {
  const revealItems = document.querySelectorAll(".reveal");
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });
  revealItems.forEach((item) => revealObserver.observe(item));
}

function setupTypingAnimation() {
  const role = "B.Tech CSE (AI & Data Science) Student | Aspiring Innovator";
  const output = document.querySelector("#typed-role");
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    output.textContent = role;
    return;
  }

  let characterIndex = 0;
  function typeNextCharacter() {
    output.textContent = role.slice(0, characterIndex);
    characterIndex += 1;
    if (characterIndex <= role.length) window.setTimeout(typeNextCharacter, 38);
  }
  window.setTimeout(typeNextCharacter, 300);
}

function updateBackToTop() {
  backToTop.classList.toggle("is-visible", window.scrollY > 480);
}

function showFormStatus(message, state) {
  const status = document.querySelector("#form-status");
  status.textContent = message;
  status.className = `form-status is-${state}`;
}

function handleContactSubmit(event) {
  event.preventDefault();
  const name = contactForm.elements.name.value.trim();
  const email = contactForm.elements.email.value.trim();
  const message = contactForm.elements.message.value.trim();
  const fields = [...contactForm.querySelectorAll("input, textarea")];
  fields.forEach((field) => field.removeAttribute("aria-invalid"));

  const invalidFields = fields.filter((field) => !field.value.trim() || !field.validity.valid);
  if (invalidFields.length) {
    invalidFields.forEach((field) => field.setAttribute("aria-invalid", "true"));
    invalidFields[0].focus();
    showFormStatus("Please enter a valid name, email address, and message.", "error");
    return;
  }

  const subject = encodeURIComponent(`Portfolio message from ${name}`);
  const body = encodeURIComponent(`${message}\n\nFrom: ${name}\nEmail: ${email}`);
  showFormStatus("Your email app is opening with your message ready to send.", "success");
  window.location.href = `mailto:spandanaprakash761@gmail.com?subject=${subject}&body=${body}`;
}

applySavedTheme();
themeToggle.addEventListener("click", toggleTheme);
menuToggle.addEventListener("click", () => setMenuOpen(menuToggle.getAttribute("aria-expanded") !== "true"));
setupNavigation();
setupRevealAnimations();
setupTypingAnimation();
window.addEventListener("scroll", updateBackToTop, { passive: true });
updateBackToTop();
contactForm.addEventListener("submit", handleContactSubmit);