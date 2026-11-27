/**
 * The book being read, chosen by reader.html?book=<id>. Everything that is
 * specific to one chapter lives in books/<id>/: book.json, layout.json,
 * solutions.js, widgets.js and pages/.
 */

export const BOOK_ID = new URLSearchParams(location.search).get("book") || "";

if (!/^[a-z0-9][a-z0-9-]*$/.test(BOOK_ID)) {
  location.replace("./");
  throw new Error("No book chosen");
}

/** Book folder relative to reader.html (for fetch, img and CSS urls). */
export const BOOK_DIR = `books/${BOOK_ID}/`;
const moduleDir = new URL(`../books/${BOOK_ID}/`, import.meta.url);
const SW_URL = new URL("../sw.js", import.meta.url);

/** The release tag in sw.js's CACHE, e.g. "ebooks-v68"; "" when it cannot be read. */
async function releaseTag() {
  const read = (async () => {
    try {
      /* A unique query keeps the HTTP cache from answering with the tag of a
         previous release, and `no-store` keeps this reply out of it. A page's
         fetch of sw.js would be routed through the registered worker, so sw.js
         answers this one itself and never caches it. Offline the fetch rejects
         and the book falls back to the unversioned urls, which are exactly what
         the worker has cached. */
      const res = await fetch(`${SW_URL}?stamp=${Date.now()}`, { cache: "no-store" });
      if (!res.ok) return "";
      const found = /CACHE\s*=\s*"([^"]+)"/.exec(await res.text());
      return found ? found[1] : "";
    } catch {
      return "";
    }
  })();
  // A stalled check must never hold the book shut; the timeout takes the same
  // unversioned fallback as being offline.
  const slow = new Promise((resolve) => setTimeout(() => resolve(""), 2500));
  return Promise.race([read, slow]);
}

/**
 * Every book data file is fetched with `?v=<release>` (book.json, layout.json,
 * solutions.js, widgets.js, media). A service worker's cache is keyed by url and
 * only answers a url it has stored, so a url it has never seen misses and has to
 * go to the network: a new release therefore reaches the reader even through an
 * old cache-first worker whose own script is stale, which is the only way to
 * recover an iPad without asking the reader to clear the site data.
 */
export const DATA_VERSION = await releaseTag();

/** `…/book.json` → `…/book.json?v=ebooks-v68`, or the url itself when offline. */
export const versioned = (url) => (DATA_VERSION ? `${url}${url.includes("?") ? "&" : "?"}v=${encodeURIComponent(DATA_VERSION)}` : url);

/**
 * A versioned load that fails falls back ONCE to the same url without `?v=`, and
 * says so in the console. This is the release-moment insurance: a service
 * worker's `activate` deletes the old cache while a page may still be loading,
 * and a request that loses that race is answered with an error that an `<img>`
 * never retries — the reader showed a blank sheet with only the toolbar. A cache
 * hit or a 200 is never affected; the retry only runs when the versioned url
 * genuinely failed, and it is a normal request that the worker can answer.
 */
export async function fetchWithFallback(path) {
  const url = versioned(path);
  if (url === path) return fetch(path);
  try {
    const res = await fetch(url);
    if (res.ok) return res;
    console.info(`[book] ${url} answered ${res.status}; retrying without ?v=`);
  } catch (error) {
    console.info(`[book] ${url} threw ${error && error.message}; retrying without ?v=`);
  }
  return fetch(path);
}

/** A dynamic import (solutions.js, widgets.js, a deck) with the same fallback. */
export async function importWithFallback(url) {
  const target = versioned(url);
  if (target === url) return import(url);
  try {
    return await import(target);
  } catch (error) {
    console.info(`[book] ${target} failed to load (${error && error.message}); retrying without ?v=`);
    return import(url);
  }
}

/**
 * An `<img>`: the versioned url, then the plain one once, then `onFail` — which is
 * where a caller shows a visible message. `src` is set here, not by the caller.
 */
export function loadImage(img, path, onFail) {
  const url = versioned(path);
  let fellBack = url === path;
  img.addEventListener("error", () => {
    if (!fellBack) {
      fellBack = true;
      console.info(`[book] ${url} failed; retrying ${path}`);
      img.src = path;
      return;
    }
    console.info(`[book] ${path} failed for good`);
    img.dataset.failed = "1";
    if (onFail) onFail(img);
  });
  img.src = url;
  return img;
}

/** Per-element state for loadVideo, which may be pointed at another clip later. */
const videos = new WeakMap();

/** A `<video>` and its poster: same one-shot fallback, one error listener ever. */
export function loadVideo(video, path, poster, onFail) {
  const state = videos.get(video) || { tries: 0 };
  if (!videos.has(video)) {
    videos.set(video, state);
    video.addEventListener("error", () => {
      if (state.tries === 0) {
        state.tries = 1;
        console.info(`[book] ${state.url} failed; retrying ${state.path}`);
        if (state.poster) video.poster = state.poster;
        video.src = state.path;
        return;
      }
      console.info(`[book] ${state.path} failed for good`);
      if (state.onFail) state.onFail(video);
    });
  }
  Object.assign(state, { tries: 0, path, url: versioned(path), poster: poster ? versioned(poster) : "", onFail });
  video.poster = state.poster;
  video.src = state.url;
  return video;
}

const res = await fetchWithFallback(`${BOOK_DIR}book.json`);
if (!res.ok) {
  location.replace("./");
  throw new Error(`Unknown book ${BOOK_ID}`);
}
export const BOOK = await res.json();

/** Prefix for saved ink and UI state; never change it once a book is in use. */
export const STORAGE = BOOK.storage || BOOK_ID;

/** Full display name, e.g. "S3 JM26 (B) Inequalities I". */
export const BOOK_NAME = [BOOK.form, BOOK.code, BOOK.title].filter(Boolean).join(" ");

const { SOLUTIONS } = await importWithFallback(new URL("solutions.js", moduleDir).href);
export const SOLUTION_BY_ID = Object.fromEntries(SOLUTIONS.map((s) => [s.id, s]));

const widgets = BOOK.widgets === false ? {} : await importWithFallback(new URL("widgets.js", moduleDir).href);

export function hasGraphic(id) {
  return Boolean(widgets.hasGraphic?.(id));
}

export function mountGraphic(id, root) {
  root.replaceChildren();
  widgets.mountGraphic?.(id, root);
}

/** Solution-guide videos (book.json "guides"), keyed by question id. */
export const GUIDE_BY_ID = Object.fromEntries((BOOK.guides || []).map((g) => [g.q, g]));

export function hasGuide(id) {
  return Boolean(GUIDE_BY_ID[id]);
}

/** The page image's plain path; loadImage adds the release (and cuts it again on failure). */
export function pageImage(n) {
  return `${BOOK_DIR}pages/p${String(n).padStart(2, "0")}.jpg`;
}
