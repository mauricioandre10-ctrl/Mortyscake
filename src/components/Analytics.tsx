'use client';

import React from 'react';
import Script from 'next/script';
import { useCookieConsent } from '@/hooks/useCookieConsent';

export const Analytics = () => {
  const { hasAnalyticsConsent, isConsentLoading } = useCookieConsent();
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  // Wait until consent status has been determined on the client
  if (isConsentLoading) {
    return null;
  }

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
