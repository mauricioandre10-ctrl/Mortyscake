'use client';

import React, { useState, useEffect } from 'react';
import Script from 'next/script';

// Function to parse the consent cookie
const getConsent = (): { analytics: boolean } | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  const cookieValue = document.cookie
    .split('; ')
    .find(row => row.startsWith('cookie_consent='))
    ?.split('=')[1];

  if (cookieValue) {
    try {
      // Decode the cookie value in case it's URI encoded
      const decodedValue = decodeURIComponent(cookieValue);
      return JSON.parse(decodedValue);
    } catch (e) {
      console.error('Error parsing cookie consent', e);
      return null;
    }
  }

  return null;
};

export const Analytics = () => {
  const [hasAnalyticsConsent, setHasAnalyticsConsent] = useState(false);
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  useEffect(() => {
    // We must read the cookie on the client side
    const consent = getConsent();
    setHasAnalyticsConsent(consent?.analytics || false);
  }, []);

  // Render the scripts only if consent is given and GA_ID is available
  if (!hasAnalyticsConsent || !gaId) {
    return null;
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  );
};
