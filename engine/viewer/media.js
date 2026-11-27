import { BOOK, BOOK_DIR, loadVideo } from "../book.js";

const PAGE_W = 595.32;
/** Half the play button: it straddles the panel's top-right corner. */
const HALF = 12;
/** Clearance between the button and the page edge. */
const EDGE = 4;

/**
 * Animations (book.json "media") laid over the printed summary panels they
 * replace. The poster is the last frame, so a panel that is never played still
 * reads like the printed one.
 *
 * Each panel carries its own controls: the play/pause/replay button on the top
 * right, and a scrubber along an edge of the panel. `item.scrub` places it in
 * page points — `{ left, width, bottom, height }`, or `{ right }` instead of
 * `width` — because only the book knows which corner its clip keeps empty; the
 * default is a full-width bar along the bottom. The scrubber is the one part of
 * a panel that takes pointer events, so the pen still draws everywhere else.
 */
export function addMedia(pageNo, overlay) {
  for (const [n, item] of (BOOK.media || []).entries()) {
    if (item.page !== pageNo) continue;
    const [x0, y0, x1, y1] = item.region;
    const box = document.createElement("div");
    box.className = "media";
    Object.assign(box.style, { left: `${x0}px`, top: `${y0}px`, width: `${x1 - x0}px`, height: `${y1 - y0}px` });
    const video = document.createElement("video");
    // Versioned with the rest of the book's data, so a release replaces the clip
    // itself and not only the words around it (sw.js keeps an unversioned copy
    // for the offline case). A failed versioned url is retried once without it.
    Object.assign(video, { muted: true, playsInline: true, preload: "metadata" });
    video.setAttribute("playsinline", "");
    video.setAttribute("muted", "");
    loadVideo(video, BOOK_DIR + item.src, BOOK_DIR + item.poster);
    const button = document.createElement("button");
    button.type = "button";
    button.className = "media-play";
    button.dataset.media = String(n);
    // item.ctrl = [dx, dy] (pt) nudges the button off the panel's top-right corner, for a panel whose
    // printed frame line runs through that corner; +dx moves it right, +dy moves it down. Omitted = 0.
    const [dx, dy] = item.ctrl || [0, 0];
    button.style.right = `${-Math.min(HALF, PAGE_W - EDGE - x1) - dx}px`;
    button.style.top = `${-Math.min(HALF, y0 - EDGE) + dy}px`;
    const title = item.title || "Play the animation";
    const label = (text, what) => {
      button.textContent = text;
      button.title = what;
      button.setAttribute("aria-label", what);
    };
    label("▶", title);
    video.addEventListener("play", () => { box.classList.add("playing"); label("❚❚", "Pause the animation"); });
    video.addEventListener("pause", () => {
      box.classList.remove("playing");
      label(video.ended ? "↻" : "▶", video.ended ? "Replay the animation" : "Resume the animation");
    });
    box.append(video, button);

    /* ---------- the scrubber ---------- */
    const scr = item.scrub || {};
    const bar = document.createElement("input");
    bar.type = "range";
    bar.className = "media-scrub";
    bar.min = "0";
    bar.max = "1000";
    bar.step = "1";
    bar.value = "0";
    bar.style.height = `${scr.height ?? 14}px`;
    if (scr.top != null) bar.style.top = `${scr.top}px`;
    else bar.style.bottom = `${scr.bottom ?? 3}px`;
    bar.style.left = `${scr.left ?? 8}px`;
    if (scr.width != null) bar.style.width = `${scr.width}px`;
    else bar.style.right = `${scr.right ?? 8}px`;
    bar.title = "Drag to seek within the animation";
    bar.setAttribute("aria-label", "Position in the animation");
    const syncBar = () => {
      if (video.duration) bar.value = String(Math.round((video.currentTime / video.duration) * 1000));
    };
    let raf = 0;
    const tick = () => {
      syncBar();
      raf = video.paused || video.ended ? 0 : requestAnimationFrame(tick);
    };
    video.addEventListener("play", () => { if (!raf) raf = requestAnimationFrame(tick); });
    video.addEventListener("pause", () => { if (raf) cancelAnimationFrame(raf); raf = 0; syncBar(); });
    video.addEventListener("timeupdate", syncBar);
    video.addEventListener("seeked", syncBar);
    video.addEventListener("loadedmetadata", syncBar);
    bar.addEventListener("input", () => {
      if (!video.duration) return;
      video.currentTime = (Number(bar.value) / 1000) * video.duration;
    });
    /* A range input takes the pen's pointer events too (ink.js ignores input),
       so a stroke that starts on the bar seeks and one that starts beside it
       still draws. touch-action: none keeps the page from panning.
       The bar is the panel's LAST child and carries a z-index above the video
       (styles.css): painted after the video and out of its compositing layer, so
       a clip that plays cannot cover it. Keep the order and the z-index. */
    box.append(bar);
    overlay.append(box);
  }
}

export function toggleMedia(button) {
  const video = button.closest(".media").querySelector("video");
  if (!video.paused && !video.ended) {
    video.pause();
    return;
  }
  if (video.ended) video.currentTime = 0;
  video.play().catch(() => {});
}
