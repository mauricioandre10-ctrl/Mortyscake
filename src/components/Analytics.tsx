
'use client';

import React, { useEffect } from 'react';
import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { useCookieConsent } from '@/hooks/useCookieConsent';
import { pageview } from '@/lib/gtag';

export const Analytics = () => {
  const { hasAnalyticsConsent, isConsentLoading } = useCookieConsent();
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!gaId || !hasAnalyticsConsent) {
      return;
    }
    const url = pathname + (searchParams?.toString() ?? '');
    pageview(gaId, url);
  }, [pathname, searchParams, gaId, hasAnalyticsConsent]);
  

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
