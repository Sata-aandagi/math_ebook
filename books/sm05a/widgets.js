/**
 * Interactive graphics for this book, opened from a question's graphic button.
 * Build them from the shared kit; house rules are in docs/03-authoring-style.md.
 *
 * SM05 (A) is pure algebra: no question needs a graphic yet, so the registry is
 * empty and no question shows a graphic button.
 */

const REGISTRY = {};

export function hasGraphic(id) {
  return Boolean(REGISTRY[id]);
}

export function mountGraphic(id, root) {
  REGISTRY[id]?.(root);
}
