/**
 * Worked solutions for SM05 (B) More about Polynomials.
 * Written from the teacher's ANS key: same method, same steps, same final sentence.
 * Field reference: docs/02-book-format.md. House style: docs/03-authoring-style.md.
 */

import { m, t, h, note, align, L, lk } from "../../engine/authoring.js";

const raw = String.raw;

/* ---------------------------------------------------------------------------
   Long division, drawn like the key.

   Every line of the sum is one cell of one array, so all lines share the same
   power slots: a term sits under the same power, a sign under the same sign,
   and a variable lines up with the variable of a wider coefficient. The
   divisor and its bracket stand in the dividend's own line, so they share its
   baseline; the rule over the dividend is an overline that begins at the
   bracket's tip and ends with the sum; and every subtraction bar is an
   underline that runs from that line's first sign to the same right edge.
   --------------------------------------------------------------------------- */
const xp = (p) => (p === 0 ? "" : p === 1 ? "x" : raw`x^{${p}}`);
const pads = (n) => raw`\phantom{0}`.repeat(Math.max(0, n));
const SEP = raw`\;+\;`;
const GAP = raw`\phantom{\;+\;}`;
/** The bracket: a shade taller than x³, its tip level with the rule. */
const BRACKET = raw`\Big)`;
const DIVGAP = raw`\,`;
/** Height of the strut that lifts the rule to the bracket's tip. */
const RULELIFT = "1.18em";
/**
 * The bracket's tip stands this far left of the cursor that follows the bracket.
 * The rule is drawn that far left — by a pair of kerns *outside* the rlap, since
 * a negative kern inside one moves the dividend's own line — and widened by the
 * same amount: an overline pads its right end by one `\,`, exactly the space
 * that follows the bracket, so the rule then ends where the sum ends.
 */
const TIP = "0.54";
/** The rule over the dividend, `width` wide, starting at the bracket's tip. */
const ruleOver = (width) =>
  raw`\mkern-${TIP}em\mathrlap{\overline{\phantom{${width}}\mkern${TIP}em\rule{0pt}{${RULELIFT}}}}\mkern${TIP}em`;

/**
 * One cell per line: `pre` holds what comes before the line's first ink (the
 * power padding, and the sign's space), `body` the line itself, padded out to
 * the right edge of the grid so a bar can run to it.
 */
function divLines(rows) {
  const n = rows.find((r) => r !== "rule").c.length;
  const widths = [];
  for (let i = 0; i < n; i++) {
    let w = 1;
    for (const r of rows) if (r !== "rule" && r.c[i] !== null) w = Math.max(w, String(Math.abs(r.c[i])).length);
    widths[i] = w;
  }
  // A sum whose leading term is negative carries a sign in the first slot; the
  // other lines pad that sign out so their digits still line up.
  const sign0 = rows.some((r) => r !== "rule" && r.c[0] < 0) ? raw`\phantom{-}` : "";
  const v = (i) => xp(n - 1 - i);
  const dig = (c, i) => (i < n - 1 && Math.abs(c) === 1 ? "" : String(Math.abs(c)));
  const term = (c, i) => pads(widths[i] - dig(c, i).length) + dig(c, i) + v(i);
  const ghost = (i) => raw`\phantom{${"9".repeat(widths[i])}${v(i)}}`;
  const gone = (i) => (i === 0 ? sign0 + ghost(i) : GAP + ghost(i));

  return rows.filter((r) => r !== "rule").map((r) => {
    const cs = r.c;
    const first = cs.findIndex((c) => c !== null);
    const d0 = dig(cs[first], first);
    const pad0 = pads(widths[first] - d0.length);
    let pre = "";
    for (let i = 0; i < first; i++) pre += gone(i);
    let body = "";
    if (cs[first] < 0) {
      if (first > 0) {
        pre += raw`\;`;
        body += raw`-\;`;
      } else {
        // An empty group keeps the leading minus binary, so this line starts in
        // the same column as the dividend's — whose minus follows the rule's
        // rlap, a plain ord atom, and therefore takes binary space too.
        body += raw`{}`;
        body += "-";
      }
      body += pad0 + d0 + v(first);
    } else if (first > 0) {
      pre += GAP + pad0;
      body += d0 + v(first);
    } else {
      pre += sign0 + pad0;
      body += d0 + v(first);
    }
    for (let i = first + 1; i < n; i++) {
      const c = cs[i];
      if (c === null) body += gone(i);
      else body += (c < 0 ? raw`\;-\;` : SEP) + term(c, i);
    }
    return { pre, body, bar: !!r.bar, startsNeg: first > 0 && cs[first] < 0 };
  });
}

/** Divisor with its bracket on the dividend's line, and the sum under the rule. */
function DIV(divisor, rows) {
  const [quot, divd, ...work] = divLines(rows);
  const head = `${divisor}${DIVGAP}${BRACKET}`;
  const pad = raw`\hphantom{${head}}`;
  const rule = ruleOver(`${divd.pre}${divd.body}`);
  // A bar is an underline of the line itself: the empty group keeps a leading
  // minus a binary sign (so the line sits exactly where the plain lines do) and
  // the thin negative kern trims the padding KaTeX adds to the rule.
  const rest = (c) =>
    c.bar ? `${c.pre}\\underline{${c.startsNeg ? "{}" : ""}${c.body}\\mkern-3mu}` : `${c.pre}${c.body}`;
  const lines = [
    `${pad}${DIVGAP}${quot.pre}${quot.body}`,
    `${head}${rule}${DIVGAP}${divd.pre}${divd.body}`,
    ...work.map((c) => `${pad}${DIVGAP}${rest(c)}`),
  ];
  return raw`\begin{array}{l}${lines.join(" \\\\ ")}\end{array}`;
}

/** Lines whose equals must sit in one column (as the key writes them). */
const eqBlock = (rows) =>
  raw`\begin{array}{rl}${rows.map(([l, r]) => `${l} &{}= ${r}`).join(" \\\\ ")}\end{array}`;

/** The same, with a ∵ / ∴ standing at the left margin of the lines that carry one. */
const eqSym = (rows) =>
  raw`\begin{array}{lrl}${rows.map(([s, l, r]) => `${s} & ${l} &{}= ${r}`).join(" \\\\ ")}\end{array}`;

/** An equation block whose last lines branch into "… or …", both halves aligned. */
const eqOr = (rows) =>
  raw`\begin{array}{rlcrl}${rows
    .map(([l, r, or, l2, r2]) =>
      or ? `${l} &{}= ${r} & \\text{or} & ${l2} &{}= ${r2}` : `${l} &{}= ${r}`,
    )
    .join(" \\\\ ")}\end{array}`;

/**
 * One block, split into the parts the reader reveals one at a time. `groups` holds
 * one part per step; a part is a list of rows — `[left, right]`, or
 * `[left, right, true, left2, right2]` for an "or" row — and may open with a line
 * of prose, which then appears together with the row that follows it.
 *
 * `width` is the block's widest left-hand side. Every row is set to that width by
 * a hidden phantom and its own wording is laid over it with `\mathllap`, so the
 * equals signs of all the parts fall in one column even though each part is a
 * step of its own. The prose line is drawn at the text margin (`\ln.m` is inset by
 * 0.9em of the box, i.e. 0.865em of the maths that is set 1.04em large).
 */
const eqParts = (width, groups) => {
  const wide = raw`\smash{\hphantom{${width}}}`;
  const side = (l) => `${wide}\\mathllap{${l}}`;
  const prose = (text) => `${raw`\mathrlap{\kern-0.865em\text{${text}}}`}${wide}`;
  // `\mathrel{=}` rather than a bare `=`: the reader may break a long line before
  // an equals sign it finds at brace depth 0, and an array must never be cut there.
  const eq = raw`{}\mathrel{=}`;
  return groups.map((rows) => {
    const body = rows
      .map((r) => {
        if (typeof r === "string") return prose(r);
        return r[2]
          ? `${side(r[0])} &${eq} ${r[1]} & \\text{or} & ${r[3]} &${eq} ${r[4]}`
          : `${side(r[0])} &${eq} ${r[1]}`;
      })
      .join(" \\\\ ");
    const or = rows.some((r) => Array.isArray(r) && r[2]);
    return m(raw`\begin{array}{${or ? "rlcrl" : "rl"}}${body}\end{array}`);
  });
};

/**
 * The key's ∵/∴ blocks, which also carry a right-hand tag ("……(1)") on the rows
 * that are numbered. Row: [symbol, left side, right side, tag?]; a plain string
 * row is a sentence set at the left margin (such as "By substituting …").
 * This is book-local on purpose: the shared helpers above stay untouched.
 */
const eqCol = (rows) => {
  const body = rows
    .map((r) => {
      if (typeof r === "string") return raw`\text{${r}} & & & `;
      const [s, l, rr, tag] = r;
      return `${s} & ${l} &{}= ${rr} & ${tag || ""}`;
    })
    .join(" \\\\ ");
  return raw`\begin{array}{lrll}${body}\end{array}`;
};

/**
 * A block whose last line branches into "… or …" with the ∵/∴ at the margin:
 * six columns (symbol, left, =, "or", left, =).
 */
const eqColOr = (rows) =>
  raw`\begin{array}{lrlcrl}${rows
    .map((r) => {
      const [s, l, rr, or, l2, r2] = r;
      return or
        ? `${s} & ${l} &{}= ${rr} & \\text{or} & ${l2} &{}= ${r2}`
        : `${s} & ${l} &{}= ${rr} & & & `;
    })
    .join(" \\\\ ")}\end{array}`;

/**
 * The reader may re-render a line in "wrap" mode when it does not fit, and that
 * mode cuts a maths string at every `=` it meets at brace depth 0 — which tears
 * an array apart and shows the raw TeX. `&{}\mathrel{=}` keeps the sign inside a
 * group, so the cut never happens; the arrays above stay exactly as the key sets
 * them. Applied to every array this book writes.
 */
const eqSafe = (s) => s.replaceAll("&{}=", raw`&{}\mathrel{=}`);
/** An `=` written inside a cell ("f(1) = … = 0") is guarded the same way. */
const guard = (c) => String(c).replace(/(?<!\\)=/g, raw`\mathrel{=}`);
const guardRow = (row) => (Array.isArray(row) ? row.map((c, i) => (i === 0 || c === "true" ? c : guard(c))) : row);
const EQ = (rows) => eqSafe(eqBlock(rows.map(([l, r]) => [guard(l), guard(r)])));
const EQCOL = (rows) => eqSafe(eqCol(rows.map(guardRow)));
const EQCOLOR = (rows) => eqSafe(eqColOr(rows.map(guardRow)));

/* --- Reveal parts: one block, split at a row boundary --------------------- */

/**
 * The block's rows cut into the groups the reader reveals one at a time.
 * `cuts` holds one row index per new part; omitted, every row is its own part
 * (the teacher's rule for a chain: statement, substitution, simplification,
 * factorisation, solution — one tap each).
 */
const rowCuts = (rows, cuts) => {
  const list = cuts || Array.from({ length: Math.max(0, rows.length - 1) }, (_, i) => i + 1);
  const out = [];
  let from = 0;
  for (const c of list) {
    out.push(rows.slice(from, c));
    from = c;
  }
  out.push(rows.slice(from));
  return out;
};

/**
 * A block written the way `EQ` is, split into reveal parts (the shape eqParts
 * builds). Layout is the block's own: every left side is padded to the block's
 * widest by an invisible phantom and its wording is laid over it with
 * `\mathllap`, so the equals signs keep the one column the whole array had.
 * `width` is the block's widest left-hand side. Only the reveal grouping
 * changes; the rows themselves stay verbatim.
 */
const EQSPLIT = (width, rows, cuts) =>
  eqParts(width, rowCuts(rows, cuts).map((g) => g.map(([l, r]) => [guard(l), guard(r)])));

/**
 * The same split for a ∵/∴ block (`EQCOL`): four columns — symbol, left side,
 * "= …", right-hand tag. `symbol` is the block's widest symbol, usually
 * `\therefore`, or "" when no row carries one.
 */
const EQCOLSPLIT = (width, symbol, rows, cuts) => {
  const wide = raw`\smash{\hphantom{${width}}}`;
  const sym = symbol ? raw`\smash{\hphantom{${symbol}}}` : "";
  const eq = raw`{}\mathrel{=}`;
  return rowCuts(rows, cuts).map((group) => {
    const body = group
      .map((r) => {
        const [s, l, rr, tag] = guardRow(r);
        return `${symbol ? `${sym}\\mathllap{${s}}` : s} & ${wide}\\mathllap{${l}} &${eq} ${rr} & ${tag || ""}`;
      })
      .join(" \\\\ ");
    return m(raw`\begin{array}{lrll}${body}\end{array}`);
  });
};

/**
 * The same split for a ∵/∴ block whose last row branches into "… or …"
 * (`EQCOLOR`): six columns — symbol, left side, "= …", "or", left side, "= …".
 */
const EQCOLORSPLIT = (width, symbol, rows, cuts) => {
  const wide = raw`\smash{\hphantom{${width}}}`;
  const sym = symbol ? raw`\smash{\hphantom{${symbol}}}` : "";
  const eq = raw`{}\mathrel{=}`;
  return rowCuts(rows, cuts).map((group) => {
    const body = group
      .map((r) => {
        const [s, l, rr, or, l2, r2] = guardRow(r);
        const head = `${symbol ? `${sym}\\mathllap{${s}}` : s} & ${wide}\\mathllap{${l}}`;
        return or
          ? `${head} &${eq} ${rr} & \\text{or} & ${l2} &${eq} ${r2}`
          : `${head} &${eq} ${rr} & & & `;
      })
      .join(" \\\\ ");
    return m(raw`\begin{array}{lrlcrl}${body}\end{array}`);
  });
};

/**
 * Two or three short lines of one hanging chain revealed as ONE step, where the
 * key marks them as one move (the teacher's totals for sm05b). Rows are
 * `[left, relation, right]`; the relation is a `\mathrel`, so the reader's wrap
 * pass cannot cut at it, and the second row's relation falls under the first's
 * exactly as `align()` sets it.
 */
const CHAIN = (rows) => {
  // With no left-hand side there is nothing to align to, and `aligned` adds its
  // own column separation (0.277em at this size); the kern takes it back so the
  // relation sits exactly where a plain `= …` line puts it.
  const anyLeft = rows.some(([l]) => l);
  const body = rows
    .map(([l, rel, r]) =>
      anyLeft ? `${l} &{}\\mathrel{${rel}} ${r}` : `&\\kern-0.277em\\mathrel{${rel}} ${r}`
    )
    .join(" \\\\ ");
  return m(raw`\begin{aligned}${body}\end{aligned}`);
};

/* --- Division coefficient rows, highest power first ---------------------- */

/** Practice 1(b): x³ − 2x² − 41x + 42 ÷ (x − 1). */
const P1B_ROWS = [
  { c: [null, 1, -1, -42] },
  "rule",
  { c: [1, -2, -41, 42] },
  { c: [1, -1, null, null], bar: true },
  { c: [null, -1, -41, 42] },
  { c: [null, -1, 1, null], bar: true },
  { c: [null, null, -42, 42] },
  { c: [null, null, -42, 42], bar: true },
];

/** Practice 2: 5x³ + 10x² − 25x − 30 ÷ (x + 1). */
const P2_ROWS = [
  { c: [null, 5, 5, -30] },
  "rule",
  { c: [5, 10, -25, -30] },
  { c: [5, 5, null, null], bar: true },
  { c: [null, 5, -25, -30] },
  { c: [null, 5, 5, null], bar: true },
  { c: [null, null, -30, -30] },
  { c: [null, null, -30, -30], bar: true },
];

/** Q11: 3x³ + 7x² − 22x − 8 ÷ (x − 2). */
const Q11_ROWS = [
  { c: [null, 3, 13, 4] },
  "rule",
  { c: [3, 7, -22, -8] },
  { c: [3, -6, null, null], bar: true },
  { c: [null, 13, -22, -8] },
  { c: [null, 13, -26, null], bar: true },
  { c: [null, null, 4, -8] },
  { c: [null, null, 4, -8], bar: true },
];

/** Q12: x³ − 7x² + 8x + 16 ÷ (x + 1). */
const Q12_ROWS = [
  { c: [null, 1, -8, 16] },
  "rule",
  { c: [1, -7, 8, 16] },
  { c: [1, 1, null, null], bar: true },
  { c: [null, -8, 8, 16] },
  { c: [null, -8, -8, null], bar: true },
  { c: [null, null, 16, 16] },
  { c: [null, null, 16, 16], bar: true },
];

/** Q13: 2x³ + 17x² + 40x + 16 ÷ (2x + 1). */
const Q13_ROWS = [
  { c: [null, 1, 8, 16] },
  "rule",
  { c: [2, 17, 40, 16] },
  { c: [2, 1, null, null], bar: true },
  { c: [null, 16, 40, 16] },
  { c: [null, 16, 8, null], bar: true },
  { c: [null, null, 32, 16] },
  { c: [null, null, 32, 16], bar: true },
];

/** Q19(c): x³ + 2x² − 11x + 8 ÷ (x − 1). */
const Q19_ROWS = [
  { c: [null, 1, 3, -8] },
  "rule",
  { c: [1, 2, -11, 8] },
  { c: [1, -1, null, null], bar: true },
  { c: [null, 3, -11, 8] },
  { c: [null, 3, -3, null], bar: true },
  { c: [null, null, -8, 8] },
  { c: [null, null, -8, 8], bar: true },
];

export const SOLUTIONS = [
  /* ---------------------------------------------------------------- Practice 1 */
  {
    id: "p1",
    boxes: [
      {
        steps: [
          h("(a)"),
          t(raw`$\because$ $f(x)$ is divisible by $x-1$.`),
          ...EQCOLSPLIT(raw`(1)^{3}-2(1)^{2}+k(1)+42`, raw`\therefore`, [
            [raw`\therefore`, "f(1)", "0"],
            ["", "(1)^{3}-2(1)^{2}+k(1)+42", "0"],
            ["", "k", raw`\underline{-41}`],
          ]),
        ],
      },
      {
        steps: [
          h("(b)"),
          m(raw`f(x) = x^{3}-2x^{2}-41x+42`),
          t(raw`By long division,`),
          m(DIV(raw`x-1`, P1B_ROWS)),
          ...align([
            m(raw`\therefore f(x) = (x-1)(x^{2}-x-42)`),
            m(raw`= \underline{(x-1)(x+6)(x-7)}`),
          ]),
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------- Practice 2 */
  {
    id: "p2",
    boxes: [
      {
        steps: [
          t(raw`Let $f(x) = 5x^{3}+10x^{2}-25x-30$.`),
          m(EQCOL([
            [raw`\because`, "f(1)", raw`5(1)^{3}+10(1)^{2}-25(1)-30=-40\ne 0`],
            ["", "f(-1)", raw`5(-1)^{3}+10(-1)^{2}-25(-1)-30=0`],
          ])),
          t(raw`$\therefore$ $x+1$ is a factor of $f(x)$.`),
          t(raw`By long division,`),
          m(DIV(raw`x+1`, P2_ROWS)),
          ...align([
            m(raw`\therefore 5x^{3}+10x^{2}-25x-30 = (x+1)(5x^{2}+5x-30)`),
            m(raw`= \underline{(x+1)(x-2)(5x+15)}`),
          ]),
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------- Q1 */
  {
    id: "q1",
    boxes: [
      {
        steps: [
          h("(a)"),
          m(raw`f(-1) = 2(-1)^{3}-3(-1)^{2}-8(-1)-3 = 0`),
          t(raw`$\therefore$ $x+1$ is a factor.`),
          h("(b)"),
          m(raw`f(3) = 2(3)^{3}-3(3)^{2}-8(3)-3 = 0`),
          t(raw`$\therefore$ $x-3$ is a factor.`),
          h("(c)"),
          m(raw`f\left(-\dfrac{5}{2}\right) = 2\left(-\dfrac{5}{2}\right)^{3}-3\left(-\dfrac{5}{2}\right)^{2}-8\left(-\dfrac{5}{2}\right)-3 = -33 \ne 0`),
          t(raw`$\therefore$ $2x+5$ is not a factor.`),
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------- Q2 */
  {
    id: "q2",
    boxes: [
      {
        steps: [
          t(raw`Let $f(x) = x^{99}+99x+k$.`),
          ...EQSPLIT(raw`(-1)^{99}+99(-1)+k`, [
            ["f(-1)", "0"],
            [raw`(-1)^{99}+99(-1)+k`, "0"],
            [raw`-1-99+k`, "0"],
            ["k", raw`\underline{100}`],
          ]),
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------- Q3 */
  {
    id: "q3",
    boxes: [
      {
        steps: [
          t(raw`Let $f(x) = x^{3}-ax^{2}-5x-10$.`),
          t(raw`$\because$ $x-a$ is a factor of $f(x)$.`),
          ...EQCOLSPLIT(raw`(a)^{3}-a(a)^{2}-5(a)-10`, raw`\therefore`, [
            [raw`\therefore`, "f(a)", "0"],
            ["", "(a)^{3}-a(a)^{2}-5(a)-10", "0"],
            ["", "-5a", "10"],
            ["", "a", raw`\underline{-2}`],
          ]),
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------- Q4 */
  {
    id: "q4",
    boxes: [
      {
        steps: [
          t(raw`Let $f(x) = 2x^{2}-(k-1)x-20$.`),
          t(raw`$\because$ $x-k$ is a factor of $f(x)$.`),
          ...EQCOLORSPLIT(raw`2k^{2}-(k-1)k-20`, raw`\therefore`, [
            [raw`\therefore`, "f(k)", "0"],
            ["", "2k^{2}-(k-1)k-20", "0"],
            ["", "2k^{2}-k^{2}+k-20", "0"],
            ["", "k^{2}+k-20", "0"],
            ["", "(k-4)(k+5)", "0"],
            ["", "k", raw`\underline{4}`, "true", "k", raw`\underline{-5}`],
          ]),
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------- Q5 (MC) */
  {
    id: "q5",
    letter: "A",
    boxes: [
      {
        steps: [
          t(raw`$\because$ $x-3$ is a factor of $f(x)$.`),
          ...EQCOLSPLIT(raw`3(3)^{3}+a(3)^{2}+4(3)-21`, raw`\therefore`, [
            [raw`\therefore`, "f(3)", "0"],
            ["", "3(3)^{3}+a(3)^{2}+4(3)-21", "0"],
            ["", "9a+72", "0"],
            ["", "9a", "-72"],
            ["", "a", raw`\underline{-8}`],
          ], [1, 2]),
          m(raw`\therefore f(x) = 3x^{3}-8x^{2}+4x-21`),
          ...align([
            m(raw`f(-5)`),
            m(raw`= 3(-5)^{3}-8(-5)^{2}+4(-5)-21`),
            m(raw`= \underline{-616}`),
          ]),
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------- Q6 (MC) */
  {
    id: "q6",
    letter: "C",
    boxes: [
      {
        steps: [
          t(raw`$\because$ $x+2$ is a factor of $f(x)$.`),
          ...EQCOLSPLIT(raw`(-2)^{3}+a(-2)^{2}+6a(-2)+16`, raw`\therefore`, [
            [raw`\therefore`, "f(-2)", "0"],
            ["", "(-2)^{3}+a(-2)^{2}+6a(-2)+16", "0"],
            ["", "-8a+8", "0"],
            ["", "8a", "8"],
            ["", "a", "1"],
          ], [1, 2]),
          m(raw`\therefore f(x) = x^{3}+x^{2}+6x+16`),
          ...align([
            m(raw`f(-1)`),
            m(raw`= (-1)^{3}+(-1)^{2}+6(-1)+16`),
            m(raw`= \underline{10}`),
          ]),
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------- Q7 (MC) */
  {
    id: "q7",
    letter: "D",
    boxes: [
      {
        steps: [
          t(raw`$\because$ $f(x)$ is divisible by $2x-1$.`),
          t(raw`$\therefore$ $f(x+2)$ is divisible by $2(x+2)-1$,`),
          t(raw`i.e. $2x+3$ is a factor of $f(x+2)$.`),
          t(raw`$\therefore$ The answer is D.`),
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------- Q8 */
  {
    id: "q8",
    boxes: [
      {
        steps: [
          t(raw`$x^{2}+6x+5 = (x+1)(x+5)$`),
          t(raw`Let $f(x) = mx^{4}+nx^{3}+22x^{2}-17x-10$.`),
          t(raw`$\because$ $f(x)$ is divisible by $x^{2}+6x+5$.`),
          ...EQCOLSPLIT(raw`m(-1)^{4}+n(-1)^{3}+22(-1)^{2}-17(-1)-10`, raw`\therefore`, [
            [raw`\therefore`, "f(-1)", "0"],
            ["", "m(-1)^{4}+n(-1)^{3}+22(-1)^{2}-17(-1)-10", "0"],
            ["", "m-n+22+17-10", "0"],
            ["", "m-n", "-29", raw`\cdots\cdots(1)`],
          ], [1, 2]),
          ...EQCOLSPLIT(raw`m(-5)^{4}+n(-5)^{3}+22(-5)^{2}-17(-5)-10`, "", [
            ["", "f(-5)", "0"],
            ["", "m(-5)^{4}+n(-5)^{3}+22(-5)^{2}-17(-5)-10", "0"],
            ["", "625m-125n+550+85-10", "0"],
            ["", "5m-n", "-5", raw`\cdots\cdots(2)`],
          ], [1, 2]),
          m(EQCOL([
            ["(2)-(1):", "4m", "24"],
            ["", "m", raw`\underline{6}`],
          ])),
          t(raw`By substituting $m=6$ into (1), we have`),
          m(EQCOL([
            ["", "6-n", "-29"],
            ["", "n", raw`\underline{35}`],
          ])),
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------- Q9 */
  {
    id: "q9",
    boxes: [
      {
        steps: [
          h("(a)"),
          t(raw`$\because$ $x+1$ is a common factor of $f(x)$ and $g(x)$.`),
          ...EQCOLSPLIT(raw`m(-1)^{3}+12(-1)^{2}-n(-1)-13`, raw`\therefore`, [
            [raw`\therefore`, "f(-1)", "0"],
            ["", "m(-1)^{3}+12(-1)^{2}-n(-1)-13", "0"],
            ["", "-m+12+n-13", "0"],
            ["", "-m+n", "1", raw`\cdots\cdots(1)`],
          ], [1, 2]),
          ...EQCOLSPLIT(raw`7(-1)^{3}+m(-1)^{2}-n(-1)+m`, "", [
            ["", "g(-1)", "0"],
            ["", "7(-1)^{3}+m(-1)^{2}-n(-1)+m", "0"],
            ["", "-7+m+n+m", "0"],
            ["", "2m+n", "7", raw`\cdots\cdots(2)`],
          ], [1, 2]),
          m(EQCOL([
            ["(2)-(1):", "3m", "6"],
            ["", "m", raw`\underline{2}`],
          ])),
          t(raw`By substituting $m=2$ into (1), we have`),
          m(EQCOL([
            ["", "-2+n", "1"],
            ["", "n", raw`\underline{3}`],
          ])),
        ],
      },
      {
        steps: [
          h("(b)"),
          ...align([
            m(raw`f(-1)+g(-1)`),
            m(raw`= [2(-1)^{3}+12(-1)^{2}-3(-1)-13]+[7(-1)^{3}+2(-1)^{2}-3(-1)+2]`),
            CHAIN([
              ["", "=", "-2+12+3-13-7+2+3+2"],
              ["", "=", "0"],
            ]),
          ]),
          t(raw`$\therefore$ $x+1$ is a factor of $f(x)+g(x)$.`),
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------- Q10 */
  {
    id: "q10",
    boxes: [
      {
        steps: [
          h("(a)(i)"),
          t(raw`$\because$ $x-3$ is a factor of $f(x)$.`),
          ...EQCOLSPLIT(raw`(3-m)(3-n)[3(3)-1]-24`, raw`\therefore`, [
            [raw`\therefore`, "f(3)", "0"],
            ["", "(3-m)(3-n)[3(3)-1]-24", "0"],
            ["", "8(3-m)(3-n)", "24"],
            ["", "(3-m)(3-n)", "3"],
          ]),
          h("(a)(ii)"),
          t(raw`$\because$ $m$ and $n$ are positive integers and $m>n$.`),
          m(EQCOL([
            [raw`\therefore`, "m-3", "3 \\quad\\text{and}\\quad n-3 = 1"],
          ])),
          m(raw`\text{i.e.}\qquad m = \underline{6}\quad\text{and}\quad n = \underline{4}`),
        ],
      },
      {
        steps: [
          h("(b)"),
          t(raw`By comparing the coefficient of $x^{3}$ on both sides,`),
          m(raw`a = \underline{3}`),
          t(raw`By comparing the constant term on both sides,`),
          m(EQ([
            ["-3c", "(-6)(-4)(-1)-24"],
            ["c", raw`\underline{16}`],
          ])),
          t(raw`Consider $f(4)$.`),
          m(EQCOL([
            [raw`\therefore`, "(4-3)[3(4)^{2}+b(4)+16]", "(4-6)(4-4)[3(4)-1]-24"],
            ["", "4b", "-88"],
            ["", "b", raw`\underline{-22}`],
          ])),
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------- Q11 */
  {
    id: "q11",
    boxes: [
      {
        steps: [
          t(raw`Let $f(x) = 3x^{3}+7x^{2}-22x-8$.`),
          m(EQ([
            ["f(1)", raw`3(1)^{3}+7(1)^{2}-22(1)-8 = -20 \ne 0`],
            ["f(-1)", raw`3(-1)^{3}+7(-1)^{2}-22(-1)-8 = 18 \ne 0`],
            ["f(2)", raw`3(2)^{3}+7(2)^{2}-22(2)-8 = 0`],
          ])),
          t(raw`$\therefore$ $x-2$ is a factor of $f(x)$.`),
          t(raw`By long division,`),
          m(DIV(raw`x-2`, Q11_ROWS)),
          ...align([
            m(raw`\therefore 3x^{3}+7x^{2}-22x-8 = (x-2)(3x^{2}+13x+4)`),
            m(raw`= \underline{(x-2)(x+4)(3x+1)}`),
          ]),
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------- Q12 */
  {
    id: "q12",
    boxes: [
      {
        steps: [
          m(raw`-2x^{3}+14x^{2}-16x-32 = -2(x^{3}-7x^{2}+8x+16)`),
          t(raw`Let $f(x) = x^{3}-7x^{2}+8x+16$.`),
          m(EQ([
            ["f(1)", raw`(1)^{3}-7(1)^{2}+8(1)+16 = 18 \ne 0`],
            ["f(-1)", raw`(-1)^{3}-7(-1)^{2}+8(-1)+16 = 0`],
          ])),
          t(raw`$\therefore$ $x+1$ is a factor of $f(x)$.`),
          t(raw`By long division,`),
          m(DIV(raw`x+1`, Q12_ROWS)),
          ...align([
            m(raw`\therefore -2x^{3}+14x^{2}-16x-32 = -2(x+1)(x^{2}-8x+16)`),
            m(raw`= \underline{-2(x+1)(x-4)^{2}}`),
          ]),
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------- Q13 */
  {
    id: "q13",
    boxes: [
      {
        steps: [
          t(raw`Let $f(x) = 2x^{3}+17x^{2}+40x+16$.`),
          m(EQ([
            ["f(1)", raw`2(1)^{3}+17(1)^{2}+40(1)+16 = 75 \ne 0`],
            ["f(-1)", raw`2(-1)^{3}+17(-1)^{2}+40(-1)+16 = -9 \ne 0`],
          ])),
          m(raw`f\left(-\tfrac{1}{2}\right) = 2\left(-\tfrac{1}{2}\right)^{3}+17\left(-\tfrac{1}{2}\right)^{2}+40\left(-\tfrac{1}{2}\right)+16 = 0`),
          t(raw`$\therefore$ $2x+1$ is a factor of $f(x)$.`),
          t(raw`By long division,`),
          m(DIV(raw`2x+1`, Q13_ROWS)),
          ...align([
            m(raw`\therefore 2x^{3}+17x^{2}+40x+16 = (2x+1)(x^{2}+8x+16)`),
            m(raw`= \underline{(2x+1)(x+4)^{2}}`),
          ]),
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------- Q14 (Challenge) */
  {
    id: "q14",
    boxes: [
      {
        steps: [
          h("(a)"),
          t(raw`Let $q_{1}(x)$ and $q_{2}(x)$ be the quotients when $f(x)$ is divided by $(x+2)(x+6)$ and $(x+3)(x+6)$ respectively.`),
          t(raw`By division algorithm, we have`),
          m(EQCOL([
            ["", "f(x)", "(x+2)(x+6)q_{1}(x)+kx-53", raw`\cdots\cdots(1)`],
            ["", "f(x)", "(x+3)(x+6)q_{2}(x)-67x+k", raw`\cdots\cdots(2)`],
          ])),
          t(raw`By substituting $x=-6$ into (1), we have $f(-6) = -6k-53$.`),
          t(raw`By substituting $x=-6$ into (2), we have $f(-6) = 402+k$.`),
          m(EQCOL([
            [raw`\therefore`, "-6k-53", "402+k"],
            ["", "-7k", "455"],
            ["", "k", raw`\underline{-65}`],
          ])),
        ],
      },
      {
        steps: [
          h("(b)"),
          t(raw`Note that $f(x)$ is a cubic polynomial with coefficient of $x^{3}$ equal to 1.`),
          t(raw`Let $f(x) = (x+2)(x+6)(x+c)-65x-53$, where $c$ is a constant.`),
          t(raw`By (2) in (a), $f(-3) = -67(-3)-65 = 136$.`),
          m(EQCOL([
            [raw`\therefore`, "(-3+2)(-3+6)(-3+c)-65(-3)-53", "136"],
            ["", "-3(c-3)+142", "136"],
            ["", "c", "5"],
          ])),
          m(raw`f(x) = \underline{x^{3}+13x^{2}-13x+7}`),
        ],
      },
      {
        steps: [
          h("(c)"),
          m(raw`f(-1) = (-1)^{3}+13(-1)^{2}-13(-1)+7 = 32`),
          ...align([
            m(raw`\text{The required remainder}`),
            m(raw`= g(-1)`),
            m(raw`= f(-1)-(-1+1)^{3}`),
            m(raw`= 32-0`),
            m(raw`= \underline{32}`),
          ]),
        ],
      },
      {
        steps: [
          h("(d)"),
          t(raw`When $n$ is even, the remainder when $f(x^{n})-g(x^{n})$ is divided by $x+1$ is $f((-1)^{n})-g((-1)^{n}) = f(1)-g(1)$.`),
          m(raw`f(1) = 1^{3}+13(1)^{2}-13(1)+7 = 8`),
          ...align([
            m(raw`g(1) = f(1)-(1+1)^{3}`),
            m(raw`= 8-8`),
            m(raw`= 0`),
          ]),
          m(raw`\therefore f(1)-g(1) = 8 \ne 0`),
          t(raw`$\therefore$ When $n$ is even, $x+1$ is not a factor of $f(x^{n})-g(x^{n})$.`),
          t(raw`i.e. $x+1$ is not a factor of $f(x^{n})-g(x^{n})$ for all positive integers $n$.`),
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------- Practice 2 (section 2) */
  {
    id: "p2b",
    boxes: [
      {
        steps: [
          h("(a)"),
          m(raw`f(x) = (x^{2}-x+1)(2x^{2}-x-41)+kx+k+42`),
          t(raw`$\because$ $f(x)$ is divisible by $x-5$.`),
          ...EQCOLSPLIT(raw`(5^{2}-5+1)[2(5)^{2}-5-41]+k(5)+k+42`, raw`\therefore`, [
            [raw`\therefore`, "f(5)", "0"],
            ["", "(5^{2}-5+1)[2(5)^{2}-5-41]+k(5)+k+42", "0"],
            ["", "84+6k+42", "0"],
            ["", "6k", "-126"],
            ["", "k", raw`\underline{-21}`],
          ], [1, 2]),
        ],
      },
      {
        steps: [
          h("(b)"),
          ...align([
            m(raw`f(x) = (x^{2}-x+1)(2x^{2}-x-41)-21x+(-21)+42`),
            m(raw`= (x^{2}-x+1)(2x^{2}-x-41)-21x+21`),
          ]),
          CHAIN([
            ["f(-4)", "=", "[(-4)^{2}-(-4)+1][2(-4)^{2}-(-4)-41]-21(-4)+21"],
            ["", "=", "0"],
          ]),
          m(raw`\therefore\ \underline{x+4\text{ is a factor of }f(x).}`),
        ],
      },
      {
        steps: [
          h("(c)"),
          ...EQSPLIT(raw`(x^{2}-x+1)(2x^{2}-x-41)-21x+21`, [
            ["f(x)", "0"],
            ["(x^{2}-x+1)(2x^{2}-x-41)-21x+21", "0"],
            ["2x^{4}-3x^{3}-38x^{2}+19x-20", "0"],
            ["(x-5)(x+4)(2x^{2}-x+1)", "0"],
          ]),
          m(raw`x = 5\quad\text{or}\quad -4\quad\text{or}\quad 2x^{2}-x+1 = 0`),
          t(raw`Consider the equation $2x^{2}-x+1 = 0$.`),
          ...align([
            m(raw`\Delta = (-1)^{2}-4(2)(1)`),
            CHAIN([
              [raw`\phantom{\Delta}`, "=", "-7"],
              [raw`\phantom{\Delta}`, "<", "0"],
            ]),
          ]),
          t(raw`$\therefore$ The equation $2x^{2}-x+1 = 0$ has nonreal roots.`),
          m(raw`\therefore\ \underline{\text{The claim is not correct.}}`),
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------- Q15 */
  {
    id: "q15",
    boxes: [
      {
        steps: [
          h("(a)"),
          m(raw`f(x) = (x^{2}+x+1)(x^{2}-x-5)+cx+c-5`),
          t(raw`$\because$ $f(x)$ is divisible by $x+2$.`),
          ...EQCOLSPLIT(raw`[(-2)^{2}+(-2)+1][(-2)^{2}-(-2)-5]+c(-2)+c-5`, raw`\therefore`, [
            [raw`\therefore`, "f(-2)", "0"],
            ["", "[(-2)^{2}+(-2)+1][(-2)^{2}-(-2)-5]+c(-2)+c-5", "0"],
            ["", "3-c-5", "0"],
            ["", "c", raw`\underline{-2}`],
          ], [1, 2]),
        ],
      },
      {
        steps: [
          h("(b)"),
          ...align([
            m(raw`f(x) = (x^{2}+x+1)(x^{2}-x-5)-2x+(-2)-5`),
            m(raw`= (x^{2}+x+1)(x^{2}-x-5)-2x-7`),
          ]),
          CHAIN([
            ["f(3)", "=", "(3^{2}+3+1)(3^{2}-3-5)-2(3)-7"],
            ["", "=", "0"],
          ]),
          m(raw`\therefore\ \underline{x-3\text{ is a factor of }f(x).}`),
        ],
      },
      {
        steps: [
          h("(c)"),
          ...EQSPLIT(raw`(x^{2}+x+1)(x^{2}-x-5)-2x-7`, [
            ["f(x)", "0"],
            ["(x^{2}+x+1)(x^{2}-x-5)-2x-7", "0"],
            ["x^{4}-5x^{2}-8x-12", "0"],
            ["(x-3)(x+2)(x^{2}+x+2)", "0"],
          ]),
          m(raw`x = 3\quad\text{or}\quad -2\quad\text{or}\quad x^{2}+x+2 = 0`),
          t(raw`Consider the equation $x^{2}+x+2 = 0$.`),
          ...align([
            m(raw`\Delta = 1^{2}-4(1)(2)`),
            CHAIN([
              [raw`\phantom{\Delta}`, "=", "-7"],
              [raw`\phantom{\Delta}`, "<", "0"],
            ]),
          ]),
          t(raw`$\therefore$ The equation $x^{2}+x+2 = 0$ has nonreal roots.`),
          m(raw`\therefore\ \underline{\text{The claim is not correct.}}`),
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------- Q16 */
  {
    id: "q16",
    boxes: [
      {
        steps: [
          h("(a)"),
          m(raw`f(x) = (x^{2}+2x+3)(x^{2}-6x-9)+mx+m+4`),
          t(raw`$\because$ $f(x)$ is divisible by $x+2$.`),
          ...EQCOLSPLIT(raw`[(-2)^{2}+2(-2)+3][(-2)^{2}-6(-2)-9]+m(-2)+m+4`, raw`\therefore`, [
            [raw`\therefore`, "f(-2)", "0"],
            ["", "[(-2)^{2}+2(-2)+3][(-2)^{2}-6(-2)-9]+m(-2)+m+4", "0"],
            ["", "21-m+4", "0"],
            ["", "m", raw`\underline{25}`],
          ], [1, 2]),
        ],
      },
      {
        steps: [
          h("(b)"),
          ...align([
            m(raw`f(x) = (x^{2}+2x+3)(x^{2}-6x-9)+25x+25+4`),
            m(raw`= (x^{2}+2x+3)(x^{2}-6x-9)+25x+29`),
          ]),
          CHAIN([
            ["f(-1)", "=", "[(-1)^{2}+2(-1)+3][(-1)^{2}-6(-1)-9]+25(-1)+29"],
            ["", "=", "0"],
          ]),
          m(raw`\therefore\ \underline{x+1\text{ is a factor of }f(x).}`),
        ],
      },
      {
        steps: [
          h("(c)"),
          ...EQSPLIT(raw`(x^{2}+2x+3)(x^{2}-6x-9)+25x+29`, [
            ["f(x)", "0"],
            ["(x^{2}+2x+3)(x^{2}-6x-9)+25x+29", "0"],
            ["x^{4}-4x^{3}-18x^{2}-11x+2", "0"],
            ["(x+1)(x+2)(x^{2}-7x+1)", "0"],
          ]),
          m(raw`x = -1\quad\text{or}\quad -2\quad\text{or}\quad x^{2}-7x+1 = 0`),
          ...align([
            m(raw`x = -1\quad\text{or}\quad -2\quad\text{or}\quad x = \dfrac{-(-7)\pm\sqrt{(-7)^{2}-4(1)(1)}}{2(1)}`),
            m(raw`x = -1\quad\text{or}\quad -2\quad\text{or}\quad x = \dfrac{7\pm\sqrt{45}}{2}`),
          ]),
          t(raw`Note that $\dfrac{7+\sqrt{45}}{2}$ and $\dfrac{7-\sqrt{45}}{2}$ are irrational numbers.`),
          m(raw`\therefore\ \underline{\text{The claim is not correct.}}`),
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------- Q17 */
  {
    id: "q17",
    boxes: [
      {
        steps: [
          h("(a)"),
          m(EQ([
            ["f(x)", "(x^{2}+x-4)(x^{2}-4x-3)+2(kx-6-k)"],
            ["f(1)", "(1^{2}+1-4)[1^{2}-4(1)-3]+2[k(1)-6-k]"],
            ["", "0"],
          ])),
          m(raw`\therefore\ \underline{x-1\text{ is a factor of }f(x).}`),
        ],
      },
      {
        steps: [
          h("(b)(i)"),
          t(raw`$\because$ $x+3$ is a factor of $f(x)$.`),
          ...EQCOLSPLIT(raw`[(-3)^{2}+(-3)-4][(-3)^{2}-4(-3)-3]+2[k(-3)-6-k]`, raw`\therefore`, [
            [raw`\therefore`, "f(-3)", "0"],
            ["", "[(-3)^{2}+(-3)-4][(-3)^{2}-4(-3)-3]+2[k(-3)-6-k]", "0"],
            ["", "36-8k-12", "0"],
            ["", "k", raw`\underline{3}`],
          ]),
        ],
      },
      {
        steps: [
          h("(b)(ii)"),
          ...EQSPLIT(raw`(x^{2}+x-4)(x^{2}-4x-3)+2(3x-6-3)`, [
            ["f(x)", "0"],
            ["(x^{2}+x-4)(x^{2}-4x-3)+2(3x-6-3)", "0"],
            ["x^{4}-3x^{3}-11x^{2}+19x-6", "0"],
            ["(x-1)(x+3)(x^{2}-5x+2)", "0"],
          ]),
          m(raw`x = 1\quad\text{or}\quad -3\quad\text{or}\quad x^{2}-5x+2 = 0`),
          ...align([
            m(raw`x = 1\quad\text{or}\quad -3\quad\text{or}\quad x = \dfrac{-(-5)\pm\sqrt{(-5)^{2}-4(1)(2)}}{2(1)}`),
            m(raw`x = 1\quad\text{or}\quad -3\quad\text{or}\quad x = \dfrac{5\pm\sqrt{17}}{2}`),
          ]),
          t(raw`Note that $\dfrac{5+\sqrt{17}}{2}$ and $\dfrac{5-\sqrt{17}}{2}$ are irrational numbers.`),
          m(raw`\therefore\ \underline{\text{The claim is not correct.}}`),
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------- Q18 */
  {
    id: "q18",
    boxes: [
      {
        steps: [
          h("(a)"),
          ...EQCOLSPLIT(raw`2(3)(3-2)^{2}+a(3)+b`, "", [
            ["", "f(3)", "0"],
            ["", "2(3)(3-2)^{2}+a(3)+b", "0"],
            ["", "3a+b", "-6", raw`\cdots\cdots(1)`],
          ]),
          ...EQCOLSPLIT(raw`2(1)(1-2)^{2}+a(1)+b`, "", [
            ["", "f(1)", "2b+36"],
            ["", "2(1)(1-2)^{2}+a(1)+b", "2b+36"],
            ["", "a-b", "34", raw`\cdots\cdots(2)`],
          ]),
          m(EQCOL([
            ["(1)+(2):", "4a", "28"],
            ["", "a", raw`\underline{7}`],
          ])),
          t(raw`Substitute $a=7$ into (2).`),
          m(EQCOL([
            ["", "7-b", "34"],
            ["", "b", raw`\underline{-27}`],
          ])),
          m(raw`\therefore a = \underline{7}, b = \underline{-27}`),
        ],
      },
      {
        steps: [
          h("(b)"),
          ...EQSPLIT(raw`(x-3)(2x^{2}-2x+9)`, [
            ["f(x)", "0"],
            ["2x(x-2)^{2}+7x-27", "0"],
            ["2x^{3}-8x^{2}+15x-27", "0"],
            ["(x-3)(2x^{2}-2x+9)", "0"],
          ]),
          m(raw`x = 3\quad\text{or}\quad 2x^{2}-2x+9 = 0`),
          t(raw`Consider the equation $2x^{2}-2x+9 = 0$.`),
          ...align([
            m(raw`\Delta = (-2)^{2}-4(2)(9)`),
            m(raw`= -68`),
            m(raw`< 0`),
          ]),
          t(raw`$\therefore$ The equation $2x^{2}-2x+9 = 0$ has no real roots.`),
          t(raw`Note that 3 is not an irrational number.`),
          t(raw`$\therefore$ The equation $f(x) = 0$ has no irrational roots.`),
          m(raw`\therefore\ \underline{\text{The claim is disagreed.}}`),
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------- Q19 */
  {
    id: "q19",
    boxes: [
      {
        steps: [
          h("(a)"),
          ...EQCOLSPLIT(raw`(-1)^{3}+(a-2)(-1)^{2}-(a+b)(-1)+8`, "", [
            ["", "f(-1)", "2a+12"],
            ["", "(-1)^{3}+(a-2)(-1)^{2}-(a+b)(-1)+8", "2a+12"],
            ["", "-1+a-2+a+b+8", "2a+12"],
            ["", "b", raw`\underline{7}`],
          ]),
          ...EQCOLSPLIT(raw`2^{3}+(a-2)(2)^{2}-(a+7)(2)+8`, "", [
            ["", "f(2)", "2"],
            ["", "2^{3}+(a-2)(2)^{2}-(a+7)(2)+8", "2"],
            ["", "8+4a-8-2a-14+8", "2"],
            ["", "2a", "8"],
            ["", "a", raw`\underline{4}`],
          ]),
        ],
      },
      {
        steps: [
          h("(b)"),
          ...align([
            m(raw`f(x) = x^{3}+(4-2)x^{2}-(4+7)x+8`),
            m(raw`= x^{3}+2x^{2}-11x+8`),
          ]),
          m(raw`f(1) = 1^{3}+2(1)^{2}-11(1)+8 = 0`),
          m(raw`\therefore\ \underline{x-1\text{ is a factor of }f(x).}`),
        ],
      },
      {
        steps: [
          h("(c)"),
          ...EQSPLIT(raw`x^{3}+2x^{2}-11x+8`, [
            ["f(x)", "0"],
            ["x^{3}+2x^{2}-11x+8", "0"],
          ]),
          t(raw`Using long division,`),
          m(DIV(raw`x-1`, Q19_ROWS)),
          m(raw`\therefore (x-1)(x^{2}+3x-8) = 0`),
          t(raw`Consider the equation $x^{2}+3x-8 = 0$.`),
          m(raw`\Delta = 3^{2}-4(1)(-8) = 41\text{, which is not a square number.}`),
          t(raw`$\therefore$ The equation $f(x) = 0$ has only 1 integral root $x = \underline{1}$.`),
          m(raw`\therefore\ \underline{\text{The claim is disagreed.}}`),
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------- Q20 */
  {
    id: "q20",
    boxes: [
      {
        steps: [
          h("(a)"),
          ...align([
            m(raw`f(x) = (3x^{2}+ax-6)(2x+9)+bx+c`),
            m(raw`= 6x^{3}+2ax^{2}-12x+27x^{2}+9ax-54+bx+c`),
            m(raw`= 6x^{3}+(2a+27)x^{2}+(9a+b-12)x+c-54`),
          ]),
          m(raw`\therefore 6x^{3}+41x^{2}+52x-53 \equiv 6x^{3}+(2a+27)x^{2}+(9a+b-12)x+c-54`),
          t(raw`Comparing the coefficients of $x^{2}$ on both sides, we have`),
          m(EQ([
            ["2a+27", "41"],
            ["2a", "14"],
            ["a", raw`\underline{7}`],
          ])),
        ],
      },
      {
        steps: [
          h("(b)(i)"),
          t(raw`Let $g(x) = k(3x^{2}+ax-6)+bx+c$, where $k$ is a constant.`),
          ...align([
            m(raw`f(x)-g(x)`),
            m(raw`= (3x^{2}+ax-6)(2x+9)-k(3x^{2}+ax-6)`),
            m(raw`= (3x^{2}+ax-6)(2x+9-k)`),
          ]),
          m(raw`\therefore\ \underline{f(x)-g(x)\text{ is divisible by }3x^{2}+ax-6.}`),
        ],
      },
      {
        steps: [
          h("(b)(ii)"),
          ...EQSPLIT(raw`(3x-2)(x+3)(2x+9-k)`, [
            ["f(x)-g(x)", "0"],
            ["(3x^{2}+7x-6)(2x+9-k)", "0"],
            ["(3x-2)(x+3)(2x+9-k)", "0"],
          ]),
          m(raw`\therefore\quad \dfrac{2}{3}\ \text{ is a root of the above equation.}`),
          t(raw`$\therefore$ Not all the roots of the equation $f(x)-g(x) = 0$ are integers.`),
          m(raw`\therefore\ \underline{\text{The claim is disagreed.}}`),
        ],
      },
    ],
  },
];
