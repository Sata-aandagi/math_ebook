# Authoring style

These rules make every book look and read like the teacher's own notes. Each one was approved, or asked for, during the JM26 (B) build. When a new chapter needs something these rules don't cover, decide it with the teacher, then add it here.

## 1. Page and answer boxes

- **Keep the original design.** The QUE page is the background, and nothing covers the printed question.
- **Answers sit inside the blank answer space**, in red-bordered boxes with a margin, laid out like the ANS key: side-by-side boxes where the key has them (parts (a), (b), (c), or MC working beside the options).
- **Controls** (▸ next, » all, ◂ back, ↺ reset, graphic, link) sit in a slim column right of the boxes, with a progress count such as "3/8".
- **Hidden steps** show as grey bars, and the next one is striped. Tapping a box reveals one step; tapping a bar reveals up to it.
- **When space is short:** shrink the text, then drop number lines, and only then continue on an extra sheet. Accept 70 % text on dense MC pages; avoid going below about 62 %.
- **Side reasons are plain text.** `m(tex, reason)` and `t(text, reason)` print the reason exactly as written: no `$…$`, no TeX command, and no maths-only token such as `u_x`. Write words — "horizontal speed is constant", not `x = u_x t`. A long `\therefore …` sentence is a `t()` line, never `m()`.
- **A `space` cut never crosses ink.** It falls on a measured blank row, and every region stays above the printed footer; see "Answer space and page cuts" in [02-book-format.md](02-book-format.md).
- **Answer space printed inside a frame.** When the page prints a frame around the answer space
  (Practice 1, Practice 2 and Section 2's Practice 2 on sm05b) and the teacher's working is taller
  than that frame, keep the answer box **scrolling** inside its region. Do not open `space` there:
  a cut inside the frame leaves the outline broken (the frame's bottom edge and corners move down
  away from its sides), and a cut at the frame's own bottom edge draws the red box across the
  printed line. Do not shrink the text either. The frame is part of the printed page and must stay
  whole; the working is not part of it, so it is the working that scrolls. Accepted by the teacher
  on sm05b (2026-11-25). **One recorded exception**, sm05b p2b: when the answer cannot scroll at
  100 % — the reader's fit pass shrinks that answer to 50 % instead — the teacher accepted opening
  the page below the frame's bottom edge (647 pt of working in a 590 pt frame, 60 pt opened, the
  last two lines below the rule). See "Accepted exceptions" in `docs/chapters/sm05b.md`; prefer
  scrolling, and record any such case rather than letting it pass silently.
- **Before trying a new look**, back up the project folder so it can be reverted in one step.

## 2. Worked solutions

- **Follow the teacher's method exactly:** the same unknown, the same order of steps, and the same final sentence as the red-boxed working in the ANS.
- **Hong Kong conventions:**
  - "Let $x$ be …" when the key defines the unknown;
  - $\because$ … and $\therefore$ …;
  - integer reasoning written out: "$\because$ $k$ is an integer.", then "$\therefore$ The maximum possible value of $k$ is 7.";
  - final answers underlined where the key underlines them: `\\underline{26}`.
- **One step per line.** Each algebra step is its own `m()` line, so a tap reveals exactly one move.
- **Side reasons** are short and start with the operation: "+ 10", "÷ 2", "÷ (−6): reverse", "collect like terms", "set up from the question". Always flag a sign reversal.
- **Geometry reasons** use the bracket phrase a marker accepts, and a parallel-line reason names the lines. The reason stays on the same line as the step, at the same size as the working, immediately to its right. The phrases are: `given`; `SAS` / `SSS` / `ASA` / `AAS` / `RHS`; `common side`; `adj. ∠s on st. line`; `vert. opp. ∠s`; `corr. ∠s, AB // CD`; `alt. ∠s, AB // CD`; `int. ∠s, AB // CD`; `corr. ∠s equal` / `alt. ∠s equal` / `int. ∠s supp.`; `∠ sum of △`; `ext. ∠ of △`; `base ∠s, isos. △`; `corr. sides, ≅ △s` / `corr. ∠s, ≅ △s`; `opp. sides of //gram`; `opp. ∠s of //gram`; `diags. of //gram`; `diags. bisect each other`; `opp. sides equal`; `opp. ∠s equal`; `2 sides equal and //`; `mid-pt. theorem`; `Pyth. theorem`.
- **Parts** get `h("(a)")` headings, normally one box per part.
- **Teacher margin notes** (`note()`) are for the key's pink side remarks, such as "Number of pages must be an integer, so …".
- **MC questions:**
  - test each statement I, II, III in turn, by working or with a counterexample (the "LQ method" substitutes values);
  - end with "$\therefore$ The answer is D." only if the teacher wants the letter shown;
  - leave answer squares empty unless asked (JM26 (B) removed the letters for Q23–Q30).
- **Check every final answer** against the ANS before release.

## 3. Number lines (HKDSE style)

The same style is used in the answer boxes (`nl()`) and in the graphics (`ray()`):

1. The axis has arrowheads at both ends, ticks, and real minus signs (−12, not -12).
2. A **short vertical line** rises from the boundary value.
3. A **circle** sits on top: **hollow** for $<$ and $>$ (the value is not included), **filled** for $\le$ and $\ge$.
4. The **arrow** runs from the circle in the direction of the solutions.
5. Integer solutions are red dots on the axis. In graphics, the answer value gets an orange ring, and sample values are labelled pins stacked so they never overlap.

For **ranges of two related variables** (e.g. "given $x > 0$, find the range of $y = 3x - 24$"), use the x–y picture:
- the x number line along the bottom and the y line up the left side, both in the style above;
- the given range in green, the resulting range in blue, and their overlap shaded orange;
- the relation drawn as a line, thick red where it satisfies the condition;
- dashed guides from the boundary point to both axes;
- a legend such as "given: x > 0, so: y > −24", adding "negative coefficient: sign reversed" when the sign flips.

## 4. Review links

Review links connect the wording of a question to the part of the answer it becomes. On the question they show as faint dashed boxes; in the answer they show as coloured dotted underlines (so neighbouring pieces in a formula do not clash). Tapping one opens a solid box on the question and a solid underline (with a light tint) on the answer, with a remark tag and a short leader line. Nested answer links stack their underlines downwards.

- **Link every word problem.** Skip printed worked examples, and questions where no phrase maps to a step (e.g. pure-algebra MC).
- **What to link:**
  - the definition of each unknown ("BC = x cm" → $x$);
  - each quantity built from it ("longer than BC by 4 cm" → $(x + 4)$);
  - the relation words ("at least" → $\ge$, "is shorter than twice" → $< 2(\dots)$, "not more than" → $\le$);
  - conditions ("x is a positive integer");
  - what is asked ("greatest value of x").
- **Link only what matters.** Box the exact phrase that maps to an answer part, not the whole sentence. In JM26 (B) Q5, "two consecutive even numbers" was unlinked, and only "the smaller number is x − 2" was linked.
- **Colours:**
  - amber for the inequality condition ("at least 23", "greater than 61 cm");
  - pink, blue and green for the quantities;
  - purple for a fifth link, usually what is asked.

  Within a question, each colour means one thing on both sides.
- **Tags** are short notes: "$AB = x + 4$", "at least → $\ge$", "least integer with $n \ge 8$".
- On the answer side, mark the smallest piece that matches: `L()` inside maths, or `[[key|words]]` in a sentence. Use `lk()` only when the whole line is the match.

## 5. Interactive graphics

A graphic should make the reasoning visible, not just repeat the algebra.

- **It must match the question.** It opens with a question card (the question in brief, then the same "Let …" lines and inequality as the worked solution) and uses the solution's letters.
- **It must suit the form.** Use pictures, bar models, counters, number lines and shapes. Don't use graphs of functions unless the class has learned them. JM26 (B) Q11 replaced a cost/income graph with a picture of oranges and two money bars.
- **Standard parts:**
  - the picture, which redraws live;
  - a slider for the unknown, with − / + and ▶ play;
  - a readout with the substituted calculation and ✓ satisfies or ✗ fails;
  - a caption explaining the current value ("Exactly 300 pages is not MORE than 300");
  - quick buttons for the key values ("Least value: 101", "Too few: 60", "Just enough: 72").
- **Colours:**
  - green means satisfies, red means fails;
  - amber marks the answer or boundary;
  - blue is the unknown;
  - soft tints are for areas.
- **Good fits by question type:**

  | Question type | Graphic |
  | --- | --- |
  | Polygon perimeter and side counts | Polygon slider, with the sides unrolled onto a ruler |
  | Consecutive numbers | The pair on a number line, with the +2 jump |
  | Money and counts | Counters or items plus money bars |
  | Journeys | Bar models of distance |
  | Mixtures | A beaker filling in layers |
  | Angles | An n-gon with angle arcs |
  | Two related variables | The x–y range picture |
  | MC | Sliders for the variables, a live true/false for each statement, and a "find a counterexample" search |
  | Percentage change | Original bar vs new bar, with the change marked |
  | Successive changes, growth and decay | A bar per period with the factor between bars (JM27 (A) `timeline()`) |
  | Reverse percentage ("… ago", "original") | The same timeline, with a slider for the start until the given bar matches |
  | Threshold ("less than half", "double") | The timeline with an amber threshold line |
- **No overlaps.** Labels, pins and legends must never collide. Check every graphic's QA screenshot at the default value and at the extremes.

## 6. Ink and tools

Ink behaviour belongs to the engine and is the same in every book, so there is nothing to author per chapter. If the teacher asks for an ink feature, add it to `engine/ink/` for all books.

## 7. Measuring a printed figure (for panel animations)

The printed physics diagrams in this book are **not black ink**. The trajectory lines are
yellow-green at high saturation; only the labels (75°, 60°, …) are black. So a luminance
threshold (grey < 128) finds the labels and misses the curves, and a fit scored against that
mask converges on a label instead of a curve.

- Mask the curves by saturation, not brightness: max(r,g,b) - min(r,g,b) > 40 and max(r,g,b) > 90.
- Each trajectory is a parabola whose apex x is the midpoint of launch x and landing x (checked on
  p7: 414.4 / 444.8 / 456.0 against midpoints 414.4 / 444.8 / 456.0). So a curve is pinned by three
  numbers: launch point, landing point, apex height. Read the apex height from the saturated runs at
  the apex column; do not fit a free-form curve.
- p7 measured apex heights above the launch point y = 216.0: 15° 7.7, 30° 31.3, 45° 65.5,
  60° 95.3, 75° 120.0 pt. The family is drawn with a vertical stretch of about 1.5–1.6× against
  real physics, and the stretch is not uniform — do **not** rebuild them with a single factor.
- Animate the ball on the measured parabola and leave the printed curves untouched; the poster and
  the last frame must be a straight crop of pages/pNN.jpg (native 3 px/pt), so nothing shifts when
  the animation ends.
- The green landing discs are the shared endpoints: p7 has three, at x = 454.0 (15°/75°),
  514.8 (30°/60°) and 537.2 (45°), centre y = 216.3. Complementary angles share a range but **not**
  a flight time: t ∝ sin θ, so the shallow one lands first.

## 8. Panel overlays: measure them, then watch every frame

p1 `ResolvingVelocity` shipped broken for a whole release and no check caught it, because
`--still` compares only the opening frame (guides) or the closing frame (media) — both are the
printed figure, so overlays that are misplaced or out of shot still PASS.

What went wrong on p1 (2026-11-20):

- the overlay arrows used a second coordinate set: `v` ran from (406, 206) to (566, 82), so its tip
  sat 21 pt above the camera frame. Nothing of the triangle was in shot; only a stray `θ` and
  duplicated labels landed on the page.
- a white cover hid the printed "y (vertical) component of velocity" for the first seconds.
- the film re-drew labels the print already carries ("vx = v cos θ" twice, "vy = v sin θ", θ).

Rules from here on:

1. Measure every overlay point on pages/pNN.jpg (colour mask + line fit) and keep it as a named
   constant with a comment saying where it was measured. On p1 the printed figure gives: v from
   (403.0, 258.9) to (521.7, 164.4) at 38.6°, the green guide at y = 265.5 from x 403.7 to 522.3,
   the red guide at x = 402.2 from y 259.0 to 142.3.
2. `--still` proves only that the poster is the print. Before rendering the film, pull three or
   four frames from the middle of it (`ffmpeg -v error -y -ss <t> -i <mp4> -frames:v 1 f.png`) and
   check that every overlay sits on the line it explains.
3. Do not re-draw what the print already has. Fill its dashed guides with solid arrows in the
   printed colours (sample them: p1 green #19eb16, red #fe030a, blue #1404ff), or highlight and
   follow them; add new words only where the print has none.
4. A white cover is only for page text that bleeds into the figure's bounding box (for example the
   last lines of a question). Never cover the figure's own labels.
5. Vectors act at the centre: the tail of a velocity, weight or acceleration arrow is the object's
   centre, never the top of the ball. If the arrow needs room below the object, grow the canvas —
   the Q6 widget went from `HT 250` to `270` so the v_y arrow stays whole when the ball reaches
   the floor.

## 9. Long division and aligned equation blocks

These are set with KaTeX arrays. The helpers are **per book**: they live in
`books/<id>/solutions.js`, and `books/_template/solutions.js` starts empty. Copy the block from
`books/sm05a/solutions.js` (from `const raw` through `eqParts`) into a new book verbatim — do not
re-derive it, and do not change the numbers below. Each rule here was bought with a rejected draft.

### 9.1 Long division — `DIV(divisor, rows)` / `divLines(rows)`

- **One array, one cell per line.** Every line of the sum is one cell, so all lines share the same
  power slots: a term sits under the same power, a sign under the same sign, and a bare `x` is
  padded so it lines up with the `x` of a wider coefficient.
- **Pad every power column to the widest coefficient** in the sum (`\phantom{0}`). KaTeX does not
  support a zero-gap column spec: `{r@{}r}` fails with "Unknown column alignment: @".
- **Divisor and bracket stand in the dividend's own line**, so they share its baseline. The bracket
  is `\Big)` — a shade taller than the leading power, its tip level with the rule — and a `\,` sits
  between the bracket and the dividend.
- **The rule is a zero-width `\mathrlap` overline** over the dividend, lifted by a
  `\rule{0pt}{1.18em}` strut to the bracket's tip and drawn `0.54em` left of the cursor that
  follows the bracket. The `\mkern` pair sits **outside** the rlap: a negative kern inside one moves
  the dividend's own line. The overline pads its own right end by 3mu — the same as the `\,` after
  the bracket — so widening by 0.54em alone ends the rule level with the bars.
- **Every subtraction bar is an underline of that line**, padded out to the grid's right edge minus
  one thin space (KaTeX pads an underline by 0.2em). A line whose first sign comes after the first
  slot opens the underline with `{}` so the sign keeps binary spacing and the line does not shift
  left.
- **A leading negative** carries a phantom `-` in the other lines' slot-0 filler so the digits still
  line up; its own `-` opens with `{}`, because the rule's rlap is an ord atom and a bare `-` after
  it would take binary space in the dividend's line only.
- **Bars never start left of the line's own first sign.** The rule starts at the bracket's tip; the
  rule and every bar end at the same right edge.
- **A zero remainder prints nothing.** When the remainder is 0 the grid stops at its last
  subtraction bar — the key leaves that line blank, so do not add a row with `0` in it. Drop the
  last row from the coefficient list instead of writing `{ c: [..., 0] }`; a printed `0` there is
  a step the key does not have (sm05b review, 2026-11-25: it was the only thing circled on six
  divisions).
- **No numeric coefficients** (all `k`): write the grid out by hand, starting the working lines
  under the dividend's `+kx` and letting the widest line set the rule and every bar's right end.

### 9.2 Aligned equation blocks

- `eqBlock(rows)` — equals in one column (`\begin{array}{rl}`, `&{}=`).
- `eqSym(rows)` — the same, with a ∵ / ∴ standing at the left margin of the lines that carry one.
- `eqOr(rows)` — adds the "… or …" branch, each half with its own equals column.
- `eqParts(width, groups)` — one block revealed one part at a time: pad every row to the block's
  widest left-hand side with `\smash{\hphantom{…}}` and lay its own wording over that with
  `\mathllap`, so all parts keep one equals column. A part's prose line joins the equation that
  follows it. Use `&{}\mathrel{=}`, not `&{}=`: the reader breaks a long line before a `=` at brace
  depth 0, and an array must never be cut there.
- **Several separate blocks** where the key sets several: each keeps its own equals column,
  exactly as the ANS has it. Comparing two coefficient pairs means two `eqBlock`s, so each pair's
  `=` sits in one column.
- **"Prove (x − a) is a factor" blocks.** The key sets `f(a) =` at the left margin, its `f` level
  with the `f` of the `f(x) = …` line above; the substitution stays on that same line, to the right
  of `f(a) =`; `= 0` goes on the next line with its `=` under the first one (so the block reads
  `f(−4) = [ … ] − 21(−4) + 21` / `= 0`). Do **not** put `f(a)` and the substitution in an equals
  array (the column pushes `f(a)` off the margin and reads `f(a) = 0` above the substitution), and
  do not add a `= 0` at the right of the substitution line. Set the two lines as plain `m()` steps
  wrapped in `align()`. When the same block also carries the `f(x) = …` line above, set all of
  `f(x)`, `f(a)` and `= 0` as rows of **one** `eqBlock`/`EQ`, so the three equals share a column
  (sm05b Q17(a)); sm05b p2b(b), Q15(b) and Q16(b) are the other three shapes.
- **A substitution that must stay on one line.** KaTeX's `\dfrac` inside `\left(…\right)` makes
  such a line wider than the answer column, and the reader then breaks it before the `=`. Use
  `\tfrac` (a small stacked fraction, which is what the key prints anyway): sm05b Q13's
  `f(−½) = 2(−½)³ + 17(−½)² + 40(−½) + 16 = 0` fits at 100 % on one line.
- **Where the `= 0` goes.** In a plain substitution chain it ends the same line, as the key writes
  it (`f(−½) = … + 16 = 0`; teacher's mark on sm05b Q13, 2026-11-25). In the "prove (x − a) is a
  factor" blocks above it goes on its own line, because that layout is about putting `f(a)` under
  `f(x)`. Same chapter, two shapes — follow the key for that block, and the teacher's mark if it
  says otherwise.
- **A short pair under a long line joins that line's equals column.** When the key sets
  `∴ (4−3)[3(4)² + b(4) + 16] = …` and then `4b = −88` / `b = −22` (sm05b Q10(b)), the short lines
  are the same array as the long one, right-aligned into its column, so all three `=` fall in one
  place. Check the key at 4× before deciding: sm05b's does line them up (page x ≈ 215), while its
  Q10(a)(i) block is ragged, and the teacher asked for the column in both.
- **An array must survive the reader's "wrap" pass.** When the authored layout does not fit, the
  reader re-lays the answer out and cuts a maths string at every `=` it meets at brace depth 0; an
  array cut there loses its `\begin`/`\end` and is printed as raw red TeX. Write the array's own
  sign as `&{}\mathrel{=}`, and give the same treatment to any `=` written inside a cell — a row
  like `f(1) = 3(1)³ + … = −20 ≠ 0` carries two. sm05b's `eqSafe()` / `guard()` do this; sm05a's
  arrays happened to fit and never reached that pass, which is why the hazard only showed up on
  the second book.
- **A chain that starts `f(…) = …` is revealed one row per tap** (teacher's finer rule, sm05b,
  2026-11-26 — it **supersedes** the earlier "split after row 1" rule). Part 1 is the statement —
  `f(<constant>) = 0` **or** `f(<constant>) = <expression>`, e.g. `f(1) = 2b + 36` or
  `f(−1) = 2a + 12`; part 2 substitutes the constant into the function; then each simplification
  is its own part, with a cut before the factorisation; the solved values follow. In practice every
  row of the block is one part: a 4-row block is 4 taps, a 5-row block 5, a 6-row `… or …` block 6.
  Write the block's rows once and let the helper cut them: `EQSPLIT(width, rows)`,
  `EQCOLSPLIT(width, symbol, rows)`, `EQCOLORSPLIT(width, symbol, rows)` in sm05b's solutions.js,
  which default to every boundary (pass `cuts` to keep a group together). The same treatment
  applies when the chain starts `f(x) = 0` (p2c, and q15–q20's (c)/(b)(ii) blocks) or
  `f(x) − g(x) = 0` (q20(b)(ii)): statement → substitute/expand → simplify → factorise → solve,
  one row per tap.
- **When the teacher gives a total for a question, the counter is the check.** The red marks are
  the cuts and the number is the total number of taps for the whole question — every block and
  every prose line together. If your own reading gives a different number, the number wins: keep
  the marks' grouping where it is unambiguous and merge the remaining chain rows until the
  reader's counter reads the target. Two tools, both in sm05b's solutions.js: the third argument of
  `EQSPLIT` / `EQCOLSPLIT` (`[1, 2]` = statement, substitution, then the remaining rows as one
  part), and `CHAIN([...])` for two or three hanging lines revealed together — an `aligned` block
  with the relation as `\mathrel{}`, plus a `0.277em` negative kern when the left side is empty,
  because `aligned` otherwise adds its own column separation and the relation would sit right of a
  plain `= …` line. Measure every merged row's equals x against the pre-merge build: the count is
  not worth a moved column (sm05b's `aligned` variants were tried until one reproduced the plain
  line's x exactly). Record the agreed totals and the merged groups in the chapter file, so the
  next round starts from them.
- **A row on its own tap costs a line of height.** Each part is a `.ln`, so the row sits on a
  42.5 px step line instead of the array's 28.1 px rhythm: ≈ +14 px per row, ≈ +45 px for a 4-row
  block, +74 px for 6 rows. An answer tuned to its region then tips in one of three ways — it
  scrolls, it gets cut into side-by-side columns (silent: `check_book.mjs` reports nothing, so
  audit `.abox` offsets), or it falls into the shrink-to-fit pass at 50 % type. Give it the room
  the QA warning names in `extract.overrides.<id>.space`, re-build `layout.json`, and audit again.
  sm05b's finer round needed: q2 12, q3 32, q4 50, q5 55, q6 65, q8 131, q9 229, q10 221, p2b 60,
  q15 30, q16 26, q18 11. If an answer still cannot fit its printed frame at 100 %, say so and
  report the numbers — never shrink the text (sm05b p2b: 647 pt of working in a 590 pt frame).
- **Choosing the parts:** a part ends where the working changes tack — statement, substitution,
  simplification, factorising, solving. An MC answer box appears with the last part; it is not a
  step of its own.
- **Equals must line up with the ANS**, not merely be consistent with each other. Match the key's
  grouping question by question, then check it on a screenshot of that page.

## 10. Solution-guide clips

A guide is a silent animation of a worked answer. The reader owns the player — ▶ / ❚❚, ↻ Replay, and a
scrubber — and a guide never adds widgets, captions, music or a caption strip.

**Two deliveries.**

- **`media` — the answer itself.** The clip lies over a question's answer region in `layout.json`, so
  the reader's pen draws on it (the ink canvases are appended after the overlay), and the round button
  on the panel's top-right corner plays it. Because the clip *is* the answer, give that
  question `printed: true` in `solutions.js` (no typed boxes, no strip) and **delete its `space`** from
  `layout.json` and from `extract.overrides` — a `space` cut opens blank paper under the region even
  when no answer box is built there. The region stays exactly as `layout.json` has it: `media.js`
  stretches the clip with `object-fit: fill`, so render at that region's aspect.
- **`guides` — a figure's solution.** The typed answer stays; the film button in its control strip (or
  the corner chip of a printed answer) opens the modal player.

**Shared rules.**

- **Draw the answer's own tex.** Read it from `SOLUTIONS` (`boxes[i].steps.find(s => s.m).m`) and set
  it exactly as the answer does: `.abox` type (12.5 px serif, `line-height` 1.32), KaTeX at `1.04em`,
  `displayMode: false` with a leading `\displaystyle`. Never retype the maths for a clip: a second copy
  is how the video and the answer drift apart.
- **A printed answer's steps are data, not a solution.** When a clip replaces the answer, `printed: true`
  alone is not enough: `buildOverlay` skips a printed solution, but a browser holding an older
  `solutions.js` (p1 without the flag) draws the typed boxes under the clip — that is the stray answer
  the teacher kept seeing on sm05a p1 (2026-11-27). So the steps of a printed answer move out of
  `SOLUTIONS` entirely: `export const P1_STEPS = […]`, `SOLUTIONS` keeps `{ id: "p1", printed: true,
  boxes: [] }`, and the stage imports `P1_STEPS` and builds `const p1 = { boxes: P1_STEPS }`. There is
  then no older file in which those boxes could come back.
- **When `tools/render_media.py` and `tools/manim/guide.py` are absent** (this starter has neither),
  the route is an HTML stage plus Chrome: `books/<id>/media/guide-<q>.html` exposes
  `window.GUIDE = { width, height, fps, duration, ready, render(t), audit(), geometry() }`, and
  `node tools/render_guide.mjs <id> <q>` serves the repo, screenshots frame *n* at `n / fps`, and
  encodes H.264 / yuv420p with ffmpeg. `render(t)` must be a pure function of *t* — no timers, no
  `requestAnimationFrame`, no randomness — or two runs disagree.
- **A KaTeX array lays its rows out first, so reveal rows where they already stand.** Hide a row
  with `opacity` and fade it in, never by re-rendering a shorter array: the row then arrives already in
  its own place and nothing above it moves. The array's row `<span>`s sit in the inner `.vlist` of
  `.mtable > .col-align-l` (a cell may hold vlists of its own — take the one with the most `pstrut`
  children).
- **The poster is frame 0: the plain sum, before it starts.** A solution region should read as "the
  sum is here, press play"; the answer arrives with the animation, not on the poster. (For an old-style
  summary panel the poster was the last frame; that is not this delivery.)
- **One scale for every part, and it is 1:1.** The type never changes size between (a) and (b). Measure
  **after `document.fonts.ready`**: before the KaTeX fonts load the fallback glyphs are ≈ 7 % narrower,
  so a width taken too early comes out wrong (221.7 pt instead of 237.8 pt on sm05a p1) and the columns
  land off-centre.
- **Both parts side by side, at the book's own type size.** (Teacher, 2026-11-27: (a) and (b) as the
  answer sheet sets them; "final solution 用 100% 字級，唔准縮".) Take the region from the **printed
  frame's interior** — measure the frame lines in the page image, and stop the region **below the
  printed question lines**: the frame's top belt is the question itself, so a panel that reaches it
  hides the question the answer belongs to. sm05a p1: frame x 35.8–563.5, y 477.7–786.8; the question
  belt runs to 515.9, so the region is `[36.5, 516.5, 563.0, 785.2]` = 526.5 × 268.7 pt at 1600 × 816 px
  (0.07 % skew). Then: (a) left, (b) right, **one top line**, each label over its own division and each
  division followed by its own one-sentence conclusion, all at 12.5 px with the reader's own line boxes
  (`.ln` padding 0.06em / 0.5em, `.katex` 1.04em). A block is as wide as its widest line (usually the
  conclusion); centre the pair and let the gutter take the difference.
  sm05a p1 measured: (a) 237.8 pt, gutter 24, (b) 246.8, margins 8.95 each, heights 183.9 / 152.7 in a
  268.7 pt region — 85 pt of white below for the callouts.
- **A stacked pair at 100 % does not fit, and this is arithmetic, not an opinion.** The two divisions
  need 240.0 pt and the two conclusions 33.2 — 273.2 pt with no labels at all — against 268.7 pt of
  answer space. Side by side needs only the taller of the two. Do not answer the shortfall with a
  smaller type: the 0.81 pull-back was rejected on 2026-11-27 after it shipped (`final frame 1:1`), so
  **there is no camera any more** — the stage is the frame, and the last frame is the typed answer.
- **A scrubber, not a second control bar.** `media.js` gives every media panel a range strip
  (`book.json` `media[].scrub = { left, width, top|bottom, height }`, page points) because only the book
  knows which part of its clip stays empty. It is the one part of a panel with `pointer-events: auto`;
  the pen still draws over the rest, and a stroke that starts on the strip seeks instead of inking
  (`input` is in the ink module's ignore list). A side-by-side answer has no empty corner, so sm05a p1
  puts it in the white band under the working (left 386, top 247 of 526.5 × 268.7 — 1.2 % of the panel),
  clear of both the conclusions and the callout band.
- **Check it, then look at it:** `node tools/qa/guide_check.mjs <id> <q>` covers both deliveries.
  Inline: one media panel exactly on the region, the video's edges on the panel's, the video aspect
  within 0.3 % of the region's, **no printed page text under the panel** (the region stops below the
  question lines), **nothing but the panel on the answer page** (`.media` 1, `.qa` 0, `.abox` 0,
  `.ln` 0 — a stale typed answer cannot hide there), no film button, ▶ / ❚❚ / ↻ behaving, the scrubber
  inside the panel and under 5 % of its area, a stroke across it seeking without drawing, a pure white
  poster corner, and **ink drawn over the video still there after a reload, above the video**.
  Dialog: the button, the modal, play/pause/replay/Esc, the poster. Then pull two frames out of the
  finished MP4 (`ffmpeg -ss <t> -i <mp4> -frames:v 1`) and read them: the encode, not the stage, ships.
- **Ship it:** the `media` (or `guides`) entry in `book.json`, the media files, and a `sw.js` CACHE
  bump — the bump is what versions every data url and the clip itself, so a reader stuck on an old
  worker still gets this release ([04-qa-and-release.md](04-qa-and-release.md) §5). `sw.js` already
  caches `/media/*.mp4` and answers Safari's byte ranges from the cached file.

### 10.1 A clip must show the thinking, not just the printing

A clip that only writes the division out, one line at a time ("just printing the solution"), was
rejected on sm05a p1 (2026-11-27). So was a callout rebuild that treated every operation the same
(more below). The device the teacher settled on is **operation, all its terms lit at once, the
arithmetic, and the result landing**.

- **One beat per move: 3.0 s, ±0.15 s.** sm05a p1 has run 3.4/3.6 s (first cut) and 2 s (the teacher
  found it too quick to read), and settled on **3 s flat** for every move on 2026-11-27 — 19 moves
  plus the two conclusions come to **67.7 s**. The entry and exit animation of a beat live **inside**
  its 3 s (the device lights at 0.62 s and is gone by 2.82 s), so a beat is never stretched by its own
  animation. `guide_audit` fails any beat outside 3.0 ± 0.15 s. If a count runs past 100 s, stop and
  tell the teacher before rendering.
- **Every operation lights every term it involves, at the same moment.**
  - **DIVIDE** — the working row's leading term, the divisor's leading term, and the new quotient term
    (which arrives as it lights).
  - **MULTIPLY** — the whole divisor, the quotient term, and the product row.
  - **SUBTRACT** — **no callout box at all**: bracket the product row in place (a parenthesis each
    side, a red minus to its left) and light the working row, the product row and the result together.
  - **BRING DOWN** — the whole intact tail at once (`−9x + 28`, not one term), with downward arrows
    from the terms to their landing places.
  This is the general rule for every polynomial long division, not p1's numbers.
- **"One term per bring-down" is superseded** (the teacher reversed it on 2026-11-27). The old rule
  split `−9x` and `+28` into two beats because `P1A` prints the 28 in two rows; the teacher wants the
  untouched tail brought down in one move and then no separate `+28` beat. Consequence: the next
  subtraction's result is `3x + 28`, not `3x`, and its working row is `4x² − 9x + 28`. A term may be
  lit again as part of a row an operation acts on; what must not happen is the same term *arriving* in
  two separate bring-down beats.
- **Callout style:** a white panel with a blue border — the one-word label and `n / N` on its top
  line, then this question's arithmetic in KaTeX, 0.82× the working's type. MULTIPLY writes its factor
  on one line and the product under it, at the "="; DIVIDE and BRING DOWN are one line.
- **Where a callout goes (teacher, 2026-11-27 — supersedes the fixed side column):** at the **lower
  left of the step it belongs to**. Its left edge sits on the left edge of the beat's **leftmost
  highlighted ink**, and its top sits **8 pt under the bottom of the beat's lowest row** — the rows the
  beat highlights *and* the row it writes — so the box never comes closer than 8 pt to the step it is
  talking about (it used to be 4 pt; the teacher asked for the gap on 2026-11-27). It may then lie over
  anything else (a finished row, the other column, a conclusion, printed page text), but **never over
  the step itself**: that overlap is measured and must be zero. A box that would leave the frame is
  slid back inside and the shift is reported in points; the type is never shrunk to make it fit, and a
  box is never re-wrapped to dodge something — report the geometry instead. Round the top **up**, never
  to nearest: rounding down eats into the 8 pt.
- **No leaders and no arrow heads.** The box is the whole pointer: DIVIDE, MULTIPLY, SUBTRACT and the
  remarks carry no line and no arrow. **BRING DOWN keeps its downward arrows** from the intact tail to
  the terms it lands on, and its box still has no leader.
- **The conclusion ties the sentence to the working.** After each part, show the answer's own
  conclusion (`∴ Quotient = …, Remainder = …`, from its `t()` step). When it appears, light the
  sentence's quotient **and** the division's quotient row **blue** at the same moment, and the
  sentence's remainder **and** the division's last remainder **green** at the same moment. This is the
  only colour coding in the clip.
- **Highlight with a tint behind the ink**, never on top and never by recolouring the glyphs: an amber
  fill (≈ 0.18) with a thin amber edge around the terms or the whole row. One tint rect per target;
  every tint of a beat is driven by one opacity so they cannot drift apart.
- **Read terms back from the rendered array.** KaTeX gives every atom a span; `\phantom` atoms are
  painted in the **transparent colour** (not `.mphantom` — test the colour, and drop the zero-width
  spaces KaTeX puts in rules and struts). Take only *innermost* atoms, split a row at `+`/`−`; a
  superscript's digit is its own atom next to its base, so a term is a run of atoms, not one span.
  Then a term can be revealed, highlighted and measured without a second copy of the maths.
- **The callout's coverage is the audit's geometry check.** For every beat it measures the box
  against the step's own rows' ink (must be 0 px²), the **vertical gap** from the box's top down to
  that ink (must be ≥ 8 pt, printed per box; sm05a p1 measures 8.0–8.3 pt), and against every other
  piece of ink in the frame (allowed; the area and the rows it touches are printed, so the teacher can
  see what each box lies over). It also fails if any leader is drawn, if an arrow appears on a beat
  that is not BRING DOWN, if a box leaves the frame, if a box had to be clamped, or if a beat is
  outside 3.0 ± 0.15 s.
- **The ink model is half the job.** A KaTeX atom's box is the ~1.28 em line strut, not the glyph, so
  neighbouring rows' boxes overlap and no lane ever looks free: shrink each atom to its ink band
  (≈ 0.20 of the box off the top, 0.18 off the bottom) and take only the 1 px border of a
  `.underline-line` / `.overline-line`. **But never shrink a delimiter**: `\Big)` fills nearly the
  whole of its box, and shrinking it hides the bracket's tail from the lane check — that is how a
  leader ends up drawn through the bracket while the audit says "no crossings".
- **The bring-down arrows are not leaders.** They must start under the dividend's term and end on the
  landing term, and in an answer where the subtraction bars span the whole row they will pass the
  product's rule. Draw them in front (the arrow is the gesture); the audit checks them against glyph
  ink only and reports the rule crossing separately.
- **The frame is the answer space** when the clip replaces an answer, at the book's own scale: 12.5 pt of
  `.abox` type is 12.5/526.5 of the frame width, i.e. 38 px of a 1600 px frame (3.0389 px per page
  point). Nothing is cropped and nothing is scaled: the stage *is* the frame.
- **Audit the arithmetic, the highlights and the geometry.** `node tools/qa/guide_audit.mjs <id> <q>`
  re-reads the terms each move actually reveals and compares them with the callout's result (DIVIDE,
  MULTIPLY: the "=" RHS; SUBTRACT: work − product = result, as polynomials; BRING DOWN: tail = landing),
  prints every move's highlighted terms, the lane each leader took, the arrows' glyph/rule hits, and
  flags any callout outside the frame or over its own step. It also prints the measured frame (both
  columns' widths and heights, the gutter, the corner, the type size), every box's rect in page points
  and what it lies over, and counts the remarks separately. All 17 of sm05a p1's moves match; no box
  covers its own step (0 px² on every beat); no leader is drawn; the two bring-down arrows cross only
  the subtraction rule. On sm05a p1 the one box that had to be clamped is (b) BRING DOWN, slid 46.7 pt
  left to stay inside the frame.

### 10.2 A missing power written as 0 gets a remark

When the key writes a missing power as a 0 coefficient (`−8x³ + 0x² − 12x`, `2x² + 0x + 3`), the clip
must say so — that the 0 is deliberate, not a typo. This is a general rule for every long division
whose dividend or divisor carries a `0x` placeholder (sm05b Q11–Q13 and Practice 2 will need it).

- **Two remarks, same wording family** (teacher, 2026-11-27): one **before the division** ("Give each
  missing power a 0 coefficient"), lighting only the divisor's `0x`; and one **between the first
  MULTIPLY and its SUBTRACT** ("Add a 0 coefficient for missing power"), lighting the product's `0x²`
  **and** the divisor's `0x` it comes from. The second one used to carry a second clause ("— give each
  missing power a 0 coefficient"); the teacher trimmed it to the one sentence, so keep a remark to a
  single clause that names what to do, not the general rule.
- **A remark stands alone**: no other tint, callout, bracket or leader on screen while it speaks; it is
  the only thing the frame says. Give it the same box as an operation (white, blue border) with the
  label `REMARK` and its own `n / N`. It has **no leader** — its subject is the tinted term.
- **Hold it for the same 3 s beat** as an operation (3.0 ± 0.15 s), entry/exit inside the beat.
- **Say what you lit.** Report the exact terms each remark highlights, so the teacher can trim one if
  the wording meant only the other.
