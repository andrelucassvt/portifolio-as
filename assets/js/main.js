document.addEventListener("DOMContentLoaded", () => {
  initMobileNav();
  initHeader();
  initReveal();
  initCommandCopy();
  setCurrentYear();
});

function initMobileNav() {
  const toggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-nav]");
  const header = document.querySelector("[data-header]");
  const backdrop = document.querySelector("[data-nav-backdrop]");

  if (!toggle || !nav) return;

  const setMenuState = (isOpen) => {
    nav.classList.toggle("nav--open", isOpen);
    document.body.classList.toggle("nav-open", isOpen);
    header?.classList.toggle("site-header--menu-open", isOpen);
    backdrop?.classList.toggle("nav-backdrop--visible", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
  };

  const closeMenu = () => setMenuState(false);

  toggle.addEventListener("click", () => {
    setMenuState(!nav.classList.contains("nav--open"));
  });

  nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
  backdrop?.addEventListener("click", closeMenu);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && nav.classList.contains("nav--open")) {
      closeMenu();
      toggle.focus();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) closeMenu();
  });
}

function initHeader() {
  const header = document.querySelector("[data-header]");
  if (!header) return;

  const syncHeader = () => header.classList.toggle("is-scrolled", window.scrollY > 24);
  syncHeader();
  window.addEventListener("scroll", syncHeader, { passive: true });
}

function initReveal() {
  const elements = document.querySelectorAll("[data-reveal]");
  if (!elements.length) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
    elements.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -8%", threshold: 0.08 },
  );

  elements.forEach((element) => observer.observe(element));
}

function initCommandCopy() {
  const buttons = document.querySelectorAll("[data-copy]");
  if (!buttons.length) return;

  buttons.forEach((button) => {
    const label = button.querySelector("span");
    const defaultLabel = label ? label.textContent : "";
    let timeout;

    button.addEventListener("click", async () => {
      const command = button.closest(".brain-command")?.querySelector("code")?.textContent.trim();
      if (!command) return;

      try {
        await navigator.clipboard.writeText(command);
      } catch {
        const textarea = document.createElement("textarea");
        textarea.value = command;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        textarea.remove();
      }

      button.classList.add("is-copied");
      if (label) label.textContent = "Copiado";
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        button.classList.remove("is-copied");
        if (label) label.textContent = defaultLabel;
      }, 1600);
    });
  });
}

function setCurrentYear() {
  const year = document.querySelector("[data-year]");
  if (year) year.textContent = String(new Date().getFullYear());
}
