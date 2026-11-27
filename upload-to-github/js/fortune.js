/* Fortune page: shake เซียมซี → read fortune → (if lucky) spin wheel → coupon */
(function () {
  const cfg = window.SS_CONFIG;
  const L = window.SSLuck;
  const { t, pick, fmtDate } = window.SSi18n;
  const $ = (s) => document.querySelector(s);
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  const DICT = {
    en: {
      eyebrow: "DAILY FORTUNE · เซียมซี",
      introTitle: "How lucky are you today?",
      introSub: "Make a wish, then shake the tube to draw your stick.",
      tubeLabel: "เซียมซี",
      shakeBtn: "Shake! 🙏",
      shakeHint: "…or shake your phone",
      receiptNo: "Receipt",
      stickNo: "Stick no.",
      luckyItem: "Lucky flavour",
      onePerReceipt: "One draw per receipt — this stick is yours.",
      luckyTitle: "You're lucky today! 🎉",
      luckySub: "You've earned one spin of the prize wheel.",
      spinNow: "Spin the wheel →",
      seeCoupon: "See my coupon →",
      notLucky: "No wheel spin this time — but every receipt is a new draw. See you on your next ride! 🚲",
      followIG: "Follow us on Instagram",
      wheelEyebrow: "LUCKY SPIN",
      wheelTitle: "Spin for your treat!",
      spin: "SPIN",
      wheelHint: "One spin per lucky receipt.",
      youWon: "YOU WON",
      receipt: "Receipt",
      validUntil: "Valid until",
      howTo: "Show this screen to our staff on your next visit.",
      terms: "1 coupon per receipt. Can't be combined with other promotions. Take a screenshot to keep it.",
      backToFortune: "← Back to my fortune",
      errTitle: "Hmm, this link looks wrong",
      errText: "Scan the QR code at the bottom of your Scoops & Spokes receipt.",
      tryDemo: "Try a demo draw",
      demo: "DEMO"
    },
    th: {
      eyebrow: "เซียมซีประจำวัน",
      introTitle: "วันนี้ดวงคุณเป็นยังไง?",
      introSub: "อธิษฐานในใจ แล้วเขย่ากระบอกเซียมซีเลย",
      tubeLabel: "เซียมซี",
      shakeBtn: "เขย่าเลย 🙏",
      shakeHint: "…หรือเขย่ามือถือก็ได้",
      receiptNo: "ใบเสร็จ",
      stickNo: "ใบที่",
      luckyItem: "รสนำโชค",
      onePerReceipt: "ใบเสร็จละ 1 ครั้ง ไม้นี้เป็นของคุณ",
      luckyTitle: "วันนี้คุณดวงดี! 🎉",
      luckySub: "ได้สิทธิ์หมุนวงล้อรับรางวัล 1 ครั้ง",
      spinNow: "ไปหมุนวงล้อ →",
      seeCoupon: "ดูคูปองของฉัน →",
      notLucky: "รอบนี้ยังไม่ได้หมุนวงล้อ แต่ทุกใบเสร็จได้เสี่ยงใหม่เสมอ แล้วแวะมาปั่นด้วยกันอีกนะ 🚲",
      followIG: "ติดตามเราบน Instagram",
      wheelEyebrow: "วงล้อนำโชค",
      wheelTitle: "หมุนเลย ลุ้นรางวัล!",
      spin: "หมุน",
      wheelHint: "ใบเสร็จโชคดี หมุนได้ 1 ครั้ง",
      youWon: "คุณได้รับ",
      receipt: "เลขที่ใบเสร็จ",
      validUntil: "ใช้ได้ถึง",
      howTo: "แสดงหน้านี้กับพนักงานเมื่อมาครั้งถัดไป",
      terms: "1 คูปองต่อ 1 ใบเสร็จ ใช้ร่วมกับโปรโมชันอื่นไม่ได้ แคปหน้าจอเก็บไว้ได้เลย",
      backToFortune: "← กลับไปดูเซียมซี",
      errTitle: "ลิงก์นี้ดูไม่ถูกต้อง",
      errText: "สแกน QR ที่ด้านล่างใบเสร็จ Scoops & Spokes",
      tryDemo: "ลองเสี่ยงแบบเดโม",
      demo: "เดโม"
    }
  };

  /* ---------------- which receipt? ---------------- */
  const params = new URLSearchParams(location.search);
  let rid = L.normalize(params.get("r"));
  let demo = false;
  if (!L.isValid(rid) && params.has("demo")) {
    // ?demo=1 → random receipt, ?demo=lucky → always a lucky one (for presenting)
    demo = true;
    do { rid = L.newId(); } while (params.get("demo") === "lucky" && !L.draw(rid).lucky);
  }
  const valid = L.isValid(rid);
  const result = valid ? L.draw(rid) : null;
  const KEY = "ss_draw_" + rid;
  let stage = valid && !demo ? localStorage.getItem(KEY) : null; // null | "drawn" | "spun"
  const save = (s) => { stage = s; if (!demo) localStorage.setItem(KEY, s); };

  let current = "s-intro";
  function show(id) {
    document.querySelectorAll(".screen").forEach((s) => (s.hidden = s.id !== id));
    const el = document.getElementById(id);
    el.classList.remove("enter"); void el.offsetWidth; el.classList.add("enter");
    current = id;
    window.scrollTo({ top: 0, behavior: "smooth" });
    render();
  }

  /* ---------------- shake ---------------- */
  let shaking = false;
  async function doShake() {
    if (shaking || stage) return;
    shaking = true;
    $("#btn-shake").disabled = true;
    const wrap = $("#tube-wrap");
    wrap.classList.add("shaking");
    navigator.vibrate?.([80, 60, 80, 60, 80, 60, 80, 60, 120]);
    await sleep(2200);
    wrap.classList.remove("shaking");
    $("#stick-no").textContent = result.fortune.no;
    $("#stick-out").classList.add("rise");
    await sleep(1400);
    save("drawn");
    show("s-result");
    if (result.lucky) burst();
  }

  // Real shake on phones that allow motion without a permission prompt (Android).
  function listenForShake() {
    const needsPermission = typeof DeviceMotionEvent !== "undefined" &&
      typeof DeviceMotionEvent.requestPermission === "function";
    const touch = matchMedia("(pointer: coarse)").matches;
    $("#shake-hint").hidden = !(touch && "DeviceMotionEvent" in window && !needsPermission);
    let hits = 0, last = 0;
    window.addEventListener("devicemotion", (e) => {
      const a = e.accelerationIncludingGravity;
      if (!a || current !== "s-intro") return;
      const mag = Math.hypot(a.x || 0, a.y || 0, a.z || 0);
      const now = Date.now();
      if (Math.abs(mag - 9.8) > 11) {
        hits = now - last < 900 ? hits + 1 : 1;
        last = now;
        if (hits >= 3) doShake();
      }
    });
  }

  /* ---------------- result ---------------- */
  function renderResult() {
    const f = result.fortune;
    const lv = window.SS_LEVELS[f.level];
    $("#slip").innerHTML = `
      <div class="slip-no"><span>${esc(t("stickNo"))}</span><b>${f.no}</b></div>
      <span class="level" style="background:${lv.color}">${esc(pick(lv))}</span>
      <h2>${esc(pick(f).title)}</h2>
      <p>${esc(pick(f).text)}</p>
      <hr class="divider">
      <div class="lucky-item">${esc(t("luckyItem"))}: <b>${esc(pick(f.item))}</b></div>
      <div class="again">${esc(t("onePerReceipt"))}</div>`;
    const ig = `https://instagram.com/${encodeURIComponent(cfg.shop.instagram)}`;
    $("#result-cta").innerHTML = result.lucky
      ? `<div class="lucky-banner"><strong>${esc(t("luckyTitle"))}</strong><span>${esc(t("luckySub"))}</span></div>
         <button class="btn big green pulse" id="go-wheel">${esc(t(stage === "spun" ? "seeCoupon" : "spinNow"))}</button>`
      : `<div class="soft-box">${esc(t("notLucky"))}</div>
         <a class="btn" href="${ig}" target="_blank" rel="noopener">${esc(t("followIG"))} · @${esc(cfg.shop.instagram)}</a>`;
    $("#go-wheel")?.addEventListener("click", () => show(stage === "spun" ? "s-coupon" : "s-wheel"));
  }

  /* ---------------- wheel ---------------- */
  const segs = [...cfg.prizes, ...cfg.prizes]; // 8 slices
  const SEG = 360 / segs.length;
  let rotation = 0;
  let spinning = false;

  function buildWheel() {
    const r = 150;
    const pt = (deg) => {
      const a = (deg - 90) * Math.PI / 180;
      return [(r * Math.cos(a)).toFixed(2), (r * Math.sin(a)).toFixed(2)];
    };
    let html = "";
    segs.forEach((p, i) => {
      const [x0, y0] = pt(i * SEG), [x1, y1] = pt((i + 1) * SEG);
      const mid = i * SEG + SEG / 2 - 90;
      html += `<path d="M0 0 L${x0} ${y0} A${r} ${r} 0 0 1 ${x1} ${y1} Z" fill="${p.color}" stroke="#3A4C2E" stroke-width="3"/>
        <text transform="rotate(${mid}) translate(${r * 0.6} 0)" text-anchor="middle" dominant-baseline="middle"
          fill="${p.text}" font-size="${pick(p.label).length > 8 ? 14 : 19}">${esc(pick(p.label))}</text>`;
    });
    // bolts around the rim, like a chainring
    for (let i = 0; i < 24; i++) {
      const a = (i * 15 - 90) * Math.PI / 180;
      html += `<circle cx="${(156 * Math.cos(a)).toFixed(1)}" cy="${(156 * Math.sin(a)).toFixed(1)}" r="3" fill="#E8B840"/>`;
    }
    $("#wheel").innerHTML = `<circle r="160" fill="#506840"/>` + html;
  }

  async function spin() {
    if (spinning || stage === "spun") return;
    spinning = true;
    $("#btn-spin").disabled = true;
    const matches = segs.map((p, i) => (p.id === result.prize.id ? i : -1)).filter((i) => i >= 0);
    const i = matches[Math.floor(Math.random() * matches.length)];
    const jitter = (Math.random() - 0.5) * (SEG * 0.6);
    const target = 360 * 6 - (i * SEG + SEG / 2) + jitter;
    rotation = rotation - (rotation % 360) + target;
    $("#wheel").style.transform = `rotate(${rotation}deg)`;
    navigator.vibrate?.(40);
    await sleep(5400);
    save("spun");
    burst();
    navigator.vibrate?.([100, 50, 200]);
    show("s-coupon");
  }

  /* ---------------- coupon ---------------- */
  function renderCoupon() {
    const exp = L.expiryOf(rid);
    $("#coupon").innerHTML = `
      <div class="c-eyebrow">${esc(t("youWon"))}</div>
      <div class="c-prize">${esc(pick(result.prize.label))}</div>
      <div class="mascot-disc" style="--size:96px"><img src="${esc(cfg.mascotSrc)}" alt=""></div>
      <hr class="c-line">
      <dl>
        <dt>${esc(t("receipt"))}</dt><dd class="mono">${rid}${demo ? ` · ${esc(t("demo"))}` : ""}</dd>
        <dt>${esc(t("validUntil"))}</dt><dd>${fmtDate(exp)}</dd>
      </dl>
      <hr class="c-line">
      <p><b>${esc(t("howTo"))}</b></p>
      <p class="c-terms">${esc(t("terms"))}</p>`;
  }

  /* ---------------- confetti ---------------- */
  function burst() {
    const c = $("#confetti");
    const ctx = c.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    c.width = innerWidth * dpr; c.height = innerHeight * dpr;
    ctx.scale(dpr, dpr);
    const colors = ["#E8B840", "#506840", "#E07B39", "#A9BC6E", "#F2A7A0", "#FFFDF7"];
    const parts = Array.from({ length: 140 }, () => ({
      x: innerWidth / 2 + (Math.random() - 0.5) * 80, y: innerHeight * 0.35,
      vx: (Math.random() - 0.5) * 14, vy: -Math.random() * 14 - 4,
      s: 6 + Math.random() * 7, r: Math.random() * 6, vr: (Math.random() - 0.5) * 0.4,
      c: colors[(Math.random() * colors.length) | 0], round: Math.random() < 0.3
    }));
    const start = performance.now();
    (function frame(now) {
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      parts.forEach((p) => {
        p.vy += 0.35; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.r += p.vr;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.fillStyle = p.c;
        if (p.round) { ctx.beginPath(); ctx.arc(0, 0, p.s / 2, 0, 7); ctx.fill(); }
        else ctx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2);
        ctx.restore();
      });
      if (now - start < 3500) requestAnimationFrame(frame);
      else ctx.clearRect(0, 0, innerWidth, innerHeight);
    })(start);
  }

  /* ---------------- render / boot ---------------- */
  function render() {
    document.querySelectorAll(".rid").forEach((el) => (el.textContent = valid ? rid + (demo ? ` · ${t("demo")}` : "") : ""));
    if (!valid) return;
    if (current === "s-result") renderResult();
    if (current === "s-wheel") buildWheel();
    if (current === "s-coupon") renderCoupon();
  }

  document.querySelectorAll("[data-mascot]").forEach((img) => (img.src = cfg.mascotSrc));
  $("#btn-shake").onclick = doShake;
  $("#btn-spin").onclick = spin;
  $("#btn-back-fortune").onclick = () => show("s-result");
  window.SSi18n.onChange(render);
  window.SSi18n.init(DICT);

  if (!valid) show("s-error");
  else if (stage === "spun") show("s-coupon");
  else if (stage === "drawn") show("s-result");
  else { show("s-intro"); listenForShake(); }
})();
