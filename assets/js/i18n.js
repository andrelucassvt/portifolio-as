/* Internacionalização (pt-BR · en · es).
   Carregado ao fim do <body>, depois de locales.js e antes de main.js, para
   traduzir a página antes do primeiro paint.

   Atributos de marcação:
   - data-i18n="chave"            troca o texto do elemento (com filhos, troca só
                                   o texto solto e preserva ícones/spans)
   - data-i18n-html="chave"       troca o innerHTML (para <em>, <code>)
   - data-i18n-attr="attr:chave;attr2:chave2"   traduz atributos (aria-label, alt, content…)
   - data-i18n-name="Valor"       preenche {name} nas strings do elemento

   Seletor de idioma: dropdown [data-lang-switch] com trigger, menu e opções
   [data-lang] (bandeiras vêm do sprite SVG inline em cada página). */
(function () {
  "use strict";

  const DEFAULT_LANG = "pt-BR";
  const SUPPORTED = ["pt-BR", "en", "es"];
  const STORAGE_KEY = "as-lang";
  const locales = window.LOCALES || {};

  let current = DEFAULT_LANG;

  function readStoredLang() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return SUPPORTED.includes(stored) ? stored : null;
    } catch {
      return null;
    }
  }

  function storeLang(lang) {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* armazenamento indisponível: a escolha vale só nesta página */
    }
  }

  // Escolha salva > idioma do navegador (pt/es/en) > inglês para os demais.
  function detectLang() {
    const stored = readStoredLang();
    if (stored) return stored;

    const preferred = navigator.languages?.length ? navigator.languages : [navigator.language];
    if (!preferred[0]) return DEFAULT_LANG;

    for (const entry of preferred) {
      const code = String(entry || "").toLowerCase();
      if (code.startsWith("pt")) return "pt-BR";
      if (code.startsWith("es")) return "es";
      if (code.startsWith("en")) return "en";
    }
    return "en";
  }

  function translate(key, vars) {
    const value = locales[current]?.[key] ?? locales[DEFAULT_LANG]?.[key];
    if (value === undefined) return key;
    return value.replace(/\{(\w+)\}/g, (match, name) => vars?.[name] ?? match);
  }

  const varsOf = (element) => ({ name: element.dataset.i18nName });

  // Em elementos com filhos, troca apenas o texto solto e mantém os espaços ao redor.
  function setText(element, text) {
    if (!element.children.length) {
      element.textContent = text;
      return;
    }

    const node = Array.from(element.childNodes).find(
      (child) => child.nodeType === Node.TEXT_NODE && child.nodeValue.trim(),
    );
    if (!node) return;

    const [, leading, , trailing] = node.nodeValue.match(/^(\s*)([\s\S]*?)(\s*)$/);
    node.nodeValue = leading + text + trailing;
  }

  function applyTranslations() {
    document.querySelectorAll("[data-i18n]").forEach((element) => {
      setText(element, translate(element.dataset.i18n, varsOf(element)));
    });

    document.querySelectorAll("[data-i18n-html]").forEach((element) => {
      element.innerHTML = translate(element.dataset.i18nHtml, varsOf(element));
    });

    document.querySelectorAll("[data-i18n-attr]").forEach((element) => {
      element.dataset.i18nAttr.split(";").forEach((pair) => {
        const separator = pair.indexOf(":");
        if (separator < 1) return;

        const attribute = pair.slice(0, separator).trim();
        const key = pair.slice(separator + 1).trim();
        element.setAttribute(attribute, translate(key, varsOf(element)));
      });
    });
  }

  function syncSwitcher() {
    document.querySelectorAll("[data-lang-switch]").forEach((switcher) => {
      switcher.querySelectorAll("[data-lang]").forEach((option) => {
        const isCurrent = option.dataset.lang === current;
        if (isCurrent) option.setAttribute("aria-current", "true");
        else option.removeAttribute("aria-current");

        if (!isCurrent) return;
        switcher.querySelector("[data-lang-flag]")?.setAttribute("href", `#flag-${option.dataset.flag}`);
        const code = switcher.querySelector("[data-lang-label]");
        if (code) code.textContent = option.dataset.langCode;
        switcher
          .querySelector("[data-lang-trigger]")
          ?.setAttribute("aria-label", `${translate("lang.label")}: ${option.dataset.langName}`);
      });
    });
  }

  function setLang(lang, { persist = true } = {}) {
    if (!SUPPORTED.includes(lang)) return;

    current = lang;
    document.documentElement.lang = lang;
    applyTranslations();
    syncSwitcher();
    if (persist) storeLang(lang);

    document.dispatchEvent(new CustomEvent("i18n:change", { detail: { lang } }));
  }

  function initSwitcher() {
    document.querySelectorAll("[data-lang-switch]").forEach((switcher) => {
      const trigger = switcher.querySelector("[data-lang-trigger]");
      const menu = switcher.querySelector("[data-lang-menu]");
      if (!trigger || !menu) return;

      const setOpen = (isOpen) => {
        menu.hidden = !isOpen;
        trigger.setAttribute("aria-expanded", String(isOpen));
      };

      trigger.addEventListener("click", () => {
        setOpen(menu.hidden);
        if (!menu.hidden) menu.querySelector("[aria-current]")?.focus();
      });

      menu.querySelectorAll("[data-lang]").forEach((option) => {
        option.addEventListener("click", () => {
          setLang(option.dataset.lang);
          setOpen(false);
          trigger.focus();
        });
      });

      document.addEventListener("click", (event) => {
        if (!switcher.contains(event.target)) setOpen(false);
      });

      switcher.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && !menu.hidden) {
          event.stopPropagation();
          setOpen(false);
          trigger.focus();
          return;
        }

        if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
        const options = Array.from(menu.querySelectorAll("[data-lang]"));
        if (menu.hidden) {
          setOpen(true);
          options[0]?.focus();
        } else {
          const index = options.indexOf(document.activeElement);
          const step = event.key === "ArrowDown" ? 1 : -1;
          options[(index + step + options.length) % options.length]?.focus();
        }
        event.preventDefault();
      });
    });
  }

  window.i18n = {
    t: translate,
    getLang: () => current,
    setLang,
    supported: SUPPORTED,
  };

  initSwitcher();
  setLang(detectLang(), { persist: false });
})();
