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
  const header = document.querySelector("header");
  const target = document.getElementById(id);

  if (!target) {
    return false;
  }

  const headerHeight = header instanceof HTMLElement ? header.offsetHeight : 0;
  const top = getAbsoluteTop(target) - headerHeight;

  window.scrollTo({
    top,
    behavior: "smooth",
  });

  return true;
}
