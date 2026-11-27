// Bump on every release so iPads drop the old copy (docs/04-qa-and-release.md).
// This is also the version every book data url carries: engine/book.js reads it
// back out of this file, so a release cannot be answered by an older cache.
const CACHE = "ebooks-v73";

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      /* allSettled, not all: a delete can reject (it races a read in a page that
         is still loading, or hits a quota error), and one rejected delete would
         cancel the rest and reject activate, leaving this worker's housekeeping
         half done. Claiming clients comes after the deletes so a page that is
         already open is served by this release, not by the one being removed. */
      await Promise.allSettled(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
      await self.clients.claim();
    })()
  );
});

const STATIC = /\/(assets|vendor|pages)\//;
const MEDIA = /\/media\/[^/]+\.mp4$/;
/** The page reads CACHE out of this file; a cached copy would name the wrong
    release, so a request for it is always answered by the network. */
const VERSION_FILE = /\/sw\.js$/;
/**
 * Engine code (HTML, JS, CSS, JSON) is NOT url-versioned: an ES module graph has
 * too many imports to tag each one, so `engine/media.js` and `styles.css` kept
 * being served from the HTTP cache long after a release and the teacher saw a
 * play button with no scrubber (2026-11-27). `no-store` makes every online load
 * ask the network; the worker's cache is what answers a load that is offline.
 */
const FRESH = { cache: "no-store" };

/**
 * A url without its `?v=<release>` query, or null when it has none. engine/book.js
 * versions the book's data urls, but it cannot read this file while it is offline,
 * so it then asks for the unversioned url: every stored response is kept under
 * both keys, so the offline copy is always the latest release rather than the
 * one that happened to be cached first.
 */
function unversion(url) {
  const u = new URL(url);
  if (!u.searchParams.has("v")) return null;
  u.searchParams.delete("v");
  return u.href;
}

/** Clones must be taken before the response is handed to the page; this only files them. */
function keep(cache, request, own, plain, twin) {
  const jobs = [cache.put(request, own)];
  if (twin) jobs.push(cache.put(plain, twin));
  return Promise.all(jobs);
}

/* Safari asks for video in byte ranges, which the cache cannot store, so the whole file is cached and sliced. */
async function media(request) {
  const cache = await caches.open(CACHE);
  let whole = await cache.match(request.url);
  if (!whole) {
    const response = await fetch(request.url);
    if (response.status !== 200) return response;
    whole = response;
    const own = response.clone();
    const plain = unversion(request.url);
    const twin = plain ? response.clone() : null;
    await keep(cache, request.url, own, plain, twin);
  }
  const range = /bytes=(\d*)-(\d*)/.exec(request.headers.get("range") || "");
  if (!range) return whole;
  const body = await whole.arrayBuffer();
  const start = Number(range[1] || 0);
  const end = range[2] ? Math.min(Number(range[2]), body.byteLength - 1) : body.byteLength - 1;
  return new Response(body.slice(start, end + 1), {
    status: 206,
    headers: {
      "Content-Type": whole.headers.get("Content-Type") || "video/mp4",
      "Content-Range": `bytes ${start}-${end}/${body.byteLength}`,
      "Content-Length": String(end - start + 1),
      "Accept-Ranges": "bytes",
    },
  });
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const { pathname } = new URL(request.url);
  if (MEDIA.test(pathname)) {
    event.respondWith(media(request));
    return;
  }
  if (VERSION_FILE.test(pathname)) {
    // Never stored: the page asks for it with a `stamp` query to read this release,
    // and the answer has to be the release that is live now. Offline it rejects
    // and engine/book.js falls back to the unversioned urls.
    event.respondWith(fetch(request, FRESH));
    return;
  }
  const store = (response) => {
    if (response && response.ok) {
      // The clones must be taken now: the page starts reading the body as soon as
      // this returns, and a clone of a body that is being read throws.
      const own = response.clone();
      const plain = unversion(request.url);
      const twin = plain ? response.clone() : null;
      caches.open(CACHE).then((cache) => keep(cache, request, own, plain, twin));
    }
    return response;
  };
  /* Only THIS release's cache is consulted. `caches.match()` walks every cache on
     the origin, so a delete of an older cache in activate could make a lookup
     throw and the page lose the image; this lookup cannot see the caches that are
     being deleted, and the plain key keep() stores is in here too. */
  const own = () => caches.open(CACHE).then((cache) => cache.match(request));
  if (STATIC.test(pathname)) {
    event.respondWith(own().then((hit) => hit || fetch(request, FRESH).then(store)));
    return;
  }
  /* Everything else — the HTML, the engine's modules and styles, the book's JSON
     — is network first and never answered by the HTTP cache (FRESH); the worker's
     own copy is only for the offline load. */
  event.respondWith(fetch(request, FRESH).then(store).catch(own));
});
