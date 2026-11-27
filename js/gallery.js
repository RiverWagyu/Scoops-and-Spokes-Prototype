/* Photo booth gallery panel, shown on top of the cashier page.
   Every strip taken on this device, newest first. Load before cashier.js. */
(function () {
  const $ = (s) => document.querySelector(s);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const t = (...a) => window.SSi18n.t(...a);
  const fmtDate = (...a) => window.SSi18n.fmtDate(...a);

  // merged into the cashier page's dictionary
  const DICT = {
    en: {
      gallery: "Gallery",
      slideshow: "▶ Slideshow",
      closeGallery: "✕ Close",
      galleryTitle: "Photo booth gallery",
      count: "{n} photo strips",
      count1: "1 photo strip",
      count0: "No photo strips yet",
      deviceNote: "Saved in this browser on this device only. Clearing the browser's data deletes them, so download any you want to keep.",
      deleteAll: "Delete all",
      confirmAll: "Delete ALL {n} photo strips from this device? This can't be undone.",
      confirmOne: "Delete this photo strip? This can't be undone.",
      gSave: "⬇ Save",
      gDelete: "🗑 Delete",
      gReceipt: "Receipt",
      noReceipt: "No receipt yet",
      emptyText: "No photos yet. Every strip taken in the photo booth will show up here.",
      goBooth: "Go to the photo booth",
      onlineNote: "🌐 Online gallery: photo strips from every device, updating live.",
      onlineError: "Couldn't load the online gallery. Check the internet connection and the Firebase settings.",
      confirmAllOnline: "Delete ALL {n} photo strips from the ONLINE gallery, for every device? This can't be undone."
    },
    th: {
      gallery: "แกลเลอรี",
      slideshow: "▶ สไลด์โชว์",
      closeGallery: "✕ ปิด",
      galleryTitle: "แกลเลอรีโฟโต้บูธ",
      count: "{n} ภาพ",
      count1: "1 ภาพ",
      count0: "ยังไม่มีภาพ",
      deviceNote: "บันทึกไว้ในเบราว์เซอร์ของเครื่องนี้เท่านั้น ถ้าล้างข้อมูลเบราว์เซอร์ภาพจะหายไป ดาวน์โหลดภาพที่อยากเก็บไว้ก่อน",
      deleteAll: "ลบทั้งหมด",
      confirmAll: "ลบภาพทั้งหมด {n} ภาพออกจากเครื่องนี้? ลบแล้วกู้คืนไม่ได้",
      confirmOne: "ลบภาพนี้? ลบแล้วกู้คืนไม่ได้",
      gSave: "⬇ บันทึก",
      gDelete: "🗑 ลบ",
      gReceipt: "ใบเสร็จ",
      noReceipt: "ยังไม่ได้ออกใบเสร็จ",
      emptyText: "ยังไม่มีภาพ ทุกภาพที่ถ่ายในโฟโต้บูธจะแสดงที่นี่",
      goBooth: "ไปที่โฟโต้บูธ",
      onlineNote: "🌐 แกลเลอรีออนไลน์: ภาพจากทุกเครื่อง อัปเดตทันที",
      onlineError: "โหลดแกลเลอรีออนไลน์ไม่ได้ ตรวจสอบอินเทอร์เน็ตและการตั้งค่า Firebase",
      confirmAllOnline: "ลบภาพทั้งหมด {n} ภาพจากแกลเลอรีออนไลน์ สำหรับทุกเครื่อง? ลบแล้วกู้คืนไม่ได้"
    }
  };

  let items = [];          // [{ id, receiptId, createdAt, blob, url }]
  let wired = false;

  const online = () => !!window.SSOnline?.enabled();
  let unlisten = null;

  async function load() {
    if (online()) {
      if (unlisten) return;                                   // already listening live
      unlisten = window.SSOnline.listen((list) => { items = list; render(); }, (err) => {
        console.warn(err);
        $("#g-count").textContent = t("onlineError");
      });
      return;
    }
    items.forEach((it) => URL.revokeObjectURL(it.url));
    const list = await window.SSGallery.all();
    items = list.map((r) => ({ ...r, url: URL.createObjectURL(r.blob) }));
    render();
  }

  async function fullUrl(it) {
    return it.online ? (await window.SSOnline.full(it.id)) || it.url : it.url;
  }
  async function removeItem(it) {
    if (it.online) await window.SSOnline.remove(it.id); else await window.SSGallery.remove(it.id);
  }

  const timeOf = (d) =>
    d.toLocaleTimeString(window.SSi18n.lang === "th" ? "th-TH" : "en-GB", { hour: "2-digit", minute: "2-digit" });

  function render() {
    if ($("#gallery-panel").hidden) return;
    const n = items.length;
    $("#g-count").textContent = n === 0 ? t("count0") : n === 1 ? t("count1") : t("count", { n });
    $("#btn-clear").hidden = n === 0;
    $("#btn-slideshow").disabled = n === 0;
    $("#g-empty").hidden = n > 0;
    document.querySelector("#gallery-panel .g-note").textContent = t(online() ? "onlineNote" : "deviceNote");

    const days = new Map();
    items.forEach((it) => {
      const d = new Date(it.createdAt);
      const key = d.toDateString();
      if (!days.has(key)) days.set(key, { date: d, list: [] });
      days.get(key).list.push(it);
    });

    $("#g-days").innerHTML = [...days.values()].map(({ date, list }) => `
      <section class="g-day">
        <h2>${esc(fmtDate(date, { weekday: "short", day: "numeric", month: "short", year: "numeric" }))} · ${list.length}</h2>
        <div class="g-grid">
          ${list.map((it) => `
            <article class="g-card" data-id="${it.id}">
              <button class="g-open" data-act="open" aria-label="${esc(t("slideshow"))}"><img src="${it.url}" alt="Photo booth strip" loading="lazy"></button>
              <div class="g-meta">${timeOf(new Date(it.createdAt))} · ${it.receiptId ? `${esc(t("gReceipt"))} <b>${esc(it.receiptId)}</b>` : esc(t("noReceipt"))}</div>
              <div class="g-actions">
                <button class="btn small" data-act="save">${esc(t("gSave"))}</button>
                <button class="btn ghost small" data-act="del">${esc(t("gDelete"))}</button>
              </div>
            </article>`).join("")}
        </div>
      </section>`).join("");
  }

  async function download(it) {
    const a = document.createElement("a");
    a.href = await fullUrl(it);
    a.download = `scoops-spokes-${it.receiptId || it.createdAt.slice(0, 16).replace(/[-:T]/g, "")}.jpg`;
    a.click();
  }

  /* ---------- open / close the panel ---------- */
  function open() {
    wire();
    $("#gallery-panel").hidden = false;
    document.body.classList.add("gallery-open");
    $("#gallery-panel").scrollTop = 0;
    load();
  }
  function close() {
    closeShow();
    unlisten?.(); unlisten = null;
    $("#gallery-panel").hidden = true;
    document.body.classList.remove("gallery-open");
    if (location.hash === "#gallery") history.replaceState(null, "", location.pathname + location.search);
  }

  /* ---------- slideshow (for the projector) ---------- */
  let idx = 0, timer = null;
  function showSlide(i) {
    if (!items.length) return;
    idx = (i + items.length) % items.length;
    const it = items[idx];
    const img = $("#ss-img");
    img.style.animation = "none"; void img.offsetWidth; img.style.animation = "";
    img.src = it.url;
    if (it.online) fullUrl(it).then((u) => { if (items[idx] === it) img.src = u; });
    const d = new Date(it.createdAt);
    $("#ss-cap").textContent = `${fmtDate(d)} · ${timeOf(d)}   (${idx + 1}/${items.length})`;
  }
  const restart = () => { clearInterval(timer); timer = setInterval(() => showSlide(idx + 1), 4000); };
  function openShow(start = 0) {
    if (!items.length) return;
    $("#slideshow").hidden = false;
    showSlide(start);
    restart();
    $("#slideshow").requestFullscreen?.().catch(() => {});
  }
  function closeShow() {
    clearInterval(timer);
    if ($("#slideshow").hidden) return;
    $("#slideshow").hidden = true;
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
  }

  function wire() {
    if (wired) return;
    wired = true;
    $("#g-days").addEventListener("click", async (e) => {
      const btn = e.target.closest("[data-act]");
      if (!btn) return;
      const it = items.find((x) => x.id === btn.closest(".g-card").dataset.id);
      if (!it) return;
      if (btn.dataset.act === "save") download(it);
      if (btn.dataset.act === "open") openShow(items.indexOf(it));
      if (btn.dataset.act === "del" && confirm(t("confirmOne"))) { await removeItem(it); if (!online()) load(); }
    });
    $("#btn-clear").onclick = async () => {
      if (!confirm(t(online() ? "confirmAllOnline" : "confirmAll", { n: items.length }))) return;
      if (online()) await Promise.all(items.map((it) => window.SSOnline.remove(it.id)));
      else { await window.SSGallery.clear(); load(); }
    };
    $("#btn-gallery-close").onclick = close;
    $("#btn-go-booth").onclick = close;
    $("#btn-slideshow").onclick = () => openShow(0);
    $("#ss-close").onclick = closeShow;
    $("#ss-next").onclick = () => { showSlide(idx + 1); restart(); };
    $("#ss-prev").onclick = () => { showSlide(idx - 1); restart(); };
    document.addEventListener("keydown", (e) => {
      if (!$("#slideshow").hidden) {
        if (e.key === "Escape") closeShow();
        if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); showSlide(idx + 1); restart(); }
        if (e.key === "ArrowLeft") { showSlide(idx - 1); restart(); }
      } else if (!$("#gallery-panel").hidden && e.key === "Escape") close();
    });
    document.addEventListener("fullscreenchange", () => {
      if (!document.fullscreenElement && !$("#slideshow").hidden) closeShow();
    });
    window.SSi18n.onChange(render);
  }

  window.SSGalleryUI = { DICT, open, close, refresh: () => { if (!$("#gallery-panel").hidden) load(); } };
})();
