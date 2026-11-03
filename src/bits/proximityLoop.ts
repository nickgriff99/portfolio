/**
 * Shared pointer tracker + rAF scheduler for every VariableProximity instance.
 *
 * One set of window listeners and at most one requestAnimationFrame per frame, no matter how many
 * labels are mounted. Frames are only scheduled when the pointer moved (or the page scrolled under
 * it), so an idle page costs nothing — the old per-instance loop spun every frame forever.
 */
export type ProximityListener = (clientX: number, clientY: number) => void;

const listeners = new Set<ProximityListener>();

let pointerX = 0;
let pointerY = 0;
let hasPointer = false;
let dirty = false;
let frame = 0;

function flush() {
  frame = 0;
  if (!dirty || !hasPointer) return;
  dirty = false;
  listeners.forEach((listener) => listener(pointerX, pointerY));
}

function schedule() {
  dirty = true;
  if (frame === 0 && listeners.size > 0) {
    frame = requestAnimationFrame(flush);
  }
}

function setPointer(x: number, y: number) {
  pointerX = x;
  pointerY = y;
  hasPointer = true;
  schedule();
}

const handleMouseMove = (event: MouseEvent) => setPointer(event.clientX, event.clientY);

const handleTouchMove = (event: TouchEvent) => {
  const touch = event.touches[0];
  if (touch) setPointer(touch.clientX, touch.clientY);
};

// Letters move under a stationary pointer when the page scrolls, so re-evaluate on scroll too.
const handleScroll = () => {
  if (hasPointer) schedule();
};

function attach() {
  window.addEventListener("mousemove", handleMouseMove, { passive: true });
  window.addEventListener("touchmove", handleTouchMove, { passive: true });
  window.addEventListener("scroll", handleScroll, { passive: true });
}

function detach() {
  window.removeEventListener("mousemove", handleMouseMove);
  window.removeEventListener("touchmove", handleTouchMove);
  window.removeEventListener("scroll", handleScroll);
  if (frame !== 0) {
    cancelAnimationFrame(frame);
    frame = 0;
  }
}

export function subscribeProximity(listener: ProximityListener): () => void {
  if (listeners.size === 0) attach();
  listeners.add(listener);
  // A label mounting under an already-known pointer should react without waiting for a move.
  if (hasPointer) schedule();

  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) detach();
  };
}
