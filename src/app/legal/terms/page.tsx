
import type { Metadata } from 'next';
import Link from 'next/link';
import React from 'react';

export const metadata: Metadata = {
  title: 'Términos y Condiciones',
  description: 'Consulta los términos y condiciones que rigen el uso de nuestros servicios y el acceso a los cursos y productos de repostería en Morty\'s Cake.',
  robots: { 
    index: true, 
    follow: true 
  },
  openGraph: {
    title: 'Términos y Condiciones | Morty\'s Cake',
    description: 'Condiciones de uso de nuestro sitio web, cursos y tienda online.',
    images: ['/image/fondo_heder.webp'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Términos y Condiciones | Morty\'s Cake',
    description: 'Condiciones de uso de nuestro sitio web, cursos y tienda online.',
    images: ['/image/fondo_heder.webp'],
  },
};

const TermsPage = () => {
  return (
    <main className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
      <article className="prose dark:prose-invert lg:prose-xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">Términos y Condiciones</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Última actualización: <time dateTime="2025-09-08">8 de septiembre de 2025</time>
          </p>
        </header>

        <section id="agreement" className="mb-8">
          <h2 className="text-3xl font-bold">1. Aceptación de los Términos</h2>
          <p className="lead">
            Bienvenido a Morty's Cake. Estos Términos y Condiciones rigen tu acceso y uso de nuestro sitio web y los cursos de repostería online que ofrecemos. Al comprar un curso o utilizar nuestro sitio, aceptas cumplir y estar sujeto a estos términos. Si no estás de acuerdo, no debes utilizar nuestros servicios.
          </p>
        </section>

        <section id="user-accounts" className="mb-8">
          <h2 className="text-3xl font-bold">2. Cuentas de Usuario</h2>
          <p>
            Para acceder a nuestros cursos, deberás registrarte y crear una cuenta. Eres responsable de mantener la confidencialidad de tu contraseña y de toda la actividad que ocurra en tu cuenta. Debes ser mayor de 18 años para crear una cuenta y comprar nuestros cursos.
          </p>
        </section>

        <section id="payments-refunds" className="mb-8">
          <h2 className="text-3xl font-bold">3. Pedidos, Pagos y Política de Reembolso</h2>
          <p>
            Todos los pagos se procesan a través de pasarelas de pago seguras. Al realizar un pedido, te comprometes a proporcionar información de pago válida y actual.
          </p>
          <h3 className="text-2xl font-semibold mt-4">Política de Reembolso y Desistimiento para Contenido Digital</h3>
          <p>
            Dada la naturaleza digital de nuestros cursos online, que otorgan acceso inmediato a todo el material (vídeos, recetas, etc.), se aplica una excepción legal al derecho de desistimiento.
          </p>
          <p>
            De conformidad con la legislación vigente (Real Decreto Legislativo 1/2007, de 16 de noviembre), el derecho de desistimiento no es aplicable a los contratos de suministro de contenido digital que no se preste en un soporte material cuando la ejecución haya comenzado.
          </p>
           <p>
            Al realizar la compra, <strong>aceptas expresamente y eres consciente de que tu derecho a desistir finaliza en el momento en que se te concede acceso al contenido digital del curso.</strong> Por lo tanto, una vez que se ha completado el pago y se ha otorgado el acceso, <strong>todas las ventas son finales y no se realizarán reembolsos</strong>. Te recomendamos revisar la descripción y el temario del curso detenidamente antes de realizar la compra.
          </p>
        </section>

        <section id="license" className="mb-8">
          <h2 className="text-3xl font-bold">4. Licencia de Uso</h2>
          <p>
            Al comprar un curso, Morty's Cake te concede una licencia limitada, no exclusiva, intransferible y revocable para acceder y ver el contenido del curso para tu uso personal y no comercial.
          </p>
          <p>Esta licencia prohíbe explícitamente:</p>
          <ul className="list-disc pl-5 mt-2 space-y-2">
            <li>Revender o redistribuir el contenido del curso.</li>
            <li>Compartir los datos de acceso de tu cuenta con terceros.</li>
            <li>Copiar, modificar, o crear trabajos derivados del material del curso.</li>
          </ul>
          <p>La violación de estos términos resultará en la terminación inmediata de tu acceso al curso sin reembolso.</p>
        </section>

        <section id="intellectual-property" className="mb-8">
          <h2 className="text-3xl font-bold">5. Propiedad Intelectual</h2>
          <p>
            Todo el contenido del Servicio, incluyendo videos, textos, recetas, gráficos, logos y software, es propiedad exclusiva de Morty's Cake y está protegido por leyes de derechos de autor y propiedad intelectual. Ningún contenido puede ser utilizado sin nuestro consentimiento previo por escrito.
          </p>
        </section>

        <section id="disclaimer" className="mb-8">
          <h2 className="text-3xl font-bold">6. Renuncia de Garantías y Limitación de Responsabilidad</h2>
          <p>
            El Servicio se proporciona "tal cual" y "según disponibilidad". No garantizamos que el servicio sea ininterrumpido o libre de errores. En la máxima medida permitida por la ley, Morty's Cake no será responsable de ningún daño indirecto, incidental o consecuente que surja de tu uso o incapacidad de usar el servicio.
          </p>
        </section>

        <section id="governing-law" className="mb-8">
          <h2 className="text-3xl font-bold">7. Ley Aplicable y Jurisdicción</h2>
          <p>
            Estos términos se regirán e interpretarán de acuerdo con las leyes de España. Cualquier disputa que surja en relación con estos términos será sometida a la jurisdicción exclusiva de los tribunales de la ciudad de Ourense.
          </p>
        </section>

        <section id="changes-to-terms" className="mb-8">
          <h2 className="text-3xl font-bold">8. Modificaciones de los Términos</h2>
          <p>Nos reservamos el derecho de modificar estos términos en cualquier momento. La versión más reciente siempre estará publicada en esta página. El uso continuado del servicio después de cualquier cambio constituye tu aceptación de los nuevos términos.</p>
        </section>

        <section id="contact">
          <h2 className="text-3xl font-bold">9. Contacto</h2>
          <p>Si tienes alguna pregunta sobre estos Términos y Condiciones, por favor contáctanos en <a href="mailto:info@mortyscake.com">info@mortyscake.com</a>.</p>
        </section>
      </article>
    </main>
  );
};

export default TermsPage;
