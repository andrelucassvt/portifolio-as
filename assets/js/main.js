/**
 * main.js — JS mínimo do portfólio.
 * Nada de framework: só o essencial para interações simples (menu mobile,
 * scroll de âncora, etc.). Cada bloco é independente e só roda se os
 * elementos existirem no DOM.
 */

document.addEventListener("DOMContentLoaded", () => {
  initMobileNav();
});

/**
 * Toggle do menu mobile: alterna .nav--open e sincroniza aria-expanded.
 */
function initMobileNav() {
  const toggle = document.querySelector(".site-header__toggle");
  const nav = document.querySelector(".nav");

  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("nav--open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll(".nav__link").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("nav--open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}
