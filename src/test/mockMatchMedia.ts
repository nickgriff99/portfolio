// jsdom doesn't implement matchMedia; stub it so hooks like usePrefersReducedMotion,
// useHoverCapablePointer, and useMediaMinWidth don't throw during render.
export function mockMatchMedia() {
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
  })) as unknown as typeof window.matchMedia;
}
