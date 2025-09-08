
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { CookieSettingsDialog, ConsentPreferences } from '@/components/CookieSettingsDialog';

// Function to stringify consent object and set the cookie
const setConsentCookie = (consent: object) => {
  document.cookie = `cookie_consent=${JSON.stringify(consent)}; path=/; max-age=31536000`; // 1 year expiry
};

export const CookieBanner = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Banner is only shown if no consent cookie is found
    const hasConsent = document.cookie.split(';').some(item => item.trim().startsWith('cookie_consent='));
    if (!hasConsent) {
      setShowBanner(true);
    }
  }, []);

  const handleAllowAll = () => {
    // Set all preferences to true
    const fullConsent = { necessary: true, analytics: true, marketing: true };
    setConsentCookie(fullConsent);
    setShowBanner(false);
    // Manually reload to apply analytics scripts if consent was just given
    window.location.reload();
  };

  const handleRejectAll = () => {
    // Set only necessary to true
    const minimalConsent = { necessary: true, analytics: false, marketing: false };
    setConsentCookie(minimalConsent);
    setShowBanner(false);
  };

  const handleSavePreferences = (preferences: ConsentPreferences) => {
    // Save user-defined preferences, plus necessary cookies
    const customConsent = { necessary: true, ...preferences };
    setConsentCookie(customConsent);
    setShowBanner(false);
    // Reload if analytics consent has changed to apply or remove scripts
    window.location.reload();
  };

  if (!showBanner) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-secondary/95 backdrop-blur-sm">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 p-4">
        <p className="text-sm text-secondary-foreground text-center sm:text-left">
          Utilizamos cookies para analizar el tráfico y mejorar tu experiencia. Puedes aceptarlas todas, rechazarlas o configurar tus preferencias.
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
