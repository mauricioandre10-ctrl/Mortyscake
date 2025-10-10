
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { CookieSettingsDialog, ConsentPreferences } from '@/components/CookieSettingsDialog';
import { useCookieConsent } from '@/hooks/useCookieConsent';
import Link from 'next/link';

// Function to stringify consent object and set the cookie
const setConsentCookie = (consent: object) => {
  document.cookie = `cookie_consent=${JSON.stringify(consent)}; path=/; max-age=31536000`; // 1 year expiry
};

export const CookieBanner = () => {
  const [showBanner, setShowBanner] = useState(false);
  const { isConsentLoading, hasCookieConsent, setConsent } = useCookieConsent();

  useEffect(() => {
    // Banner is only shown if consent has been determined and no cookie is found
    if (!isConsentLoading && !hasCookieConsent) {
      setShowBanner(true);
    }
  }, [isConsentLoading, hasCookieConsent]);

  const handleAllowAll = () => {
    // Set all preferences to true
    const fullConsent = { necessary: true, analytics: true, marketing: true };
    setConsentCookie(fullConsent);
    setConsent(fullConsent); // Update the hook state
    setShowBanner(false);
  };

  const handleRejectAll = () => {
    // Set only necessary to true
    const minimalConsent = { necessary: true, analytics: false, marketing: false };
    setConsentCookie(minimalConsent);
    setConsent(minimalConsent); // Update the hook state
    setShowBanner(false);
  };

  const handleSavePreferences = (preferences: ConsentPreferences) => {
    // Save user-defined preferences, plus necessary cookies
    const customConsent = { necessary: true, ...preferences };
    setConsentCookie(customConsent);
    setConsent(customConsent); // Update the hook state
    setShowBanner(false);
  };

  if (!showBanner) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-secondary/95 backdrop-blur-sm">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 p-4">
        <p className="text-sm text-secondary-foreground text-center sm:text-left">
          Este sitio web, propiedad de Morty's Cake, utiliza cookies propias y de terceros para permitir tu navegación, analizar tus hábitos de compra y ofrecerte una experiencia más dulce y personalizada.
          Puedes obtener más información en nuestra <Link href="/legal/cookies" className="font-bold underline hover:text-white">Política de Cookies</Link>.
        </p>
        <div className="flex-shrink-0 flex items-center gap-2">
          <Button variant="ghost" onClick={handleRejectAll}>Rechazar</Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Configurar</Button>
            </DialogTrigger>
            <CookieSettingsDialog onSave={handleSavePreferences} onAllowAll={handleAllowAll} />
          </Dialog>
          <Button onClick={handleAllowAll}>Aceptar Todo</Button>
        </div>
      </div>
    </div>
  );
};
