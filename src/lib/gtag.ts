
declare global {
  interface Window {
    gtag: (
      type: 'config' | 'event',
      id: string,
      options?: Record<string, unknown>
    ) => void;
  }
}

export const pageview = (GA_MEASUREMENT_ID: string, url: string) => {
  if (typeof window.gtag !== 'function') {
    return;
  }
  window.gtag("config", GA_MEASUREMENT_ID, {
    page_path: url,
  });
};

export const event = ({ action, category, label, value }: { action: string, category: string, label: string, value: number }) => {
  if (typeof window.gtag !== 'function') {
    return;
  }
  window.gtag("event", action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};
