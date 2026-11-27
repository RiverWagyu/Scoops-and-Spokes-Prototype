/* Saves every photo-booth strip in this browser (IndexedDB), so the
   gallery page can show them later. Nothing leaves the device. */
(function () {
  const DB = "ss-gallery", STORE = "strips";
  let dbp = null;

  function db() {
    if (!dbp) {
      dbp = new Promise((resolve, reject) => {
        const req = indexedDB.open(DB, 1);
        req.onupgradeneeded = () => req.result.createObjectStore(STORE, { keyPath: "id" });
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      });
      // ask the browser not to clear these when space runs low
      navigator.storage?.persist?.().catch(() => {});
    }
    return dbp;
  }

  async function run(mode, fn) {
    const d = await db();
    return new Promise((resolve, reject) => {
      const tx = d.transaction(STORE, mode);
      const out = fn(tx.objectStore(STORE));
      tx.oncomplete = () => resolve(out && "result" in out ? out.result : out);
      tx.onerror = () => reject(tx.error);
    });
  }

  async function add({ blob, receiptId = null }) {
    const id = "g" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    await run("readwrite", (s) => s.put({ id, blob, receiptId, createdAt: new Date().toISOString() }));
    return id;
  }

  async function update(id, patch) {
    const rec = await run("readonly", (s) => s.get(id));
    if (rec) await run("readwrite", (s) => s.put({ ...rec, ...patch }));
  }

  async function all() {
    const list = await run("readonly", (s) => s.getAll());
    return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt)); // newest first
  }

  const remove = (id) => run("readwrite", (s) => s.delete(id));
  const clear = () => run("readwrite", (s) => s.clear());

  window.SSGallery = { add, update, all, remove, clear };
})();
