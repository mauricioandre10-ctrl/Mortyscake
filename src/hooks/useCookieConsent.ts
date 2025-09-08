
'use client';

import { useState, useEffect } from 'react';

// Define the shape of the consent object
interface Consent {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

// Function to parse the consent cookie from the document
const getConsentFromCookie = (): Consent | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  const cookieValue = document.cookie
    .split('; ')
    .find(row => row.startsWith('cookie_consent='))
    ?.split('=')[1];

  if (cookieValue) {
    try {
      const decodedValue = decodeURIComponent(cookieValue);
      return JSON.parse(decodedValue);
    } catch (e) {
      console.error('Error parsing cookie consent', e);
      return null;
    }
  }

  return null;
};

export const useCookieConsent = () => {
  const [isConsentLoading, setIsConsentLoading] = useState(true);
  const [hasCookieConsent, setHasCookieConsent] = useState(false);
  const [hasAnalyticsConsent, setHasAnalyticsConsent] = useState(false);
  const [consent, setConsent] = useState<Consent | null>(null);

  useEffect(() => {
    const consentState = getConsentFromCookie();
    if (consentState) {
      setConsent(consentState);
      setHasCookieConsent(true);
      setHasAnalyticsConsent(consentState.analytics);
    }
    setIsConsentLoading(false);
  }, []);

  // Function to update state if cookie is set elsewhere (e.g., banner)
  const updateConsent = (newConsent: Consent) => {
    setConsent(newConsent);
    setHasCookieConsent(true);
    setHasAnalyticsConsent(newConsent.analytics);
  };

  return {
    isConsentLoading,
    hasCookieConsent,
    hasAnalyticsConsent,
    consent,
    setConsent: updateConsent,
  };
};

