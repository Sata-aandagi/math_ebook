/**
 * Worked solutions for SM05 (A) More about Polynomials.
 * Written from the teacher's ANS key: same method, same steps, same final sentence.
 * Field reference: docs/02-book-format.md. House style: docs/03-authoring-style.md.
 */

import { m, t, h, note, nl, align, L, lk } from "../../engine/authoring.js";

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

/* Division coefficient rows, highest power first. */
const P1A = [
  { c: [null, 4, 4, 3] },
  "rule",
  { c: [4, -8, -9, 28] },
  { c: [4, -12, null, null], bar: true },
  { c: [null, 4, -9, 28] },
  { c: [null, 4, -12, null], bar: true },
  { c: [null, null, 3, 28] },
  { c: [null, null, 3, -9], bar: true },
  { c: [null, null, null, 37] },
];
const P1B = [
  { c: [null, null, -4, 3] },
  "rule",
  { c: [-8, 6, 10, 5] },
  { c: [-8, 0, -12, null], bar: true },
  { c: [null, 6, 22, 5] },
  { c: [null, 6, 0, 9], bar: true },
  { c: [null, null, 22, -4] },
];
const Q1ROWS = [
  { c: [null, -2, -3, -1] },
  "rule",
  { c: [2, 1, -2, -4] },
  { c: [2, -2, null, null], bar: true },
  { c: [null, 3, -2, -4] },
  { c: [null, 3, -3, null], bar: true },
  { c: [null, null, 1, -4] },
  { c: [null, null, 1, -1], bar: true },
  { c: [null, null, null, -3] },
];
const Q2ROWS = [
  { c: [null, -3, -2, 1] },
  "rule",
  { c: [12, 5, -6, 7] },
  { c: [12, -3, null, null], bar: true },
  { c: [null, 8, -6, 7] },
  { c: [null, 8, -2, null], bar: true },
  { c: [null, null, -4, 7] },
  { c: [null, null, -4, 1], bar: true },
  { c: [null, null, null, 6] },
];
const Q3ROWS = [
  { c: [null, 2, -2, -1] },
  "rule",
  { c: [2, 0, -3, 1] },
  { c: [2, 2, null, null], bar: true },
  { c: [null, -2, -3, 1] },
  { c: [null, -2, -2, null], bar: true },
  { c: [null, null, -1, 1] },
  { c: [null, null, -1, -1], bar: true },
  { c: [null, null, null, 2] },
];
const Q4ROWS = [
  { c: [null, null, 1, 2] },
  "rule",
  { c: [4, 8, -4, -7] },
  { c: [4, 0, -3, null], bar: true },
  { c: [null, 8, -1, -7] },
  { c: [null, 8, 0, -6], bar: true },
  { c: [null, null, -1, -1] },
];
const Q5ROWS = [
  { c: [null, null, 1, null, 1, null] },
  "rule",
  { c: [1, 0, 0, 0, 0, -1] },
  { c: [1, null, -1, null, null, null], bar: true },
  { c: [null, null, 1, 0, 0, -1] },
  { c: [null, null, 1, null, -1, null], bar: true },
  { c: [null, null, null, null, 1, -1] },
];
const Q6ROWS = [
  { c: [null, null, 7, -1] },
  "rule",
  { c: [7, 13, -2, -16] },
  { c: [7, 14, -21, null], bar: true },
  { c: [null, -1, 19, -16] },
  { c: [null, -1, -2, 3], bar: true },
  { c: [null, null, 21, -19] },
];
const Q12BROWS = [
  { c: [null, null, 1, -4] },
  "rule",
  { c: [2, -6, 3, 3] },
  { c: [2, 2, 8, null], bar: true },
  { c: [null, -8, -5, 3] },
  { c: [null, -8, -8, -32], bar: true },
  { c: [null, null, 3, 35] },
];

/* Q7's divisor carries an unknown k, so its grid is written out by hand (same
   shape as DIV: one line per cell, the bracket on the dividend's line). The three
   working lines start under the dividend's `+kx`, and the widest of them fixes
   both the rule's right end and the bars. */
const Q7DIV = (() => {
  const sum = raw`x^{3}-kx^{2}+kx-3`;
  /** Where a working line starts: under the dividend's `kx`. */
  const at = raw`\hphantom{x^{3}-kx^{2}+{}}`;
  /** The widest line of the grid, which the rule and every bar must reach. */
  const widest = raw`x^{3}-kx^{2}+kx-k^{2}`;
  const head = `x-k${DIVGAP}${BRACKET}`;
  const pad = raw`\hphantom{${head}}`;
  const lines = [
    `${pad}${DIVGAP}\\phantom{x^{3}-}x^{2}+\\phantom{kx}k`,
    `${head}${ruleOver(widest)}${DIVGAP}${sum}`,
    `${pad}${DIVGAP}\\underline{x^{3}-kx^{2}\\phantom{{}+kx-k^{2}}\\mkern-3mu}`,
    `${pad}${DIVGAP}${at}kx-3`,
    `${pad}${DIVGAP}${at}\\underline{kx-k^{2}\\mkern-3mu}`,
    `${pad}${DIVGAP}${at}k^{2}-3`,
  ];
  return raw`\begin{array}{l}${lines.join(" \\\\ ")}\end{array}`;
})();

/* Practice 1's answer tex, used only by the guide stage in media/guide-p1.html.
   It is deliberately NOT part of SOLUTIONS: the page shows the inline animation,
   and no reader — not even one running a stale cached solutions.js — may draw a
   typed answer behind it. */
export const P1_STEPS = [
  {
    steps: align([
      h("(a)"),
      m(DIV(raw`x-3`, P1A)),
      t(raw`$\therefore$ Quotient $= \underline{4x^2+4x+3}$, Remainder $= \underline{37}$.`),
    ]),
  },
  {
    steps: align([
      h("(b)"),
      m(DIV(raw`2x^{2}+0x+3`, P1B)),
      t(raw`$\therefore$ Quotient $= \underline{-4x+3}$, Remainder $= \underline{22x-4}$.`),
    ]),
  },
];

export const SOLUTIONS = [
  /* ---------------------------------------------------------------- Practice 1 */
  {
    id: "p1",
    // The answer is the inline animation in book.json "media". The tex lives in
    // P1_STEPS above and is not part of this list: there is nothing to draw here.
    printed: true,
    boxes: [],
  },

  /* ---------------------------------------------------------------- Q1 */
  {
    id: "q1",
    boxes: [
      {
        steps: align([m(DIV(raw`-x+1`, Q1ROWS))]),
      },
      {
        steps: [
          t(raw`$\therefore$ The quotient is $-2x^2-3x-1$`),
          t(raw`and the remainder is $-3$.`),
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------- Q2 */
  {
    id: "q2",
    boxes: [
      {
        steps: align([m(DIV(raw`-4x+1`, Q2ROWS))]),
      },
      {
        steps: [
          t(raw`$\therefore$ The quotient is $-3x^2-2x+1$`),
          t(raw`and the remainder is $6$.`),
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------- Q3 */
  {
    id: "q3",
    boxes: [
      {
        steps: align([m(DIV(raw`x+1`, Q3ROWS))]),
      },
      {
        steps: [
          t(raw`$\therefore$ The quotient is $2x^2-2x-1$`),
          t(raw`and the remainder is $2$.`),
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------- Q4 */
  {
    id: "q4",
    boxes: [
      {
        steps: align([m(DIV(raw`4x^{2}+0x-3`, Q4ROWS))]),
      },
      {
        steps: [
          t(raw`$\therefore$ The quotient is $x+2$`),
          t(raw`and the remainder is $-x-1$.`),
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------- Q5 */
  {
    id: "q5",
    boxes: [
      {
        steps: align([m(DIV(raw`x^{2}-1`, Q5ROWS))]),
      },
      {
        steps: [
          t(raw`$\therefore$ Quotient $= \underline{x^3+x}$`),
          t(raw`Remainder $= \underline{x-1}$`),
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------- Q6 */
  {
    id: "q6",
    boxes: [
      {
        steps: align([
          m(raw`(7x^3+15x^2-9)-(2x^2+2x+7)`, "simplify the dividend"),
          m(raw`= 7x^3+13x^2-2x-16`),
          m(DIV(raw`x^{2}+2x-3`, Q6ROWS)),
        ]),
        w: 380,
      },
      {
        steps: [
          m(raw`\therefore\text{ Quotient } = \underline{7x-1}\qquad\text{Remainder } = \underline{21x-19}`),
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------- Q7 (Challenge) */
  {
    id: "q7",
    flow: "col",
    boxes: [
      {
        steps: align([
          h("(a)"),
          m(Q7DIV),
          m(raw`k^2-3 = 2k`),
          m(raw`k^2-2k-3 = 0`),
          m(raw`(k+1)(k-3) = 0`),
          m(raw`k = -1 \quad \text{or} \quad k = 3`),
        ]),
      },
      {
        steps: align([
          h("(b)"),
          t(raw`The quotient is $x^2+k$, so`),
          t(raw`Quotient $= x^2-1$ or $x^2+3$.`),
        ]),
      },
    ],
  },

  /* ---------------------------------------------------------------- Example 2 */
  {
    id: "ex2",
    printed: true,
    boxes: [],
  },

  /* ---------------------------------------------------------------- Practice 2 */
  {
    id: "p2",
    boxes: [
      {
        steps: align([
          t(raw`By division algorithm, we have`),
          m(raw`-3x^3+8x^2+6x+2 = f(x)\cdot(-3x+8)+18`),
          m(raw`f(x) = \dfrac{(-3x^3+8x^2+6x+2)-18}{-3x+8}`),
          m(raw`= \dfrac{-3x^3+8x^2+6x-16}{-3x+8}`),
          m(raw`= \dfrac{x^2(-3x+8)-2(-3x+8)}{-3x+8}`, "factorise by grouping"),
          m(raw`= \underline{x^2-2}`),
        ]),
      },
    ],
  },

  /* ---------------------------------------------------------------- Practice 3 */
  {
    id: "p3",
    boxes: [
      {
        steps: align([
          t(raw`By division algorithm, we have`),
          m(raw`2x^3+12x^2-11 = (x^2+mx-8)(2x+10)+(6x+n)`),
          m(raw`= x^2(2x+10)+mx(2x+10)-8(2x+10)+6x+n`),
          m(raw`= 2x^3+10x^2+2mx^2+10mx-16x-80+6x+n`),
          m(raw`= 2x^3+(10+2m)x^2+(10m-10)x+(n-80)`),
          t(raw`By comparing the coefficient of $x$ on both sides,`),
          m(eqBlock([
            [raw`0`, raw`10m-10`],
            [raw`m`, raw`\underline{1}`],
          ])),
          t(raw`By comparing the constant term on both sides,`),
          m(eqBlock([
            [raw`-11`, raw`n-80`],
            [raw`n`, raw`\underline{69}`],
          ])),
        ]),
      },
    ],
  },

  /* ---------------------------------------------------------------- Q8 */
  {
    id: "q8",
    boxes: [
      {
        steps: align([
          t(raw`By division algorithm, we have`),
          m(raw`f(x) = (2x^2-1)(4x)+10`),
          m(raw`= 8x^3-4x+10`, "expand"),
        ]),
      },
    ],
  },

  /* ---------------------------------------------------------------- Q9 */
  {
    id: "q9",
    boxes: [
      {
        steps: align([
          t(raw`By division algorithm, we have`),
          m(raw`f(x) = (3x+1)(2x^2-3x+6)+(-8)`),
          m(raw`= (3x+1)(2x^2)-(3x+1)(3x)+(3x+1)(6)-8`),
          m(raw`= 6x^3+2x^2-9x^2-3x+18x+6-8`),
          m(raw`= 6x^3-7x^2+15x-2`, "collect like terms"),
        ]),
      },
    ],
  },

  /* ---------------------------------------------------------------- Q10 */
  {
    id: "q10",
    boxes: [
      {
        steps: align([
          t(raw`By division algorithm, we have`),
          m(raw`2x^2-8x+15 = f(x)\cdot(2x-14)+57`),
          m(raw`f(x) = \dfrac{(2x^2-8x+15)-57}{2x-14}`),
          m(raw`= \dfrac{2x^2-8x-42}{2x-14}`),
          m(raw`= \dfrac{2(x+3)(x-7)}{2(x-7)}`, "factorise"),
          m(raw`= \underline{x+3}`),
        ]),
      },
    ],
  },

  /* ---------------------------------------------------------------- Q11 */
  {
    id: "q11",
    boxes: [
      {
        steps: align([
          t(raw`Let $p(x)$ be the required polynomial.`),
          t(raw`By division algorithm, we have`),
          m(raw`18x^3-9x^2-12x+31 = p(x)\cdot(6x-3)+25`),
          m(raw`p(x) = \dfrac{(18x^3-9x^2-12x+31)-25}{6x-3}`),
          m(raw`= \dfrac{18x^3-9x^2-12x+6}{6x-3}`),
          m(raw`= \dfrac{(6x-3)(3x^2-2)}{6x-3}`, "factorise"),
          m(raw`= 3x^2-2`),
          t(raw`$\therefore$ The required polynomial is $3x^2-2$.`),
        ]),
      },
    ],
  },

  /* ---------------------------------------------------------------- Q12 */
  {
    id: "q12",
    boxes: [
      {
        steps: align([
          h("(a)"),
          t(raw`By division algorithm, we have`),
          m(raw`4x^3-4x^2+x-30 = p(x)\cdot(2x-4)+(-7x+2)`),
          m(raw`p(x) = \dfrac{(4x^3-4x^2+x-30)-(-7x+2)}{2x-4}`),
          m(raw`= \dfrac{4x^3-4x^2+x-30+7x-2}{2x-4}`),
          m(raw`= \dfrac{4x^3-4x^2+8x-32}{2x-4}`),
          m(raw`= \dfrac{(2x-4)(2x^2+2x+8)}{2x-4}`, "factorise"),
          m(raw`= \underline{2x^2+2x+8}`),
        ]),
      },
      {
        steps: align([
          h("(b)"),
          m(DIV(raw`2x^{2}+2x+8`, Q12BROWS)),
          t(raw`$\therefore$ Quotient $= \underline{x-4}$`),
          t(raw`Remainder $= \underline{3x+35}$`),
        ]),
      },
    ],
  },

  /* ---------------------------------------------------------------- Q13 */
  {
    id: "q13",
    boxes: [
      {
        steps: align([
          t(raw`By division algorithm, we have`),
          m(raw`x^3-7x^2+4x-5 = (x^2-2x-3)(x-k)+(-3x+10)`),
          t(raw`By comparing the constant term on both sides,`),
          m(raw`-5 = (-3)(-k)+10`),
          m(raw`-5 = 3k+10`),
          m(raw`k = \underline{-5}`),
        ]),
      },
    ],
  },

  /* ---------------------------------------------------------------- Q14 */
  {
    id: "q14",
    boxes: [
      {
        steps: align([
          t(raw`By division algorithm, we have`),
          m(raw`x^3-6x^2+5x+1 = (x^2-m)(x-6)+(7x-11)`),
          m(raw`= x^3-mx-6x^2+6m+7x-11`),
          m(raw`= x^3-6x^2+(7-m)x+6m-11`),
          t(raw`By comparing the constant term on both sides,`),
          m(raw`1 = 6m-11`),
          m(raw`m = \underline{2}`),
        ]),
      },
    ],
  },

  /* ---------------------------------------------------------------- Q15 */
  {
    id: "q15",
    boxes: [
      {
        steps: align([
          t(raw`By division algorithm, we have`),
          m(raw`x^3+ax^2-6x+3 = (x^2-4)(x+8)+(bx+35)`),
          m(raw`= x^2(x+8)-4(x+8)+bx+35`),
          m(raw`= x^3+8x^2-4x-32+bx+35`),
          m(raw`= x^3+8x^2+(b-4)x+3`),
          t(raw`By comparing the coefficient of $x^2$ on both sides,`),
          m(raw`a = \underline{8}`),
          t(raw`By comparing the coefficient of $x$ on both sides,`),
          m(raw`-6 = b-4`),
          m(raw`b = \underline{-2}`),
        ]),
      },
    ],
  },

  /* ---------------------------------------------------------------- Q16 */
  {
    id: "q16",
    boxes: [
      {
        steps: align([
          t(raw`By division algorithm, we have`),
          m(raw`2x^3+12x^2-11 = (x^2+mx-8)(2x+10)+(6x+n)`),
          m(raw`= x^2(2x+10)+mx(2x+10)-8(2x+10)+6x+n`),
          m(raw`= 2x^3+10x^2+2mx^2+10mx-16x-80+6x+n`),
          m(raw`= 2x^3+(10+2m)x^2+(10m-10)x+(n-80)`),
          t(raw`By comparing the coefficient of $x$ on both sides,`),
          m(eqBlock([
            [raw`0`, raw`10m-10`],
            [raw`m`, raw`\underline{1}`],
          ])),
          t(raw`By comparing the constant term on both sides,`),
          m(eqBlock([
            [raw`-11`, raw`n-80`],
            [raw`n`, raw`\underline{69}`],
          ])),
        ]),
      },
    ],
  },

  /* ---------------------------------------------------------------- Practice 3a */
  {
    id: "p3a",
    boxes: [
      {
        steps: [
          t(raw`Let $f(x) = (x+k)(x+k-7)+2(k-39)$.`),
          ...eqParts(raw`(3+k)(3+k-7)+2(k-39)`, [
            ["By the remainder theorem,", [raw`f(3)`, "0"]],
            [[raw`(3+k)(3+k-7)+2(k-39)`, "0"]],
            [
              [raw`(3+k)(k-4)+2k-78`, "0"],
              [raw`3k+k^2-12-4k+2k-78`, "0"],
              [raw`k^2+k-90`, "0"],
            ],
            [
              [raw`(k-9)(k+10)`, "0"],
              [raw`k+10`, "0", true, raw`k-9`, "0"],
              [raw`k`, raw`\underline{-10}`, true, raw`k`, raw`\underline{9}`],
            ],
          ]),
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------- Practice 3b (MC) */
  {
    id: "p3b",
    letter: "B",
    boxes: [
      {
        steps: [
          t(raw`Let $p(x) = (x^2-16)q(x)+ax+b$,`),
          t(raw`where $q$ is a polynomial, $a$ and $b$ are constants.`),
          t(raw`$\because$ When $p(x)$ is divided by $x+4$, the remainder is $-32$.`),
          m(eqSym([
            [raw`\therefore`, raw`p(-4)`, "-32"],
            ["", raw`[(-4)^2-16]q(-4)-4a+b`, "-32"],
            ["", raw`-4a+b`, raw`-32 \qquad \ldots (1)`],
          ])),
          t(raw`$\because$ $p(x)$ is divisible by $x-4$.`),
          m(eqSym([
            [raw`\therefore`, raw`p(4)`, "0"],
            ["", raw`(4^2-16)q(4)+4a+b`, "0"],
            ["", raw`4a+b`, raw`0 \qquad\ldots\ldots\ldots (2)`],
          ])),
          m(eqBlock([
            [raw`(1)+(2):\ 2b`, "-32"],
            [raw`b`, "-16"],
          ])),
          t(raw`Substitute $b = -16$ into (2).`),
          m(eqBlock([
            [raw`4a-16`, "0"],
            [raw`a`, "4"],
          ])),
          t(raw`$\therefore$ The required remainder`),
          m(raw`= \underline{4x-16}`),
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
          m(raw`\text{Remainder} = P(4)`),
          m(raw`= 4(4-1)(4-2)(4-3)+8 = 32`),
        ],
      },
      {
        steps: [
          h("(b)"),
          t(raw`Let $P(x) = 3x^3-2x^2+x+1$`),
          m(raw`\text{Remainder} = P\left(-\dfrac{1}{3}\right)`),
          m(raw`= 3\left(-\dfrac{1}{3}\right)^3 - 2\left(-\dfrac{1}{3}\right)^2 - \dfrac{1}{3} + 1`),
          m(raw`= \dfrac{1}{3}`),
        ],
      },
      {
        steps: [
          h("(c)"),
          m(raw`\text{Remainder} = P\left(\dfrac{3}{2}\right)`),
          m(raw`= \dfrac{29}{8}`),
        ],
      },
      {
        steps: [
          h("(d)"),
          m(raw`\text{Remainder} = P(0) = 7`),
        ],
      },
      {
        steps: [
          h("(e)"),
          m(raw`\text{Remainder} = P\left(\sqrt{5}\right) = 0`),
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
          m(raw`\text{Remainder} = P(1)`),
          m(raw`= 1^{100}+1^{99}+1^{98}+\cdots+1+1 = 101`),
        ],
      },
      {
        steps: [
          h("(b)"),
          m(raw`\text{Remainder} = P(-1)`),
          m(raw`= (-1)^{100}+(-1)^{99}+\cdots+(-1)^2+(-1)+1`),
          m(raw`= 1`),
        ],
      },
      {
        steps: [
          h("(c)"),
          m(raw`\text{Remainder} = P(-1)`),
          m(raw`= (-1)^{999}+(-1)^{998}+\cdots+(-1)+1`),
          m(raw`= 0`),
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
          t(raw`Let $f(x) = (x+k)(x+k-7)+2(k-39)$.`),
          ...eqParts(raw`(3+k)(3+k-7)+2(k-39)`, [
            ["By the remainder theorem,", [raw`f(3)`, "0"]],
            [[raw`(3+k)(3+k-7)+2(k-39)`, "0"]],
            [
              [raw`(3+k)(k-4)+2k-78`, "0"],
              [raw`3k+k^2-12-4k+2k-78`, "0"],
              [raw`k^2+k-90`, "0"],
            ],
            [
              [raw`(k-9)(k+10)`, "0"],
              [raw`k+10`, "0", true, raw`k-9`, "0"],
              [raw`k`, raw`\underline{-10}`, true, raw`k`, raw`\underline{9}`],
            ],
          ]),
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
          t(raw`Let $f(x) = 2x^2+46x-120$.`),
          ...eqParts(raw`2(k)^2+46(k)-120`, [
            ["By the remainder theorem,", [raw`f(k)`, raw`k^2+44k+23`]],
            [[raw`2(k)^2+46(k)-120`, raw`k^2+44k+23`]],
            [[raw`k^2+2k-143`, "0"]],
            [
              [raw`(k+13)(k-11)`, "0"],
              [raw`k+13`, "0", true, raw`k-11`, "0"],
              [raw`k`, raw`\underline{-13}`, true, raw`k`, raw`\underline{11}`],
            ],
          ]),
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------- Q22 */
  {
    id: "q22",
    boxes: [
      {
        steps: [
          t(raw`Let $f(x) = 4x^3+ax^2+bx-12$.`),
          ...eqParts(raw`4(-2)^3+a(-2)^2+b(-2)-12`, [
            ["By the remainder theorem,", [raw`f(-2)`, "-70"]],
            [[raw`4(-2)^3+a(-2)^2+b(-2)-12`, "-70"]],
            [
              [raw`4a-2b`, "-26"],
              [raw`2a-b`, raw`-13 \qquad \ldots (1)`],
            ],
          ]),
          ...eqParts(raw`4(3)^3+a(3)^2+b(3)-12`, [
            [[raw`f(3)`, "90"]],
            [[raw`4(3)^3+a(3)^2+b(3)-12`, "90"]],
            [
              [raw`9a+3b`, "-6"],
              [raw`3a+b`, raw`-2 \qquad \ldots (2)`],
            ],
          ]),
          ...eqParts(raw`(1)+(2):\ 5a`, [
            [
              [raw`(1)+(2):\ 5a`, "-15"],
              [raw`a`, raw`\underline{-3}`],
            ],
          ]),
          t(raw`By substituting $a=-3$ into (2), we have`),
          ...eqParts(raw`3(-3)+b`, [
            [
              [raw`3(-3)+b`, "-2"],
              [raw`b`, raw`\underline{7}`],
            ],
          ]),
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------- Q23 */
  {
    id: "q23",
    boxes: [
      {
        steps: [
          t(raw`Let $f(x) = mx^3+2x^2+nx+7$.`),
          ...eqParts(raw`m(-2)^3+2(-2)^2+n(-2)+7`, [
            ["By the remainder theorem,", [raw`f(-2)`, raw`3(n-1)`]],
            [[raw`m(-2)^3+2(-2)^2+n(-2)+7`, raw`3(n-1)`]],
            [
              [raw`-8m+8-2n+7`, raw`3n-3`],
              [raw`8m+5n`, raw`18 \qquad \ldots (1)`],
            ],
          ]),
          ...eqParts(raw`m(2)^3+2(2)^2+n(2)+7`, [
            [[raw`f(2)`, raw`8m+3`]],
            [[raw`m(2)^3+2(2)^2+n(2)+7`, raw`8m+3`]],
            [
              [raw`2n`, "-12"],
              [raw`n`, raw`\underline{-6}`],
            ],
          ]),
          t(raw`By substituting $n=-6$ into (1), we have`),
          ...eqParts(raw`8m+5(-6)`, [
            [
              [raw`8m+5(-6)`, "18"],
              [raw`m`, raw`\underline{6}`],
            ],
          ]),
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------- Q24 (MC) */
  {
    id: "q24",
    letter: "D",
    boxes: [
      {
        steps: [
          t(raw`$\because$ $f(x)$ is divisible by $x+3$,`),
          ...eqParts(raw`6(-3)^3+k(-3)^2-44(-3)-3k`, [
            [[raw`\therefore f(-3)`, "0"]],
            [[raw`6(-3)^3+k(-3)^2-44(-3)-3k`, "0"]],
            [
              [raw`6k-30`, "0"],
              [raw`k`, "5"],
            ],
          ]),
          m(raw`\therefore f(x) = 6x^3+5x^2-44x-15`),
          ...eqParts(raw`\text{Remainder}`, [
            [[raw`\text{Remainder}`, raw`f(4)`]],
            [
              [raw`{}`, raw`6(4)^3+5(4)^2-44(4)-15`],
              [raw`{}`, raw`\underline{273}`],
            ],
          ]),
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------- Q25 (MC) */
  {
    id: "q25",
    letter: "D",
    boxes: [
      {
        steps: [
          t(raw`$\because$ $f(x)$ is divisible by $x+k$,`),
          ...eqParts(raw`[(-k)-1]^2`, [
            [[raw`\therefore f(-k)`, "0"]],
            [
              [raw`[(-k)-1]^2`, "0"],
              [raw`-k-1`, "0"],
            ],
            [[raw`k`, "-1"]],
          ]),
          ...eqParts(raw`\text{Remainder}`, [
            [[raw`\text{Remainder}`, raw`f(k)`]],
            [[raw`{}`, raw`[(k)-1]^2`]],
            [
              [raw`{}`, raw`[(-1)-1]^2`],
              [raw`{}`, raw`\underline{4}`],
            ],
          ]),
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------- Q26 (MC) */
  {
    id: "q26",
    letter: "D",
    boxes: [
      {
        steps: [
          t(raw`$\because$ $f(x)$ is divisible by $x+2p$.`),
          ...eqParts(raw`(-2p)^2+3p(-2p)+q`, [
            [[raw`\therefore f(-2p)`, "0"]],
            [
              [raw`(-2p)^2+3p(-2p)+q`, "0"],
              [raw`q`, "2p^2"],
            ],
          ]),
          ...eqParts(raw`\text{Remainder}`, [
            [[raw`\text{Remainder}`, raw`f(2p)`]],
            [
              [raw`{}`, raw`(2p)^2+3p(2p)+(2p^2)`],
              [raw`{}`, raw`\underline{12p^2}`],
            ],
          ]),
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------- Q27 (MC) */
  {
    id: "q27",
    letter: "D",
    boxes: [
      {
        steps: [
          t(raw`$\because$ $g(x)$ is divisible by $x-1$,`),
          ...eqParts(raw`h(1)^4-k(1)^7+2`, [
            [[raw`\therefore g(1)`, "0"]],
            [[raw`h(1)^4-k(1)^7+2`, "0"]],
            [
              [raw`h-k`, "-2"],
              [raw`k`, "h+2"],
            ],
          ]),
          ...eqParts(raw`\text{Remainder}`, [
            [[raw`\text{Remainder}`, raw`g(-1)`]],
            [[raw`{}`, raw`h(-1)^4-k(-1)^7+2`]],
            [
              [raw`{}`, raw`h+k+2`],
              [raw`{}`, raw`h+(h+2)+2`],
              [raw`{}`, raw`\underline{2h+4}`],
            ],
          ]),
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------- Q28 (MC) */
  {
    id: "q28",
    letter: "C",
    boxes: [
      {
        steps: [
          t(raw`$\because$ $g(x)$ is divisible by $x+2$,`),
          ...eqParts(raw`12-h(-2)^2+k(-2)^3`, [
            [[raw`\therefore g(-2)`, "0"]],
            [[raw`12-h(-2)^2+k(-2)^3`, "0"]],
            [
              [raw`12-4h-8k`, "0"],
              [raw`4h`, "12-8k"],
            ],
          ]),
          ...eqParts(raw`\text{Remainder}`, [
            [[raw`\text{Remainder}`, raw`g(2)`]],
            [[raw`{}`, raw`12-h(2)^2+k(2)^3`]],
            [
              [raw`{}`, raw`12-4h+8k`],
              [raw`{}`, raw`12-(12-8k)+8k`],
              [raw`{}`, raw`\underline{16k}`],
            ],
          ]),
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------- Q29 (MC) */
  {
    id: "q29",
    letter: "B",
    boxes: [
      {
        steps: [
          t(raw`Let $p(x) = (x+3)(x-7)q(x)+ax+b$,`),
          t(raw`where $q$ is a polynomial, $a$ and $b$ are constants.`),
          t(raw`$\because$ When $p(x)$ is divided by $x+3$, the remainder is $-40$.`),
          m(eqSym([
            [raw`\therefore`, raw`p(-3)`, "-40"],
            ["", raw`(-3+3)(-3-7)q(-3)-3a+b`, "-40"],
            ["", raw`-3a+b`, raw`-40 \qquad \ldots (1)`],
          ])),
          t(raw`$\because$ $p(x)$ is divisible by $x-7$.`),
          m(eqSym([
            [raw`\therefore`, raw`p(7)`, "0"],
            ["", raw`(7+3)(7-7)q(7)+7a+b`, "0"],
            ["", raw`7a+b`, raw`0 \qquad\ldots\ldots\ldots (2)`],
          ])),
          m(eqBlock([
            [raw`(2)-(1):\ 10a`, "40"],
            [raw`a`, "4"],
          ])),
          t(raw`Substitute $a = 4$ into (2).`),
          m(eqBlock([
            [raw`7(4)+b`, "0"],
            [raw`b`, "-28"],
          ])),
          t(raw`$\therefore$ The required remainder $= \underline{4x-28}$.`),
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------- Q30 (MC, Challenge) */
  {
    id: "q30",
    letter: "D",
    boxes: [
      {
        steps: [
          m(eqBlock([
            [raw`f(0)-4`, "0"],
            [raw`f(0)`, "4"],
          ])),
          m(raw`(x^3+2)(Ax+B)+x+2 = (x+1)f(x)`),
          t(raw`Put $x = 0$.`),
          m(eqBlock([
            [raw`(0+2)(B)+0+2`, raw`(0+1)f(0)`],
            [raw`2B+2`, "4"],
            [raw`B`, "1"],
          ])),
          t(raw`Put $x = -1$.`),
          m(eqBlock([
            [raw`[(-1)^3+2][-A+1]-1+2`, raw`(-1+1)f(-1)`],
            [raw`-A+1+1`, "0"],
            [raw`A`, "2"],
          ])),
          m(raw`\therefore (x^3+2)(2x+1)+x+2 = (x+1)f(x)`),
          t(raw`Remainder when $f(x)$ is divided by $x-2$:`),
          m(eqBlock([
            [raw`\therefore (2^3+2)(2\times 2+1)+2+2`, raw`(2+1)f(2)`],
            [raw`\therefore f(2)`, raw`\underline{18}`],
          ])),
        ],
      },
    ],
  },
];
