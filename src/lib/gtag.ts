declare global {
    interface Window {
      gtag: (event: string, action: string, params: Record<string, any>) => void;
    }
  }
  
  export const event = (action: string, params: Record<string, any>) => {
    if (typeof window.gtag !== 'function') {
      return;
    }
    window.gtag('event', action, params);
  };
  