/* Tiny TH/EN switcher shared by both pages.
   Elements with data-i18n="key" get their text from the page's dictionary. */
(function () {
  const KEY = "ss_lang";
  let dict = { en: {}, th: {} };
  let lang = localStorage.getItem(KEY) ||
    ((navigator.language || "").toLowerCase().startsWith("th") ? "th" : "en");
  const listeners = [];

  function t(key, vars) {
    let s = (dict[lang] && dict[lang][key]) ?? (dict.en[key] ?? key);
    if (vars) for (const k in vars) s = s.replaceAll("{" + k + "}", vars[k]);
    return s;
  }

  function apply() {
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      el.textContent = t(el.dataset.i18n);
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      el.placeholder = t(el.dataset.i18nPlaceholder);
    });
    document.querySelectorAll("[data-lang-btn]").forEach((b) => {
      b.setAttribute("aria-pressed", String(b.dataset.langBtn === lang));
    });
    listeners.forEach((fn) => fn(lang));
  }

  function set(l) {
    lang = l;
    localStorage.setItem(KEY, l);
    apply();
  }

  function init(d) {
    dict = d;
    document.querySelectorAll("[data-lang-btn]").forEach((b) =>
      b.addEventListener("click", () => set(b.dataset.langBtn))
    );
    apply();
  }

  // Pick the right language from a { en, th } object.
  function pick(obj) {
    if (obj == null) return "";
    if (typeof obj === "string") return obj;
    return obj[lang] ?? obj.en;
  }

  function fmtDate(d, opts) {
    return d.toLocaleDateString(lang === "th" ? "th-TH" : "en-GB",
      opts || { day: "numeric", month: "short", year: "numeric" });
  }

  window.SSi18n = {
    init, t, set, pick, fmtDate,
    get lang() { return lang; },
    onChange: (fn) => listeners.push(fn)
  };
})();
