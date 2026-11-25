# Maths Solution Ebooks

Interactive answer ebooks for the DSE maths worksheets — the same reader as
[physics-ebooks](https://tai-sura.github.io/physics-ebooks/).

- Library: <https://tai-sura.github.io/math-ebooks/>
- SM05 (A) More about Polynomials: <https://tai-sura.github.io/math-ebooks/reader.html?book=sm05a>

Every page of the worksheet is shown, and each answer is revealed one part at a
time with **Show answer**. Works offline once loaded (service worker caches the
pages, the fonts and KaTeX).

## Books

| id | worksheet |
| --- | --- |
| `sm05a` | SM05 (A) More about Polynomials (2026) |

## Adding another book

1. Author it with the `ebook-starter` toolkit, then copy `books/<id>/`
   (`book.json`, `layout.json`, `solutions.js`, `widgets.js`, `pages/`, `media/`)
   into `books/`.
2. Add the id to `books/catalog.json`.
3. Bump `CACHE` in `sw.js`, commit, push.

## Files

```
index.html              library of books
reader.html             the reader (?book=<id>)
engine/                 viewer, answer layout, ink, export
vendor/                 KaTeX, perfect-freehand, pdf-lib (offline copies)
books/catalog.json      which books exist
books/<id>/             one book: pages, layout, solutions
sw.js                   offline cache
```

No build step, no server, no external dependencies — GitHub Pages serves it as-is.
