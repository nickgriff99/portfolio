let gaLoaded = false;

export function loadGA4(measurementId: string | undefined): void {
  if (gaLoaded || !measurementId) {
    if (!measurementId && import.meta.env.DEV) {
      console.warn("loadGA4: missing VITE_GA4_MEASUREMENT_ID, skipping.");
    }
    return;
  }

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer.push(args);
  };

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);

  window.gtag("js", new Date());
  window.gtag("config", measurementId, { send_page_view: false });

  gaLoaded = true;
}

export function trackPageview(path: string): void {
  if (typeof window.gtag !== "function") return;
  window.gtag("event", "page_view", { page_path: path });
}
