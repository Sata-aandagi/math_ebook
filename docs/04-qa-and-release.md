# QA and release

## 1. Preview locally

The reader loads its files as modules and JSON, so it must be served over HTTP; double-clicking `index.html` does not work.

```powershell
cd "<project folder>"
python -m http.server 8090
```

- This computer: <http://127.0.0.1:8090/>, then pick the book (or go straight to `reader.html?book=<id>`).
- iPad on the same Wi-Fi: start with `python -m http.server 8090 --bind 0.0.0.0`, then open `http://<this PC's IPv4 from ipconfig>:8090/`. Allow Python through Windows Firewall on private networks. Offline install needs https, so test that on the live site.

## 2. Automatic checks

```powershell
cd tools/qa
npm install                      # first time only
node check_book.mjs <id>         # checks only
node check_book.mjs <id> --shots # checks + screenshots in books/<id>/reference/qa/
```

The script serves the site itself, and opens the book in Chrome emulating an iPad: 1180 × 820, touch, Retina, with Pencil input sent as pen events. It reports:

| Result | Meaning | Fix |
| --- | --- | --- |
| FAIL no anchor found | A question in `book.json` is missing from `layout.json`. | Fix `extract.anchors` or `fixedAnchors`, then re-run `extract_pages.py`. |
| FAIL no entry in solutions.js | A question has no solution. | Add it, or remove it from `book.json`. |
| FAIL phrase not found | A link's `q` phrase doesn't match the printed words. | Copy the words exactly as printed; a phrase may wrap across lines. |
| FAIL no marked answer part | A link has nothing to point to. | Add `L()`, `lk()` or `[[key|…]]`. |
| FAIL underline does not sit under all of … | An answer underline is shorter than, or cuts through, the maths it marks (fractions, powers, roots). | A measuring bug in `inkRects()` in `engine/viewer/links.js`; the book content is fine. |
| FAIL graphic threw / drew nothing | A widget crashed. | Fix it in `widgets.js`. |
| FAIL page error / HTTP 404 | Broken code or a missing file. | Read the message. |
| FAIL Pencil stroke / finger tap | An input regression in the engine. | See [05-engine-notes.md](05-engine-notes.md). |
| WARN answer scrolls inside its region | The answer is taller than its region at the book's type size. | Acceptable for teaching; add `space` in `extract.overrides` when a short answer should show in full. |
| WARN shrunk to N % | The text was scaled down to fit. | Acceptable down to about 62 %. |

Exit code 0 means nothing blocks a release.

For a book with scenario boards (`"infographics": true`):

```powershell
node check_boards.mjs <id> [q1 q5 ...]
```

It draws every board with all its steps showing and reports handwriting that overlaps other handwriting, is crossed by a table rule, or runs off the board. Open the screenshots in `books/<id>/reference/boards/`: rings and braces must not cut through numbers, and labels must not sit on bar edges.

### 2.1 Release check (versioned data urls)

```powershell
cd tools/qa
node release_probe.mjs
```

Run this after any change to `sw.js` or to the way a book's data files are loaded. One
browser profile, three origins: 8090 and 8092 (started here when the port is free, reused
when something already answers there) and 8093, whose server can also hand out a
deliberately **stuck, cache-first service worker** whose cache already holds an old
`solutions.js` under the plain url. It checks that:

- the previous release (old `solutions.js` on the plain url, release tag unreachable) really
  does show the typed answer — `.qa` 1 — so the symptom is reproducible;
- the same profile, reloaded with the tag readable, comes back clean (`.qa` 0, `.abox` 0,
  one `.media`, one scrubber) and its data urls carry `?v=ebooks-vNN`;
- a stuck cache-first worker answers the plain url with the old file but the versioned url
  misses its cache and reaches the network, so the reader under it is clean;
- the worker stores both the versioned and the plain copy of every data file and of the
  clip (the plain one is what the offline fallback asks for), and the app's worker replaces
  the stuck one;
- with the server **closed**, the book still opens, page 2 still shows the panel and the
  clip, and the clip still plays from the cache.

### 2.2 Solution-guide clips

```powershell
node tools/qa/guide_audit.mjs <id> <q>   # the stage, before rendering
node tools/qa/guide_check.mjs <id> <q>   # the encoded clip, in the reader
```

`guide_audit` opens the stage in Chrome and reads what it would draw: the arithmetic of every move
against the row it reveals, every beat's highlighted terms, the callout rectangles in page points, the
**area they cover of their own step (must be 0 px²)** and of everything else (reported), the **gap from
a box's top to its step's ink (must be ≥ 8 pt)**, the leaders (none), whether an arrow appears on a beat
that is not BRING DOWN, whether a box leaves the frame or had to be clamped, and each beat's duration
(**3.0 ± 0.15 s**). Its output is the report to paste into `docs/chapters/<id>.md`.

`guide_check` opens the reader and checks the delivery: one panel exactly on the region, no typed
answer behind it (`.qa` / `.abox` / `.ln` all 0), no page text under the panel, the panel top below
the printed questions, play/pause/replay, aspect, ink above the panel and surviving a reload, and the
**scrubber**: it must be the panel's last child, paint above the video, and the check clips its pixels
out of the rendered page and demands the track and the orange thumb colours — the same clip with the
bar hidden is the control, so a merely present-but-invisible bar fails. It writes
`books/<id>/reference/guides/<id>-<q>-scrub-clip.png`.

`release_probe` also proves the **release-moment fallback** (see §2.1 and
[05-engine-notes.md](05-engine-notes.md)): it refuses every `?v=` data url once with a 500 and demands
that all 15 page images still appear from the plain urls, that the fallback is logged rather than
thrown, and — with one page image refused on both urls — that the sheet shows "page image failed —
reload" instead of staying blank.

It also poisons the worker's cache with an old `engine/viewer/media.js` and `engine/styles.css` and
reloads: the network copies must win (a `.media-scrub` exists and computes `z-index: 5`), which is
what the `no-store` fetch on the engine's requests guarantees, and it reads the `#build` tag
(`v73`) the reader prints beside the page number.

## 3. Visual pass (screenshots)

Open every `sheet-*.png` and `graphic-*.png` in `books/<id>/reference/qa/` and check:

- [ ] every answer box sits inside its blank space with a margin, and covers no printed text;
- [ ] the controls don't overlap the boxes, the next question or the page edge;
- [ ] the maths renders properly: no raw LaTeX and no red KaTeX errors;
- [ ] review link boxes sit on their words, and the tags stay inside the page;
- [ ] graphics have no overlapping labels, and the question card matches the solution;
- [ ] a long answer scrolls inside its region with a visible bar; wheel and drag move the answer before the page.

## 4. iPad checklist (real device, Apple Pencil)

Run this on the live link after release, or on the local Wi-Fi preview.

- [ ] The library shows the book; tapping the card opens it; the top-left brand returns to the library.
- [ ] Pencil writing starts instantly, with no delay between strokes; a resting palm neither scrolls nor makes marks.
- [ ] One finger scrolls and two fingers pinch-zoom, in every tool.
- [ ] A tap in a box reveals one step; ▸ » ◂ ↺ work; Show all and Hide all work.
- [ ] Dashed review links open and close on tap (finger, or Pencil in Read mode).
- [ ] Every graphic opens, and its slider and buttons respond.
- [ ] Holding still at the end of a stroke snaps it to a line, circle, rectangle or triangle.
- [ ] Tapping ink opens the edit menu (colour, size, Shape, Copy, Delete, move, resize).
- [ ] A two-finger tap undoes and a three-finger tap redoes.
- [ ] Present mode works: swipe between pages, and only the Exit button leaves. On iPad it does not use Safari full screen (no "Swipe down to exit"), so a zoomed page scrolls up and down with one finger; desktop browsers go full screen, and Esc there only drops full screen. After a two-finger pinch, one-finger drags pan without leaving the zoom; a double tap returns to the whole page.
- [ ] Export PDF opens the share sheet.
- [ ] Rotate the iPad, then close and reopen the app: the ink is still there.

## 5. Release

1. Set `"status": "live"` in `books/<id>/book.json`, and make sure the id is in `books/catalog.json`.
2. Bump `CACHE` in `sw.js` (`ebooks-v5` → `ebooks-v6`). This is the one release number:
   `engine/book.js` reads it back out of `sw.js` and fetches `book.json`, `layout.json`,
   `solutions.js`, `widgets.js`, the clips and the page images as `…?v=ebooks-v6` (and the
   deck / infographic modules the same way). A service worker only answers urls it has
   stored, so the new query is a cache miss even for an old, stuck worker, and the release
   reaches an iPad that never updated its worker — without the reader clearing site data.
   Bumping the number is therefore not optional: it is what replaces the files. (Offline the
   tag cannot be read, the urls go unversioned, and the worker's unversioned copies are
   served.) Run `node tools/qa/release_probe.mjs` after the bump.
3. Commit and push:
   ```powershell
   git add -A
   git commit -m "Add <code> <title>"
   git push
   ```
4. Wait about a minute, then confirm the build and the live files:
   ```powershell
   gh api repos/<org>/<repo>/pages/builds/latest --jq .status
   ```
   Open `https://<org>.github.io/<repo>/books/<id>/book.json` to confirm that it's live.
5. On the iPad, close and reopen the app (or the tab) once, so it loads the new version.

**What is public.** The GitHub repo and Pages site are public. `.gitignore` keeps out the PDFs (`*.pdf`, `books/*/source/`) and the reference crops and screenshots (`books/*/reference/`). The page images, solutions and graphics are published.

### 5.1 Publishing from a machine without git

The machine that built `sm05a` had no `git` and no `gh`, so the release went out through
the REST API instead. Use this when git is not installed; the result is the same repo
content and the same Pages site.

1. Copy a clean bundle: `index.html`, `reader.html`, `sw.js`, `manifest.webmanifest`,
   `.nojekyll`, `assets/`, `engine/`, `vendor/`, `books/catalog.json`, `books/<id>/`
   (`book.json`, `layout.json`, `solutions.js`, `widgets.js`, `pages/`, `media/`).
   Leave out `*.pdf`, `books/*/source/`, `books/*/reference/`, `tools/`, `docs/`.
   Serving that folder at `/repo/` locally (any static server) is the preview.
2. Push with the Git Data API: `POST /repos/{o}/{r}/git/blobs` (base64) for every file,
   `POST /git/trees`, `POST /git/commits` with `parents`, then `PATCH /git/refs/heads/main`.
   A brand-new empty repo answers **409 "Git Repository is empty"** to the first blob:
   make one bootstrap commit first (`PUT /contents/.bootstrap`), then the tree replaces it.
3. Enable Pages: `POST /repos/{o}/{r}/pages` with
   `{"source":{"branch":"main","path":"/"},"build_type":"legacy"}`.
4. Poll `GET /repos/{o}/{r}/pages/builds/latest` until `status` is `built` (about 40 s).
5. Confirm the live files with curl (reader, `book.json`, `layout.json`, `solutions.js`,
   a page image, `vendor/katex/katex.min.js` all 200), then open the real URL in Chrome:
   `node tools\qa\live_check.mjs https://<owner>.github.io/<repo>/reader.html?book=<id> out.png <q>`
   prints the question count, page count, KaTeX errors and console errors, and takes a screenshot.

The token (classic `repo` scope is enough; a fine-grained token needs Contents + Pages
read/write) arrives as `$env:DSH_SECRET_GITHUB_TOKEN` and is deleted from
<https://github.com/settings/tokens> once the release is confirmed. The URL is
`https://<owner>.github.io/<repo>/reader.html?book=<id>`; if the repo name contains `_`,
`.nojekyll` in the bundle is what keeps Pages from trying to process the folder.

## 6. Rolling back

- **One bad release:** `git revert <commit>`, then `git push`. Ink saved on iPads is untouched, because it lives in the browser, not in the repo.
- **An aesthetic experiment:** restore from the backup folder made before the change (e.g. `… (backup before review links)`), or `git checkout <commit> -- <files>`.
- **Never** change a live book's `id` or `storage`. The saved ink is keyed by `storage`.
