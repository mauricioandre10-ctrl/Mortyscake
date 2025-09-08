
import type { Metadata } from 'next';
import Link from 'next/link';
import React from 'react';

export const metadata: Metadata = {
  title: 'Política de Cookies',
  description: 'Descubre cómo Morty\'s Cake utiliza cookies para mejorar tu experiencia de usuario, analizar el tráfico del sitio y ofrecer contenido personalizado en nuestros cursos de repostería.',
  robots: { 
    index: true, 
    follow: true 
  },
};

const CookiesPolicyPage = () => {
  return (
    <main className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
      <article className="prose dark:prose-invert lg:prose-xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">Política de Cookies</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Última actualización: <time dateTime="2025-09-08">8 de septiembre de 2025</time>
          </p>
        </header>

        <section id="what-are-cookies" className="mb-8">
          <h2 className="text-3xl font-bold">¿Qué son las cookies?</h2>
          <p>
            Una cookie es un pequeño fichero de texto que un sitio web almacena en el navegador del usuario. Las cookies facilitan el uso y la navegación por una página web y son esenciales para el funcionamiento de internet, aportando innumerables ventajas en la prestación de servicios interactivos.
          </p>
          <p>
            En Morty\'s Cake, utilizamos cookies para mejorar tu experiencia, entender cómo utilizas nuestro sitio y para fines de marketing. Estos pequeños ficheros nos ayudan a recordar tus preferencias (como los cursos que te interesan) y a optimizar el rendimiento de nuestra plataforma.
          </p>
        </section>

        <section id="types-of-cookies" className="mb-8">
          <h2 className="text-3xl font-bold">Tipos de Cookies que Utilizamos</h2>
          <p>A continuación, detallamos los tipos de cookies que utilizamos en nuestro sitio web:</p>
          <ul className="list-disc pl-5 mt-4 space-y-3">
            <li>
              <strong>Cookies Técnicas Esenciales:</strong> Son imprescindibles para el correcto funcionamiento del sitio. Permiten la navegación a través de la página, el uso de sus funciones, como el acceso al área de cliente o la inscripción en los cursos. Sin estas cookies, los servicios que solicitas no podrían prestarse.
            </li>
            <li>
              <strong>Cookies de Análisis o Rendimiento:</strong> Nos permiten reconocer y contar el número de visitantes, así como analizar cómo navegan por el sitio web. Utilizamos esta información, normalmente de forma agregada, para mejorar el funcionamiento de nuestro sitio, por ejemplo, asegurando que los usuarios encuentren fácilmente lo que buscan. Usamos herramientas como Google Analytics para este fin.
            </li>
            <li>
              <strong>Cookies de Funcionalidad:</strong> Se utilizan para reconocerte cuando regresas a nuestro sitio web. Esto nos permite personalizar nuestro contenido para ti, saludarte por tu nombre y recordar tus preferencias (por ejemplo, tu elección de idioma o región). También pueden ser utilizadas para recordar si ya has aceptado esta política de cookies.
            </li>
             <li>
              <strong>Cookies de Marketing o Publicidad:</strong> Estas cookies registran tu visita a nuestro sitio web, las páginas que has visitado y los enlaces que has seguido. Utilizaremos esta información para que la publicidad que se muestre sea más relevante para tus intereses. No compartimos esta información con terceros de forma que puedan identificarte personalmente.
            </li>
          </ul>
        </section>

        <section id="third-party-cookies" className="mb-8">
          <h2 className="text-3xl font-bold">Cookies de Terceros</h2>
          <p>
            Además de nuestras propias cookies, podemos utilizar diversas cookies de terceros para informar sobre estadísticas de uso del Servicio, entregar anuncios en y a través del Servicio, y así sucesivamente. Por ejemplo, utilizamos Google Analytics para analizar el uso de nuestro sitio web. Google Analytics recopila información sobre el uso del sitio web mediante cookies, y la información generada se utiliza para crear informes sobre el uso de nuestro sitio web. La política de privacidad de Google está disponible en: <Link href="https://www.google.com/policies/privacy/" target="_blank" rel="noopener noreferrer">https://www.google.com/policies/privacy/</Link>.
          </p>
        </section>

        <section id="manage-cookies" className="mb-8">
          <h2 className="text-3xl font-bold">¿Cómo puedes gestionar o deshabilitar las cookies?</h2>
          <p>
            Tienes el derecho de decidir si aceptas o rechazas las cookies. Puedes configurar o modificar los controles de tu navegador web para aceptar o rechazar cookies. Si eliges rechazar las cookies, aún puedes usar nuestro sitio web, aunque tu acceso a algunas funcionalidades y áreas puede ser restringido.
          </p>
          <p>A continuación, te proporcionamos enlaces a las páginas de ayuda de los principales navegadores donde se explica cómo gestionar las cookies:</p>
          <ul className="list-disc pl-5 mt-4 space-y-2">
            <li><Link href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">Google Chrome</Link></li>
            <li><Link href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web-rastrear-preferencias" target="_blank" rel="noopener noreferrer">Mozilla Firefox</Link></li>
            <li><Link href="https://support.microsoft.com/es-es/windows/eliminar-y-administrar-cookies-168dab11-0753-043d-7c16-ede5947fc64d" target="_blank" rel="noopener noreferrer">Microsoft Edge</Link></li>
            <li><Link href="https://support.apple.com/es-es/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer">Safari (macOS)</Link></li>
          </ul>
        </section>

        <section id="policy-changes" className="mb-8">
          <h2 className="text-3xl font-bold">Cambios en la Política de Cookies</h2>
          <p>
            Podemos actualizar esta Política de Cookies ocasionalmente para reflejar, por ejemplo, cambios en las cookies que utilizamos o por otras razones operativas, legales o reglamentarias. Por lo tanto, te recomendamos que visites esta página regularmente para mantenerte informado sobre nuestro uso de cookies y tecnologías relacionadas.
          </p>
        </section>

         <section id="contact">
          <h2 className="text-3xl font-bold">Contacto</h2>
          <p>
            Si tienes alguna pregunta sobre nuestro uso de cookies o sobre esta Política, puedes contactarnos a través de nuestro correo electrónico de soporte o la página de contacto.
          </p>
        </section>
      </article>
    </main>
  );
};

export default CookiesPolicyPage;
