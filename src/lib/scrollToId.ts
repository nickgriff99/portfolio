/** Traverse offsetParent chain to get absolute page layout offset (not affected by
 *  sticky positioning), so scroll-spy and scrollToSection work correctly when sections
 *  live inside a `position:relative` curtain wrapper (.page-curtain). */
export function getAbsoluteTop(el: HTMLElement): number {
  let top = 0;
  let cur: HTMLElement | null = el;
  while (cur) {
    top += cur.offsetTop;
    cur = cur.offsetParent as HTMLElement | null;
  }
  return top;
}

/** Smooth-scrolls to the element with the given id, offset by the fixed header's height.
 *  Returns whether the target element was found (and thus whether the scroll happened). */
export function scrollToId(id: string): boolean {
  const target = document.getElementById(id);

  if (!target) {
    return false;
  }

  // "home" is `.section-hero` (position:sticky, see global.css) - once it's scrolled
  // past and stuck at the viewport top, Chrome's offsetTop for a stuck sticky element
  // reports its current (stuck) box position rather than its static-flow position, so
  // `getAbsoluteTop` below drifts up toward the live scroll position instead of staying
  // at 0. That made the Home nav button only scroll "a tiny bit" instead of to the top.
  // It's always page position 0 anyway, so skip the offset math and go straight there.
  if (id === "home") {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return true;
  }

  const header = document.querySelector("header");
  const headerHeight = header instanceof HTMLElement ? header.offsetHeight : 0;
  const top = getAbsoluteTop(target) - headerHeight;

  window.scrollTo({
    top,
    behavior: "smooth",
  });

  return true;
}
