/* Cashier page: order → photo booth → receipt (front with QR, back with photos) */
(function () {
  const cfg = window.SS_CONFIG;
  const { t, pick, fmtDate } = window.SSi18n;
  const $ = (s) => document.querySelector(s);
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const baht = (n) => "฿" + n.toLocaleString("en-US");

  const DICT = {
    en: {
      cashierTag: "Cashier · Salaya",
      plain: "Plain",
      float: "Float",
      cup: "Cup",
      cone: "Cone +25",
      checkCoupon: "Check coupon",
      classQr: "Class demo QR",
      shareOnline: "Share to the online gallery (customer agrees)",
      sharedOnline: "✓ Shared to the online gallery",
      sharing: "Uploading to the online gallery…",
      shareFailed: "Couldn't upload to the online gallery. Check the internet connection.",
      classQrHelp: "Show this on the projector. Everyone who scans gets their own random draw (25% are lucky and spin the wheel).",
      settings: "Settings",
      stepOrder: "Order",
      cartEmpty: "Tap a menu item to add it.",
      total: "Total",
      paidBy: "Paid by",
      stepPhoto: "Photo booth",
      boothIdle: "Turn on the camera and snap 3 photos for the back of the receipt.",
      startCamera: "Turn on camera",
      takePhotos: "📸 Take 3 photos",
      retake: "Retake",
      upload: "Upload photos",
      stepReceipt: "Receipt",
      createReceipt: "Create receipt",
      flip: "↻ Flip",
      print: "Print",
      savePhoto: "Save photo strip",
      openFortune: "Open fortune page",
      newOrder: "New order",
      printHint: "Print uses 2 pages: the front, then the photo side. Turn on two-sided printing (flip on long edge) to get both on one sheet, then trim.",
      baseUrlLabel: "Web address of this prototype (where the QR code sends phones)",
      baseUrlHelp: "Leave empty to use the address this page is open on. Phones can't open 'localhost' — put your Netlify / GitHub Pages address or your laptop's Wi-Fi address here (e.g. http://192.168.1.20:8000/).",
      qrPreview: "QR goes to:",
      cancel: "Cancel",
      save: "Save",
      couponLabel: "Receipt number (free scoop for posting) or wheel prize code (starts with W)",
      check: "Check",
      close: "Close",
      receipt: "RECEIPT",
      no: "No.",
      date: "Date",
      cashier: "Cashier",
      paid: "Paid by",
      thanks: "Thank you — ride safe & stay sweet!",
      fortuneHead: "DAILY FORTUNE",
      fortuneLine: "Scan to shake your เซียมซี and see how lucky you are today.",
      fortuneLucky: "Lucky draws spin the wheel for a treat!",
      turnOver: "↻ Turn over for your photo",
      boothTitle: "PHOTO BOOTH",
      noPhoto: "No photo this time",
      tagUs: "Tag us",
      shareLine: "Ride by again soon!",
      freeScoop: "1 FREE SCOOP",
      wheelPrize: "Lucky wheel prize",
      notWheelCode: "This prize code isn't real — the check characters don't match.",
      shareCheckNote: "Free scoop for posting this receipt. Ask to see the customer's post — it should show this receipt.",
      needItems: "Add at least one item first.",
      noCameraApi: "This browser can't use the camera. Use 'Upload photos' instead.",
      cameraDenied: "Couldn't open the camera. Allow camera access, or use 'Upload photos'.",
      insecure: "The camera only works on https:// or localhost. Open this page through the local server (see README).",
      photosReady: "✓ Photos ready — they'll go on the back of the receipt.",
      localWarn: "Heads up: the QR code points to {url}, which phones can't open. Set the real web address in Settings.",
      invalidCode: "That isn't a receipt number (e.g. S261127-K7QF) or a wheel prize code (e.g. W261127-B7KQ9M).",
      noPrize: "No prize on this receipt",
      notLuckyNote: "The fortune for this receipt wasn't a lucky one.",
      issuedHere: "Issued on this device ✓",
      notIssuedHere: "Not found on this device — check the paper receipt.",
      validUntil: "Valid until {date}",
      expired: "Expired on {date}",
      redeemedOn: "Already used on {date}",
      markUsed: "Mark as used",
      marked: "Marked as used ✓"
    },
    th: {
      cashierTag: "แคชเชียร์ · ศาลายา",
      plain: "ธรรมดา",
      float: "โฟลต",
      cup: "ถ้วย",
      cone: "โคน +25",
      checkCoupon: "ตรวจคูปอง",
      classQr: "QR เดโมในห้อง",
      shareOnline: "แชร์ไปที่แกลเลอรีออนไลน์ (ลูกค้ายินยอม)",
      sharedOnline: "✓ แชร์ไปที่แกลเลอรีออนไลน์แล้ว",
      sharing: "กำลังอัปโหลดไปที่แกลเลอรีออนไลน์…",
      shareFailed: "อัปโหลดไปที่แกลเลอรีออนไลน์ไม่สำเร็จ ตรวจสอบอินเทอร์เน็ต",
      classQrHelp: "เปิดขึ้นจอโปรเจกเตอร์ ทุกคนที่สแกนจะได้เสี่ยงเซียมซีของตัวเอง (25% ได้หมุนวงล้อ)",
      settings: "ตั้งค่า",
      stepOrder: "รายการสั่ง",
      cartEmpty: "แตะเมนูเพื่อเพิ่มรายการ",
      total: "รวม",
      paidBy: "ชำระโดย",
      stepPhoto: "โฟโต้บูธ",
      boothIdle: "เปิดกล้องแล้วถ่าย 3 รูป เพื่อพิมพ์ด้านหลังใบเสร็จ",
      startCamera: "เปิดกล้อง",
      takePhotos: "📸 ถ่าย 3 รูป",
      retake: "ถ่ายใหม่",
      upload: "อัปโหลดรูป",
      stepReceipt: "ใบเสร็จ",
      createReceipt: "ออกใบเสร็จ",
      flip: "↻ พลิก",
      print: "พิมพ์",
      savePhoto: "บันทึกรูป",
      openFortune: "เปิดหน้าเซียมซี",
      newOrder: "ออเดอร์ใหม่",
      printHint: "พิมพ์ 2 หน้า: ด้านหน้า แล้วตามด้วยด้านรูป เปิดพิมพ์สองหน้า (พลิกด้านยาว) จะได้ทั้งสองด้านในแผ่นเดียว แล้วตัดขอบ",
      baseUrlLabel: "ที่อยู่เว็บของต้นแบบนี้ (ปลายทางของ QR)",
      baseUrlHelp: "เว้นว่างไว้เพื่อใช้ที่อยู่ของหน้านี้ มือถือเปิด 'localhost' ไม่ได้ ให้ใส่ที่อยู่ Netlify / GitHub Pages หรือที่อยู่ Wi-Fi ของแล็ปท็อป (เช่น http://192.168.1.20:8000/)",
      qrPreview: "QR จะพาไปที่:",
      cancel: "ยกเลิก",
      save: "บันทึก",
      couponLabel: "เลขที่ใบเสร็จ (ไอศกรีมฟรีจากการโพสต์) หรือรหัสรางวัลวงล้อ (ขึ้นต้นด้วย W)",
      check: "ตรวจ",
      close: "ปิด",
      receipt: "ใบเสร็จรับเงิน",
      no: "เลขที่",
      date: "วันที่",
      cashier: "แคชเชียร์",
      paid: "ชำระโดย",
      thanks: "ขอบคุณที่แวะมา ปั่นปลอดภัย หวานทุกวันนะ!",
      fortuneHead: "เซียมซีประจำวัน",
      fortuneLine: "สแกนเพื่อเขย่าเซียมซี ดูดวงวันนี้ของคุณ",
      fortuneLucky: "ใครดวงดี ได้หมุนวงล้อรับของรางวัล!",
      turnOver: "↻ พลิกด้านหลังดูรูปของคุณ",
      boothTitle: "โฟโต้บูธ",
      noPhoto: "รอบนี้ไม่มีรูป",
      tagUs: "แท็กเรา",
      shareLine: "แวะมาปั่นด้วยกันอีกนะ!",
      freeScoop: "ฟรี 1 สกู๊ป",
      wheelPrize: "รางวัลวงล้อนำโชค",
      notWheelCode: "รหัสรางวัลนี้ไม่ถูกต้อง ตัวตรวจสอบไม่ตรงกัน",
      shareCheckNote: "รับไอศกรีมฟรีจากการโพสต์ใบเสร็จนี้ ขอดูโพสต์ของลูกค้า ในโพสต์ต้องเห็นใบเสร็จนี้",
      needItems: "เพิ่มอย่างน้อย 1 รายการก่อน",
      noCameraApi: "เบราว์เซอร์นี้ใช้กล้องไม่ได้ ใช้ 'อัปโหลดรูป' แทน",
      cameraDenied: "เปิดกล้องไม่ได้ อนุญาตการเข้าถึงกล้อง หรือใช้ 'อัปโหลดรูป'",
      insecure: "กล้องใช้ได้เฉพาะ https:// หรือ localhost เปิดหน้านี้ผ่านเซิร์ฟเวอร์ในเครื่อง (ดู README)",
      photosReady: "✓ รูปพร้อมแล้ว จะพิมพ์อยู่ด้านหลังใบเสร็จ",
      localWarn: "QR ตอนนี้ชี้ไปที่ {url} ซึ่งมือถือเปิดไม่ได้ ตั้งที่อยู่เว็บจริงในหน้าตั้งค่า",
      invalidCode: "ไม่ใช่เลขที่ใบเสร็จ (เช่น S261127-K7QF) หรือรหัสรางวัลวงล้อ (เช่น W261127-B7KQ9M)",
      noPrize: "ใบเสร็จนี้ไม่มีรางวัล",
      notLuckyNote: "เซียมซีของใบเสร็จนี้ไม่ใช่ใบโชคดี",
      issuedHere: "ออกจากเครื่องนี้ ✓",
      notIssuedHere: "ไม่พบในเครื่องนี้ ตรวจใบเสร็จตัวจริง",
      validUntil: "ใช้ได้ถึง {date}",
      expired: "หมดอายุแล้วเมื่อ {date}",
      redeemedOn: "ใช้ไปแล้วเมื่อ {date}",
      markUsed: "บันทึกว่าใช้แล้ว",
      marked: "บันทึกว่าใช้แล้ว ✓"
    }
  };

  /* ---------------- state ---------------- */
  const state = {
    cart: {},              // itemId -> qty
    payment: cfg.payments[0].id,
    photos: [],            // data URLs (4:3)
    stripUrl: null,
    receipt: null,
    stream: null,
    busy: false
  };
  const store = {
    get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
    set(k, v) { localStorage.setItem(k, JSON.stringify(v)); }
  };

  /* ---------------- order ---------------- */
  function renderMenu() {
    const box = $("#menu");
    box.innerHTML = "";
    const add = (key) => { state.cart[key] = (state.cart[key] || 0) + 1; renderCart(); };
    const cats = cfg.menuCategories || [{ id: undefined, name: "" }];
    cats.forEach((c) => {
      const items = cfg.menu.filter((m) => m.cat === c.id);
      if (!items.length) return;
      if (c.name) {
        const h = document.createElement("h3");
        h.className = "menu-cat";
        h.textContent = pick(c.name);
        box.appendChild(h);
      }
      const grid = document.createElement("div");
      grid.className = "menu-grid";
      items.forEach((m) => {
        const opts = optionsOf(m);
        if (opts) {
          // two-way choice: Plain / Float for drinks, Cup / Cone for ice cream
          const card = document.createElement("div");
          card.className = "menu-item has-opts";
          card.innerHTML = `<span class="n"></span>
            <span class="opts">${opts.map((o, i) => `
              <button class="opt${i ? " alt" : ""}" data-k="${m.id}${o.key ? ":" + o.key : ""}"><small>${esc(t(o.label))}</small>${baht(o.price)}</button>`).join("")}
            </span>`;
          card.querySelector(".n").textContent = pick(m.name);
          card.querySelectorAll(".opt").forEach((b) => (b.onclick = () => add(b.dataset.k)));
          grid.appendChild(card);
        } else {
          const b = document.createElement("button");
          b.className = "menu-item";
          b.innerHTML = `<span class="n"></span><span class="p">${baht(m.price)}</span>`;
          b.querySelector(".n").textContent = pick(m.name);
          b.onclick = () => add(m.id);
          grid.appendChild(b);
        }
      });
      box.appendChild(grid);
    });
    const chips = $("#payments");
    chips.innerHTML = "";
    cfg.payments.forEach((p) => {
      const c = document.createElement("button");
      c.className = "chip";
      c.textContent = pick(p.label);
      c.setAttribute("aria-pressed", String(p.id === state.payment));
      c.onclick = () => { state.payment = p.id; renderMenu(); };
      chips.appendChild(c);
    });
  }

  // Items with a two-way choice. key "" = the basic version.
  function optionsOf(m) {
    if (m.float) return [
      { key: "", label: "plain", price: m.price },
      { key: "float", label: "float", price: m.float, suffix: { en: "Float", th: "โฟลต" } }];
    if (m.cone) return [
      { key: "", label: "cup", price: m.price },
      { key: "cone", label: "cone", price: m.price + m.cone, suffix: { en: "Cone", th: "โคน" } }];
    return null;
  }

  // cart keys: "melon" (basic) or "melon:float" / "classic:cone"
  function cartLines() {
    return Object.entries(state.cart).filter(([, q]) => q > 0).map(([key, qty]) => {
      const [id, optKey = ""] = key.split(":");
      const m = cfg.menu.find((x) => x.id === id);
      if (!m) return null;
      const o = (optionsOf(m) || []).find((x) => x.key === optKey);
      return {
        id: key, qty,
        price: o ? o.price : m.price,
        name: o?.suffix ? { en: `${m.name.en} · ${o.suffix.en}`, th: `${m.name.th} · ${o.suffix.th}` } : m.name
      };
    }).filter(Boolean);
  }
  const cartTotal = (lines) => lines.reduce((s, l) => s + l.qty * l.price, 0);

  function renderCart() {
    const lines = cartLines();
    const ul = $("#cart-list");
    ul.innerHTML = "";
    lines.forEach((l) => {
      const li = document.createElement("li");
      li.innerHTML = `<span class="name"></span>
        <span class="qty"><button aria-label="-">−</button><span>${l.qty}</span><button aria-label="+">+</button></span>
        <span class="line-price">${baht(l.qty * l.price)}</span>`;
      li.querySelector(".name").textContent = pick(l.name);
      const [minus, plus] = li.querySelectorAll("button");
      minus.onclick = () => { state.cart[l.id]--; renderCart(); };
      plus.onclick = () => { state.cart[l.id]++; renderCart(); };
      ul.appendChild(li);
    });
    $("#cart-empty").hidden = lines.length > 0;
    $("#cart-total").textContent = baht(cartTotal(lines));
  }

  /* ---------------- photo booth ---------------- */
  const video = $("#video");
  const stage = $("#booth-stage");
  const msg = (s) => { $("#camera-msg").textContent = s || ""; };

  async function startCamera() {
    msg("");
    if (!window.isSecureContext) { msg(t("insecure")); return; }
    if (!navigator.mediaDevices?.getUserMedia) { msg(t("noCameraApi")); return; }
    try {
      state.stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 960 } },
        audio: false
      });
      video.srcObject = state.stream;
      await video.play();
      stage.classList.add("live");
      $("#booth-idle").hidden = true;
      $("#btn-camera").hidden = true;
      $("#btn-shoot").hidden = false;
    } catch (e) {
      msg(t("cameraDenied") + " (" + e.name + ")");
    }
  }

  function stopCamera() {
    state.stream?.getTracks().forEach((tr) => tr.stop());
    state.stream = null;
    video.srcObject = null;
    stage.classList.remove("live");
    $("#booth-idle").hidden = false;
    $("#btn-camera").hidden = false;
    $("#btn-shoot").hidden = true;
  }

  async function countdown(n) {
    const el = $("#countdown");
    for (let k = n; k >= 1; k--) {
      el.textContent = k;
      el.classList.remove("pop"); void el.offsetWidth; el.classList.add("pop");
      await sleep(1000);
    }
    el.textContent = "";
  }

  function flash() {
    const f = $("#flash");
    f.classList.remove("go"); void f.offsetWidth; f.classList.add("go");
  }

  // Draw a source into a 960×720 canvas, cover-cropped, optionally mirrored.
  function toFrame(src, sw, sh, mirror) {
    const c = document.createElement("canvas");
    c.width = 960; c.height = 720;
    const ctx = c.getContext("2d");
    const target = 4 / 3;
    let w = sw, h = sh, x = 0, y = 0;
    if (sw / sh > target) { w = sh * target; x = (sw - w) / 2; }
    else { h = sw / target; y = (sh - h) / 2; }
    if (mirror) { ctx.translate(960, 0); ctx.scale(-1, 1); }
    ctx.drawImage(src, x, y, w, h, 0, 0, 960, 720);
    return c.toDataURL("image/jpeg", 0.9);
  }

  async function shoot() {
    if (state.busy || !state.stream) return;
    state.busy = true;
    $("#btn-shoot").disabled = true;
    $("#btn-retake").hidden = true;
    state.photos = [];
    renderThumbs();
    msg("");
    for (let i = 0; i < 3; i++) {
      $("#shot-count").textContent = `${i + 1} / 3`;
      await countdown(3);
      flash();
      state.photos.push(toFrame(video, video.videoWidth, video.videoHeight, true));
      renderThumbs();
      await sleep(600);
    }
    $("#shot-count").textContent = "";
    await afterPhotos();
    state.busy = false;
    $("#btn-shoot").disabled = false;
    $("#btn-retake").hidden = false;
  }

  async function afterPhotos() {
    state.stripUrl = state.photos.length ? await composeStrip(state.photos) : null;
    msg(state.photos.length ? t("photosReady") : "");
    // keep every strip in the on-device gallery
    state.stripId = null;
    if (state.stripUrl && window.SSGallery) {
      try {
        const blob = await (await fetch(state.stripUrl)).blob();
        state.stripId = await window.SSGallery.add({ blob, receiptId: state.receipt?.id || null });
        window.SSGalleryUI?.refresh();
      } catch (e) { console.warn("Couldn't save to gallery", e); }
    }
    if (state.receipt) shareOnline();
    if (state.receipt) { state.receipt.stripUrl = state.stripUrl; renderBack(); }
  }

  function renderThumbs() {
    document.querySelectorAll("#thumbs .thumb").forEach((el, i) => {
      const p = state.photos[i];
      el.style.backgroundImage = p ? `url(${p})` : "";
      el.classList.toggle("filled", !!p);
    });
  }

  function loadImg(src) {
    return new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = src; });
  }

  async function onUpload(e) {
    const files = [...e.target.files].slice(0, 3);
    if (!files.length) return;
    state.photos = [];
    for (const f of files) {
      const url = URL.createObjectURL(f);
      const img = await loadImg(url);
      state.photos.push(toFrame(img, img.naturalWidth, img.naturalHeight, false));
      URL.revokeObjectURL(url);
    }
    e.target.value = "";
    renderThumbs();
    await afterPhotos();
    $("#btn-retake").hidden = !state.stream;
  }

  // Photobooth strip: green frame, cream borders, mustard footer.
  async function composeStrip(urls) {
    await document.fonts.ready;
    const imgs = await Promise.all(urls.map(loadImg));
    const W = 600, pad = 24, pw = W - pad * 2, ph = pw * 3 / 4, gap = 16, foot = 64;
    const H = pad + imgs.length * ph + (imgs.length - 1) * gap + foot;
    const c = document.createElement("canvas");
    c.width = W; c.height = H;
    const ctx = c.getContext("2d");
    ctx.fillStyle = "#506840";
    ctx.fillRect(0, 0, W, H);
    // little chainring dots along the edges
    ctx.fillStyle = "rgba(232, 184, 64,.35)";
    for (let y = 18; y < H - foot; y += 26) {
      ctx.beginPath(); ctx.arc(10, y, 3, 0, 7); ctx.fill();
      ctx.beginPath(); ctx.arc(W - 10, y, 3, 0, 7); ctx.fill();
    }
    imgs.forEach((img, i) => {
      const y = pad + i * (ph + gap);
      ctx.fillStyle = "#F7F1E1";
      roundRect(ctx, pad - 5, y - 5, pw + 10, ph + 10, 12); ctx.fill();
      ctx.save();
      roundRect(ctx, pad, y, pw, ph, 8); ctx.clip();
      ctx.drawImage(img, pad, y, pw, ph);
      ctx.restore();
    });
    const fy = H - foot / 2 + 4;
    // mascot badge
    const bx = pad + 18, by = fy - 2, br = 18;
    ctx.save();
    ctx.beginPath(); ctx.arc(bx, by, br, 0, 7); ctx.clip();
    ctx.fillStyle = "#E8B840"; ctx.fillRect(bx - br, by - br, br * 2, br * 2);
    try {
      const m = await loadImg(cfg.mascotSrc);
      const mw = br * 2 * 0.94, mh = mw * m.naturalHeight / m.naturalWidth;
      // same framing as the CSS badge: background-position 47% 44%
      const ox = (br * 2 - mw) * 0.47, oy = (br * 2 - mh) * 0.44;
      ctx.drawImage(m, bx - br + ox, by - br + oy, mw, mh);
    } catch {}
    ctx.restore();
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#F7F1E1";
    ctx.textAlign = "left";
    ctx.font = "700 24px Fredoka, sans-serif";
    ctx.fillText("SCOOPS & SPOKES", pad + 46, fy);
    ctx.textAlign = "right";
    ctx.fillStyle = "#E8B840";
    ctx.font = "600 20px Fredoka, sans-serif";
    const d = new Date();
    ctx.fillText(`${String(d.getDate()).padStart(2, "0")}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getFullYear()).slice(2)}`, W - pad, fy);
    return c.toDataURL("image/jpeg", 0.92);
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  /* ---------------- receipt ---------------- */
  function baseUrl() {
    let b = localStorage.getItem("ss_base") || cfg.fortuneBaseUrl;
    if (!b) b = location.href.split(/[?#]/)[0].replace(/[^/]*$/, "");
    if (!b.endsWith("/")) b += "/";
    return b;
  }
  const fortuneUrl = (id) => `${baseUrl()}fortune.html?r=${encodeURIComponent(id)}`;

  function unreachable(url) {
    try {
      const u = new URL(url);
      return u.protocol === "file:" || ["localhost", "127.0.0.1", "[::1]"].includes(u.hostname);
    } catch { return true; }
  }

  function qrSvg(text) {
    if (typeof qrcode !== "function") return `<div class="b-empty">QR library didn't load (offline?)</div>`;
    const qr = qrcode(0, "M");
    qr.addData(text);
    qr.make();
    const n = qr.getModuleCount();
    const q = 2; // quiet zone
    let d = "";
    for (let r = 0; r < n; r++)
      for (let c = 0; c < n; c++)
        if (qr.isDark(r, c)) d += `M${c + q} ${r + q}h1v1h-1z`;
    return `<svg class="r-qr" viewBox="0 0 ${n + q * 2} ${n + q * 2}" shape-rendering="crispEdges" role="img" aria-label="QR code">
      <rect width="100%" height="100%" fill="#fff"/><path d="${d}" fill="#111"/></svg>`;
  }

  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  function renderFront() {
    const r = state.receipt;
    const pay = cfg.payments.find((p) => p.id === r.payment);
    const time = r.date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
    const lines = r.lines.map((l) => `
      <div class="r-line"><span>${l.qty}×</span><span>${esc(pick(l.name))}</span><span>${(l.qty * l.price).toFixed(2)}</span></div>`).join("");
    $("#receipt-front").innerHTML = `
      <div class="r-head">
        <span class="amp-badge">&amp;</span>
        <span class="wm">${window.SSBrand.WORDMARK}</span>
        <div class="r-small r-center">${esc(pick(cfg.shop.address))}<br>IG @${esc(cfg.shop.instagram)}</div>
      </div>
      <div class="r-title">${esc(t("receipt"))}</div>
      <dl class="r-meta">
        <dt>${esc(t("no"))}</dt><dd>${r.id}</dd>
        <dt>${esc(t("date"))}</dt><dd>${fmtDate(r.date, { day: "2-digit", month: "2-digit", year: "numeric" })} ${time}</dd>
        <dt>${esc(t("cashier"))}</dt><dd>01</dd>
      </dl>
      <hr class="r-rule">
      ${lines}
      <hr class="r-rule">
      <div class="r-total"><span>${esc(t("total"))}</span><span>${baht(r.total)}.00</span></div>
      <dl class="r-meta"><dt>${esc(t("paid"))}</dt><dd>${esc(pick(pay.label))}</dd></dl>
      <p class="r-thanks">${esc(t("thanks"))}</p>
      <div class="r-fortune">
        <h4>${esc(t("fortuneHead"))}</h4>
        <p>${esc(t("fortuneLine"))}</p>
        ${qrSvg(fortuneUrl(r.id))}
        <p class="r-code">${r.id}</p>
        <p><b>${esc(t("fortuneLucky"))}</b></p>
      </div>
      <p class="r-turn">${esc(t("turnOver"))}</p>`;
  }

  function renderBack() {
    const r = state.receipt;
    const mascot = esc(cfg.mascotSrc);
    const photo = r.stripUrl
      ? `<img class="b-strip" src="${r.stripUrl}" alt="Photo booth strip">`
      : `<div class="b-empty"><img src="${mascot}" alt="">${esc(t("noPhoto"))}</div>`;
    $("#receipt-back").innerHTML = `
      <div class="b-head">
        <span class="b-title">${esc(t("boothTitle"))}</span>
        <span class="amp-badge" style="--size:30px">&amp;</span>
      </div>
      ${photo}
      <div class="b-foot">
        <div>
          <p class="b-tagline">${esc(t("shareLine"))}</p>
          <p class="r-small">${esc(t("tagUs"))} @${esc(cfg.shop.instagram)}<br>#ScoopsAndSpokes · ${fmtDate(r.date)}</p>
        </div>
        <img src="${mascot}" alt="Scoops & Spokes mascot">
      </div>`;
  }

  function updateUrlWarn() {
    const warn = $("#url-warn");
    const url = fortuneUrl(state.receipt?.id || "S000000-XXXX");
    warn.hidden = !unreachable(url);
    warn.textContent = t("localWarn", { url: baseUrl() });
  }

  function createReceipt() {
    const lines = cartLines();
    if (!lines.length) { alert(t("needItems")); return; }
    const date = new Date();
    const id = window.SSLuck.newId(date);
    state.receipt = { id, date, lines, total: cartTotal(lines), payment: state.payment, stripUrl: state.stripUrl };
    const issued = store.get("ss_issued", {});
    issued[id] = { total: state.receipt.total, at: date.toISOString() };
    store.set("ss_issued", issued);
    const wheel = window.SSLuck.wheelCode(id);
    if (wheel) {
      const wmap = store.get("ss_wheel_issued", {});
      wmap[wheel] = { receipt: id, at: date.toISOString() };
      store.set("ss_wheel_issued", wmap);
    }
    if (state.stripId) window.SSGallery?.update(state.stripId, { receiptId: id }).catch(() => {});
    renderReceipt();
    shareOnline();
    $("#flip").classList.remove("flipped");
  }

  function renderReceipt() {
    if (!state.receipt) return;
    renderFront();
    renderBack();
    $("#flip").classList.add("ready");
    $("#after-actions").hidden = false;
    $("#btn-open-fortune").href = fortuneUrl(state.receipt.id);
    updateUrlWarn();
  }

  function newOrder() {
    state.cart = {};
    state.photos = [];
    state.stripUrl = null;
    state.stripId = null;
    state.sharedUrl = null;
    state.receipt = null;
    renderCart();
    renderThumbs();
    msg("");
    $("#flip").classList.remove("ready", "flipped");
    $("#after-actions").hidden = true;
    $("#btn-retake").hidden = true;
    $("#url-warn").hidden = true;
    stopCamera();
  }

  function savePhoto() {
    const r = state.receipt;
    if (!r?.stripUrl) { alert(t("noPhoto")); return; }
    const a = document.createElement("a");
    a.href = r.stripUrl;
    a.download = `scoops-spokes-${r.id}.jpg`;
    a.click();
  }

  /* ---------------- online gallery ---------------- */
  // Upload the final strip once its receipt exists (retakes after that upload too).
  async function shareOnline() {
    if (!window.SSOnline?.enabled() || !$("#share-online").checked) return;
    if (!state.stripUrl || !state.receipt || state.sharedUrl === state.stripUrl) return;
    const url = state.stripUrl;
    state.sharedUrl = url;
    msg(t("sharing"));
    try {
      await window.SSOnline.upload({ dataUrl: url, receiptId: state.receipt.id });
      if (state.stripUrl === url) msg(t("sharedOnline"));
    } catch (e) {
      console.warn("Online upload failed", e);
      state.sharedUrl = null;
      msg(t("shareFailed"));
    }
  }

  /* ---------------- settings ---------------- */
  function openSettings() {
    const input = $("#base-url");
    input.value = localStorage.getItem("ss_base") || "";
    const refresh = () => {
      const v = input.value.trim();
      const b = v ? (v.endsWith("/") ? v : v + "/") : baseUrl();
      $("#qr-preview").textContent = `${b}fortune.html?r=S261127-K7QF`;
    };
    input.oninput = refresh;
    refresh();
    $("#dlg-settings").showModal();
  }
  $("#dlg-settings").addEventListener("close", () => {
    if ($("#dlg-settings").returnValue !== "save") return;
    const v = $("#base-url").value.trim();
    if (v) localStorage.setItem("ss_base", v); else localStorage.removeItem("ss_base");
    renderReceipt();
  });

  /* ---------------- class demo QR ---------------- */
  function openClassQr() {
    const url = `${baseUrl()}fortune.html?demo=1`;
    $("#class-qr").innerHTML = qrSvg(url);
    $("#class-qr-url").textContent = url;
    const warn = $("#class-qr-warn");
    warn.hidden = !unreachable(url);
    warn.textContent = t("localWarn", { url: baseUrl() });
    $("#dlg-classqr").showModal();
  }

  /* ---------------- coupon check ---------------- */
  function checkCoupon() {
    const id = window.SSLuck.normalize($("#coupon-id").value);
    const out = $("#coupon-result");
    if (id.startsWith("W")) { checkWheelCode(id, out); return; }
    if (window.SSLuck.isValid(id)) { checkReceiptScoop(id, out); return; }
    if (!window.SSLuck.isValid(id)) { out.innerHTML = `<p class="bad">${esc(t("invalidCode"))}</p>`; return; }
    const res = window.SSLuck.draw(id);
    const issued = store.get("ss_issued", {})[id];
    const redeemed = store.get("ss_redeemed", {})[id];
    const exp = window.SSLuck.expiryOf(id);
    const expired = Date.now() > exp.getTime();
    const items = [
      `<li class="${issued ? "ok" : "bad"}">${esc(t(issued ? "issuedHere" : "notIssuedHere"))}</li>`
    ];
    if (res.lucky) {
      items.push(`<li class="${expired ? "bad" : "ok"}">${esc(t(expired ? "expired" : "validUntil", { date: fmtDate(exp) }))}</li>`);
      if (redeemed) items.push(`<li class="bad">${esc(t("redeemedOn", { date: fmtDate(new Date(redeemed)) }))}</li>`);
    }
    const canUse = res.lucky && !expired && !redeemed;
    out.innerHTML = `
      <div class="big">${esc(res.lucky ? pick(res.prize.label) : t("noPrize"))}</div>
      ${res.lucky ? "" : `<p>${esc(t("notLuckyNote"))}</p>`}
      <ul>${items.join("")}</ul>
      ${canUse ? `<button type="button" class="btn small green" id="mark-used">${esc(t("markUsed"))}</button>` : ""}`;
    $("#mark-used")?.addEventListener("click", (e) => {
      const map = store.get("ss_redeemed", {});
      map[id] = new Date().toISOString();
      store.set("ss_redeemed", map);
      e.target.disabled = true;
      e.target.textContent = t("marked");
    });
  }

  // Lucky-wheel prize code (shown on the customer's phone after spinning)
  function checkWheelCode(code, out) {
    if (!window.SSLuck.isWheelCode(code)) {
      out.innerHTML = `<p class="bad">${esc(t(/^W\d{6}-[A-D][2-9A-Z]{5}$/.test(code) ? "notWheelCode" : "invalidCode"))}</p>`;
      return;
    }
    const prize = window.SSLuck.wheelPrizeOf(code);
    const issued = store.get("ss_wheel_issued", {})[code];
    const redeemed = store.get("ss_wheel_redeemed", {})[code];
    const exp = window.SSLuck.wheelExpiryOf(code);
    const expired = Date.now() > exp.getTime();
    const items = [
      `<li class="${issued ? "ok" : "bad"}">${esc(t(issued ? "issuedHere" : "notIssuedHere"))}</li>`,
      `<li class="${expired ? "bad" : "ok"}">${esc(t(expired ? "expired" : "validUntil", { date: fmtDate(exp) }))}</li>`
    ];
    if (redeemed) items.push(`<li class="bad">${esc(t("redeemedOn", { date: fmtDate(new Date(redeemed)) }))}</li>`);
    const canUse = !expired && !redeemed;
    out.innerHTML = `
      <div class="big">🎡 ${esc(pick(prize.label))}</div>
      <p>${esc(t("wheelPrize"))}</p>
      <ul>${items.join("")}</ul>
      ${canUse ? `<button type="button" class="btn small green" id="mark-used">${esc(t("markUsed"))}</button>` : ""}`;
    $("#mark-used")?.addEventListener("click", (e) => {
      const map = store.get("ss_wheel_redeemed", {});
      map[code] = new Date().toISOString();
      store.set("ss_wheel_redeemed", map);
      e.target.disabled = true;
      e.target.textContent = t("marked");
    });
  }

  // Receipt number = free scoop for posting the receipt (photo side) on social media
  function checkReceiptScoop(id, out) {
    const issued = store.get("ss_issued", {})[id];
    const redeemed = store.get("ss_share_redeemed", {})[id];
    const exp = window.SSLuck.dateOf(id);
    exp.setDate(exp.getDate() + cfg.shareValidDays);
    exp.setHours(23, 59, 59, 0);
    const expired = Date.now() > exp.getTime();
    const items = [
      `<li class="${issued ? "ok" : "bad"}">${esc(t(issued ? "issuedHere" : "notIssuedHere"))}</li>`,
      `<li class="${expired ? "bad" : "ok"}">${esc(t(expired ? "expired" : "validUntil", { date: fmtDate(exp) }))}</li>`
    ];
    if (redeemed) items.push(`<li class="bad">${esc(t("redeemedOn", { date: fmtDate(new Date(redeemed)) }))}</li>`);
    const canUse = !expired && !redeemed;
    out.innerHTML = `
      <div class="big">🍦 ${esc(t("freeScoop"))}</div>
      <p>${esc(t("shareCheckNote"))}</p>
      <ul>${items.join("")}</ul>
      ${canUse ? `<button type="button" class="btn small green" id="mark-used">${esc(t("markUsed"))}</button>` : ""}`;
    $("#mark-used")?.addEventListener("click", (e) => {
      const map = store.get("ss_share_redeemed", {});
      map[id] = new Date().toISOString();
      store.set("ss_share_redeemed", map);
      e.target.disabled = true;
      e.target.textContent = t("marked");
    });
  }

  /* ---------------- wire up ---------------- */
  document.querySelectorAll("[data-mascot]").forEach((img) => (img.src = cfg.mascotSrc));
  $("#btn-camera").onclick = startCamera;
  $("#btn-shoot").onclick = shoot;
  $("#btn-retake").onclick = () => { state.stream ? shoot() : startCamera(); };
  $("#file-input").onchange = onUpload;
  $("#btn-create").onclick = createReceipt;
  $("#btn-flip").onclick = () => $("#flip").classList.toggle("flipped");
  $("#btn-print").onclick = () => window.print();
  $("#btn-save").onclick = savePhoto;
  $("#btn-new").onclick = newOrder;
  $("#btn-settings").onclick = openSettings;
  $("#btn-classqr").onclick = openClassQr;
  $("#btn-coupon").onclick = () => { $("#coupon-result").innerHTML = ""; $("#coupon-id").value = ""; $("#dlg-coupon").showModal(); };
  $("#coupon-check").onclick = checkCoupon;
  $("#coupon-id").addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); checkCoupon(); } });

  // online sharing tick box
  if (window.SSOnline?.enabled()) {
    $("#share-opt").hidden = false;
    $("#share-online").checked = cfg.shareOnlineDefault !== false;
  }

  // gallery panel (same page)
  if (window.SSGalleryUI) {
    for (const l of ["en", "th"]) Object.assign(DICT[l], window.SSGalleryUI.DICT[l]);
    $("#btn-gallery").onclick = () => window.SSGalleryUI.open();
  }

  window.SSi18n.onChange(() => { renderMenu(); renderCart(); renderReceipt(); });
  window.SSi18n.init(DICT);
  if (location.hash === "#gallery") window.SSGalleryUI?.open();
})();
