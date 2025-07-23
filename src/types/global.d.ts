declare global {
  interface Window {
    adsbygoogle: Array<Record<string, unknown>>;
    gtag?: (command: string, eventName: string, params?: Record<string, unknown>) => void;
  }
}
export {}; 