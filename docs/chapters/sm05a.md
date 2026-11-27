# SM05 (A) More about Polynomials (`sm05a`)

| | |
| --- | --- |
| Form | S5 |
| Book id / storage | `sm05a` (never rename) |
| Source | `books/sm05a/source/` — QUE 15 pages, ANS 14 pages, offset −1 |
| Status | live (local) |
| Live | `reader.html?book=sm05a` |

## Source facts

- Page structure: p1 cover; **Section 1 Long Division** p2 (summary + Practice 1), p3–p4 (Q1–Q6, Challenge Zone Q7); **Section 2 Division Algorithm** p5 (summary + Example 2, printed), p6–p8 (Practice 2, Practice 3, Q8–Q16); **Section 3 Remainder Theorem** p9 (summary), p10 (Practice 3a, 3b), p11–p14 (Q17–Q29); p15 Challenge Zone Q30.
- Answers in the ANS are printed in a red frame, laid out as a long-division grid or an aligned `=` chain; final answers underlined. Example 2 is a printed worked example (no red frame).
- MC answers from the ANS: P3b **B**, Q24 **D**, Q25 **D**, Q26 **D**, Q27 **D**, Q28 **C**, Q29 **B**, Q30 **D**. The printed answer squares sit at the right margin on QUE p10, p13, p14, p15.

## Question map

| Section | Questions | Pages | Notes |
| --- | --- | --- | --- |
| Long Division | Practice 1, Q1–Q6 | 2–4 | Divisions written as a KaTeX `array` grid, sentence beside it, as the key does |
| Division Algorithm | Example 2, Practice 2, Practice 3, Q8–Q16 | 5–8 | Example 2 is printed → `printed: true`; Q12 has parts (a) and (b) |
| Remainder Theorem | Practice 3a, 3b, Q17–Q20, Q22–Q29 | 10–14 | Q17 = 5 boxes, Q18 = 3 boxes; MC working placed right of the options |
| Challenge | Q7, Q30 | 4, 15 | Q30 keeps the key's handwritten order (put x = 0, then x = −1) |

## Special cases

- `extract.footer: 786` — the printed page number sits at y ≈ 791; the starter default (822) put regions over it.
- MC overrides: region moved to `x0 = 140` (right of the options) and `square` set to the printed answer box on QUE p10 (P3b), p13 (Q24–Q26) and p14 (Q27–Q29), p15 (Q30); `letter` filled from the ANS.
- `space` opened under long answers so they show whole instead of scrolling: p1, q1, q2, q4, q5, q6, q7, q9, q10, q11, q12, q13, q14, q15, q16, q17, q18, q20, q22, q23, q27, q28, q29, p2, p3, p3b. Every cut falls at the region's own bottom edge, above the footer.
- Question 21 does not exist in the worksheet; numbering follows the paper.

## Long division (`DIV()` / `divLines()` in `solutions.js`)

> The generalised rules now live in [03-authoring-style.md](../03-authoring-style.md) §9 (Long
> division and aligned equation blocks). This section stays as the record of how they were found.

- One array, one cell per line of the sum, so every line shares the same power
  slots: a term sits under the same power, a sign under the same sign, and a
  bare `x` is padded so it lines up with the `x` of a wider coefficient.
- The divisor and its bracket (`\Big)`) stand **in the dividend's own line**, so
  they share its baseline.
- The rule is a zero-width `\mathrlap` overline, lifted by a `\rule{0pt}{1.18em}`
  strut to the bracket's tip, drawn `0.54 em` to the left of the cursor that
  follows the bracket (`ruleOver()`): the `\mkern` pair sits **outside** the
  rlap, because a negative kern inside one moves the dividend's line itself.
  The overline pads its own right end by 3mu, the same as the `\,` after the
  bracket, so widening by 0.54 em alone ends the rule level with the bars.
- Every bar is `\underline{...}` of that line, padded out to the grid's right
  edge, minus one thin space (KaTeX pads an underline by 0.2 em); a line whose
  first sign comes after the first slot opens the underline with `{}` so the
  sign keeps binary spacing and the line does not shift left.
- A sum whose leading term is negative carries a phantom `-` in the other
  lines' slot-0 filler, so digits still line up, and its own `-` opens with `{}`
  (the rule's rlap is an ord atom, so a bare `-` after it would take binary
  space in the dividend's line only).
- Q7 has no numeric coefficients, so its grid is written out by hand
  (`Q7DIV`): the three working lines start under the dividend's `+kx`
  (`\hphantom{x^{3}-kx^{2}+{}}`), and the widest of them
  (`x^{3}-kx^{2}+kx-k^{2}`) sets the rule's width and every bar's right end.

## Equation blocks

- `eqBlock(rows)` — equals in one column (`\begin{array}{rl}`, `&{}=`).
- `eqSym(rows)` — the same with a ∵/∴ at the left margin, as the key's P3b/Q29.
- `eqOr(rows)` — adds the `or` branch, its own equals column, as P3a/Q19/Q20.
- P3b and Q29 use four/five separate blocks, each with its own `=` column,
  exactly as the key sets them.
- Practice 3 and Q16 compare coefficients in two `eqBlock`s (`0 = 10m-10` /
  `m = 1`, `-11 = n-80` / `n = 69`), so each pair's `=` sits in one column; the
  key's red and green circles mark exactly those two pairs.
- `eqParts(width, groups)` sets one block as the run of parts the reader reveals
  one step at a time: one group per step, a group being a list of rows and
  optionally a line of prose. `width` is the block's widest left-hand side; every
  row is padded to it with `\smash{\hphantom{…}}` and its own wording laid over
  that with `\mathllap`, so each part keeps the equals column of the whole block.
  `&{}\mathrel{=}` rather than `&{}=` keeps a bare `=` at brace depth 0 out of the
  reader's `=`-breaking fallback, which would otherwise cut the array.
- The parts, as the key's marks have them: Practice 3a, Q19 and Q20 in 5 (the
  prose joining the first equation), Q22 in 10, Q23 in 9, and Q24–Q28 in
  7/7/5/7/7. A part ends where the working changes tack: statement, substitution,
  simplification, factorising, solving.
- An MC answer's letter box (`.mcl`) appears with the last part, not as a part of
  its own — it is not a step.

## Graphics

None. `book.json` sets `"widgets": false` and `widgets.js` is the empty template, so
no question shows a graphic button at all (the old demo button came from the
template's registry and survived in browsers that had cached `widgets.js`).

## Review links

None. This chapter is algebra only: no word problem has a phrase that maps to one step, so per the style guide no links were added.

## Solution guide (Practice 1)

Practice 1's answer **is** the clip. There are no typed answer boxes for p1 (`printed: true`, and its
steps live in `export const P1_STEPS` rather than in `SOLUTIONS`, so no stale file can draw them), and
`book.json` puts `media/guide-p1.mp4` on p1's answer space on page 2 —
`[36.5, 516.5, 563.0, 785.2]`, 526.5 × 268.7 pt. The reader's controls are the panel's own round
button on the region's top-right corner and a **scrubber** in the white band below the working; the
panel takes no pointer events (a stroke across the scrubber seeks, anywhere else it inks), so the pen
draws on the video (the ink canvases sit above the overlay). No dialog, no film button in a strip.
The scrubber is an opaque pill (`rgba(255,255,255,.94)`, 1 px border, 4 px `rgba(17,17,17,.38)` track,
orange-ringed thumb), the panel's **last child**, painted above the video (video `z-index: 0`,
scrubber `5`, play button `6`) — a pale 3 px track had been invisible on the teacher's screen, so
`guide_check` now clips its pixels and demands the track and thumb colours.

| | |
| --- | --- |
| `books/sm05a/media/guide-p1.mp4` | 967 KB (989 980 B), H.264 high, yuv420p, **1600 × 816**, 30 fps, **2031 frames**, **67.70 s**, no audio |
| `books/sm05a/media/guide-p1.jpg` | 22 KB (22 899 B), 1600 × 816 — frame 0, the plain sum of part (a) at 1:1 |
| `books/sm05a/media/guide-p1.html` | the stage (≈45 KB); it imports p1's tex as `P1_STEPS` from `../solutions.js` |
| `book.json` | `"media": [{ "page": 2, "region": [36.5, 516.5, 563, 785.2], "src": "media/guide-p1.mp4", "poster": "media/guide-p1.jpg", "title": "Play the solution of Practice 1", "scrub": { "left": 386, "width": 120, "top": 247, "height": 14 } }]` — no `guides` entry |
| `layout.json` | p1's region is the same `[36.5, 516.5, 563, 785.2]`; its old `space` is gone (and from `extract.overrides`), so page 2 is the printed page |

**The region is the printed frame's interior, minus the question belt.** Measured in `pages/p02.jpg`
(3.00 px/pt): the frame's lines are x 35.8–563.5, y 477.7–786.8 pt, but the top 38 pt of that frame is
the two printed questions — `(a)` at 483.9–497.9, `(b)` at 501.9–515.9 (ink to 514.7). So the panel
starts **below the questions** (516.5) and stops just above the frame's bottom rule (785.2): 526.5 ×
268.7 pt, which is 1600 × 816 px (1.9594 vs 1.9608, a 0.07 % skew — under one displayed pixel). A panel
that took the whole frame instead would hide the questions the answer belongs to.

**Both parts side by side, at 1:1** (teacher, 2026-11-27: "final solution 用 100% 字級，唔准縮";
the 0.81 pull-back was rejected). (a) on the left and (b) on the right on **one top line**, each label
over its own division and each division followed by its own one-sentence conclusion — the answer
sheet's own arrangement. The type is the book's: `.abox` metrics (12.5 px serif, `line-height` 1.32,
KaTeX 1.04em) at 3.0389 px per page point, so 12.5 pt of type is 38 px of the 1600 px frame. The stage
**is** the frame — there is no camera and no pull-back; the last frame is the typed answer.

Measured at 12.5 px after `document.fonts.ready`: (a) **237.8 pt** wide, (b) **246.8**, a **24 pt**
gutter, margins **8.95 pt** each, **9 pt** from the frame's top to the labels. Heights: (a) **183.9**,
(b) **152.7** in 268.7 pt of region, so 85 pt of white is left below for the callouts. A stacked pair at
100 % could not fit: the two divisions need 240.0 pt and the two conclusions 33.2 — **273.2 pt with no
labels at all** — inside 268.7 pt. Side by side needs only the taller of the two.

Row-by-row against the reader's own typed box (the same tex in `engine/styles.css` `.abox` at `--k: 1`,
rendered at 12.5 px): every one of (a)'s 8 rows and (b)'s 6 rows sits within **0.00 pt** of the reader's
(the largest deviation is 0.00 pt, tolerance 1), and the block heights are identical to the reader's
content box (183.9 / 152.7 pt). The stage pads `.block` and `.concl` with the reader's `.ln` line box
(0.06em above, 0.5em below), so there is no staging leading to accuse.

**The device** (the teacher's): every operation lights **all** the terms it involves at the same
moment; SUBTRACT has no callout at all (the product row is bracketed in place with a red minus);
BRING DOWN takes the whole intact tail at once with downward arrows to its landing; and each part ends
with the answer's own conclusion, its quotient tied to the division's quotient row in **blue** and its
remainder to the last remainder in **green**. **Every beat holds 3 s** (3.0 ± 0.15 s), with its own
entry and exit animation inside the beat — the 3.4/3.6 s of the first cut were rejected as too slow,
and a 2 s cut as too quick to read.

**Where each callout goes** (teacher, 2026-11-27 — supersedes the side column and every leader): at the
**lower left of the step it belongs to**, its left edge on the left edge of the beat's leftmost
highlighted ink, its top **8 pt under the bottom of the beat's lowest row** (the rows it highlights and
the row it writes), so the box never comes within 8 pt of its own step (it was 4 pt; the teacher asked
for the gap). It may lie over anything else — a finished row, the other column, a conclusion, the
page's printed text — but never over the step itself, and the audit measures that overlap in px² and
demands zero. Every measured gap is **8.0–8.3 pt** (floor 8). **No leaders, no arrow heads:** the box
is the whole pointer. BRING DOWN keeps its two (one in (b)) downward arrows from the intact tail to
the landing terms; its box has no leader either.
One box had to be clamped: (b) BRING DOWN wanted its left edge on the `+5` at the far right, so it was
slid **46.7 pt** left to stay inside the frame (type untouched). No other beat needed clamping, and no
box leaves the frame.

**The zero coefficient** (teacher, 2026-11-27; a general rule, see
[03-authoring-style.md](../03-authoring-style.md) §10.2). (b)'s key writes the missing x as `0x`.
Two standalone remarks say so, each **3.0 s**, and during a remark nothing else on that part is lit:

- `b1` **"Give each missing power a 0 coefficient"** — lights **the divisor's `0x`** only.
- `b4` **"Add a 0 coefficient for missing power"** — lights **the product row's `0x²`** (of
  `−8x³ + 0x² − 12x`) **and the divisor's `0x`** it comes from. This is the pair to trim if the
  teacher meant only one of them. (The sentence used to carry a second clause; the teacher trimmed it
  to this one sentence on 2026-11-27.)

**The 19 moves.** `lights` is what is tinted together in one beat; `writes` is the row the move
produces. Every beat is 3.0 s.

| # | label | callout arithmetic | lights (same moment) | writes |
| --- | --- | --- | --- | --- |
| a1 | DIVIDE | 4x³ ÷ x = 4x² | 4x³ (dividend lead), x (divisor), 4x² | quotient 4x² |
| a2 | MULTIPLY | 4x²(x−3) = 4x³−12x² | x−3, 4x², the product row | 4x³−12x² |
| a3 | SUBTRACT | — (bracket + red minus) | 4x³−8x², 4x³−12x², 4x² | 4x² |
| a4 | BRING DOWN | −9x + 28 | the dividend's −9x and +28, and their landing terms | 4x²−9x+28 |
| a5 | DIVIDE | 4x² ÷ x = 4x | 4x², x, 4x | quotient 4x |
| a6 | MULTIPLY | 4x(x−3) = 4x²−12x | x−3, 4x, the product row | 4x²−12x |
| a7 | SUBTRACT | — | 4x²−9x+28, 4x²−12x, 3x+28 | 3x+28 |
| a8 | DIVIDE | 3x ÷ x = 3 | 3x, x, 3 | quotient 3 |
| a9 | MULTIPLY | 3(x−3) = 3x−9 | x−3, 3, the product row | 3x−9 |
| a10 | SUBTRACT | — | 3x+28, 3x−9, 37 | 37 |
| b1 | REMARK | "Give each missing power a 0 coefficient" | the divisor's `0x` | — |
| b2 | DIVIDE | −8x³ ÷ 2x² = −4x | −8x³, 2x², −4x | quotient −4x |
| b3 | MULTIPLY | −4x(2x²+3) = −8x³−12x | 2x²+0x+3, −4x, the product row | −8x³+0x²−12x |
| b4 | REMARK | "Add a 0 coefficient for missing power" | the product's `0x²` and the divisor's `0x` | — |
| b5 | SUBTRACT | — | −8x³+6x²+10x, −8x³+0x²−12x, 6x²+22x | 6x²+22x |
| b6 | BRING DOWN | +5 | the dividend's +5 and its landing | 6x²+22x+5 |
| b7 | DIVIDE | 6x² ÷ 2x² = 3 | 6x², 2x², 3 | quotient 3 |
| b8 | MULTIPLY | 3(2x²+3) = 6x²+9 | 2x²+0x+3, 3, the product row | 6x²+0x+9 |
| b9 | SUBTRACT | — | 6x²+22x+5, 6x²+0x+9, 22x−4 | 22x−4 |

**Conclusions** (the answer's own `t()` steps, tinted ties at the end of each part):

- (a) `∴ Quotient = 4x²+4x+3, Remainder = 37.` — blue: the sentence's quotient ↔ the quotient row
  `4x²+4x+3`; green: `37` ↔ the last `37`.
- (b) `∴ Quotient = −4x+3, Remainder = 22x−4.` — blue: `−4x+3` ↔ the quotient row; green: `22x−4` ↔
  the last `22x−4`.

**Timeline.** Frame 0 (the poster) is the plain (a) sum at 1:1, in the left column. (a) runs 0 → 34.9 s:
ten 3 s beats, the first at 0.9 and the last ending at 30.9; conclusion 31.4, blue 32.1, green 33.1,
hold. (b) fades in beside it from 35.0 (no camera move), and its nine beats run 36.7 → 63.7 — b1
36.7, b2 39.7, b3 42.7, b4 45.7, b5 48.7, b6 51.7, b7 54.7, b8 57.7, b9 60.7 — conclusion 64.2,
blue 64.9, green 65.9, hold to **67.70 s** (2031 frames).

- **One whole tail per bring-down.** `P1A` prints the 28 in two rows (`[null,4,-9,28]`,
  `[null,null,3,28]`). This cut brings `−9x + 28` down **once**, at a4, into the working row; the
  next subtraction therefore reads `(4x²−9x+28) − (4x²−12x) = 3x+28` (a7) and the last one
  `(3x+28) − (3x−9) = 37` (a10). There is no separate `+28` beat.
- **Terms are read back from the rendered array**, never from a second copy: innermost KaTeX atoms,
  `\phantom` atoms skipped by their transparent colour, a row split at `+`/`−`. A term is shown by
  fading its atoms where they already stand, so the division never moves.
- **Callout geometry is measured, not drawn.** Per beat: box left = the beat's leftmost highlighted
  ink, box top = the beat's lowest row's ink bottom + 4 pt, both slid back inside the frame if needed.
  The audit reports the rect in page points, the overlap with the beat's own rows (0 px² required) and
  with everything else (allowed, area printed), plus the clamp shift. It also proves that `GUIDE` draws
  no leader at all and that arrows appear only on the two BRING DOWN beats.
- **The bring-down arrows** start under the dividend's terms and end on the landing terms; the
  subtraction bars span the whole row in this book, so the arrows pass that one rule — the audit checks
  them against glyph ink only (0 hits) and reports the rule separately.
- **The zero-padded product rows** of (b) are the key's own (`−8x³+0x²−12x`, `6x²+0x+9`); the callouts
  give the product itself and the audit compares them ignoring `+0x²`/`+0x` on either side.
- **The scrubber** is a range input inside the panel, `pointer-events: auto`, at
  `{left: 386, width: 120, top: 247, height: 14}` — the white band under the working, below the callout
  band (which ends at 251.7 pt on (a)) and clear of both conclusions. It covers **1.2 %** of the panel;
  the pen still draws on the rest, and `input` is already in the ink module's ignore list, so a stroke on
  it seeks and leaves no ink. `guide_check` proves both.
- **Built with the HTML stage route** (no Manim in this starter): `node tools/render_guide.mjs sm05a p1
  --scale 2` screenshots 2313 frames at 3200 × 1632 and ffmpeg downscales to 1600 × 816; the poster is
  frame 0 written from the same run. Rules for the next clip:
  [03-authoring-style.md](../03-authoring-style.md) §10–§10.2.
- **Checked:** `node tools/qa/guide_audit.mjs sm05a p1` — 17/17 moves' results match the rows they
  write, both remarks light exactly their named terms and stand alone, **no box covers its own step
  (0 px² on every beat)**, **no leader is drawn**, no box leaves the frame, only BRING DOWN has arrows
  and they cross no glyph (log: `reference/guides/audit-p1.txt`). `node tools/qa/guide_check.mjs sm05a p1` — **34 checks**: the panel
  is exactly the region, starts below the printed question lines (516.5 vs 515.9), the page holds the
  panel and **no answer elements at all** (`.media` 1, `.qa` 0, `.abox` 0, `.ln` 0), the video's edges
  sit on the panel, aspect 1.9608 vs 1.9594, ▶ / ❚❚ / ↻ work, the scrubber is inside the panel, 1.2 %
  of it, seeks on drag and on a pen stroke without drawing, the poster is pure white at the corner, and
  a pen stroke over the video is still there after a reload, above the video. `check_book.mjs sm05a
  --shots` — clean; `sm05b` — clean (2 pre-existing scroll warnings). Frames pulled back out of the MP4
  at a1/a2/a3/a4/a7, the two remarks, b3, both conclusions and the end are in
  `reference/guide-stills/`; the page-2 proof (questions above, the whole answer box nothing but the
  video's last frame) is `reference/guides/p2-answer-region.png`.
- **The leftover typed (b) answer the teacher saw** (`06-pb-leftover-old-solution.png`) came from a
  browser holding an older `solutions.js`: `printed: true` is only a flag, and `buildOverlay` draws a
  non-printed solution's boxes, so the old file still drew them under the clip. The flag is no longer
  the only guard — p1's steps were moved out of `SOLUTIONS` into `P1_STEPS` (2026-11-27), so there is no
  file that could draw them. A fresh profile shows `.qa` 0, `.abox` 0, `.ln` 0 and no
  Quotient/Remainder text anywhere on page 2.
- **Printing:** the PDF export rasterizes the page image plus ink, so the printed/exported page keeps
  the blank answer space for p1 — the answer is screen-only by design. Reverting is the `printed: true`
  line (and p1's steps back into `SOLUTIONS`), the `media` entry and p1's `space`.

## Feedback log

| Date | Request | What changed |
| --- | --- | --- |
| 2026-11-24 | First build from QUE + ANS PDFs | Book created, 35 solutions written, QA clean |
| 2026-11-24 | Long division must match the ANS grid: rule over the dividend, term/operator columns, bars from the term start to the grid's right edge | Grids rebuilt: `divGrid()` pads every power column to the widest coefficient and underlines the whole row, so terms and signs line up; the quotient rule is the array's `\hline`; the bracket is `\Bigg)` |
| 2026-11-24 | Equals must line up as in the key | `align()` on every chain; `\phantom` prefixes in p3b/q29; `eqBlock()` (two-column array) in q22–q28 |
| 2026-11-24 | Q1 graphic, Q6 last line over "Challenge Zone", Q7 (b) extra lines | `widgets.js` emptied; Q6 quotient and remainder now one line side by side; Q7(b) reduced to "The quotient is x² + k, so Quotient = x² − 1 or x² + 3." |
| 2026-11-24 | Division: divisor on the dividend's line, bracket a little taller than x³ with its tip on the rule, a gap between the rule and the dividend, bars not starting left of the line's own first sign; P3a/P3b/Q19/Q20/Q29 equals per group; Q29's two missing "∵" lines; Q1 graphic still showing | `DIV()` rewritten (see above): bracket and divisor in the dividend row, rule as a lifted zero-width overline from the bracket's tip, bars trimmed to end with the rule; `eqOr`/`eqSym`/`eqBlock` now group the equals as the key does; Q29 gained "∵ When p(x) is divided by x + 3, the remainder is −40." and "∵ p(x) is divisible by x − 7."; `space` raised for p1 (110) and added for q20 (75); `"widgets": false`; cache `ebooks-v51` |
| 2026-11-24 | Q7's `kx − 3` must sit under the dividend's `kx − 3`, a step `k² − 3 = 2k` before `k² − 2k − 3 = 0`; Q16's red and green equals each aligned; the bracket still a hair short of the rule | `Q7DIV` rebuilt: working lines start under the dividend's `+kx`, the widest line fixes the rule and the bars; the step added; Practice 3 and Q16 use `eqBlock` per pair; the rule now starts at the bracket's tip (`mkern -0.54em` outside the rlap, `1.18em` strut, widened 0.54 em which the overline's own 3mu pad completes); the dividend no longer shifted 4px by a stray `\mkern3mu`; slot-0 negatives open with `{}` so every line starts in one column; cache `ebooks-v52` |
| 2026-11-25 | The reveal shows too much at once: split P3a's third part, and Q19/Q20/Q22/Q23/Q24/Q25/Q26/Q27/Q28, along the key's marks — 5, 5, 5, 10, 9, 7, 7, 5, 7, 7 parts — with the MC letter box appearing with the last part, and no change to the typesetting | New `eqParts(width, groups)` sets a block as one step per part: each row padded to the block's widest left side with `\smash{\hphantom{…}}` + `\mathllap` (one equals column across all parts), and a part's prose line joins the equation that follows it. `&{}\mathrel{=}` keeps the array out of the reader's `=`-breaking fallback. `space` opened for q19 (8), q24 (16), q25 (17), q27 (49), q28 (64); `layout.json` regenerated; cache `ebooks-v53` |
| 2026-11-27 | A solution-guide video for Practice 1 covering (a) and (b) in one clip — animation only, no interactive widgets; play/pause and replay from the reader; no Manim on this machine | `books/sm05a/media/guide-p1.html` is a self-contained stage that renders p1's own tex from `solutions.js` with KaTeX at the answer's size; `tools/render_guide.mjs` screenshots it frame by frame through Chrome (frame *n* = *n*/fps, no timers) and ffmpeg encodes `media/guide-p1.mp4` (1280 × 960, 30 fps, 13.6 s, 172 KB, silent) plus the poster `media/guide-p1.jpg` (28 KB, frame 0 = the plain sum); `book.json` gained the `guides` entry, so the film button appears in p1's strip. `tools/qa/guide_check.mjs` proves button/dialog/play/pause/replay/Esc/poster and that the answer did not move; `check_book.mjs sm05a --shots` still clean; cache `ebooks-v61` |
| 2026-11-27 | Teacher rejected the line-by-line clip as "just printing the solution": the animation must show the *thinking* — per the reference handout, a label + this question's arithmetic + a leader to the exact terms, for every move including "bring down" | The stage was rebuilt around 18 callouts (11 in (a), 7 in (b), table above): each move shows its label, its own arithmetic read against p1's rows, a hairline leader arched through the gap between rows to the terms it acts on, and a tint on those terms; the terms are read back from the rendered array (atoms of a KaTeX row, phantoms transparent) so a result can land term by term and a brought-down term can arrive after it. Frame 1920 × 1080, 54.0 s, 1620 frames, 1 068 KB; the division keeps its 1120 px (scale 4.538), unchanged paper and typography. New `tools/qa/guide_audit.mjs` (18/18 arithmetic matches) and `guide_check` extended to the stage's duration/size; `check_book.mjs sm05a --shots` clean; cache `ebooks-v62` |
| 2026-11-27 | Review of that rebuild: `+28` highlighted/brought down twice (a4 and a8), a leader crossing the dividend's ink in a4 and the divisor in b3, and the frame half empty (content in the top ~45 %) | One term per bring-down: a4 is now `−9x` only, a8 is `+28` and writes it into both rows that print it (r3, r5) — no term is served by two beats. Leaders are routed orthogonally through the free corridor and the ink-free lane above/below the target row, chosen by measurement, with the head landing on the target's edge; the ink model had to shrink each atom's strut box to its glyphs or no lane looked free (the audit now samples every path at 2 px and reports `none crosses printed ink`). The stage was cropped 1920 × 1080 → **1920 × 800** with the maths unchanged: finished (a) fills 85 % of the height (was 63 %), (b) 67 % (was 50 %). 54.0 s, 950 712 B, poster 31 896 B; audit 18/18, guide_check and `check_book.mjs sm05a --shots` clean; cache `ebooks-v63` |
| 2026-11-27 | Teacher redesigned the p1 guide again: the clip must replace the solution in the answer region (same layer, the pen must draw on it), pure white `#ffffff`, every operation lighting **all** its terms at once, **no callout for SUBTRACT** (bracket the product row + red minus), **the whole intact tail brought down at once with downward arrows** (reversing one-term-per-bring-down), a conclusion line per part with blue quotient/green remainder ties, ≥ 3 s per step, and the static typed steps removed | Delivery changed from `guides`+dialog to a `media` panel exactly on p1's region `[66, 521.9, 546, 782]`; p1 is `printed: true` (no typed answer, no strip) and its `space: 110` is gone from `layout.json` and `book.json`, so page 2 stays the printed page and the media's button is the only control. The stage was rewritten: white, 1600 × 868, the book's own 12.5 pt type at 10/3 px per point, callout column on the left; DIVIDE lights working lead + divisor lead + new quotient term, MULTIPLY the whole divisor + quotient term + product row, SUBTRACT the bracket device with work/product/result tinted together, BRING DOWN the tail + landing with two arrows; conclusions read from the answer's `t()` step. The stage is 69.55 s / 2087 frames / 816 KB, poster 25 KB. `guide_audit` rewritten for the new device: 17/17 arithmetic matches, no leader on ink, arrows cross no glyph (they pass the subtraction rule only). `guide_check` rewritten for the inline delivery, including an ink-over-video test that survives a reload (131 px). `check_book --shots` navigation fixed (a sheet key like `p2` collided with Practice 2's question id and photographed page 6); `check_book.mjs sm05a` and `sm05b` still clean; cache `ebooks-v64` |
| 2026-11-27 | Five more notes: the old typed (b) solution was still showing under the panel; (b) needs a remark before the division (highlight the divisor's `0x`, "Give each missing power a 0 coefficient") and one between MULTIPLY and SUBTRACT (product's `0x²` + divisor's `0x`, "Add a 0 coefficient for missing power…"), standing alone and ≥ 3 s; that is a general rule for every 0 coefficient; keep (a) on screen and start (b) underneath in the same frame; add a scrubber | The leftover was a **stale tab** from the window between the `media` entry and `printed: true`/`space` removal: the shipped page 2 has one overlay child (`.media`), no `.qa`, and the whole answer box shows only the video (`reference/guides/p2-answer-region.png`). The stage now draws both parts in one scene and a camera frames it: 1:1 on (a), then a measured pull-back to **0.8098** (a 172.4 + b 141.2 = 316.6 pt in 260.1 pt) so both fit at **10.12 pt** — (a) never fades. Two REMARK beats added (b1 lights the divisor's `0x`; b4 lights the product's `0x²` and the divisor's `0x`), each 3.6 s, no leader, alone on screen; the label is now measured as ink (text only, not its full-width box) so the DIVIDE leaders go above `(a)`/`(b)` instead of skimming the rule. Engine change for the scrubber: `engine/viewer/media.js` adds a range strip (`book.json` `media[].scrub`, here `{left: 352, width: 120, top: 18, height: 14}` = 1.3 % of the panel, in the empty top-right corner) and `engine/styles.css` styles it; a pen stroke on it seeks and leaves no ink. Clip is 77.10 s / 2313 frames / 1 204 903 B, poster 25 006 B. `guide_audit` 17/17 + 2 remarks standing alone + no leader on ink; `guide_check` 32 checks; `check_book.mjs sm05a --shots` clean, `sm05b` clean (2 pre-existing warnings); the QA servers now send `video/mp4` and ignore aborted media preloads; cache `ebooks-v65` |
| 2026-11-27 | The teacher rejected the 0.81 pull-back: the typed layout fits the printed frame at 100 %, callouts may cover frame lines and printed text because the final solution has none, and the type must stay 12.5 px. Give the row-by-row y table against the reader's 12.5 px version, prove the panel's top stays below the questions, and state `.qa`/`.abox`/`.ln` = 0 on page 2 | **Both parts now side by side at 1:1, no camera.** The region was re-measured from `p02.jpg` (frame 527.7 × 309.1 pt, of which the top 38 pt is the question belt) to `[36.5, 516.5, 563, 785.2]` = 526.5 × 268.7 pt, clip 1600 × 816 (0.07 % skew). The stage was rewritten: (a) left, (b) right, one top line, 24 pt gutter, margins 8.95, type 12.5 px with the reader's own `.ln` line boxes; callouts moved to the white band under each block (203 pt / 172 pt) and their leaders route in the gutter. (a) 237.8 / 183.9 pt, (b) 246.8 / 152.7 pt; a stacked 100 % pair needs 273.2 pt of the 268.7 available, which is why only side by side fits. Against the reader's `.abox` at 12.5 px every row of both parts is within **0.00 pt** (tolerance 1). `guide_audit` 17/17, remarks alone, no leader on ink; `guide_check` now **34 checks** including "the panel starts below the printed question lines" and "the page holds the media panel and no answer elements at all"; `check_book.mjs` sm05a clean, sm05b clean (2 warnings). Clip 77.10 s / 2313 frames / 1 082 736 B, poster 22 899 B, CACHE `ebooks-v67` |
| 2026-11-27 | The teacher still met the old typed p1 answer on 8090 (end of (b) + its conclusion) and **no scrubber**: the browser kept serving the previous service worker's / HTTP-cached `solutions.js`, `media.js` and `book.json`. Asked for a durable fix, not another manual cache clear | **The book's data files are versioned urls.** `engine/book.js` reads `CACHE` back out of `sw.js` (`fetch("sw.js?stamp=" + Date.now(), { cache: "no-store" })`, 2.5 s timeout, "" when it fails) and fetches `book.json`, `layout.json`, `solutions.js`, `widgets.js` and the clip's `src`/`poster` as `?v=ebooks-vNN`; a worker only answers urls it has stored, so the new query is a miss even for a stuck cache-first worker. `sw.js` stores both the versioned and the plain key (offline `book.js` cannot read `sw.js`, falls back to the plain urls and finds the current release) and never caches `sw.js` itself. New `tools/qa/release_probe.mjs`, one profile: 8090 first reproduces the symptom with the old `solutions.js` (`.qa` 1, `.media` 1), then two reloads give `.qa` 0, `.abox` 0, one panel, one scrubber and `?v=ebooks-v68` on every data url; 8092 is clean; 8093 runs a deliberately stuck cache-first worker seeded with the old file (plain url old, versioned url new) and the reader under it is clean; with the server closed the book still opens, page 2 still shows the panel and the clip plays (t 1.39 s, readyState 4) from the unversioned copy. `P1_STEPS` / `boxes: []` untouched. `check_book` sm05a --shots and sm05b clean (2 pre-existing warnings), `guide_check` 34 checks pass; CACHE `ebooks-v68` |
| 2026-11-27 | Six screenshots: every callout (the two remarks included) must stand at the **lower left of the step it belongs to** — left edge on the leftmost highlighted ink, top just under that step's last row — and may cover anything except the step itself; **no leaders or arrow heads** anywhere except BRING DOWN's downward arrows; clamp a box into the frame rather than shrinking anything; report each beat's callout rect and what it covers, plus which beats were clamped | The leader routing was removed from the stage (no `wire` paths, no arrow heads, `GUIDE.leaders()` is empty) and the fixed side column was replaced by a per-beat placement: left = min x of the beat's highlighted/written ink, top = the beat's lowest row's ink bottom + 4 pt, slid inside the frame when it would leave it. Only the BRING DOWN arrows remain. `guide_audit` now prints every beat's box in page pt, its own-step overlap (0 px² on all 19 beats) and the area/rows it lies over (e.g. (a) DIVIDE over (a) row 2 639 pt², (b) remark over (b) row 3/4 + (b) concl), plus the clamp list: only (b) BRING DOWN, slid 46.7 pt left. Clip re-rendered 1600 × 816. QA: `guide_audit` 17/17 + 0 px² own overlap, `guide_check` 34 checks, `check_book` sm05a/sm05b clean, `release_probe` 14 checks; CACHE `ebooks-v69` |
| 2026-11-27 | Four more notes: (1) the callout must not touch its step — top at **8 pt** under the lowest involved row, not 4; (2) **2 s per beat**, not 3.4–3.6, animation inside the beat; (3) the second remark trimmed to **"Add a 0 coefficient for missing power"**; (4) the scrubber keeps "disappearing" for the teacher — make it impossible to lose (z-order, solid pill, darker track) and prove the pixels | Gap: `CAL_GAP_PT` 4 → **8**, and the top is rounded **up** (`Math.ceil`) so rounding cannot eat into it — `guide_audit` measures **8.0–8.3 pt on all 14 boxes** (floor 8), own-step overlap still 0 px² on all 19 beats, only (b) BRING DOWN clamped (46.7 pt left). Timing: one `BEAT = 2.0` for every move, entry at 0.62 s and gone by 1.82 s; **19 beats, 48.70 s total, 1461 frames, 823 165 B** (was 77.10 s) — the audit now fails any beat outside **2.0 ± 0.15 s**. b4's sentence cut to the one clause; it wraps to 2 lines, box 126.4 × 39.8 pt, and still stands alone. Scrubber (engine change): video `z-index: 0`, `.media-scrub` **5**, play **6**, bar appended **last**; the bar is a 120 × 14 pt solid pill (`rgba(255,255,255,.94)`, 1 px `rgba(0,0,0,.18)` border, shadow), 4 px `rgba(17,17,17,.38)` track, orange-ringed thumb, same place (386,247). `guide_check` gained a **pixel** check: it clips the bar out of the rendered page and demands the track and thumb colours (4 400 track px, 741 thumb px; the same clip with the bar hidden is the control, 0/0) — it also asserts the bar is on screen, is the last child and paints above the video; clip saved as `reference/guides/sm05a-p1-scrub-clip.png`. `guide_check` now **38 checks**. (Its old pen test had been stroking the bar while the bar's bottom sat under the viewport fold, so it now scrolls the strip fully into view before clipping or stroking it.) `guide_audit` 17/17, `guide_check` 38/38, `release_probe` 18/18, CACHE `ebooks-v70`. (The teacher put the beat back to 3 s the same day — next row.) |
| 2026-11-27 | Two things: (a) 2 s per beat is too quick — put every beat back to **3.0 s**, animation inside the beat, and change the audit's window back; (b) the teacher met a **blank page** in Chrome on 8090 (toolbar fine, "Page 1", beige paper, no page image) — the engine needs insurance for the moment a release swaps the worker's cache | **(a) 3 s.** `BEAT = 3.0` for all 19 moves (entry 0.62 s, gone 2.82 s); `guide_audit`'s timing check is 3.0 ± 0.15 s again; clip **67.70 s / 2031 frames / 989 980 B**, poster 22 899 B; (a) 0 → 34.9 (ten beats 0.9–30.9, conclusion 31.4/32.1/33.1), (b) fades 35.0, beats 36.7–63.7, conclusion 64.2/64.9/65.9. **(b) Fallback.** Every versioned load now retries the plain url **once** and logs `[book] … retrying without ?v=`: `fetchWithFallback` (book.json, layout.json), `importWithFallback` (solutions.js, widgets.js, deck), `loadImage` (page images + thumbnails; `pageImage()` returns the plain path now) and `loadVideo` (clips, posters, the guide modal). A page image that fails on both urls puts **"page image failed — reload"** (`.bg-error`) in its sheet. `sw.js` `activate` deletes with `Promise.allSettled` (one rejected delete must not cancel the rest), and both fetch branches look **only in the current cache** instead of `caches.match()` (which walks every cache on the origin — a delete racing that lookup is how a loading image could be lost). `release_probe` gained two stages: 46 forced 500s on the `?v=` urls → **15/15 page images** appear from the plain urls and the fallback is logged; `p03.jpg` refused on **both** urls → exactly one visible note, 14/15 images. `check_book` now fails any sheet whose page image is blank (and any `.bg-error`). QA: `guide_audit` 17/17 + gap 8.01–8.29, `guide_check` 38/38, `check_book` sm05a --shots clean, sm05b clean (2 pre-existing warnings), `release_probe` 18/18; CACHE `ebooks-v72` |
| 2026-11-27 | The teacher's screenshot proved his Chrome was still running an old `engine/media.js` / `styles.css`: the play button (page DOM, above the video) was there but the scrubber was missing completely. Engine files were never url-versioned — only the book's data — so the SW / HTTP cache could serve an old engine indefinitely | `sw.js`: every non-media request (HTML, JS, CSS, JSON) is fetched with **`cache: "no-store"`** and the worker's copy is only the offline fallback; the engine is not url-versioned because a module graph has too many imports to tag one by one. Untouched: `?v=` data urls, both stored keys, `allSettled` deletes, current-cache lookups, the loader fallback. A **10 px muted `#build`** beside "Page 2 / 15" shows the running release (`v73`; `v?` when `sw.js` is unreadable) — no button, no tooltip. `release_probe` gained a stage that poisons `media.js` and `styles.css` in the worker's cache and reloads: the network wins (1 scrubber, `display: block`, `z-index: 5`, build `v73`). `05-engine-notes.md` now records "play button but no scrubber" as the diagnostic signature of a new `book.json` under an old engine. QA: `release_probe` **22/22**, `guide_check` 38/38, `check_book` sm05a --shots clean, sm05b clean (2 warnings); CACHE `ebooks-v73` |
| 2026-11-27 | On the live site a **first visit** broke playback: pressing play ran ~1.5 s, then `error`/`abort`/`emptied`/`loadstart`, the src fell back to the plain url and the clip restarted at 0 (`paused`). Visits 2 and 3 were fine. The worker's `install → skipWaiting → activate → clients.claim()` was taking over the page while the clip was playing | **(1) No `clients.claim()`.** The worker serves the next navigation instead of claiming an open page, so a first visit is answered by the network end to end (the data urls are versioned anyway). Cost: the cache fills from the second load, not the first. **(2) `loadVideo` keeps its place**: it remembers the position (`timeupdate`) and whether the viewer had asked for play; after a fallback it restores `currentTime` on `loadedmetadata` and resumes playback, and it logs every media error once — including "no MediaError", which is what an aborted request looks like. **(3) New probe stage**: a brand-new profile (separate browser, nothing installed) presses play and must be at `currentTime > 2`, `paused === false`, no `abort`, `?v=` url intact — measured **t=3.57 s, paused false, err 0, events ["playing"]**. `release_probe` now **25/25**; `guide_check` 38/38; `check_book` sm05a --shots clean, sm05b clean (2 warnings); CACHE `ebooks-v74` |

## Known warnings

`node tools/qa/check_book.mjs sm05a --shots` → **OK, no blocking problems, no warnings.**
