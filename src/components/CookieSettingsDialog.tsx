'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export interface ConsentPreferences {
  analytics: boolean;
  marketing: boolean;
}

interface CookieSettingsDialogProps {
  onSave: (preferences: ConsentPreferences) => void;
  onAllowAll: () => void;
}

export const CookieSettingsDialog = ({ onSave, onAllowAll }: CookieSettingsDialogProps) => {
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(true);

  const handleConfirm = () => {
    onSave({
      analytics,
      marketing,
    });
  };
  
  const handleAllowAll = () => {
    setAnalytics(true);
    setMarketing(true);
    onAllowAll();
  }

  return (
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Centro de Preferencias de Privacidad</DialogTitle>
          <DialogDescription>
            Gestiona tus preferencias de consentimiento. Puedes habilitar o deshabilitar las categorías según tus preferencias. Las cookies esenciales no se pueden desactivar.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="p-4 border rounded-lg bg-secondary/50">
            <div className="flex items-center justify-between">
              <Label htmlFor="necessary-cookies" className="font-bold text-base">Estrictamente Necesarias</Label>
              <Switch id="necessary-cookies" checked disabled />
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Estas cookies son esenciales para el funcionamiento del sitio y no se pueden desactivar. Se utilizan para funciones básicas como la navegación y la seguridad.
            </p>
          </div>
          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between">
              <Label htmlFor="analytics-cookies" className="font-bold text-base">Analítica y Rendimiento</Label>
              <Switch id="analytics-cookies" checked={analytics} onCheckedChange={setAnalytics} />
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Nos ayudan a medir el tráfico, analizar cómo interactúas con el sitio y mejorar el rendimiento general. Tu experiencia de usuario es clave para nosotros.
            </p>
          </div>
          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between">
              <Label htmlFor="marketing-cookies" className="font-bold text-base">Marketing y Publicidad</Label>
              <Switch id="marketing-cookies" checked={marketing} onCheckedChange={setMarketing} />
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Nos permiten mostrarte anuncios y ofertas más relevantes en otras plataformas. Si desactivas esta opción, seguirás viendo anuncios, pero serán menos personalizados.
            </p>
          </div>
        </div>
        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between w-full">
            <Button variant="outline" onClick={handleConfirm}>Confirmar mis Preferencias</Button>
            <Button onClick={handleAllowAll}>Permitir Todas</Button>
        </DialogFooter>
      </DialogContent>
  );
};
