/* Photo booth gallery: every strip taken on this device, newest first. */
(function () {
  const { t, fmtDate } = window.SSi18n;
  const $ = (s) => document.querySelector(s);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  const DICT = {
    en: {
      galleryTag: "Photo booth",
      slideshow: "▶ Slideshow",
      backCashier: "← Cashier",
      galleryTitle: "Photo booth gallery",
      count: "{n} photo strips",
      count1: "1 photo strip",
      count0: "No photo strips yet",
      deviceNote: "Saved in this browser on this device only. Clearing the browser's data deletes them, so download any you want to keep.",
      deleteAll: "Delete all",
      confirmAll: "Delete ALL {n} photo strips from this device? This can't be undone.",
      confirmOne: "Delete this photo strip? This can't be undone.",
      save: "⬇ Save",
      del: "🗑 Delete",
      receipt: "Receipt",
      noReceipt: "No receipt yet",
      emptyText: "No photos yet. Every strip taken in the photo booth will show up here.",
      goBooth: "Go to the photo booth"
    },
    th: {
      galleryTag: "โฟโต้บูธ",
      slideshow: "▶ สไลด์โชว์",
      backCashier: "← แคชเชียร์",
      galleryTitle: "แกลเลอรีโฟโต้บูธ",
      count: "{n} ภาพ",
      count1: "1 ภาพ",
      count0: "ยังไม่มีภาพ",
      deviceNote: "บันทึกไว้ในเบราว์เซอร์ของเครื่องนี้เท่านั้น ถ้าล้างข้อมูลเบราว์เซอร์ภาพจะหายไป ดาวน์โหลดภาพที่อยากเก็บไว้ก่อน",
      deleteAll: "ลบทั้งหมด",
      confirmAll: "ลบภาพทั้งหมด {n} ภาพออกจากเครื่องนี้? ลบแล้วกู้คืนไม่ได้",
      confirmOne: "ลบภาพนี้? ลบแล้วกู้คืนไม่ได้",
      save: "⬇ บันทึก",
      del: "🗑 ลบ",
      receipt: "ใบเสร็จ",
      noReceipt: "ยังไม่ได้ออกใบเสร็จ",
      emptyText: "ยังไม่มีภาพ ทุกภาพที่ถ่ายในโฟโต้บูธจะแสดงที่นี่",
      goBooth: "ไปที่โฟโต้บูธ"
    }
  };

  let items = [];        // [{ id, receiptId, createdAt, blob, url }]

  async function load() {
    items.forEach((it) => URL.revokeObjectURL(it.url));
    const list = await window.SSGallery.all();
    items = list.map((r) => ({ ...r, url: URL.createObjectURL(r.blob) }));
    render();
  }

  function timeOf(d) {
    return d.toLocaleTimeString(window.SSi18n.lang === "th" ? "th-TH" : "en-GB", { hour: "2-digit", minute: "2-digit" });
  }

  function render() {
    const n = items.length;
    $("#g-count").textContent = n === 0 ? t("count0") : n === 1 ? t("count1") : t("count", { n });
    $("#btn-clear").hidden = n === 0;
    $("#btn-slideshow").disabled = n === 0;
    $("#g-empty").hidden = n > 0;

    // group by day
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
              <div class="g-meta">${timeOf(new Date(it.createdAt))} · ${it.receiptId ? `${esc(t("receipt"))} <b>${esc(it.receiptId)}</b>` : esc(t("noReceipt"))}</div>
              <div class="g-actions">
                <button class="btn small" data-act="save">${esc(t("save"))}</button>
                <button class="btn ghost small" data-act="del">${esc(t("del"))}</button>
              </div>
            </article>`).join("")}
        </div>
      </section>`).join("");
  }

  function download(it) {
    const a = document.createElement("a");
    a.href = it.url;
    const stamp = it.createdAt.slice(0, 16).replace(/[-:T]/g, "");
    a.download = `scoops-spokes-${it.receiptId || stamp}.jpg`;
    a.click();
  }

  $("#g-days").addEventListener("click", async (e) => {
    const btn = e.target.closest("[data-act]");
    if (!btn) return;
    const id = btn.closest(".g-card").dataset.id;
    const it = items.find((x) => x.id === id);
    if (!it) return;
    if (btn.dataset.act === "save") download(it);
    if (btn.dataset.act === "open") openShow(items.indexOf(it));
    if (btn.dataset.act === "del" && confirm(t("confirmOne"))) {
      await window.SSGallery.remove(id);
      load();
    }
  });

  $("#btn-clear").onclick = async () => {
    if (!confirm(t("confirmAll", { n: items.length }))) return;
    await window.SSGallery.clear();
    load();
  };

  /* ---------- slideshow (for the projector) ---------- */
  let idx = 0, timer = null;
  function showSlide(i) {
    if (!items.length) return;
    idx = (i + items.length) % items.length;
    const it = items[idx];
    const img = $("#ss-img");
    img.style.animation = "none"; void img.offsetWidth; img.style.animation = "";
    img.src = it.url;
    const d = new Date(it.createdAt);
    $("#ss-cap").textContent = `${fmtDate(d)} · ${timeOf(d)}   (${idx + 1}/${items.length})`;
  }
  function openShow(start = 0) {
    if (!items.length) return;
    $("#slideshow").hidden = false;
    showSlide(start);
    clearInterval(timer);
    timer = setInterval(() => showSlide(idx + 1), 4000);
    $("#slideshow").requestFullscreen?.().catch(() => {});
  }
  function closeShow() {
    clearInterval(timer);
    $("#slideshow").hidden = true;
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
  }
  const restart = () => { clearInterval(timer); timer = setInterval(() => showSlide(idx + 1), 4000); };
  $("#btn-slideshow").onclick = () => openShow(0);
  $("#ss-close").onclick = closeShow;
  $("#ss-next").onclick = () => { showSlide(idx + 1); restart(); };
  $("#ss-prev").onclick = () => { showSlide(idx - 1); restart(); };
  document.addEventListener("keydown", (e) => {
    if ($("#slideshow").hidden) return;
    if (e.key === "Escape") closeShow();
    if (e.key === "ArrowRight" || e.key === " ") { showSlide(idx + 1); restart(); }
    if (e.key === "ArrowLeft") { showSlide(idx - 1); restart(); }
  });
  document.addEventListener("fullscreenchange", () => { if (!document.fullscreenElement && !$("#slideshow").hidden) closeShow(); });

  // refresh when a new strip is taken in another tab
  document.addEventListener("visibilitychange", () => { if (!document.hidden) load(); });

  window.SSi18n.onChange(render);
  window.SSi18n.init(DICT);
  load();
})();
