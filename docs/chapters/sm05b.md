# SM05 (B) More about Polynomials (`sm05b`)

| | |
| --- | --- |
| Form | S5 |
| Book id / storage | `sm05b` (never rename) |
| Source | `books/sm05b/source/` — QUE 16 pages, ANS 15 pages, offset **−1** |
| Status | live (local only; not published) |
| Live | `reader.html?book=sm05b` |

## Source facts

- Page structure (QUE page numbers): **p1** cover; **p2** Section 1 *Factor Theorem* — the summary panel with the printed example `x³ − 2x² − x + 2` and the CASIO steps (no answer box, so no card); **p3** Practice 1, Practice 2 and Q1; **p4** Q2–Q5; **p5** Q6–Q8; **p6** Q9–Q10; **p7** Q11–Q13; **p8** Challenge Zone + Q14; **p9** Section 2 *Solve f(x) = 0 [DSE-Typed Question] Part I* — the summary with the printed worked example (no card); **p10** Practice 2 (the DSE-typed question); **p11–p16** Q15–Q20, one question per page.
- The ANS has one page fewer and no cover: every ANS page is the QUE page minus one, confirmed page by page (ANS p1 = QUE p2 … ANS p15 = QUE p16). `ansPageOffset: -1`.
- Answer space: Practice 1, Practice 2 and Section 2's Practice 2 are printed with a thin rectangular frame around the working area; the numbered questions have plain blank space. The teacher's working sits in a red box, usually right of the question text.
- MC answers from the ANS: **Q5 A, Q6 C, Q7 D**. The printed answer squares are on QUE p4 and p5 only:
  - Q5 `[525.7, 710.7, 551.8, 736.8]`
  - Q6 `[525.7, 222.5, 551.8, 248.5]`
  - Q7 `[525.7, 438.5, 551.8, 464.5]`
- Q15(a): the key's `c = −2` — the minus is printed small. (b) then substitutes `− 2x + (−2) − 5`, which only balances with `c = −2`; checked against (c) `x⁴ − 5x² − 8x − 12 = 0`.

## Question map

| Section | Questions | Pages | Notes |
| --- | --- | --- | --- |
| Factor theorem (`ft`) | Practice 1, Practice 2, Q1–Q13 | 3–7 | Q2–Q13 are plain blanks; the two practices are printed frames |
| Challenge (`ch`) | Q14 | 8 | Four parts (a)–(d), long |
| Solve f(x) = 0 (`sf`) | Practice 2, Q15–Q20 | 10–16 | Every question ends with a "someone claims…" judgement part |

## Special cases

- **MC regions** moved right of the options, as in sm05a: `q5 [140, 585, 512, 782]`, `q6 [140, 95, 512, 282]`, `q7 [140, 330, 512, 490]`, so the working never covers the printed options (they end at x ≈ 126).
- **Q1** answers go beside the printed (a)/(b)/(c) lines: `region [140, 630, 512, 782]`.
- **Practice 2 (Section 2)** region starts at `y = 192` (just under "Explain your answer.") instead of the generated `215`; the extra 23 pt is what makes its answer fit without scrolling.
- `space` opened for q1 (90), q3 (10), q4 (14), q5 (28), q6 (40), q8 (88), q9 (186), q10 (208), q11 (200), q12 (150), q13 (196), q14 (312), q19 (84).
- Practice 1 and Practice 2 are printed frames slightly shorter than the teacher's working: no cut can open room inside a frame without breaking its outline, so those two answers scroll inside their box (the two QA warnings below). The teacher confirmed this is what he wants; the general rule is "Answer space printed inside a frame" in `03-authoring-style.md` §1.

## Book-local authoring helpers (`solutions.js`)

The long-division and equation helpers are copied verbatim from `books/sm05a/solutions.js`
(`const raw` … `eqParts`). This book adds three, because the key's layout needs them:

- `eqCol(rows)` — the ∵/∴ column plus a right-hand tag column (`……(1)`), for Q8, Q9, Q14(a),
  Q15–Q19. Row: `[symbol, left, right, tag?]`.
- `eqColOr(rows)` — the same with the final "… or …" branch (Q4), six columns.
- `EQ` / `EQCOL` / `EQCOLOR` — the wrap-safe entry points used by every array in this book.

**Why the wrap-safe entry points:** the reader lays an answer out again in "wrap" mode when the
authored layout does not fit, and that mode cuts a maths string at every `=` it meets at brace
depth 0. An array cut there loses its `\begin`/`\end` pair and is printed as raw TeX. `&{}\mathrel{=}`
keeps the array's own sign inside a group, and `guard()` does the same for an `=` written inside a
cell ("f(1) = 3(1)³ + … = −20 ≠ 0"). Both were needed here: the first draft printed several arrays
as red TeX.

## Graphics

None. `book.json` sets `"widgets": false` and `widgets.js` exports an empty registry, so no
question shows a graphic button.

## Review links

None: the chapter is algebra; no wording maps to a step.

## Agreed part counts (teacher's red-line marks, 2026-11-26)

The teacher drew a cut under every line that is a tap and gave the total per question. **The
counter in the reader is the check**: `check_book` shows `n/n` per answer and `n` must equal the
number below. The ten marked questions:

| question | parts | question | parts |
| --- | --- | --- | --- |
| q5 | 8 | p2b (page 10) | 19 |
| q6 | 8 | q15 | 19 |
| q8 | 12 | q16 | 18 |
| q9 | 14 | q17 | 16 |
| q10 | 14 | q14 | 25 |

Unmarked questions (leave them unless a count is given): p1 9 · p2 7 · q1 6 · q2 5 · q3 6 · q4 8 ·
q7 4 · q11 7 · q12 8 · q13 8 · q18 23 · q19 22 · q20 17.

Where the totals forced rows into one tap, these are the groups (so the next round keeps them):
q5 `{9a + 72, 9a = −72, a = −8}` · q6 `{−8a + 8, 8a = 8, a = 1}` · q8(a) `{m − n + 22 + 17 − 10,
m − n = −29 ⋯(1)}` and `{625m − 125n + 550 + 85 − 10, 5m − n = −5 ⋯(2)}` · q9(a) `{−m + 12 + n − 13,
−m + n = 1 ⋯(1)}` and `{−7 + m + n + m, 2m + n = 7 ⋯(2)}`, q9(b) `{= −2 + 12 + 3 − 13 − 7 + 2 + 3 + 2,
= 0}` · p2b(a) `{84 + 6k + 42, 6k = −126, k = −21}`, p2b(b) `{f(−4) = […], = 0}`, p2b(c) `{= −7, < 0}` ·
q15(a) `{3 − c − 5, c = −2}`, q15(b) `{f(3) = […], = 0}`, q15(c) `{= −7, < 0}` ·
q16(a) `{21 − m + 4, m = 25}`, q16(b) `{f(−1) = […], = 0}`.
The merged pairs are written with `CHAIN([...])` (an `aligned` block, the relation as `\mathrel`, and
a `0.277em` kern where the left side is empty so the relation sits exactly where a plain `= …` line
puts it); the block rows are cut with the third argument of `EQSPLIT` / `EQCOLSPLIT`
(`[1, 2]` = statement, substitution, then the rest as one part).

## Feedback log

| Date | Request | What changed |
| --- | --- | --- |
| 2026-11-25 | First build from the QUE + ANS PDFs | Book created; 23 answer items written (Practice 1, Practice 2, Q1–Q14, Section 2's Practice 2, Q15–Q20); offset −1 measured; MC squares taken from the PDF's own rectangles; `space` opened so every plain-blank answer shows whole; QA `OK no blocking problems` |
| 2026-11-25 | Teacher's verdict on the two open points | Q7 keeps the rewritten wording that follows the paper's own symbols (`2x − 1`, `f(x + 2)`) and D as the answer — the ANS wording is not copied. Practice 1 and Practice 2 keep scrolling inside their printed frames: no page cut, because it would break the frame outline, and no smaller text. Nothing in the book changed; the frame case became a rule in `03-authoring-style.md` §1. |
| 2026-11-25 | Ten review screenshots (`sm05b-review/`) | (1) Zero remainders: the six long divisions (P1b, P2, Q11, Q12, Q13, Q19c) stop at their last subtraction bar — no `0` line. (2) Q10(a)(i): fourth row is `(3 − m)(3 − n) = 3` as the key writes it. (3) Q13: `f(−½) = …` on one line (`\tfrac`), `= 0` under it (moved to the end of that line in the next round). (4) Practice 2(b), Q15(b), Q16(b): `f(a) = [substitution]` at the margin with `= 0` on the next line, its `=` in the same column. (5) Q17(a): `f(x)`, `f(1)` and `= 0` in one equals column. Measured with `tools/qa/eq_probe.mjs` (CSS px): Q13 110.7/110.7; P2b 101.5/101.5; Q15b 83.3/83.3; Q16b 101.5/101.5; Q17a 120/120/120; Q10(a)(i) 412 ×4 (its (b) pair moved into the long line’s column in the next round). Rules added to `03-authoring-style.md` §9.1 and §9.2; cache `ebooks-v55`. |
| 2026-11-25 | Two follow-up screenshots (`11`, `12`) | **Q10(b)** “Consider f(4)”: the `∴ (4−3)[3(4)² + b(4) + 16] = …` line, `4b = −88` and `b = −22` are one array, so all three `=` sit at 368.2. The key's own column was checked at 4×: its `4b` `=` is under the long line's `=`, so the book follows the key. **Q13**: `= 0` back on the same line — `f(−½) = 2(−½)³ + 17(−½)² + 40(−½) + 16 = 0`, one line at 100 %, equals at 110.7 and 500.4. Cache `ebooks-v56`. |
| 2026-11-25 | Reveal-split pattern A/B (`13`, `14`) | **Superseded by the finer rule below (2026-11-26).** 16 blocks whose first row is `f(c) = 0` took two taps — statement, then substitution: p1(a), q2, q3, q4, q5, q6, q8(a) both blocks, q9(a) both (`f(−1)` and `g(−1)`), q10(a)(i), p2b(a), q15(a), q16(a), q17(b)(i), q18(a). Rows kept verbatim behind `EQSPLIT` / `EQCOLSPLIT` / `EQCOLORSPLIT`, which pad every left side to the block's widest with the same `\smash{\hphantom{…}}\mathllap` as `eqParts`. Measured with `tools/qa/row_probe.mjs` (CSS px, before → after, identical in every block): p1 355.7, q2 281.8, q3 357.3, q4 312.4 (or-branch 459.3), q5 366.9, q6 422.3, q8 553.3 / 537.7, q9 443.8 / 413.6, q10 412.0, p2b 554.5, q15 654.4, q16 698.6, q17 696.4, q18 328.6. Tap sequences (`tools/qa/tap_probe.mjs`): q2 `0/3 → 1/3 → 2/3 → 3/3` with tap 2 showing `f(−1) = 0` alone, q3 `0/4 …`, q18 `0/17 → 1/17 → 2/17 …`. The boundary cost one line (8 pt), so the answers tuned to the old height got the room back: q3 10→15, q8 88→97, q9 186→195, p2b none→10 (without it the whole p2b answer fell to the reader's 50 % type). Cache `ebooks-v57`. |
| 2026-11-26 | Four finer-split screenshots (`15`–`18`) | **Supersedes the two-part split above: every chain that starts `f(…) = 0` now reveals one row per tap.** Same 16 blocks, now cut at every row (p1(a) 3 parts; q2, q3, q8(a)×2, q9(a)×2, q10(a)(i), q15(a), q16(a), q17(b)(i) 4 each; q4 6; q5, q6, p2b(a) 5; q18(a) 3), plus the chains the teacher named: p2c, q15(c), q16(c), q17(b)(ii), q18(b) 4 each, q19(c) 2, q20(b)(ii) 3 — 23 blocks. Rows stay verbatim; `EQSPLIT`/`EQCOLSPLIT`/`EQCOLORSPLIT` now default to a cut at every boundary. Equals columns unchanged row for row (`row_probe.mjs`, before → after identical in all 16 questions): p1 355.7; q2 281.8; q3 357.3; q4 312.4 (or-branch 459.3); q5 366.9; q6 422.3; q8 553.3 / 537.7; q9 443.8 / 413.6; q10 412.0; p2b 554.5; q15 654.4; q16 698.6; q17 696.4; q18 328.6; q19 265.9 ×2; q20 355.0 ×3. Each row now sits on its own step line (42.5 px instead of the array's 28.1), so a 4-row block grew 124.9→170 px (+25 pt) and a 6-row block 181.1→255 (+41 pt); `space` grew to q2 12, q3 32, q4 50, q5 55, q6 65, q8 131, q9 229, q10 221, p2b 60, q15 30, q16 26, q18 11, and q2 also needed it to stop a silent side-by-side column cut (QA does not report that — `tools/qa/layout_audit.mjs` found it). p1/p2 keep scrolling inside their frames (185 / 96 pt). **p2b cannot fit its frame at 100 %**: 647 pt of working in a 590 pt frame, so the last two lines sit in the 60 pt room opened below the frame's bottom rule — reported, not shrunk. q18(a)'s `f(1) = 2b + 36` block and q19(a)'s `f(−1) = 2a + 12` / `f(2) = 2` stay whole (given values, not zeros). Cache `ebooks-v58`. |
| 2026-11-26 | Teacher's answers to the two open points | **p2b accepted as it stands**: 100 % type, 60 pt opened below the frame's bottom rule, the last two lines below the rule — 647 pt of working in a 590 pt frame. Recorded as an accepted exception below, because it contradicts §1's "the frame stays whole, the working scrolls" (p2b does not scroll: at its region's usable width the reader shrinks the whole answer to 50 %, and shrinking is forbidden). **The three given-value blocks now split one row per tap**: q18(a) `f(1) = 2b + 36` (3 parts), q19(a) `f(−1) = 2a + 12` (4 parts), q19(a) `f(2) = 2` (5 parts). Rows verbatim; equals columns unchanged row for row (`row_probe.mjs`, before → after identical): q18 328.6 ×6 (both blocks), q19 498.6 ×4 and 427.4 ×5. Space: q18 11→28 (+17), q19 84→129 (+45); QA back to `OK no blocking problems, 2 warning(s)`. Cache `ebooks-v59`. |
| 2026-11-26 | Teacher's per-question totals (ten screenshots, `19`–`28`) | **Every marked question now reports exactly its total**, checked against the reader's own counter: q5 8, q6 8, q8 12, q9 14, q10 14, q14 25, p2b 19, q15 19, q16 18, q17 16. Rows verbatim; equals columns unchanged row for row (`row_probe.mjs`; q5, q6, q8, q9, q10, p2b, q16, q17 identical to the last round, q15 sub-pixel only — six left-margin lines at 0.2–0.4 px from fractional layout, no column moved). The groups are listed in "Agreed part counts" above and written with `CHAIN([...])` (merged chain lines) or the `[1, 2]` cut (statement, substitution, then the rest as one part). Heights fell back because there are fewer steps than the one-row-per-tap state, so `space` was re-tuned to the content: q5 55→40, q6 65→50, q8 131→115, q9 229→212, p2b 60→40, q15 30→20, q16 26→6 (q10 221 unchanged); the page images open that much less. QA `OK no blocking problems, 2 warning(s)` — the two framed practices. Cache `ebooks-v60`. |

## Known warnings

```
node tools/qa/check_book.mjs sm05b --shots
  WARN  p1: answer scrolls inside its region (185 pt more would show it all)
  WARN  p2: answer scrolls inside its region (96 pt more would show it all)
  OK    no blocking problems, 2 warning(s)
```

Both are the framed practices, and the teacher accepted the scroll (see the feedback log and
"Answer space printed inside a frame" in `03-authoring-style.md` §1).

Also accepted, and not a QA warning: **p2b's working is 610 pt inside a 590 pt frame**, so 40 pt
is opened below the frame's bottom rule and the last lines sit below it — see below.

## Accepted exceptions

- **Practice 2 (p2b) runs below its frame — accepted by the teacher, 2026-11-26.** The block's
  printed frame is 590 pt tall (`region` `[66, 192, 546, 782]`); the working at 100 % type needs
  610 pt once its part count is 19. The reader opens 40 pt of page below the frame's bottom rule
  and the last lines (`∴ The equation 2x² − x + 1 = 0 has nonreal roots.`,
  `∴ The claim is not correct.`) sit in that opened space, below the rule. This is the one place
  where the general rule in `03-authoring-style.md` §1 ("the frame stays whole, the working
  scrolls") is **not** applied: p2b cannot scroll at 100 %, because at its region's usable width
  the reader's fit pass shrinks the whole answer to 50 % type instead of scrolling it, and
  shrinking is forbidden. Do not "fix" it by cutting the frame, by shrinking the text, or by
  raising `space` past the page — the teacher has seen and accepted this state. (The figures were
  647 pt / 60 pt when the teacher accepted it, at 23 parts; the count round shortened the working to
  19 parts, so it now overruns by 20 pt instead of 57.)

## Differences from the key (agreed with the teacher)

- **Q7**: the key's box reads "∵ f(x) is divisible by x + 2. ∴ f(2x+1) is divisible by (2x+1)+2,
  i.e. 2x+3 is a factor of f(2x+1)." — which belongs to a different question (the paper divides by
  `2x − 1` and asks about `f(x + 2)`); the teacher flagged it with a small ⚠. The book keeps the
  key's shape but with the question's own symbols: "∵ f(x) is divisible by 2x − 1. ∴ f(x+2) is
  divisible by 2(x+2) − 1, i.e. 2x + 3 is a factor of f(x+2). ∴ The answer is D." The teacher
  confirmed this wording.
- The key sets each "∴ f(x) = …" conclusion beside the bottom of its long-division grid; the book
  sets it under the grid, in reading order, because an answer box is one column.
