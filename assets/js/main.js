// Tradução com fallback em pt-BR caso i18n.js não tenha carregado.
const t = (key, fallback) => (window.i18n ? window.i18n.t(key) : fallback);

document.addEventListener("DOMContentLoaded", () => {
  initStoreRedirect();
  initMobileNav();
  initHeader();
  initReveal();
  initCommandCopy();
  initShortLinkCopy();
  initAppDirectory();
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
    syncToggleLabel();
  };

  const syncToggleLabel = () => {
    const isOpen = nav.classList.contains("nav--open");
    toggle.setAttribute("aria-label", isOpen ? t("nav.close", "Fechar menu") : t("nav.open", "Abrir menu"));
  };

  const closeMenu = () => setMenuState(false);

  syncToggleLabel();
  document.addEventListener("i18n:change", syncToggleLabel);

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

function initStoreRedirect() {
  const redirect = document.querySelector("[data-store-redirect]");
  if (!redirect) return;

  const ua = navigator.userAgent;
  const isAndroid = /Android/i.test(ua);
  // iPadOS 13+ se apresenta como Macintosh; o toque diferencia de um Mac real.
  const isIOS =
    /iPhone|iPad|iPod/i.test(ua) ||
    (/Macintosh/i.test(ua) && navigator.maxTouchPoints > 1);
  const store = isAndroid ? "android" : isIOS ? "ios" : null;
  if (!store) return;

  const link = redirect.querySelector(`[data-store="${store}"]`);
  if (link) window.location.replace(link.href);
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

      await copyText(command);

      button.classList.add("is-copied");
      if (label) label.textContent = t("common.copied", "Copiado");
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        button.classList.remove("is-copied");
        if (label) label.textContent = t("brain.copy", defaultLabel);
      }, 1600);
    });
  });
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
  }
}

function initShortLinkCopy() {
  const buttons = document.querySelectorAll("[data-copy-short-link]");
  if (!buttons.length) return;

  buttons.forEach((button) => {
    const label = button.querySelector("span");
    const defaultLabel = label ? label.textContent : "";
    let timeout;

    button.addEventListener("click", async () => {
      const url = button.dataset.shortUrl;
      if (!url) return;

      await copyText(url);

      button.classList.add("is-copied");
      if (label) label.textContent = t("common.copied", "Copiado");
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        button.classList.remove("is-copied");
        if (label) label.textContent = t("apps.copyLink", defaultLabel);
      }, 1600);
    });
  });
}

function initAppDirectory() {
  const list = document.querySelector("[data-app-directory]");
  if (!list) return;

  const details = document.querySelectorAll("[data-app-detail]");
  let lastTrigger = null;

  const openDetail = (target, updateUrl = true) => {
    list.classList.add("is-hidden");
    details.forEach((detail) => detail.classList.remove("is-active"));
    target.classList.add("is-active");
    target.querySelector(".app-detail__title")?.focus();
    document.body.classList.add("app-detail-open");
    if (updateUrl) history.replaceState(null, "", `#${target.id}`);
  };

  const closeDetail = () => {
    details.forEach((detail) => detail.classList.remove("is-active"));
    list.classList.remove("is-hidden");
    document.body.classList.remove("app-detail-open");
    lastTrigger?.focus();
    history.replaceState(null, "", window.location.pathname + window.location.search);
  };

  list.querySelectorAll(".app-list__item").forEach((item) => {
    item.addEventListener("click", (event) => {
      event.preventDefault();
      const target = document.querySelector(item.getAttribute("href"));
      if (!target) return;

      lastTrigger = item;
      openDetail(target);
    });
  });

  document.querySelectorAll("[data-app-back]").forEach((back) => {
    back.addEventListener("click", (event) => {
      event.preventDefault();
      closeDetail();
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && list.classList.contains("is-hidden")) {
      closeDetail();
    }
  });

  if (window.location.hash) {
    const target = document.querySelector(window.location.hash);
    if (target?.matches("[data-app-detail]")) openDetail(target, false);
  }
}

function setCurrentYear() {
  const year = document.querySelector("[data-year]");
  if (year) year.textContent = String(new Date().getFullYear());
}
