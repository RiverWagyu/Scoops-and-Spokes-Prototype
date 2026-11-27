/* Turns a receipt number into a fixed fortune + prize.
   The same receipt always gives the same result, on any phone,
   so re-scanning can't re-roll the luck. */
(function () {
  const ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ"; // no 0/O/1/I/L
  const ID_RE = /^S(\d{2})(\d{2})(\d{2})-([2-9A-Z]{4})$/;

  function hash(str) {
    let h = 0x811c9dc5;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 0x01000193);
    }
    return h >>> 0;
  }

  function rng(seed) {
    let a = seed;
    return function () {
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function normalize(id) {
    return String(id || "").trim().toUpperCase();
  }

  function isValid(id) {
    return ID_RE.test(normalize(id));
  }

  function newId(date) {
    const d = date || new Date();
    const yy = String(d.getFullYear() % 100).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const buf = new Uint32Array(4);
    crypto.getRandomValues(buf);
    let tail = "";
    for (const n of buf) tail += ALPHABET[n % ALPHABET.length];
    return `S${yy}${mm}${dd}-${tail}`;
  }

  function dateOf(id) {
    const m = ID_RE.exec(normalize(id));
    if (!m) return null;
    return new Date(2000 + Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  }

  function expiryOf(id) {
    const d = dateOf(id);
    if (!d) return null;
    const e = new Date(d);
    e.setDate(e.getDate() + window.SS_CONFIG.couponValidDays);
    e.setHours(23, 59, 59, 0);
    return e;
  }

  function draw(id) {
    const cfg = window.SS_CONFIG;
    const r = rng(hash(cfg.secret + "|" + normalize(id)));
    const lucky = r() < cfg.luckyChance;
    const pool = window.SS_FORTUNES.filter((f) =>
      lucky ? f.level === "great" : f.level !== "great"
    );
    const fortune = pool[Math.floor(r() * pool.length)];
    let prize = null;
    if (lucky) {
      const total = cfg.prizes.reduce((s, p) => s + p.weight, 0);
      let x = r() * total;
      for (const p of cfg.prizes) {
        x -= p.weight;
        if (x < 0) { prize = p; break; }
      }
      prize = prize || cfg.prizes[cfg.prizes.length - 1];
    }
    return { lucky, fortune, prize };
  }

  window.SSLuck = { isValid, newId, dateOf, expiryOf, draw, normalize };
})();
