/* Shared brand bits: wordmark, mascot images, and the "&" for canvas drawing. */
(function () {
  // "SCOOPS & SPOKES" with the O's drawn as stacked wheels, like the shop's logo.
  const WORDMARK = 'SC<i class="oo"></i>PS <i class="amp-i"></i> SP<i class="oo"></i>KES';

  // Same strokes as assets/amp-mark.svg, so the photo strip can draw the "&" itself.
  const AMP_PATHS = [
    "M266 128 A52 52 0 1 1 162 128 A52 52 0 1 1 266 128 Z",
    "M196 176 C148 206 126 256 136 306 C146 362 196 390 242 388 C286 386 308 352 302 300",
    "M204 298 H276", "M224 298 V332", "M262 314 L342 234"
  ];

  function drawAmp(ctx, cx, cy, size, color) {
    const s = size / 362;
    ctx.save();
    ctx.translate(cx - 229 * s, cy - 233 * s);
    ctx.scale(s, s);
    ctx.strokeStyle = color;
    ctx.lineWidth = 46;
    AMP_PATHS.forEach((d) => ctx.stroke(new Path2D(d)));
    ctx.restore();
  }

  function apply() {
    const src = window.SS_CONFIG.mascotSrc;
    document.querySelectorAll("[data-mascot]").forEach((img) => (img.src = src));
    document.querySelectorAll("[data-wm]").forEach((el) => {
      el.innerHTML = WORDMARK;
      el.setAttribute("aria-label", "Scoops & Spokes");
    });
  }

  window.SSBrand = { WORDMARK, drawAmp, apply };
  apply();
})();
