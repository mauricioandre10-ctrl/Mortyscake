
'use client';

import React from 'react';
import { CustomCakeForm } from '@/components/CustomCakeForm';

export default function TartaAMedidaPage() {
  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <header className="text-center mb-12 max-w-3xl mx-auto">
        <h1 className="font-headline text-4xl md:text-5xl">Diseña tu Tarta a Medida</h1>
        <p className="text-muted-foreground mt-4 text-lg">
          Cuéntanos tu idea y la haremos realidad. Rellena nuestro formulario para que podamos empezar a crear la tarta perfecta para tu celebración.
        </p>
      </header>

      <div className="max-w-2xl mx-auto bg-card p-8 rounded-lg shadow-lg">
        <CustomCakeForm />
      </div>
    </div>
  );
}
