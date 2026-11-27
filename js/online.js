/* Online gallery via Firebase Firestore (free plan, no Cloud Storage needed).
   Each strip is saved as two documents:
     strips/{id}       → { createdAt, receiptId, thumb }   small, listed in the gallery
     stripImages/{id}  → { image }                         full strip, loaded on demand
   Turned on by putting your Firebase web config in js/config.js (firebase: {...}). */
(function () {
  const cfg = () => window.SS_CONFIG.firebase;
  let db = null;

  function enabled() {
    const c = cfg();
    return !!(c && c.apiKey && c.projectId && window.firebase?.firestore);
  }

  function init() {
    if (db || !enabled()) return db;
    if (!firebase.apps.length) firebase.initializeApp(cfg());
    db = firebase.firestore();
    return db;
  }

  function loadImg(src) {
    return new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = src; });
  }

  // Re-encode at a given width/quality so documents stay well under Firestore's 1 MB limit.
  async function encode(dataUrl, width, quality) {
    const img = await loadImg(dataUrl);
    const w = Math.min(width, img.naturalWidth);
    const h = Math.round(img.naturalHeight * (w / img.naturalWidth));
    const c = document.createElement("canvas");
    c.width = w; c.height = h;
    c.getContext("2d").drawImage(img, 0, 0, w, h);
    let q = quality, out = c.toDataURL("image/jpeg", q);
    while (out.length > 900000 && q > 0.4) { q -= 0.1; out = c.toDataURL("image/jpeg", q); }
    return out;
  }

  async function upload({ dataUrl, receiptId }) {
    const d = init();
    if (!d) throw new Error("Online gallery is not set up");
    const ref = d.collection("strips").doc();
    const [image, thumb] = await Promise.all([encode(dataUrl, 600, 0.85), encode(dataUrl, 200, 0.7)]);
    await d.collection("stripImages").doc(ref.id).set({ image });   // full image first…
    await ref.set({                                                   // …then the listing entry
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      receiptId: receiptId || null,
      thumb
    });
    return ref.id;
  }

  // Live list of the newest strips. Returns a function that stops listening.
  function listen(onItems, onError) {
    const d = init();
    if (!d) return () => {};
    return d.collection("strips").orderBy("createdAt", "desc").limit(300).onSnapshot((snap) => {
      onItems(snap.docs.map((doc) => {
        const v = doc.data();
        const at = v.createdAt?.toDate ? v.createdAt.toDate() : new Date();
        return { id: doc.id, receiptId: v.receiptId || null, createdAt: at.toISOString(), url: v.thumb, online: true };
      }));
    }, onError);
  }

  const cache = new Map();
  async function full(id) {
    if (cache.has(id)) return cache.get(id);
    const snap = await init().collection("stripImages").doc(id).get();
    const img = snap.exists ? snap.data().image : null;
    if (img) cache.set(id, img);
    return img;
  }

  async function remove(id) {
    const d = init();
    await Promise.all([d.collection("strips").doc(id).delete(), d.collection("stripImages").doc(id).delete()]);
    cache.delete(id);
  }

  window.SSOnline = { enabled, upload, listen, full, remove };
})();
