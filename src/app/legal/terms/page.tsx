
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
            Bienvenido a Morty's Cake. Estos Términos y Condiciones rigen tu acceso y uso de nuestro sitio web, así como la compra de nuestros cursos de repostería y productos de pastelería. Al comprar un producto o utilizar nuestro sitio, aceptas cumplir y estar sujeto a estos términos. Si no estás de acuerdo, no debes utilizar nuestros servicios.
          </p>
        </section>

        <section id="user-accounts" className="mb-8">
          <h2 className="text-3xl font-bold">2. Cuentas de Usuario</h2>
          <p>
            Para acceder a nuestros cursos o realizar compras, puede ser necesario registrarse y crear una cuenta. Eres responsable de mantener la confidencialidad de tu contraseña y de toda la actividad que ocurra en tu cuenta. Debes ser mayor de 18 años para crear una cuenta y comprar nuestros productos.
          </p>
        </section>

        <section id="payments-refunds" className="mb-8">
          <h2 className="text-3xl font-bold">3. Pedidos, Pagos y Política de Desistimiento (Cancelación)</h2>
          <p>
            Todos los pagos se procesan a través de pasarelas de pago seguras. Al realizar un pedido, te comprometes a proporcionar información de pago válida y actual.
          </p>
          
          <h3 className="text-2xl font-semibold mt-6">Política de Desistimiento (Cancelación)</h3>
          <p>El derecho de desistimiento es la facultad del consumidor de anular una compra sin necesidad de justificación. Sin embargo, la legislación española y europea establece excepciones importantes para los productos que ofrecemos:</p>
          
          <div className="mt-4 p-4 border rounded-lg bg-muted/30">
            <h4 className="font-bold">Para Cursos Online (Contenido Digital)</h4>
            <p className="mt-2">
              De conformidad con la normativa aplicable (Real Decreto Legislativo 1/2007), el derecho de desistimiento no es aplicable a los contratos de suministro de contenido digital (como nuestros cursos online) cuando la ejecución haya comenzado.
            </p>
            <p className="mt-2 font-semibold">
              Al realizar la compra de un curso, aceptas expresamente y eres consciente de que, una vez que se te concede acceso al contenido digital, pierdes tu derecho de desistimiento. Por lo tanto, no se realizarán reembolsos una vez el acceso haya sido otorgado.
            </p>
          </div>

          <div className="mt-4 p-4 border rounded-lg bg-muted/30">
            <h4 className="font-bold">Para Productos Físicos (Tartas, Galletas, etc.)</h4>
            <p className="mt-2">
             Nuestros productos de repostería son bienes perecederos, elaborados de forma artesanal y, en muchos casos, personalizados bajo pedido. La ley excluye del derecho de desistimiento los bienes "que puedan deteriorarse o caducar con rapidez".
            </p>
            <p className="mt-2 font-semibold">
              Por este motivo, una vez que el pedido de un producto físico ha sido confirmado y ha entrado en preparación, no se aceptarán cancelaciones ni se realizarán reembolsos bajo el derecho de desistimiento.
            </p>
          </div>

          <h3 className="text-2xl font-semibold mt-6">Garantía y Devoluciones de Productos Defectuosos</h3>
          <p>Independientemente de lo anterior, tienes derecho a la garantía legal si el producto que recibes no es conforme al contrato, es decir, si está defectuoso, dañado o es incorrecto.</p>
          <div className="mt-4 p-4 border rounded-lg bg-card">
              <p>Si consideras que el producto entregado tiene algún defecto o no se corresponde con lo pedido, deberás ponerte en contacto con nosotros de forma inmediata (en un plazo máximo de 24 horas desde la recepción, dada la naturaleza perecedera de los productos) a través de nuestro correo electrónico <a href="mailto:info@mortyscake.com">info@mortyscake.com</a>, facilitando los datos del producto y una descripción del daño o defecto, adjuntando una fotografía.</p>
              <p className="mt-2">Una vez recibida la notificación, examinaremos el caso y te comunicaremos si procede el reembolso o la sustitución del producto. Dicha gestión se realizará lo antes posible. En caso de reembolso, se efectuará en el mismo medio de pago utilizado para la compra.</p>
          </div>
        </section>

        <section id="license" className="mb-8">
          <h2 className="text-3xl font-bold">4. Licencia de Uso para Cursos Online</h2>
          <p>
            Al comprar un curso, Morty's Cake te concede una licencia limitada, no exclusiva, intransferible y revocable para acceder y ver el contenido del curso para tu uso personal y no comercial.
          </p>
          <p>Esta licencia prohíbe explícitamente:</p>
          <ul className="list-disc pl-5 mt-2 space-y-2">
            <li>Revender, redistribuir, o compartir el contenido del curso.</li>
            <li>Compartir los datos de acceso de tu cuenta con terceros.</li>
            <li>Copiar, modificar, o crear trabajos derivados del material del curso para fines comerciales.</li>
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
          <h2 className="text-3xl font-bold">7. Ley Aplicable y Resolución de Conflictos</h2>
          <p>
            Estos términos se regirán e interpretarán de acuerdo con las leyes de España y de la Unión Europea. Para cualquier disputa que surja, las partes se someten a la jurisdicción exclusiva de los tribunales de la ciudad de Ourense.
          </p>
          <p className="mt-4">
            Asimismo, en cumplimiento del Reglamento (UE) nº 524/2013, te informamos de que tienes derecho a solicitar una resolución extrajudicial de controversias en materia de consumo a través de la plataforma de resolución de litigios en línea de la Unión Europea, a la que puedes acceder a través de la siguiente dirección de internet: <Link href="http://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer">http://ec.europa.eu/consumers/odr/</Link>.
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
